# Ruohan Dong — Personal Website

Website: https://tsa314ku-oss.github.io/RuohanDongSelf/

The website contains **12 independent HTML pages**. Each has its own URL, title, canonical address and pre-rendered content. Scrolling sections and the resume PDF do not count as additional pages.

| No. | Page | File | Parent |
| --- | --- | --- | --- |
| 1 | Home | `index.html` | — |
| 2 | Course Work | `coursework.html` | Home |
| 3 | Fermented Soothing Lotion | `project-artemisia.html` | Course Work |
| 4 | Functional Wound Dressing | `project-wound-dressing.html` | Course Work |
| 5 | Extracurricular Activities | `activities.html` | Home |
| 6 | Symphony Orchestra | `orchestra.html` | Extracurricular Activities |
| 7 | Student Leadership | `student-leadership.html` | Extracurricular Activities |
| 8 | Campus Singer | `campus-singer.html` | Extracurricular Activities |
| 9 | Academic Plan | `plan.html` | Home |
| 10 | Learning Philosophy | `philosophy.html` | Home |
| 11 | Resume | `resume.html` | Home |
| 12 | Contact | `contact.html` | Home |

Project and activity detail pages retain the existing descriptions and photographs. Each detail page includes a breadcrumb and a link to its parent. The footer links to all 12 pages. The unused duplicate `academic.html` has been removed.

## Maintain and publish

The site is static HTML/CSS/JavaScript. GitHub Pages publishes the root of `main`. Images retain the existing CDN and same-origin fallback; the homepage retains its high-resolution portrait. Internal navigation reuses the document where supported, while every HTML page also includes its own content and can be opened directly.

After changing the page rendering functions or page map in `app.js`, run:

```sh
node scripts/build-pages.cjs
node --check app.js
```

The builder regenerates the 12 HTML documents, their titles, canonical URLs and the shared footer navigation. No third-party packages are required.
