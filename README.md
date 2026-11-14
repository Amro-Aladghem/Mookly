# Mookly

Mookly is an AI-powered mock-interview platform. You create a profile, pick a job type and level, choose an interview type, and then talk to an AI interviewer that asks conversational questions, hands you practical tasks, evaluates your answers, and saves a structured result with a score, strengths, improvement areas, and recommendations.

The whole experience is in Arabic (RTL), with a calm dark-navy visual identity.

## 1. What Mookly Does

- Creates a user profile with first name, last name, about, job type, and job level.
- Lets the user start a mock interview by choosing a mock-interview type, a job type, a job level, and a short description of what to focus on.
- Ties every interview to a chat signature, so the conversation, tasks, and result all belong to the same interview.
- Runs an AI interviewer over the conversation: **5 conversational questions** followed by **3 practical tasks**, then a final evaluation.
- Stores practical tasks as `Canva` records. Each task is either `Markdown` or `HTML` and can be marked as solved with the user's answer.
- Saves the final evaluation as a `MockInterviewResult`: overall score (0–100), summary, strengths, areas for improvement, and recommendations.
- Tracks agent progress through notifications: `Queued`, `Running`, `WaitingForUser`, `Completed`, and `Failed`.
- Keeps an interview history per user with statuses: `Scheduled`, `InProgress`, `Completed`, `Cancelled`, and `Failed`.
- Provides an Arabic dashboard with the home page, interview room, interactive-tasks panel, history, result page, and profile page.

### From Interview Setup to Result

1. The user opens Mookly. If there is no `userId` in `localStorage`, the profile-creation page is shown first.
2. The user creates a mock interview. The frontend first creates a chat and receives its `chatSignature`, then creates the `MockInterview` (status `Scheduled`) against that signature.
3. The frontend stores the interview information (type, job type, level, about) under the chat signature and navigates to the interview room.
4. The interview information message is sent once as a normal user message to the agent endpoint.
5. The API stores the user message as a chat row, creates a `Queued` notification, writes the request to an in-memory channel, and responds `202 Accepted` immediately.
6. A background worker picks up the request, marks the notification as `Running`, and runs the `InterviewerAgent`.
7. The agent reads the chat context, asks its questions, creates and updates canvas tasks, saves the user's practical answers, and finally saves the interview result and marks the interview `Completed`.
8. The frontend polls the notifications endpoint every 4 seconds, groups the chat history into user / agent execution blocks, refreshes the canvas panel, and shows a **View result** action when the agent finishes.

## 2. The AI Engine (BaseAgent) and InterviewerAgent

`BaseAgent` is the shared engine behind every agent. An agent is a configuration of that engine: an agent type, its own AI chat implementation, and a system prompt.

At a high level, the engine loop:

- Loads the chat context for the conversation from the database.
- Sends the context to the AI model with the agent's system prompt.
- Parses the model's JSON response: finish, ask the user, or call a tool.
- Executes the requested tool, saves the tool result as a `Tool` chat row, and loops again.
- Finishes with `IsFinished`, `AskUser`, or an error after the configured retry limit.
- Writes a notification for each terminal state: `Completed`, `WaitingForUser`, or `Failed`.

The AI provider is **Google Gemini** through `Mscc.GenerativeAI`. `InterviewerAgentChat` uses `gemini-2.5-flash` with `ResponseMimeType = application/json` and `Temperature = 0`, so the model always returns structured JSON.

Current agent:

- **InterviewerAgent** — the mock-interview agent. It focuses on exactly 8 items: 5 conversational questions, then 3 practical tasks created through canvas tools, then a final evaluation. Its system prompt is stored in `Backend/Infrastructure/Resources/InterviewerAgentSysPrompt.txt`.

`AgentExecutionService` routes the queued request to the right agent (currently `InterviewerAgent`), and `AgentBackgroundWorker` consumes the in-memory channel in the background.

## 3. Tools & Services

Tools are the small operations the AI agent decides to call. Each tool calls a service, and the services do the actual work (database access, persistence, external calls). Every tool lives in its own class and is discovered automatically from `IAgentTool` implementations.

Tool groups:

- **Chat tools**
  - `CreateChatTool` — appends a chat row to a conversation.
  - `GetChatsForChatIdTool` — the full chat history for a chat signature.

- **Notification tools**
  - `CreateNotificationTool` — creates a notification row.
  - `GetNotificationsForChatIdTool` — notifications for one conversation.
  - `GetNotificationsForSpecificStatusTool` — notifications filtered by status.
  - `GetNotificationsForUserIdTool` — notifications for a user.

- **User tools**
  - `CreateUserTool`, `GetUserByIdTool`, `UpdateUserTool`, `DeleteUserTool`.

- **Mock interview tools**
  - `CreateMockInterviewTool` — creates an interview for a chat signature.
  - `GetMockInterviewByChatSigntureTool` — the interview that belongs to a chat signature.
  - `GetAllMockInterviewsByUserIdTool` — interview history.
  - `GetLastMockInterviewTool` — the most recent interview.
  - `UpdateMockInterviewStatusTool` — moves the interview through its statuses.

- **Mock interview result tools**
  - `CreateMockInterviewResultTool` — saves the final evaluation.
  - `GetMockInterviewResultTool` — reads the evaluation for an interview.

- **Canvas tools**
  - `AddCanvaTool` — creates a practical task (`Markdown` or `HTML`).
  - `UpdateCanvaStatusTool` — marks a task as solved and stores the user's answer.
  - `DeleteCanvaTool` — removes a task.
  - `GetCanvaByIdTool` — one task by id.
  - `GetCanvasForChatSigntureTool` — all tasks for a chat signature.

- **Lookup tools**
  - `GetJobTypesTool`, `GetJobTypeByIdTool`.
  - `GetJobLevelsTool`, `GetJobLevelByIdTool`.
  - `GetMockInterviewTypesTool`, `GetMockInterviewTypeByIdTool`.
  - `GetChatRolesTool`, `GetChatRoleByIdTool`.
  - `GetDefaultMessagesTool`, `GetDefaultMessageByIdTool`.

Tool calls and their results are stored in the chat history as `Tool` rows, so the agent can follow its own reasoning on the next turn.

Backing services:

- `UserService` — create, read, update, and delete users.
- `ChatService` — chat creation and history.
- `NotificationService` — queued/running/waiting/completed/failed notifications.
- `MockInterviewService` — create, update status, get by chat signature, get all for a user, get the last interview.
- `MockInterviewResultService` — save and read the final evaluation.
- `CanvaService` — add, update status, delete, get by id, and get by chat signature.
- `JobTypeService`, `JobLevelService`, `MockInterviewTypeService`, `ChatRoleService`, `DefaultMessageService` — lookup reads.
- `AgentChatCoordinator` and `ToolChatCoordinator` — connect AI responses and tool results to the chat history and notifications.
- `AgentExecutionService` — routes a queued request to `InterviewerAgent`.
- `SpeechToTextCoordinatorService` / `TextToSpeechCoordinatorService` — Whisper and Piper wrappers (speech features are scaffolded and currently disabled in the chat coordinator).
- `AudioFileService` — audio format conversion through FFMpegCore.
- `BlobStorageUploadService` — uploads generated audio to Azure Blob Storage and rewrites the URL through the CDN.

## 4. Project Structure

```text
Backend/
  Domain/          Entities and enums
  Application/     DTOs, services, agents, tools, coordinators, background worker
  Infrastructure/  EF Core DbContext, Gemini chat, Whisper/Piper, blob storage
  Presentation/    API controllers
  MooklyApi/       Host project, Program.cs, migrations, appsettings

Frontend/
  my-app/          Vite + React + TypeScript + Tailwind app
```

## 5. Configuration

The backend reads its configuration from `Backend/MooklyApi/appsettings.Development.json` (it is ignored by git next to `appsettings.json`).

Create the file yourself and fill in your own values. The important keys are:

- `SQL_CONNECTION_STRING` — PostgreSQL connection string.
- `geminiApi` — Google Gemini API key.
- `aiRetryCount` — how many times the AI call is retried before failing.
- `blobconnectionstring` — Azure Blob Storage connection string.
- `File_Host` — blob host that is replaced in generated URLs.
- `File_Container` — blob container name.
- `File_Cdn` — CDN host used in the final public URLs.
- `Whisper:Uri`, `Whisper:Port`, `Whisper:TimeOut` — speech-to-text service.
- `Piper:Uri`, `Piper:Port`, `Piper:TimeOut` — text-to-speech service.

Never commit real keys, connection strings, or secrets — use placeholders in shared files and keep your local file private. If a key was ever committed, rotate it.

## 6. Database

Mookly uses EF Core with PostgreSQL. Migrations live in `Backend/MooklyApi/Migrations`.

Apply them from the `Backend/` folder:

```bash
dotnet ef database update --project MooklyApi/MooklyApi.csproj --startup-project MooklyApi/MooklyApi.csproj
```

Seed the lookup tables from the repository root:

```bash
psql -h localhost -p 5433 -U postgres -d Mookly -f DataScript.sql
```

`DataScript.sql` fills:

- `JobLevels` — Junior, MidLevel, Senior.
- `JobTypes` — front-end, back-end, full-stack, mobile, QA, data, cloud, AI/ML, and more.
- `MockInterviewTypes` — Technical Skills, Logical Thinking, Behavioral, Situational, Mixed.
- `DefaultMessages` — welcome, next-question, and follow-up messages.

## 7. Running the Backend

The backend is an ASP.NET Core (.NET 10) solution split into `Domain`, `Application`, `Infrastructure`, `Presentation`, and `MooklyApi`.

From the repository root:

```bash
dotnet run --project Backend/MooklyApi/MooklyApi.csproj
```

The API runs on `http://localhost:5141`.

Main endpoints:

- `POST /api/v1/users`
- `GET  /api/v1/users/{userId}`
- `POST /api/v1/users/{userId}/chats`
- `GET  /api/v1/users/{userId}/chats/{chatSignature}`
- `GET  /api/v1/users/{userId}/chats/{chatSignature}/notifications`
- `POST /api/v1/users/{userId}/chats/{chatSignature}/agent`
- `POST /api/v1/users/{userId}/chats/{chatSignature}/mock-interviews`
- `GET  /api/v1/users/{userId}/chats/{chatSignature}/mock-interviews`
- `GET  /api/v1/users/{userId}/mock-interviews`
- `GET  /api/v1/users/{userId}/mock-interviews/last`
- `GET  /api/v1/users/{userId}/mock-interviews/{mockInterviewId}/result`
- `GET  /api/v1/users/{userId}/chats/{chatSignature}/canvas`
- `GET  /api/v1/users/{userId}/canvas/{canvaId}`

Lookup endpoints:

- `GET /api/v1/lookups/job-types`
- `GET /api/v1/lookups/job-levels`
- `GET /api/v1/lookups/mock-interview-types`

CORS is enabled for the Vite development origins (`localhost` on ports `5173` and `5174`).

Docker is also supported. From the repository root, after creating `.env`:

```bash
docker compose up --build
```

This starts the API on `5141`, the built frontend on `5137`, and PostgreSQL on `5435`.

## 8. Running the Frontend

The frontend is a Vite + React + TypeScript app styled with Tailwind CSS. It uses React Router, `marked` for Markdown, `DOMPurify` for injected HTML, and `lucide-react` for icons.

Create `Frontend/my-app/.env` (there is a `.env.example` to copy) and set:

```env
VITE_API_BASE_URL=http://localhost:5141/api/v1
```

Then:

```bash
cd Frontend/my-app
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

Pages:

- `/` — **Home** when a user exists, otherwise the **profile creation** page.
- `/create-interview` — pick interview type, job type, job level, and write the interview description.
- `/interview/:chatSignature` — the interview room: chat with the AI interviewer on one side and the **interactive tasks** panel on the other.
- `/history` — all mock interviews with status filters.
- `/results/:mockInterviewId` — the structured result of a completed interview.
- `/profile` — the user profile.

Key behaviors:

- `userId` is stored in `localStorage` under `mookly.userId`; the cached profile is stored under `mookly.user`.
- The active interview details are cached per chat signature under `mookly.activeInterview.<chatSignature>`.
- The interview information message is built from the interview details and sent automatically once per chat; a flag is stored under `mookly.autoMessage.<chatSignature>`.
- Chat history and notifications are grouped into user messages and agent execution blocks (the same algorithm as the reference project).
- Notifications are polled every 4 seconds until the agent reaches a terminal state.
- The **interactive tasks** panel shows the latest `Canva` returned by the backend:
  - `Markdown` is rendered with `marked`.
  - `HTML` is sanitized with `DOMPurify` and injected into a React component.
  - When there is no task yet, an empty state is shown.
- A dedicated loader is displayed before the interviewer's first reply: “المقابلة على وشك البدء…”, with the interviewer avatar and pulsing rings.
- When the agent is `WaitingForUser`, the page shows “دورك الآن” and focuses the composer.
- When the interview finishes, the user is offered a button to open the result page.
- The UI is fully Arabic and RTL, uses the Cairo font, a dark-navy palette, and subtle hover effects. Interviewer images live in `Frontend/my-app/public`.

## 9. Contributing

Contributions are welcome! Feel free to open a pull request: fork the repo, create a feature branch, commit your changes, and describe your PR clearly.

Author: Mookly Team
