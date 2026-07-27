<?php

namespace App\Http\Controllers;

use App\Services\ClaudeAgentService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Powers the customer-facing chat widget. Stateless on the server: the
 * browser holds the running conversation and re-sends it each turn, so
 * there's no chat_messages migration to add for this to work.
 */
class ChatController extends Controller
{
    public function send(Request $request, ClaudeAgentService $agent): JsonResponse
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
            'history' => ['array'],
            'history.*.role' => ['required_with:history', 'in:user,assistant'],
            'history.*.content' => ['required_with:history', 'string'],
        ]);

        try {
            $result = $agent->reply($data['message'], $data['history'] ?? []);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'reply' => "Sorry, the assistant is temporarily unavailable. Please try again shortly.",
                'history' => $data['history'] ?? [],
                'error' => true,
            ], 200);
        }

        return response()->json($result);
    }
}
