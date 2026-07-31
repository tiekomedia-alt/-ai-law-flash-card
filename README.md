# LawFlash AI

**AI-Powered Legal Study Companion for Nigerian Bar Exam Students**

## Project Structure
```
LawFlash-AI/
├── .env                    # Environment variables (never commit!)
├── .gitignore
├── README.md
├── frontend/               # Stitch HTML screens
│   ├── mobile/            # Mobile screens
│   └── desktop/           # Desktop screens
├── supabase/
│   └── migrations/        # SQL schema files
├── pipeline/              # AI content pipeline scripts
├── admin/                 # Admin review panel
└── landing/               # Next.js landing page
```

## Setup
1. Copy `.env.example` to `.env` and fill in credentials
2. Run `node supabase/run_migration.js` to set up DB schema
3. Open `frontend/mobile/onboarding-1.html` to see the UI

## Tech Stack
- **Frontend:** HTML + Tailwind CSS (Stitch-generated)
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions)
- **AI:** Gemini 2.0 Flash (content generation) + pgvector (RAG)
- **Payments:** Paystack
- **Notifications:** Firebase Cloud Messaging
