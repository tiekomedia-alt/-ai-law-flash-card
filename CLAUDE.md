# CLAUDE.md — LawFlash AI Project Context

This file is the single source of truth for this project. Read it entirely before doing any work.

## Project Overview

LawFlash AI is an AI-powered flashcard and exam preparation mobile app for Nigerian law students preparing for Bar Final Examinations. It covers 5 courses, ~125 topics, and combines RAG-powered flashcards with gamification (streaks, leaderboards, XP) and timed MCQ exam simulations.

- **Founder:** Non-technical (no-code competent, can prompt AI tools but cannot write code)
- **Technical Partner:** Claude (AI) handles all code, architecture, and implementation
- **Target User:** Final-year Nigerian Law School students preparing for Bar Finals
- **Competitors:** None in Nigeria for AI-powered legal study tools
- **Business Model:** Freemium — ₦5,000/month subscription via Paystack

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend (Mobile) | Flutter via FlutterFlow (iOS + Android) |
| Backend / Database | Supabase (PostgreSQL) |
| Serverless Functions | Supabase Edge Functions (Deno/TypeScript) |
| Vector Database | Supabase pgvector extension |
| AI (Bulk Generation) | Gemini 3 Flash (cheap, fast) |
| AI (Complex Tasks) | Gemini Pro or Claude Sonnet (better reasoning) |
| AI (Embeddings) | text-embedding-3-small or Gemini embedding |
| Authentication | Supabase Auth (email/password + Google OAuth) |
| Payments | Paystack (Nigerian payment processor) |
| Push Notifications | Firebase Cloud Messaging |
| Error Tracking | Sentry (free tier) |
| Landing Page | Next.js on Vercel |

## Supabase Project

- **Project Name:** FLASHCARD.NG
- **Project ID:** hjlzqandwglgxdbtsget
- **Region:** EU-West-1
- **API URL:** https://hjlzqandwglgxdbtsget.supabase.co
- **Database:** PostgreSQL 17.6
- **Status:** ACTIVE_HEALTHY

## Installed Extensions

- `uuid-ossp` (UUID generation)
- `vector` v0.8.0 (pgvector for RAG embeddings)
- `pgcrypto` (cryptographic functions)
- `pg_graphql` (GraphQL support)
- `pg_stat_statements` (query monitoring)

## Database Schema (14 Tables — ALL CREATED)

All tables have Row Level Security (RLS) enabled with appropriate policies.

| Table | Purpose | Rows |
|---|---|---|
| users | User accounts and profiles | 0 |
| subscriptions | Payment and billing tracking | 0 |
| courses | The 5 bar exam courses | 5 |
| chapters | Chapters within courses | 125 |
| flashcards | AI-generated flashcards | 0 |
| mcq_questions | Multiple choice questions | 0 |
| user_progress | Individual learning progress (SM-2 spaced repetition) | 0 |
| exam_attempts | MCQ simulation results | 0 |
| streaks | Daily streak tracking | 0 |
| xp_transactions | XP point history | 0 |
| leaderboard | Weekly/all-time rankings | 0 |
| content_reports | User-flagged inaccurate content | 0 |
| documents | Source material metadata | 0 |
| embeddings | Vector embeddings for RAG pipeline | 0 |

## Course IDs (for reference in queries)

| Course | UUID |
|---|---|
| Criminal Litigation | 65e185b9-6471-4e13-b9fc-5a502b5b6c49 |
| Civil Litigation | f3f9762e-2d0a-4258-b94e-5a544c1b9c98 |
| Professional Ethics | a3e6e6a1-20c8-4a3b-bbc4-e2022db599b8 |
| Company Law & Practice | 8f524136-30f6-4a75-b660-c70338c1b090 |
| Property Law & Practice | 6b05c6f6-1093-4690-adce-4a814a9ff178 |

## Key ENUM Types

- `subscription_status`: free, premium, cancelled, past_due
- `flashcard_difficulty`: basic_recall, application, analysis
- `flashcard_status`: pending_review, approved, rejected, flagged
- `mcq_difficulty`: easy, medium, hard
- `mcq_source_type`: ai_generated, past_exam, curated
- `campus_type`: Abuja, Lagos, Enugu, Yola, Kano, Yenagoa, Other

## Auto-Triggers (Already Deployed)

- `on_auth_user_created`: When a user signs up via Supabase Auth, automatically creates entries in `users`, `streaks`, and `subscriptions` tables
- `set_*_updated_at`: Auto-updates `updated_at` timestamp on users, subscriptions, flashcards, user_progress, and streaks tables

## Vector Search Function (Already Deployed)

```sql
search_embeddings(query_embedding vector(1536), match_threshold FLOAT, match_count INT, p_course_id UUID)
```
Returns matching document chunks sorted by cosine similarity.

## Edge Functions: NONE DEPLOYED YET

These need to be built:
1. `generate-flashcards` — Takes chapter_id, retrieves relevant embeddings, calls Gemini to generate flashcards
2. `generate-mcqs` — Takes chapter_id, generates MCQ questions via Gemini
3. `paystack-webhook` — Handles payment confirmation, subscription activation/cancellation
4. `check-subscription` — Middleware to verify premium access before returning content

## The 5 Courses and Their 125 Chapters

### Criminal Litigation (25 chapters)
1. Introduction to Criminal Litigation
2. Jurisdiction in Criminal Matters
3. Commencement of Criminal Proceedings
4. Bail in Criminal Cases
5. Charges and Information
6. Arraignment and Plea
7. Pre-Trial Proceedings
8. Exhibits and Real Evidence
9. Examination of Witnesses
10. Confessions and Admissions
11. Identification Evidence
12. Character Evidence
13. Corroboration
14. Defence of Alibi
15. No-Case Submission
16. Defence and Final Addresses
17. Judgment in Criminal Cases
18. Sentencing and Punishment
19. Criminal Appeals
20. Juvenile Justice
21. Administration of Criminal Justice Act (ACJA)
22. Homicide Offences
23. Robbery and Theft Offences
24. Economic and Financial Crimes
25. Fundamental Rights Enforcement in Criminal Matters

### Civil Litigation (25 chapters)
1. Introduction to Civil Litigation
2. Jurisdiction in Civil Matters
3. Parties to an Action
4. Originating Processes
5. Pleadings
6. Service of Court Processes
7. Interlocutory Applications
8. Pre-Trial Conference
9. Trial Procedure
10. Evidence in Civil Cases
11. Judgment and Orders
12. Remedies and Reliefs
13. Enforcement of Judgments
14. Civil Appeals
15. Alternative Dispute Resolution
16. Limitation of Actions
17. Costs in Civil Litigation
18. Contempt of Court
19. Fundamental Rights Enforcement
20. Election Petitions
21. Probate and Administration of Estates
22. Company Winding-Up Proceedings
23. Chieftaincy Matters
24. Land Disputes
25. Practice and Procedure at the Supreme Court and Court of Appeal

### Professional Ethics (25 chapters)
1. Introduction to Legal Ethics
2. The Legal Practitioners Act
3. Rules of Professional Conduct (RPC)
4. Duties to the Court
5. Duties to Clients
6. Duties to Fellow Lawyers
7. Duties to the Public
8. Lawyer-Client Relationship
9. Legal Fees and Remuneration
10. Professional Privilege
11. Advertising and Solicitation
12. Law Office Management
13. Legal Practitioners Disciplinary Committee
14. Professional Misconduct
15. Sanctions and Disciplinary Proceedings
16. Nigerian Bar Association
17. Body of Benchers
18. Senior Advocate of Nigeria (SAN)
19. Notarial Practice
20. Ethics in Advocacy
21. Conflict of Interest
22. Handling Client Funds
23. Ethics in Commercial Transactions
24. Anti-Money Laundering Obligations
25. Emerging Ethical Issues

### Company Law & Practice (25 chapters)
1. Introduction to Company Law
2. Incorporation of Companies
3. Types of Companies
4. Memorandum and Articles of Association
5. Corporate Personality
6. Share Capital
7. Membership
8. Directors
9. Company Secretary
10. Company Meetings
11. Dividends and Profits
12. Company Accounts and Audit
13. Insider Dealing and Market Abuse
14. Protection of Minority Shareholders
15. Corporate Borrowing and Charges
16. Receivership
17. Winding Up
18. Mergers and Acquisitions
19. Business Names
20. Limited Liability Partnerships
21. Corporate Governance
22. Foreign Companies
23. Corporate Social Responsibility
24. Investments and Securities Act
25. Stamp Duties and Company Taxation

### Property Law & Practice (25 chapters)
1. Introduction to Property Law
2. Land Use Act 1978
3. Customary Land Tenure
4. Statutory Right of Occupancy
5. Governor's Consent
6. Sale of Land
7. Conveyancing Practice
8. Deeds and Documents
9. Land Registration
10. Leases and Tenancies
11. Recovery of Premises
12. Mortgages
13. Remedies of the Mortgagee
14. Easements and Profits
15. Covenants Affecting Land
16. Co-ownership
17. Succession and Inheritance
18. Trespass to Land
19. Compulsory Acquisition
20. Town and Country Planning
21. Environmental Law and Property
22. Real Estate Development
23. Property Taxation
24. Landlord and Tenant Law
25. Ethics in Property Transactions

## Core Features to Build

### 1. AI-Powered Flashcards (Core Feature)
- Front (question/prompt) + Back (answer/explanation)
- 3 difficulty levels: Basic Recall, Application, Analysis
- SM-2 spaced repetition algorithm
- Users rate cards: Hard, Good, Easy
- AI generates from source materials via RAG pipeline

### 2. 59-Minute MCQ Exam Simulation
- 50 MCQs per session, strict 59-minute timer
- Auto-submits on timeout
- Adaptive difficulty based on performance
- Post-exam review with explanations
- Score breakdown by topic

### 3. Gamification Engine
- **Daily Streaks:** Consecutive days of completing minimum study goal
- **Leaderboard:** Weekly and all-time, filtered by course/campus
- **XP Points:** +5 per flashcard, +25 per MCQ session, +50 perfect score bonus, +10 daily streak
- **Achievements:** Milestone badges
- **Brain Workout:** Daily 5-min mixed drill (rapid flashcards + 5 timed MCQs)

### 4. Progress Analytics
- Mastery percentage per course/chapter
- Study time tracking
- MCQ score trends
- Weakest topics identification

## Monetization

### Free Tier
- 5 random cards from 1 random topic daily
- 3 MCQ questions per day (untimed)
- 1 course preview (rotating weekly)
- No streaks, no leaderboard participation, no brain workout
- Basic analytics only

### Premium (₦5,000/month via Paystack)
- Unlimited flashcards across all 5 courses
- Full 59-minute timed exams, unlimited attempts
- All gamification features
- Full progress analytics
- Brain workout

### Payment Flow
1. User upgrades → Paystack checkout
2. Paystack webhook confirms → backend activates premium
3. 3 days before renewal → push notification
4. Failed payment → 3-day grace period with daily retry
5. After grace → reverts to Free tier (progress preserved)

## AI Content Pipeline (To Be Built)

### Step 1: Material Upload
Founder uploads PDFs/notes to Supabase Storage, organized by course/chapter.

### Step 2: Text Extraction
Scripts extract text from PDFs, clean formatting, segment by chapter.

### Step 3: Chunking & Embedding
Split into 500-1000 token chunks. Generate vector embeddings. Store in `embeddings` table.

### Step 4: Flashcard Generation
For each chapter, retrieve relevant chunks via vector search, call Gemini 3 Flash to generate flashcards following schema:
```json
{
  "front_text": "Question or prompt (max 280 chars)",
  "back_text": "Answer or explanation (max 500 chars)",
  "difficulty": "basic_recall | application | analysis",
  "tags": ["topic", "subtopic"],
  "confidence_score": 0.0-1.0,
  "source_reference": "Citation"
}
```

### Step 5: MCQ Generation
Generate MCQs with 4 options (a,b,c,d), correct answer, and explanation.

### Step 6: Human Curation
Founder reviews via admin panel. Cards below 80% confidence auto-flagged.

## AI Model Strategy
- **Bulk generation:** Gemini 3 Flash (fast, cheap)
- **Complex review:** Gemini Pro or Claude Sonnet
- **Embeddings:** text-embedding-3-small or Gemini embedding

## Security (OWASP Top 10 Implemented)
- Row Level Security on all tables
- Parameterized queries (SQL injection prevention)
- API keys in environment variables only
- Rate limiting: 100 req/min authenticated, 20 unauthenticated, 10/min AI endpoints
- Paystack webhook HMAC signature verification
- AI prompt injection protection (user content never inserted directly into prompts)
- NDPR (Nigeria Data Protection Regulation) compliance

## Development Phases

### Phase 1: Foundation (MOSTLY COMPLETE ✅)
- [x] Supabase project created
- [x] Database schema deployed (14 tables)
- [x] 5 courses seeded
- [x] 125 chapters seeded
- [x] RLS policies configured
- [x] Vector search function deployed
- [ ] Supabase Storage buckets for materials
- [ ] AI API keys configured as secrets
- [ ] Paystack test account set up

### Phase 2: Content Pipeline (NEXT)
- [ ] Upload source materials
- [ ] Text extraction scripts
- [ ] Vector embedding generation
- [ ] Flashcard generation pipeline
- [ ] MCQ generation pipeline
- [ ] Admin review panel

### Phase 3: App Development
- [ ] Auth flow (signup/login)
- [ ] Flashcard study screen with spaced repetition
- [ ] MCQ exam screen with timer
- [ ] Streak & XP system
- [ ] Leaderboard
- [ ] Progress dashboard
- [ ] Payment integration (Paystack)
- [ ] Free tier gating
- [ ] Push notifications
- [ ] Brain Workout feature

### Phase 4: Launch Prep
- [ ] Generate content for all 5 courses
- [ ] Security audit
- [ ] Beta testing (15-20 users)
- [ ] App Store submissions
- [ ] Landing page
- [ ] Launch campaign

## UI/UX Designs

Stitch-generated HTML/CSS designs exist for all screens (mobile + desktop):
- Onboarding (3 screens)
- Authentication
- Home Dashboard
- Flashcard Study
- MCQ Exam
- Leaderboard
- Progress Analytics
- Subscription/Paywall

**Design System:**
- Primary: `#1A3B70` (deep navy)
- Accent: `#C5A059` (gold)
- Font: Inter
- Icons: Material Symbols
- Framework: Tailwind CSS
- Mobile-first, dark mode support

## Project Folder Structure

```
lawflash-ai/
├── .env                          # API keys (NEVER commit)
├── .gitignore
├── CLAUDE.md                     # THIS FILE
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── functions/
│       ├── generate-flashcards/
│       ├── generate-mcqs/
│       ├── paystack-webhook/
│       └── check-subscription/
├── scripts/
│   ├── seed-chapters.ts
│   ├── process-documents.ts
│   └── generate-embeddings.ts
├── ui-designs/
│   ├── mobile/
│   └── desktop/
└── docs/
    └── PRD.md
```

## Important Notes

1. The founder cannot write code — all code must be generated by Claude Code
2. Always commit to git frequently and push to GitHub
3. Use Gemini 3 Flash for bulk operations to stay within budget (₦20-50k/month infra)
4. Every AI-generated flashcard needs a confidence score — flag anything below 0.80
5. Free tier restrictions MUST be enforced server-side (never trust the client)
6. The 59-minute exam timer must be validated server-side
7. All Paystack webhook payloads must be verified with HMAC signature
