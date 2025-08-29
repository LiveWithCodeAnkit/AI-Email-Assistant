# AI Email Agent (Route: /agent)

## Overview
The AI Email Agent automates email drafting, refinement, follow-ups, and (mock) sending with minimal user input. It supports both a Native pipeline and a LangChain-powered agent, with Retrieval-Augmented Generation (RAG), lightweight memory, and a client-side scheduler.

## Key Features
- LangChain Agent toggle (Native vs LangChain)
- Context inference (recipient, purpose, urgency)
- RAG knowledge base (client-side, embeddings)
- Agent memory (preferences/contexts, localStorage)
- Handlebars pre-structuring with corporate templates
- AI refinement using OpenAI (GPT-4/GPT-4o-mini)
- Follow-up scheduler (client-side setInterval)
- Mock email transport (configure From, test send)
- Detailed logs and status UI

## Architecture
- Route: `/agent`
- Services:
  - `EmailService`: OpenAI calls, retries, context-aware refinement
  - `RagService`: Embeddings index/retrieval (OpenAI text-embedding-3-small)
  - `AgentService`: Native orchestration (infer → retrieve → template → refine)
  - `LangChainAgent`: LangChain ChatOpenAI for infer/refine
  - `AgentMemory`: localStorage memory for preferences/contexts
  - `AgentScheduler`: client-side scheduler for follow-ups
  - `EmailTransportService`: mock transport (local configuration, test send)
  - `TemplateEngine`: Handlebars renderer with helpers
- UI Components:
  - `EmailAgentPage.jsx` (page)
  - `KnowledgeBaseManager.jsx` (RAG snippets add/clear)
  - `TransportConfig.jsx` (mock email transport)

## Usage
1. Navigate to `/agent`.
2. Enter OpenAI API key in `ApiKeyManager`. Optionally save encrypted with passphrase.
3. (Optional) Add knowledge snippets in Knowledge Base.
4. (Optional) Toggle “Use LangChain Agent”.
5. Configure follow-up minutes (scheduler) if needed.
6. Configure “From” in Email Transport and test send.
7. Click “Start Agent” to run the pipeline. Review logs and final email.
8. (Optional) Click “Send Latest (Mock)” to simulate sending.

## Security & Privacy
- API key never leaves the client. Optional encryption at rest via passphrase (AES-GCM, PBKDF2).
- RAG snippets and memory stored in localStorage; user can clear both from UI.
- No server-side storage included.

## Notes
- Email sending is mocked client-side. For real SMTP/IMAP, a minimal backend is recommended.
- Scheduler uses setInterval on the client; jobs execute while the page is open.

## Extensibility
- Swap mock transport with backend proxy (Nodemailer) for real sending.
- Add IMAP listener in backend for auto-replies/threading.
- Extend templates and sector-specific variants.
- Add multi-language support.
