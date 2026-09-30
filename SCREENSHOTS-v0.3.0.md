# Screenshots to capture for v0.3.0

The v0.3.0 pages have 12 new screenshot slots. Until an image exists, each slot shows a marked "Screenshot to come" placeholder with its alt text and slot name, so the site builds and reads correctly without them. Capture them once the v0.3.0 UI settles.

## How

- Only from the public demo instance ("Example University"), never from a real install. PNG, 1440x900, like the existing set.
- Personas as in `../grounded-assets/screenshots/MANIFEST.md`: Morgan Lee (platform admin), Priya Shah (IT Help Desk owner), Sam Ortiz (Library owner, IT editor), Jordan Kim (member).
- Save each file as `<file>.png` in `../grounded-assets/screenshots/` (the slot's `files` entry in `lib/screenshot-slots.json`), add a line to that folder's `MANIFEST.md`, then run `npm run screenshots` and commit `public/images/` and `lib/screenshots.json`. `npm run screenshots:check` lists what's still missing.
- Check each image against its slot's alt text (in `lib/screenshot-slots.json`) and adjust the alt text if the capture differs.
- The demo needs some set-up first: the MCP server switched on (and OAuth sign-in for the two OAuth shots), an MCP server registered with approved tools (`make fake-mcp` in the Grounded repository serves one on `http://127.0.0.1:8091/mcp` with a `check_outage` tool; a development install may use loopback addresses), and an agent with that tool published. Name the registered server "Service status" so captions match the pages. Display-only edits of `localhost` addresses to `*.example.edu` are fine, as for the existing set; note them in the manifest.

## New slots

| Slot (file) | Page | What it should show | Persona, URL |
|---|---|---|---|
| `mcp-key-created` | Using → Connect AI tools (`using/mcp`) | The New API key dialog after creation: a personal key with **MCP: search and ask from AI tools** ticked, the secret shown once, and the **MCP server** address field. Blur or replace the secret. | Jordan Kim, `/teams/it-help-desk/settings?tab=api-keys` |
| `oauth-consent` | Using → Connect AI tools | The OAuth consent page: the tool's name, the host that vouches for it (or **Unverified**), "Search knowledge bases and ask agents you can use, as you", the return address, **Allow** and **Deny**. Start the flow from any MCP client with OAuth support, or a crafted `/oauth/authorize` request. | Jordan Kim, `/oauth/consent?…` |
| `connected-apps` | Using → Connect AI tools | Team settings → API keys, the **Connected apps** card with one connected tool (host, connected, last used, **Disconnect…**). | Jordan Kim, `/teams/it-help-desk/settings?tab=api-keys` |
| `admin-features-mcp` | Self-hosting → MCP server and OAuth (`self-hosting/mcp-server`) | Admin Overview, Features: the **MCP server** row on with the address and **Setup guide**, and **OAuth sign-in for MCP clients** marked **Experimental**. Crop to those rows if the full card is too tall. | Morgan Lee, `/admin` |
| `admin-user-connected-apps` | Self-hosting → MCP server and OAuth | Admin → Users → a person (Jordan Kim) with the **Connected apps** card. | Morgan Lee, `/admin/users/{id}` |
| `admin-mcp-servers` | Administration → Tools from MCP servers (`administration/mcp-servers`) | Models → **MCP servers** list: "Service status" with approved tools ("2 of 3"), Data up to, Status and Health ("Healthy · 3 minutes ago"). | Morgan Lee, `/admin/mcp-servers` |
| `admin-mcp-server-tools` | Administration → Tools from MCP servers | The server's record page: URL, header shown by its last characters, Data up to, Timeout, Price per call, the **Read before you approve** notice and the tools with description, **Input schema** open for one, and Approved / Not approved states. | Morgan Lee, `/admin/mcp-servers?record={id}` |
| `agent-build-tools` | Using → Agents (`using/editors/agents#tools`) and Tools from MCP servers | Agent editor, Build, the **Tools** section open: approved tools with "From Service status · approved for data up to …", one ticked. | Priya Shah, `/teams/it-help-desk/agents/{id}` |
| `chat-tool-source` | Using → Chatting (`using/chat`) and Tools from MCP servers | A published agent's answer that cites a tool result, with the sources open showing **From Service status · check_outage** next to a document passage. | Jordan Kim, `/a/it-help-desk/help-desk-assistant?c=…` |
| `admin-connections-health` | Self-hosting → Stored health (`self-hosting/health`) | Admin → Connections with the **Health** column: two healthy and one failing ("Failing · since …"), the Health filter visible. A failing connection is easiest with a wrong API key on a spare connection. | Morgan Lee, `/admin/connections` |
| `admin-needs-attention-health` | Self-hosting → Stored health | Admin Overview, **Needs attention** with "1 connection is failing" and "1 MCP server is failing" (stop the fake MCP server, then **Test server**). | Morgan Lee, `/admin` |
| `tracing-answer-trace` | Self-hosting → Tracing (`self-hosting/tracing`) | One chat answer as a trace in Jaeger's UI (local trial, `OTEL_SERVICE_NAME=grounded-dev`): the HTTP span, `agent.answer`, retrieval spans, `chat …` and an `execute_tool` / `tools/call` span with its HTTP exchange. Not the Grounded UI: a local Jaeger only. | any, `http://127.0.0.1:16686` |

## Existing slots to recapture

These slots already have v0.2.1 images that are now out of date. The pages still read correctly with the old images; recapture when convenient (same slot names and files, then check the alt text):

| Slot | Why |
|---|---|
| `admin-overview-features` | The Features card gains the MCP server and OAuth rows, and Needs attention can list health items. |
| `admin-connections`, `admin-models` | Both lists gain the Health column. |
| `team-api-keys` | The scope list gains MCP; the page may show Connected apps. |
| `admin-costs` | The spend chart gains the MCP tools category (only visible with priced MCP calls). |
| `agent-build` | Build gains the Tools section (closed by default). |
