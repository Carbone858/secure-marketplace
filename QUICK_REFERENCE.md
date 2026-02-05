╔═══════════════════════════════════════════════════════════════════════════╗
║                    🚀 SECURE MARKETPLACE - QUICK REFERENCE                 ║
╚═══════════════════════════════════════════════════════════════════════════╝

📁 PROJECT LOCATION
═══════════════════════════════════════════════════════════════════════════
/mnt/kimi/output/secure-marketplace

📄 KEY FILES
═══════════════════════════════════════════════════════════════════════════

TASKS.md                      → Complete task list (11 phases)
PROMPT_FOR_NEXT_AI.md         → Give this to next AI model
PROJECT_SUMMARY.md            → Full project overview
README.md                     → Project documentation

src/
├── middleware.ts             → Security middleware (rate limiting, auth)
├── lib/
│   ├── auth/utils.ts         → Argon2, JWT, password validation
│   ├── security/             → Security utilities
│   └── db/client.ts          → Prisma database client
├── prisma/
│   └── schema.prisma         → Database schema (25+ tables)
└── app/[locale]/             → Next.js app router

🎯 HOW TO CONTINUE
═══════════════════════════════════════════════════════════════════════════

1. GIVE TO NEXT AI:
   → Copy contents of PROMPT_FOR_NEXT_AI.md
   → Paste to next AI assistant
   → It will start with TASK 2.1

2. MONITOR PROGRESS:
   → Check TASKS.md for completed items (marked with ✅)
   → Each task builds on previous
   → Test each feature before moving on

3. TESTING:
   cd /mnt/kimi/output/secure-marketplace
   npm install
   npm run dev
   → Test at http://localhost:3000

📊 TASK BREAKDOWN
═══════════════════════════════════════════════════════════════════════════

PHASE 1: Foundation          ✅ DONE
PHASE 2: Authentication      ⏳ NEXT (Tasks 2.1-2.4)
PHASE 3: Service Requests    ⏳ PENDING
PHASE 4: Company Directory   ⏳ PENDING
PHASE 5: Membership          ⏳ PENDING
PHASE 6: Real-time           ⏳ PENDING
PHASE 7: CMS                 ⏳ PENDING
PHASE 8: Admin Dashboard     ⏳ PENDING
PHASE 9: Company Dashboard   ⏳ PENDING
PHASE 10: Frontend Pages     ⏳ PENDING
PHASE 11: API Development    ⏳ PENDING

🎨 DESIGN SYSTEM
═══════════════════════════════════════════════════════════════════════════

Colors:
- Primary: blue-600 (#2563eb)
- Success: green-600 (#16a34a)
- Warning: amber-500 (#f59e0b)
- Danger: red-600 (#dc2626)
- Purple: purple-600 (#9333ea) - Premium

Components:
- btn-primary: Blue button
- btn-secondary: White/gray button
- card: White rounded shadow
- input-field: Form inputs

🔒 SECURITY REMINDERS
═══════════════════════════════════════════════════════════════════════════

✅ Already Implemented:
- Argon2 password hashing
- JWT authentication
- Rate limiting (5 req/5min auth, 100 req/min API)
- CSP, HSTS, XSS headers
- Input sanitization
- SQL injection prevention (Prisma)
- Audit logging

⚠️ Must Maintain:
- Never log passwords or tokens
- Always sanitize user input
- Validate all API inputs (Zod)
- Check user permissions
- Use parameterized queries
- Implement CSRF protection

🐛 DEBUGGING
═══════════════════════════════════════════════════════════════════════════

Check logs:
- Security events: SecurityLog table
- Data changes: AuditLog table
- API errors: Console + Network tab
- Database: Prisma Studio (npx prisma studio)

Common issues:
- Rate limit exceeded → Wait or check Redis
- JWT expired → Refresh token flow
- CORS error → Check middleware.ts
- DB error → Check connection string

📞 NEXT STEPS
═══════════════════════════════════════════════════════════════════════════

1. Review TASKS.md to understand full scope
2. Give PROMPT_FOR_NEXT_AI.md to next AI
3. Let it implement TASK 2.1 (User Registration)
4. Test the registration flow
5. Continue to TASK 2.2 (Login System)
6. Repeat until all tasks complete

═══════════════════════════════════════════════════════════════════════════
                        ✅ READY TO CONTINUE
═══════════════════════════════════════════════════════════════════════════