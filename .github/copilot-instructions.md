# Copilot Instructions for Phu AI Core

## Project Overview

Phu AI is a static web application built with vanilla HTML, CSS, and JavaScript, deployed to Azure App Service via GitHub Actions.

## Repository Structure

```
/
├── index.html          # Main landing page
├── css/
│   └── styles.css      # Global stylesheet
├── js/
│   └── app.js          # Main JavaScript (navigation, modals, pricing, animations)
├── pages/
│   ├── apps.html       # Apps/features page
│   ├── privacy.html    # Privacy policy
│   └── terms.html      # Terms of service
└── .github/
    └── workflows/
        └── azure-webapps-node.yml  # CI/CD pipeline to Azure
```

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+, strict mode)
- **Hosting**: Azure App Service (deployed via GitHub Actions)
- **No build step**: Files are served as-is (no bundler or transpiler)
- **No frameworks**: Pure DOM APIs only — do not introduce React, Vue, jQuery, etc.

## Coding Conventions

- JavaScript uses `'use strict'` and is organized into IIFEs per feature section.
- All JS is in `/js/app.js`; add new features as clearly labelled IIFE blocks.
- CSS variables and utility classes are defined in `/css/styles.css`.
- Use `const`/`let`, arrow functions, template literals, and modern DOM APIs.
- Accessibility: always set `aria-*` attributes on interactive elements.
- Animations use the `IntersectionObserver` API and CSS transitions — avoid JS-based animation libraries.

## Key UI Patterns

- **Modals**: Use the `Modal.open(id)` / `Modal.close(id)` / `Modal.closeAll()` API defined in `app.js`.
- **Toast notifications**: Use `Toast.show(message, type, duration)` — types: `'success'`, `'error'`, `'info'`, `'warning'`.
- **Smooth scroll**: All `href="#anchor"` links use the built-in smooth scroll handler.
- **Counters**: Add `data-counter`, `data-target`, `data-suffix`, `data-prefix`, and `data-decimals` attributes to trigger animated counters.
- **Fade-in animations**: Add class `fade-in` to elements to trigger scroll-based entrance animations.

## CI/CD

- Pushes to `main` trigger the Azure Web Apps deployment workflow.
- The workflow runs `npm install`, `npm run build --if-present`, and `npm run test --if-present`.
- There is currently no `package.json`, so the build and test steps have no effect; add one if introducing npm-based tooling.

## Dos and Don'ts

- ✅ Keep all logic in the existing files unless a new page is genuinely needed.
- ✅ Follow existing IIFE patterns when adding JavaScript features.
- ✅ Test changes in a modern browser (Chrome/Edge) before committing.
- ❌ Do not introduce third-party JS/CSS frameworks or CDN dependencies without discussion.
- ❌ Do not add `console.log` statements in production code.
- ❌ Do not hardcode secrets or API keys in any file.
