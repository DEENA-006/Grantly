Simulated Endpoints:
All API calls will wrap the JSON data in a setTimeout to mimic 300ms network latency. This allows the CLEAR skeleton loaders to trigger perfectly for the judges.

GET /api/grants: Fetches the discovery feed.

POST /api/board/move: Updates the status of a grant (e.g., Moved from "Saved" to "In Progress").