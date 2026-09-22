# Interface QA

## Contents

- Scope the check
- Where to test
- Layout and appearance
- Readability and clarity
- Text and content
- Interaction and states
- Motion and time
- Depictions of real things
- Accessibility
- Performance and loading
- Failure and robustness
- Security and privacy at the surface
- Discoverability and sharing
- Interfaces used while driving
- Release and regression

Read before checking or reviewing anything a user sees or uses: web pages, device and app interfaces, and the illustrations, animations and generated visuals inside them. Fidelity to an approved reference is one requirement (the implement-frontend-designs skill owns it); this covers everything a careful person would notice by using, watching and depending on the interface, whether or not a reference exists. It finds defects in what is there; it doesn't license redesigning approved choices or adding features nobody asked for. When an approved reference itself shows such a defect (an outdated device, a physically impossible detail, clutter, an inaccessible pattern), report it as a question about the reference, not as drift in the implementation.

## Scope the check

Apply each check to what the change or the review's scope can affect, and every section for a versioned release, a launch or a full audit (not a routine deploy of a scoped change): a change with no motion, themes or variants needs no motion capture or variant sweep. Test the processes the change can affect end to end, including their common branches and error paths, not just separate pages. Say which sections you covered, what you skipped and why, and what you couldn't test in this environment (a real phone, a screen reader, a browser that isn't installed); an untested area is not a passed one. Skipping is a judgement about reach, not about effort: a shared style, layout or script reaches every page that uses it. Run an automated checker where one is available locally (axe for web accessibility, the browser's console and network panels), then check by hand what tools can't judge.

## Where to test

- **Engines and devices:** each supported browser engine you can run (Chromium, Firefox and WebKit for the web), chosen from the project's own analytics where it has them and naming any you couldn't, such as real Safari on iOS or Samsung Internet, on desktop and on real or emulated phones and tablets; for a device or app interface, its actual resolution, scaling and input method.
- **Sizes:** the smallest supported width (320 px on the web), widths between breakpoints, landscape phones, tablets in both orientations, large and ultrawide desktops, short viewports and screens with notches or rounded corners (safe areas).
- **Settings:** browser zoom at 200% and 400%, text-only enlargement to 200%, larger system text, light and dark mode, forced colours or high contrast, reduced motion and reduced transparency, device pixel ratios of 1, 2 and 3.
- **Input and assistive technology:** mouse, touch, keyboard only, devices without hover, a screen reader, a screen magnifier and speech recognition.
- **Conditions:** a throttled mid-range phone, a slow or flaky network, offline, and a tab left open for a long time or hidden and revisited.
- **Data and time:** realistic content, plus empty, single-item and maximum cases; very long words, names and URLs; emoji and other scripts; whitespace-only input, leading and trailing spaces and line breaks; characters with markup meaning, shown literally; zero, negative, decimal and locale-formatted numbers; duplicates; two users or devices changing the same item; every supported language and text direction. Dates and clocks across time zones, daylight-saving changes, midnight, month, season and year boundaries, leap days, and a visitor whose clock is wrong.

## Layout and appearance

- Nothing overflows, clips, overlaps or scrolls sideways unintentionally; sticky or fixed elements don't cover content, focused controls or anchor targets; stacking order is right in every state. Find these by measurement where the DOM or toolkit exposes geometry: sweep widths from the smallest to the largest supported, flag content wider than its box (scrollWidth > clientWidth) and elements whose rectangles intersect or leave their container or the viewport, then inspect native-scale screenshots at the flagged widths. Judging screenshots alone misses small truncation and overlap.
- Text wraps cleanly, without orphaned words in headings or awkward breaks. Text, boxes and widgets sit where a reader expects them, aligned to a consistent grid, with related items grouped and spacing that shows the grouping; alignment and spacing are consistent across similar elements and pages.
- Content works in portrait and landscape and never locks to one orientation unless that is essential.
- Images keep their aspect ratio, crop to their subject at every width, load at a sharpness that suits the screen, and never show broken, missing or placeholder states; icons, logos and favicons are crisp and current at every size and stay visible on both light and dark browser tabs.
- Colour and contrast meet WCAG AA for text and for non-text elements such as icons, borders and focus rings, over every background they can appear on, including photos, gradients, animated or seasonal backgrounds and dark mode; for text over images or gradients, measure contrast from the rendered pixels behind the text, since automated checkers skip it. Meaning never relies on colour alone; check deuteranopia, protanopia and tritanopia simulations.
- Branding, components and tone stay consistent across pages and states.

## Readability and clarity

- Each view has a clear hierarchy: the eye lands first on what matters most, and nothing competes for attention without reason.
- Nothing is cluttered: no view crams in so many elements, effects, widgets or words that they compete, decoration never hides content, and controls aren't crowded together. Nothing wastes space either: no large empty areas or oversized gaps and padding that push content out of view, and no unbalanced columns or half-empty rows at some widths.
- Text is easy to read on every device: a comfortable size, line length and line spacing, a weight and contrast that hold up over its background, and never set over a busy part of an image without something to separate it.
- Details stay legible where they are shown: labels, numbers and small parts inside images, icons, widgets, charts and infographics remain readable and recognisable at phone size, not only on a desktop; scale or simplify them rather than shrinking them below legibility.
- Loading screens, spinners, skeletons and placeholders look intentional, match the size and layout of what replaces them so nothing jumps when content arrives, and appear only when loading takes long enough to need them.
- Empty states (first use, no results, cleared lists, nothing saved yet) say why they're empty and offer the next step, never a blank area or an endless spinner. A first-time visitor can tell what the product is for and how to start.

## Text and content

Follow [ui-content.md](ui-content.md). Also check:

- where the product is localized, a pseudolocale (expanded, accented and delimited text, plus a mirrored right-to-left one) on the changed screens, to find hard-coded, concatenated and clipped strings before real translations exist; it doesn't replace checking real translations;
- spelling, grammar and punctuation, consistent names and capitalisation, and factual accuracy against current sources;
- that a newcomer understands each term or has it explained, headings and labels describe what follows, and link text says where it goes;
- that instructions don't rely on shape, position, colour or sound alone ("the round button on the right");
- that dates, numbers, units, plurals and currency follow the reader's locale, and passages in another language are marked with their language;
- that text is real text rather than a picture of text, except in logos, and no placeholder, debug or test content remains;
- in every supported language, that short labels survive translations two to three times longer, taller scripts aren't clipped, right-to-left pages mirror the layout and direction-bearing icons while numbers and embedded left-to-right text stay correct, and every script and emoji renders with a suitable font rather than empty boxes.

## Interaction and states

- Every control works by mouse, touch and keyboard, with visible hover, focus, active, disabled, loading, success and error states. Touch and click targets are at least 24 by 24 CSS px on the web, or spaced so a 24 px circle centred on each doesn't touch its neighbours, except links within a sentence, and the platform size (44 pt on iOS, 48 dp on Android) in app and device interfaces. Rapid repeated clicks or taps don't double-submit or break state.
- Every action shows a response at once; anything slower than about a second shows it's working, and anything near ten seconds shows progress and can be cancelled. The interface always shows where the user is and what is selected.
- Controls, icons, gestures and wording behave the way the platform and similar sites have taught people to expect, and nothing hijacks system edge swipes. Anything done by dragging, swiping, pinching, multi-finger or path gestures, or by shaking or tilting the device, also works with a single tap or click, and motion control can be turned off. Actions fire on release, not press, so sliding off a control cancels them.
- Nothing needed to use the interface appears only on hover: menus, tooltips and controls revealed by hover also open by tap and by keyboard, and a tap doesn't leave a hover style stuck on. Content that appears on hover or focus can be dismissed with Escape without moving the pointer or focus, can itself be hovered without vanishing, and stays until dismissed or the trigger loses hover or focus.
- Keyboard order follows the visual order, focus is always visible, nothing traps focus, Escape closes overlays, and focus returns to a sensible place after a menu or dialog closes. Focusing a control never by itself navigates, submits or moves focus, and changing one does so only when the user was told beforehand. Single-key shortcuts can be turned off or remapped, or work only while their control has focus. Custom widgets follow the keyboard model of the matching ARIA Authoring Practices pattern; widgets that group options, such as tabs, menus, listboxes and toolbars, take one Tab stop with arrow keys inside and a selected state that looks different from focus. Opening a menu or dialog locks background scroll where it should, and the layout survives resizing while it's open.
- Forms have visible labels that say which fields are required and what format is expected; fields about the user carry the right autocomplete values, so browser autofill and password managers work (including one-time codes); inputs use appropriate types and mobile keyboards and accept paste; validation happens at a helpful moment with messages next to the field that say how to fix the problem; the user's input survives an error; and the form submits exactly once. Multi-step flows never ask for the same information twice. Sign-in accepts paste and password managers and never requires a puzzle or transcription without an alternative.
- Destructive or costly actions are hard to trigger by accident: they sit away from common controls, offer undo where possible, and otherwise ask for a confirmation whose buttons name the action ("Delete file", not "Yes"); legal, financial or data-changing submissions can be reversed, or reviewed and corrected before they're final. Confirmations are rare enough that people still read them, and error messages say in plain words what went wrong and how to recover.
- Results are right, not just well rendered: calculations, totals, counts, unit conversions, sorting, filtering and search results match the source data and the user's input, including at limits and boundaries.
- Uploads limit file types and sizes and explain rejections before sending, show progress and can be cancelled, and work by file picker, drag or phone camera wherever offered; downloads arrive with sensible names and the right type.
- On web pages, text that reads as content can be selected and copied. Overlays, decorative layers and canvases don't take clicks, selection, scrolling or focus from what sits beneath or above them.
- **On phones:** the on-screen keyboard never covers the focused field or its submit button; rotating mid-task keeps input, scroll position and open dialogs; full-height sections fit with the browser toolbars shown and hidden; pinch zoom works; scrolling inside a dialog or panel doesn't scroll the page behind it or set off pull-to-refresh or back-swipe navigation.
- **Navigation:** every link and button goes where it says, with no broken internal or external links. Navigation repeated across pages keeps the same order, the same function has the same name and icon everywhere, help sits in the same place on every page that offers it, and each page can be reached in more than one way except steps inside a process. Anchors land below sticky headers. Back, forward, reload and deep links restore the right state, scroll position and URL. Missing pages and error pages help the visitor on.
- **Sessions and persistence:** what should survive a reload, a new tab or a return visit does. Before a session or time limit expires the user is warned and can extend it, typed work is never lost, and after signing in again they return to where they were; other time limits can be turned off, adjusted or extended unless they're essential. Signing in or out, or changing data, in one tab shows correctly in other tabs and in pages reopened with Back, and Back after signing out never shows private pages. The interface still works when storage, cookies or a third-party script is unavailable or blocked.

## Motion and time

- Judge motion from consecutive frames, not from sampled screenshots or geometry checks. Capture each animation, transition, loading sequence and scroll-driven effect the change can affect frame by frame across a complete loop or sequence in each engine you test, diff adjacent frames to find jumps and inspect those frames and their neighbours; also record it at real speed without a controlled clock, which is what shows stalls and dropped frames.
- Look for objects that pop in or out, jump, change size or shadow in one frame, flicker, jitter, swap stacking order, open gaps or seams between their parts, or vanish before they leave the frame, and for stalls, dropped frames and drift over long runs.
- On web pages, reload repeatedly, go back and forward, and resize: the scroll position must not creep, no empty or unstyled strip may flash, text and layout must not jump as fonts and images load, and entrance effects must not expose the background.
- Check how effects start, stop and hand over when scrolling away and back, pausing, hiding the tab or app, switching to reduced motion or changing theme: loops and particles finish or stop cleanly instead of cutting out midair, and nothing keeps running offscreen or in a hidden tab.
- Motion that starts on its own and lasts more than five seconds, and any auto-updating content such as tickers or feeds, has a visible pause, stop or hide control; honouring reduced motion is good but doesn't replace that control. Nothing flashes more than three times a second, and nothing plays sound on its own for more than three seconds without a way to pause it or turn it down. Clocks, countdowns and date-driven content stay correct across the time boundaries listed above.

## Depictions of real things

- Compare each part tightly cropped in both the depiction and the reference, with no surrounding scene, and state counts and positions for both before comparing; a match judged on the whole scene is unconfirmed.
- When an illustration, animation or mock screen depicts something specific and real (a particular product, vehicle, device, its interface, a place), compare it part by part with reference photos of the current version, unless the brief names another: shape and proportions, where parts sit and how they attach, and what the real thing shows and does. A stylised drawing may simplify, but it stays recognisable and never shows parts floating or overlapping, or behaviour that differs from the real thing's (a camera's screen that doesn't show what the camera sees, a map that doesn't move).
- Every view of the same world agrees: a screen, mirror or map showing the scene shows the same moving scene, objects stay continuous between views and over time, and overlays that exist only on a device's screen don't appear in the direct view.
- The depicted world obeys physics and nature: things rest on what supports them, scale and perspective are consistent, and natural things are arranged naturally rather than in rows or repeats.
- Each themed or seasonal variant shows only what its theme owns; check every variant for elements leaking in from another.
- Anything meant to be noticed (a path, label, indicator or subject) is visible at the size it is shown.

## Accessibility

Meet WCAG 2.2 AA. Beyond the items above:
- a logical heading order and landmarks; tables, lists and grouped fields in real markup (header cells, list elements, fieldsets with legends); a sensible reading order with styles and images turned off;
- text alternatives for meaningful images and empty ones for decorative images;
- accessible names, roles and states on every control, each name containing its visible label, with ARIA used only where native elements can't do the job;
- status changes announced through live regions; a skip link; the page language set;
- content that reflows at 400% zoom and survives increased text spacing;
- video with meaningful sound has accurate captions, and audio description where the soundtrack doesn't already convey what's shown; audio-only and video-only clips have a transcript or description; live video has live captions; media controls work by keyboard.

Walk each key process with the screen reader and browser pairs its users rely on (JAWS or NVDA with Chrome or Edge, NVDA with Firefox, VoiceOver with Safari on iOS and macOS, TalkBack with Chrome on Android, and Narrator with Edge where its users matter), and say which you couldn't test. On Windows, Guidepup can drive NVDA and read back what it speaks; installing NVDA needs the user's go-ahead once. For a major feature or release, note whether people with disabilities have tried it; tool and expert checks don't replace them.

## Performance and loading

- In the lab, on a throttled mid-range phone profile, measure Largest Contentful Paint, Cumulative Layout Shift and Total Blocking Time (the lab stand-in for Interaction to Next Paint), along with long tasks, animation frame times, memory growth over several minutes, and CPU use while idle or hidden. Where field data exists, confirm LCP, INP and CLS at the 75th percentile against the current thresholds at web.dev.
- Images have declared dimensions, suitable formats and sizes for each screen, and lazy loading only below the fold; the largest image above the fold loads first and is never lazy-loaded. Fonts load without invisible text or layout jumps, and nothing large loads that the page doesn't use.
- Changed assets reach returning visitors: cache headers and file names make updates visible, and a service worker delivers updates promptly without mixing versions across tabs.

## Failure and robustness

- No console errors or warnings, failed requests or unhandled promise rejections in any tested state.
- Every request the page depends on has a sensible loading, slow, empty, error and timeout state, including malformed responses, rate limits and outages of each backend or third-party service; the page degrades gracefully instead of breaking, and rate limits, captchas and anti-bot checks say when to try again and keep what the user entered.
- Offline or on a flaky connection the user sees a clear offline message or fallback rather than the browser's error, actions taken offline are queued and confirmed or clearly refused, and the page recovers when the connection returns. An installable app installs and opens in its display mode with a way back on every screen.
- Unsupported or older browsers, blocked scripts and content blockers produce a usable page or a clear message.
- Where people print or save pages (articles, receipts, documentation), the printed or PDF result is clean: navigation, banners and animation hidden, nothing cut off at page edges, colours readable on white.

## Security and privacy at the surface

- Every page and asset is served over HTTPS, with HTTP redirecting and HSTS set; no mixed content or content-security-policy violations; other sites can't frame the page (CSP frame-ancestors, plus X-Frame-Options for older browsers); nosniff and a Referrer-Policy are sent; session cookies are Secure, HttpOnly and SameSite; versioned third-party files from CDNs use Subresource Integrity; windows opened by script don't get an opener.
- User-supplied and external content is escaped; no secrets, tokens or personal data appear in the page, its URLs, its console or its requests.
- Consent banners don't cover content or controls at any size; nothing non-essential loads before consent; the choice is remembered and can be changed later from an obvious place. Analytics and conversion events fire exactly once per tracked action, with the right names and values, and not at all when consent is refused.

## Discoverability and sharing

Each page has an accurate title, description and canonical URL; share cards (Open Graph and similar) show the right image, title, text and image alt and render correctly in a preview; favicons, app icons and the web manifest are present and current; structured data validates; moved pages redirect permanently (301 or 308); missing pages return 404 and error pages an error status, never a "not found" or error page with a 200 status; navigation uses real links with href; multilingual pages declare hreflang; robots and sitemap rules expose what should be found and hide previews and drafts.

## Interfaces used while driving

Warnings are noticeable and timely; each task can be done in short glances (NHTSA's guideline is 2 seconds or less on average and 12 seconds in total); and video, automatically scrolling text and typing are locked out while the vehicle moves.

## Release and regression

- Verify what is actually deployed, not the local copy: the right revision, assets and configuration are live, caches serve the new files, and production behaves like the tested build.
- When shared styles, components, scripts or assets change, check a page of every other kind that uses them before and after, and confirm each is unchanged or report the difference, using the matched-conditions pixel diff in the implement-frontend-designs skill's visual-fidelity reference.
