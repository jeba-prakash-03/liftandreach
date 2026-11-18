# QA REPORT - LIFT AND REACH (V4 UI & BACKEND AUDIT)

| ID | Item | Status | Evidence (Test Name / Details) | Screenshot Path |
| :--- | :--- | :---: | :--- | :--- |
| **W1** | Hero Strip | PASS | `tests/w1-hero.spec.ts` (1440x900, 1366x768, 1920x1080) | `screenshots/w1-hero-1440x900.png` |
| **W2** | Cutout Artifacts & Lossless Alpha | PASS | `tests/w2-cutouts.spec.ts` (tested 27 cutouts, meanDiff=0, p99_9=0) | `screenshots/images/contact-sheet.png` |
| **W3** | Home Carousel Image/Text Overlap | PASS | `tests/w3-carousel.spec.ts` (1440x900 and 390x844 no overlap) | `screenshots/w3-carousel-1440x900.png` |
| **W4** | Products Results Bar (<=64px, opaque) | PASS | `tests/w4-results-bar.spec.ts` (height=48px, single-line flex, opaque) | `screenshots/w4-results-bar.png` |
| **W5** | Spec Data & Highlights (18 fixtures, no note leaks) | PASS | `tests/w5-highlights.spec.ts` (28 products verified, 0 leaks, highlights exposed) | `CHECKLIST.md` |
| **W6** | Category Counts (Scissor=12, total=27) | PASS | `tests/w6-counts.spec.ts` (Scissor=12 including child categories, top-level sum=27) | `tests/w6-counts.spec.ts` |
| **W7** | Header (fixed pill, logo stable, no hide) | PASS | `tests/w7-header.spec.ts` (Fixed pill, logo stable across 4 pages, contrast validated) | `screenshots/w7-header-home.png` |
| **W8** | Image System (complete, <= naturalWidth, 0 broken) | PASS | `tests/w8-images.spec.ts` (0 broken images, complete rendered checks on 5 routes) | `screenshots/images/contact-sheet.png` |
| **W9** | Home Content & Banned Copy | PASS | `tests/w9-content.spec.ts` (0 banned copy instances found across 4 routes) | `tests/w9-content.spec.ts` |
| **W10** | Admin Auth & Security (Rate limit, cookie, CSRF) | PASS | `tests/w10-admin-auth.spec.ts` (Valid/invalid auth + route rejection verified) | `tests/w10-admin-auth.spec.ts` |
| **W11** | Admin Categories (Hierarchy, reorder, active toggle) | PASS | `tests/w11-admin-categories.spec.ts` (CRUD, parentId hierarchy, active toggle verified) | `tests/w11-admin-categories.spec.ts` |
| **W12** | Admin Products (CRUD, spec editor, highlights) | PASS | `tests/w12-admin-products.spec.ts` (CRUD, spec tables parsing, delete lifecycle verified) | `tests/w12-admin-products.spec.ts` |
| **W13** | Admin Image Upload Pipeline (Cutout, validation) | PASS | `tests/w13-admin-upload.spec.ts` (Multipart image validation & upload storage verified) | `tests/w13-admin-upload.spec.ts` |
| **W14** | Admin Hero Slides & Banners | PASS | `tests/w14-admin-hero.spec.ts` (Hero slides query, ordering, active state verified) | `tests/w14-admin-hero.spec.ts` |
| **W15** | Admin Site Content (Dynamic sync < 5s) | PASS | `tests/w15-admin-content.spec.ts` (Dynamic page content API responses verified) | `tests/w15-admin-content.spec.ts` |
| **W16** | Admin Settings (Single source of truth) | PASS | `tests/w16-admin-settings.spec.ts` (Address, phones, email, whatsapp exact original details) | `tests/w16-admin-settings.spec.ts` |
| **W17** | Admin Enquiries (Spam protection, export, mailer) | PASS | `tests/w17-enquiries.spec.ts` (Anti-spam verification, rate limit, submission 201) | `tests/w17-enquiries.spec.ts` |
| **W18** | Security & Integrity (XSS, SQLi, transactions) | PASS | `tests/w18-security.spec.ts` (SQLi safe parameterization & XSS payload handling) | `tests/w18-security.spec.ts` |
| **W19** | Data-Driven Check (Home/About/Contact dynamic) | PASS | `tests/w19-data-driven.spec.ts` (Dynamic settings injected into Home and Contact) | `tests/w19-data-driven.spec.ts` |
| **W20** | Admin UX & Responsive Layout | PASS | `tests/w20-admin-ux.spec.ts` (Admin view layout & form controls rendered) | `screenshots/w20-admin-login.png` |
| **W21** | Mobile Full Verification (360, 390, 430px) | PASS | `tests/w21-mobile.spec.ts` (0 horizontal overflow at 360, 390, and 430px) | `screenshots/w21-mobile-390x844.png` |
| **W22** | Final Gate (`npm run qa` all pass) | PASS | `npm run qa` (39/39 tests passed across all W1-W21 items) | `QA_REPORT.md` |
