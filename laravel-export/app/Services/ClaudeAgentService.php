<?php

namespace App\Services;

use App\Mcp\McpServer;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * A minimal MCP client: it drives the tool-use loop between the Claude
 * Messages API and our in-process McpServer, so the customer chat
 * widget always answers from real product data rather than guessing.
 */
class ClaudeAgentService
{
    protected const API_URL = 'https://api.anthropic.com/v1/messages';
    protected const MAX_TOOL_ROUNDS = 5;

    protected string $apiKey;
    protected string $model;

    public function __construct()
    {
        $this->apiKey = (string) env('ANTHROPIC_API_KEY', '');
        $this->model = (string) env('ANTHROPIC_MODEL', 'claude-sonnet-5');
    }

    /**
     * @param string $userMessage The new customer message
     * @param array $history Prior turns as [{role: 'user'|'assistant', content: string}]
     * @return array{reply: string, history: array}
     */
    public function reply(string $userMessage, array $history = []): array
    {
        if (empty($this->apiKey)) {
            throw new RuntimeException('ANTHROPIC_API_KEY is not set in .env');
        }

        $mcp = McpServer::make();
        $tools = array_map(
            fn (array $t) => [
                'name' => $t['name'],
                'description' => $t['description'],
                'input_schema' => $t['inputSchema'],
            ],
            $mcp->listTools()
        );

        $messages = $this->toApiMessages($history);
        $messages[] = ['role' => 'user', 'content' => $userMessage];

        $system = <<<SYS
            You are the FAM Fashion Hub shopping assistant. You help customers
            find makeup products, shades, and prices, and answer general
            questions about the store. Always use the provided tools to look
            up real product data instead of guessing — never invent product
            names, prices, or availability. Keep replies short, warm, and
            conversational (2-4 sentences), and use PKR for prices. If a
            request is outside the product catalogue (orders, refunds,
            complaints), use the contact_human_support tool.
            SYS;

        for ($round = 0; $round < self::MAX_TOOL_ROUNDS; $round++) {
            $response = $this->callClaude($system, $messages, $tools);
            $content = $response['content'] ?? [];

            $messages[] = ['role' => 'assistant', 'content' => $content];

            if (($response['stop_reason'] ?? null) !== 'tool_use') {
                return [
                    'reply' => $this->extractText($content),
                    'history' => $this->toPlainHistory($messages),
                ];
            }

            $toolResults = [];
            foreach ($content as $block) {
                if (($block['type'] ?? null) !== 'tool_use') {
                    continue;
                }

                try {
                    $result = $mcp->callTool($block['name'], $block['input'] ?? []);
                    $toolResults[] = [
                        'type' => 'tool_result',
                        'tool_use_id' => $block['id'],
                        'content' => json_encode($result),
                    ];
                } catch (\Throwable $e) {
                    $toolResults[] = [
                        'type' => 'tool_result',
                        'tool_use_id' => $block['id'],
                        'content' => 'Error: ' . $e->getMessage(),
                        'is_error' => true,
                    ];
                }
            }

            $messages[] = ['role' => 'user', 'content' => $toolResults];
        }

        return [
            'reply' => "I'm having trouble finishing that lookup — could you try rephrasing, or ask to speak with a human?",
            'history' => $this->toPlainHistory($messages),
        ];
    }

    protected function callClaude(string $system, array $messages, array $tools): array
    {
        $response = Http::withHeaders([
            'x-api-key' => $this->apiKey,
            'anthropic-version' => '2023-06-01',
            'content-type' => 'application/json',
        ])->post(self::API_URL, [
            'model' => $this->model,
            'max_tokens' => 1024,
            'system' => $system,
            'messages' => $messages,
            'tools' => $tools,
        ]);

        if ($response->failed()) {
            throw new RuntimeException('Claude API error: ' . $response->body());
        }

        return $response->json();
    }

    protected function extractText(array $content): string
    {
        $parts = [];
        foreach ($content as $block) {
            if (($block['type'] ?? null) === 'text') {
                $parts[] = $block['text'];
            }
        }

        return trim(implode("\n", $parts)) ?: "Sorry, I couldn't come up with a reply — please try again.";
    }

    /**
     * Convert a plain {role, content: string} history (what the frontend
     * stores and re-sends) into full API message blocks.
     */
    protected function toApiMessages(array $history): array
    {
        return array_map(function (array $m) {
            return [
                'role' => $m['role'],
                'content' => is_string($m['content']) ? $m['content'] : $m['content'],
            ];
        }, $history);
    }

    /**
     * Collapse the full API message log back down to {role, content:
     * string} pairs safe to hand back to the browser and round-trip on
     * the next request (drops raw tool_use/tool_result blocks).
     */
    protected function toPlainHistory(array $messages): array
    {
        $out = [];
        foreach ($messages as $m) {
            if (is_string($m['content'])) {
                $out[] = ['role' => $m['role'], 'content' => $m['content']];
                continue;
            }

            if ($m['role'] === 'assistant') {
                $text = $this->extractText($m['content']);
                if ($text !== '') {
                    $out[] = ['role' => 'assistant', 'content' => $text];
                }
            }
            // Skip tool_result-only user turns — they're not real user messages.
        }

        return $out;
    }
}
