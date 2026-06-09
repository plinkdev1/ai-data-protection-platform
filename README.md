<div align="center">

# Privacy Guard

**An AI-assisted data-protection (DPO) platform**

[![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Status](https://img.shields.io/badge/status-MVP-orange)]()

*An AI co-pilot for data protection officers - requests, records, and compliance in one place.*

</div>

---

## What Is This?

Privacy Guard is an AI-assisted platform for data protection officers. It helps manage data-subject requests, maintain records of processing, draft policies, and track GDPR-style compliance tasks from a single dashboard.

---

## Features

| Feature | Description | Status |
|---|---|:---:|
| Compliance dashboard | Tasks, status, and risk at a glance | ✅ |
| Data-subject requests | Intake and track access/deletion | ✅ |
| AI DPO assistant | Drafts policies and guidance | 🚧 |
| Records of processing | Maintain the processing register | 🚧 |
| Audit trail | Activity and evidence log | 🚧 |

---

## How It Works

```
Data subjects ──▶ requests (access · deletion)
        │
        ▼
AI DPO assistant ◀──▶ records of processing · policies
        │
        ▼
Compliance dashboard (GDPR tasks · audits)
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| AI | Assistant / drafting layer |

---

## Project Structure

```
privacy-guard-ai-dpo-platform/
migrations/
   1/
   10/
   11/
   12/
   13/
   14/
src/
   react-app/
   shared/
   worker/
.gitignore
eslint.config.js
index.html
package.json
package-lock.json
postcss.config.js
README.md
tailwind.config.js
tsconfig.app.json
tsconfig.frontend.json
tsconfig.json
tsconfig.node.json
tsconfig.worker.json
vite.config.ts
wrangler.json
```

---

## Screenshots

<table>
<tr><td width="50%"><img src="screenshots/01.png" width="100%" /></td><td width="50%"><img src="screenshots/03.png" width="100%" /></td></tr>
<tr><td width="50%"><img src="screenshots/04.png" width="100%" /></td><td width="50%"><img src="screenshots/05.png" width="100%" /></td></tr>
<tr><td width="50%"><img src="screenshots/06.png" width="100%" /></td><td width="50%"><img src="screenshots/07.png" width="100%" /></td></tr>
<tr><td width="50%"><img src="screenshots/08.png" width="100%" /></td><td width="50%"><img src="screenshots/09.png" width="100%" /></td></tr>
<tr><td width="50%"><img src="screenshots/10.png" width="100%" /></td><td width="50%"><img src="screenshots/11.png" width="100%" /></td></tr>
<tr><td width="50%"><img src="screenshots/12.png" width="100%" /></td></tr>
</table>

---

## Getting Started

```bash
npm install --legacy-peer-deps --ignore-scripts
npx next dev
```

---

## Notes

Shared as a portfolio artifact demonstrating product and system design. Early prototype, not a finished product; not legal advice.

<div align="center">

MIT

</div>
