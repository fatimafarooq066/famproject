<?php

namespace App\Http\Controllers;

use App\Mcp\McpServer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Exposes the MCP server over HTTP at POST /mcp using the "Streamable
 * HTTP" transport in its simplest, stateless form: one JSON-RPC request
 * in, one JSON-RPC response out. No session ID, no SSE stream — this
 * store's tools are all fast, read-only lookups, so a single response
 * per call is enough.
 *
 * Point any MCP client at this URL, e.g. in Claude Desktop / Claude
 * Code's mcp config:
 *   { "mcpServers": { "fam-fashion": { "url": "https://your-app.test/mcp" } } }
 */
class McpController extends Controller
{
    public function handle(Request $request): JsonResponse
    {
        $payload = $request->json()->all();

        $response = McpServer::make()->handle($payload);

        // Notifications (no "id" in the request) get an empty 202 — no body.
        if ($response === null) {
            return response()->json(null, 202);
        }

        return response()->json($response);
    }
}
