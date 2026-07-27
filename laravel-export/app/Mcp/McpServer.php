<?php

namespace App\Mcp;

use InvalidArgumentException;

/**
 * A small, dependency-free Model Context Protocol (MCP) server.
 *
 * Implements the JSON-RPC 2.0 methods a client needs to discover and
 * call tools: `initialize`, `tools/list`, `tools/call`, and `ping`.
 *
 * This class is transport-agnostic — McpController exposes it over
 * HTTP (so external MCP clients like Claude Desktop / Claude Code can
 * connect to POST /mcp), and ChatController calls it in-process so the
 * customer-facing chat agent uses the exact same tools.
 */
class McpServer
{
    protected static ?self $instance = null;

    /** @var array<string, array{description:string,inputSchema:array,handler:callable}> */
    protected array $tools = [];

    public static function make(): self
    {
        if (static::$instance === null) {
            static::$instance = new self();
            \App\Mcp\Tools\ProductTools::register(static::$instance);
        }

        return static::$instance;
    }

    /**
     * Register a tool.
     *
     * @param string $name Unique tool name, e.g. "search_products"
     * @param string $description Shown to the LLM — be specific, it drives tool selection
     * @param array $inputSchema JSON Schema (object) describing the tool's arguments
     * @param callable $handler function(array $arguments): array
     */
    public function tool(string $name, string $description, array $inputSchema, callable $handler): void
    {
        $this->tools[$name] = [
            'description' => $description,
            'inputSchema' => $inputSchema,
            'handler' => $handler,
        ];
    }

    /**
     * Tool list in MCP wire format (also valid as Anthropic Messages API
     * "tools" entries once you rename inputSchema -> input_schema).
     */
    public function listTools(): array
    {
        $out = [];
        foreach ($this->tools as $name => $tool) {
            $out[] = [
                'name' => $name,
                'description' => $tool['description'],
                'inputSchema' => $tool['inputSchema'],
            ];
        }

        return $out;
    }

    /**
     * Execute a registered tool and return its result as a plain array
     * (JSON-serializable). Throws InvalidArgumentException for an
     * unknown tool name so callers can turn that into a JSON-RPC error
     * or an is_error tool_result.
     */
    public function callTool(string $name, array $arguments): array
    {
        if (!isset($this->tools[$name])) {
            throw new InvalidArgumentException("Unknown tool: {$name}");
        }

        return ($this->tools[$name]['handler'])($arguments);
    }

    /**
     * Handle a single JSON-RPC 2.0 request and return the response body
     * as an array, ready to be json-encoded. Returns null for
     * notifications (no `id`), which per spec get no response.
     */
    public function handle(array $request): ?array
    {
        $id = $request['id'] ?? null;
        $method = $request['method'] ?? '';

        try {
            $result = match ($method) {
                'initialize' => [
                    'protocolVersion' => '2025-06-18',
                    'capabilities' => ['tools' => new \stdClass()],
                    'serverInfo' => [
                        'name' => 'fam-fashion-mcp',
                        'version' => '1.0.0',
                    ],
                ],
                'notifications/initialized' => null,
                'ping' => new \stdClass(),
                'tools/list' => ['tools' => $this->listTools()],
                'tools/call' => $this->handleToolCall($request['params'] ?? []),
                default => throw new InvalidArgumentException("Method not found: {$method}"),
            };
        } catch (\Throwable $e) {
            if ($id === null) {
                return null; // notification — never respond, even on error
            }

            return [
                'jsonrpc' => '2.0',
                'id' => $id,
                'error' => [
                    'code' => $e instanceof InvalidArgumentException ? -32601 : -32000,
                    'message' => $e->getMessage(),
                ],
            ];
        }

        if ($id === null) {
            return null; // notification
        }

        return [
            'jsonrpc' => '2.0',
            'id' => $id,
            'result' => $result,
        ];
    }

    protected function handleToolCall(array $params): array
    {
        $name = $params['name'] ?? '';
        $arguments = $params['arguments'] ?? [];

        try {
            $data = $this->callTool($name, $arguments);

            return [
                'content' => [
                    ['type' => 'text', 'text' => json_encode($data, JSON_PRETTY_PRINT)],
                ],
                'isError' => false,
            ];
        } catch (\Throwable $e) {
            return [
                'content' => [
                    ['type' => 'text', 'text' => 'Tool error: ' . $e->getMessage()],
                ],
                'isError' => true,
            ];
        }
    }
}
