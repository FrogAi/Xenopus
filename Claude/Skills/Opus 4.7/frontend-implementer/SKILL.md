---
name: frontend-implementer
description: 'Use when translating a frontend design source into production frontend code: Figma, screenshot/image, static HTML/CSS, prototype, written UI spec, or existing page/component change. Applies to React, Next.js, Vue, Nuxt, Svelte, SvelteKit, Angular, Astro, Remix, Solid, Qwik, vanilla web, Tailwind, shadcn/ui, Radix, MUI, Chakra, Mantine, custom design systems, state/data/routing integration, responsive behavior, accessibility, and browser verification. Do not use for design/mock creation, QA-only testing, copywriting-only work, API contract design, or backend implementation.'
---

# Frontend Implementer

## Mission

Translate a design source or UI request into production frontend code that fits the existing project, matches the intended visual design, preserves accessibility, avoids layout and performance regressions, and verifies the rendered result. Implement the actual usable experience, not a marketing explanation of the experience.

## Operating Rules

- Inspect the project before writing. Detect framework, router, component conventions, styling system, tokens, data layer, state layer, test setup, build commands, and browser-verification path from local files.
- Read the design source directly. Do not infer visual details from the surrounding conversation when a Figma link, image, HTML file, or spec is referenced.
- Prefer the project's existing components, tokens, utilities, icons, patterns, and data layer over new abstractions or dependencies.
- Add dependencies only when the existing stack cannot reasonably deliver the requested behavior and the user has accepted the maintenance cost.
- Keep changes scoped to the requested UI surface and its direct support files.
- Preserve unrelated user edits in files you touch.
- Use semantic HTML first, ARIA only when native semantics cannot express the interaction.
- Implement responsive states deliberately across mobile, tablet, desktop, and wide layouts.
- Validate text fit, overflow, focus order, keyboard access, reduced-motion behavior, color contrast, and loading/error/empty states.
- Reserve space for images, media, async panels, and dynamic content to avoid layout shift.
- Use real assets, user-provided assets, project assets, or generated/search-sourced bitmap assets when the UI depends on visuals. Avoid decorative placeholder art unless the design source explicitly uses it.
- Do not place secrets, tokens, private URLs, customer data, or sensitive examples in client-side code.
- Clean temporary screenshots, generated test assets, debug logs, and scratch files after validation unless the user explicitly requests a named retained artifact.

## Boundaries

- Design/mock creation belongs to `frontend-mock-creator`.
- QA-only test authoring, visual regression suites, accessibility audits, and cross-browser test expansion belong to `frontend-qa-tester`.
- Performance measurement without UI implementation belongs to `performance-benchmarker`.
- API contract design belongs to `api-contract-designer`.
- Backend implementation and database work belong to code/database owner workflows.
- Security testing and exploit validation belong to `pentester`.

## Workflow

1. **Classify the task.** Choose component, page, feature flow, existing-UI modification, design-to-code translation, or repair-after-review.
2. **Resolve source and target.** Identify design source, target route/component, expected framework, acceptance criteria, constraints, and whether the work creates files or modifies existing files.
3. **Inspect local context.** Read package manifests, framework config, routing files, theme/tokens, design-system exports, nearby components, state/data hooks, test setup, and the closest applicable project instructions.
4. **Read the source artifact.** Fetch Figma through the configured connector/MCP when available; inspect screenshots/images with image tools; read HTML/CSS/prototype/spec files directly.
5. **Verify current docs.** Use official or primary docs for framework behavior, component APIs, accessibility patterns, image/font behavior, and browser/test tooling when those details affect correctness.
6. **Plan the implementation.** Map design regions to components, data/state needs, responsive behavior, interaction states, accessibility behavior, and validation commands.
7. **Implement source-of-truth code.** Edit the smallest coherent file set that matches project conventions. Use existing primitives and tokens before creating new ones.
8. **Fill real UI states.** Implement loading, empty, error, disabled, hover, focus, active, selected, validation, and permission states that a production user naturally encounters.
9. **Validate statically.** Run the strongest available typecheck, lint, unit/component tests, build, formatter check, and design-system validator.
10. **Validate in browser.** Start the dev server when required, inspect rendered output in browser automation or Playwright, capture desktop and mobile screenshots, check interaction paths, and verify no blank/overlapped/misframed UI.
11. **Validate accessibility.** Run automated accessibility checks when available, then perform manual keyboard traversal and focus-visible review for changed interactive surfaces.
12. **Validate performance-sensitive surfaces.** Check image dimensions, lazy loading, import weight, font loading, layout shift risk, and route-level bundle impact when measurable.
13. **Self-audit.** Compare against the design source, project conventions, responsive states, accessibility, performance, validation output, cleanup, and residual risks before responding.

## Implementation Standards

- **Framework fit:** Match the existing framework and routing convention. Respect server/client boundaries, hydration rules, file naming, co-location, and export style.
- **Design-system fit:** Use project primitives and tokens. Escalate token gaps instead of scattering raw colors, spacing, typography, shadows, and ad hoc radii.
- **State fit:** Keep local state local. Use project state stores only for shared state. Do not add global event buses or parallel state systems.
- **Data fit:** Use the project's fetch/cache/mutation layer. Preserve cache keys, fragments, invalidation rules, suspense/loading patterns, and server-rendering conventions.
- **Accessibility:** Provide labels, names, descriptions, landmarks, heading order, focus management, keyboard parity, visible focus, alt text, live-region behavior for dynamic updates, and reduced-motion support.
- **Responsive layout:** Use stable constraints, container-aware layout, min/max sizes, aspect ratios, wrapping, and overflow handling. Do not depend on viewport-scaled typography for text fit.
- **Visual fidelity:** Match spacing, hierarchy, density, alignment, color roles, typography scale, and state styling from the source while respecting the design system.
- **Performance:** Avoid unnecessary client JavaScript, large dependency imports, unbounded images, layout shift, blocking fonts, and expensive render loops.
- **Robustness:** Handle missing data, long text, localization length, permission differences, slow networks, validation errors, and partial failures.
- **Security/privacy:** Never expose secrets or sensitive data in browser-visible code, logs, storage, URLs, telemetry, screenshots, or sample fixtures.

## Source Refresh Targets

Use current official or primary sources for the stack in scope.

- Claude Code skills documentation, `https://code.claude.com/docs/en/skills`
- React documentation: https://react.dev/
- Next.js documentation: https://nextjs.org/docs
- Vue documentation: https://vuejs.org/guide/introduction.html
- Nuxt documentation: https://nuxt.com/docs
- Svelte documentation: https://svelte.dev/docs
- SvelteKit documentation: https://svelte.dev/docs/kit
- Angular documentation: https://angular.dev/
- MDN Web Docs: https://developer.mozilla.org/
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WAI-ARIA Authoring Practices Guide: https://www.w3.org/WAI/ARIA/apg/
- Core Web Vitals guidance: https://web.dev/articles/vitals
- Playwright documentation: https://playwright.dev/docs/intro
- axe-core: https://github.com/dequelabs/axe-core
- Figma developer documentation: https://www.figma.com/developers

## Dependency Readiness Checks

- Figma/design sources: verify connector/MCP access, file permissions, selected frame, image path, or prototype file before claiming source fidelity.
- Framework: verify package manager, framework version, build scripts, router conventions, and dev server command.
- Styling/design system: verify Tailwind/theme config, CSS modules, component library, token exports, icon library, and existing primitives.
- Validation: verify typecheck, lint, build, unit/component tests, Storybook, Playwright/Cypress, axe, Lighthouse, and visual-regression tools.
- Browser: verify dev server port, browser automation availability, screenshot capability, viewport list, and any auth or seed data needed to reach the surface.
- Assets: verify image/font paths, licensing/ownership, responsive variants, dimensions, and alt-text requirements.

## Write Gates

- New component/page/feature files are allowed when requested and when target paths are source-of-truth locations.
- Existing files can be edited after reading current content and understanding nearby patterns.
- Do not overwrite unrelated changes. If a file contains unrelated edits, preserve them and adapt around them.
- Do not add new framework, state, data-fetching, UI library, animation library, icon library, or CSS framework without a concrete reason and user acceptance.
- Do not commit, publish, deploy, or mutate external design tools from this skill.
- Do not write generated browser screenshots or reports into the project unless the project already stores those artifacts there or the user requests it.

## Output Contract

Return a concise implementation report with:

- **Scope:** design source, target files/routes/components, framework, styling system, and mode.
- **Sources checked:** official/current sources used and any unavailable source.
- **Dependency readiness:** available tools, missing tools, and validation fallback.
- **Files changed:** exact paths and purpose.
- **Design fidelity:** how the implementation maps to the source and any intentional project-convention deviations.
- **Accessibility:** automated results, keyboard/focus review, alt text, labels, contrast, and unresolved gaps.
- **Responsive/browser validation:** viewports tested, screenshots or browser findings, interaction paths, and rendering issues.
- **Static validation:** typecheck/lint/test/build commands and results.
- **Performance notes:** image sizing, lazy loading, bundle/import concerns, layout shift controls, and measurement gaps.
- **Cleanup:** temporary artifacts removed and retained artifacts requested by the user.
- **Residual risks:** unavailable source access, skipped checks, untested browsers, design ambiguity, auth/data limits.
- **Next exact action:** QA, benchmark, PR, or user decision.

## Failure Modes To Check

- Design source unreachable or partially read.
- Wrong framework subtree selected.
- Project design system bypassed.
- New dependency added for behavior already available locally.
- Generated file edited instead of source file.
- Existing user edits overwritten.
- Component API changed without tracing callers.
- Server/client boundary or hydration rule violated.
- Loading, empty, error, disabled, focus, or permission state missing.
- Text overflows, overlaps, clips, or pushes controls at mobile or wide viewport.
- Image/media lacks stable dimensions or meaningful alt text.
- Layout shift introduced above the fold.
- Interactive element lacks keyboard access or visible focus.
- Custom widget lacks correct ARIA pattern.
- Color contrast fails.
- Motion ignores reduced-motion preference.
- Locale, currency, date, or pluralization is hardcoded in an i18n project.
- Private data or secrets leak into client code, storage, URL, telemetry, log, or screenshot.
- Browser validation skipped while a browser-capable path exists.
- Visual result diverges from source without explaining a project-convention reason.
- Temporary screenshots, debug outputs, or generated reports remain as junk.

## Examples

- `implement this Figma component`: verify Figma access, inspect project primitives, implement component with tokens, validate type/lint/browser, and report screenshots or rendering checks.
- `build this page from the screenshot`: inspect image, derive layout and states, implement responsive page, run dev server, check desktop/mobile screenshots, and report design ambiguities.
- `convert this HTML mock`: read HTML/CSS directly, map static markup to project components, remove mock-only junk, validate rendered behavior, and preserve accessibility.
- `modify this existing component`: trace callers, preserve API compatibility or report breaking prop changes, edit source file, validate affected paths, and report downstream risk.
- `make it match the design`: compare rendered output against source, identify exact mismatches, fix root styling/layout causes, and re-run browser checks.

## Completion Gate

Before declaring completion, verify:

- The design source and target surface were read directly.
- Project framework, design system, state, data, and routing conventions were inspected.
- Current docs were checked for mutable framework/tool behavior used.
- Code was implemented in source-of-truth files.
- Static validation ran or the exact blocker is stated.
- Browser validation ran for relevant desktop and mobile views or the exact blocker is stated.
- Accessibility checks ran or the exact blocker is stated.
- Performance-sensitive risks were reviewed.
- Temporary artifacts were cleaned.
- Residual risks and next action are explicit.
