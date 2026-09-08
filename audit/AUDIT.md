# Website and 3D audit — 8 September 2026

Audited the current local checkout at http://localhost:5173 in Chromium at 1440×900 and 390×900. Checked all five routes, scrolled every homepage section, inspected source and assets, ran the production build, tested light/dark Experience rendering and completed the booking wizard with test data. Application source was not changed. Build regenerated dist; audit scripts, results and screenshots are in this directory.

## Critical findings

1. **Homepage never mounts a 3D model.** `src/pages/HomePage.jsx` mounts `SelBanner`, but `src/components/sections/SelBanner.jsx:2` only returns an eyebrow and heading. It has no Canvas, scene import, model selector, paint controls or reservation control. Browser evidence: zero canvases and zero GLB/Draco requests. Existing model files are not the cause of this absence.
2. **About and Services crash to a blank page.** Both reference `cars` without importing it (`AboutPage.jsx:16`, `ServicesPage.jsx:17`). Both desktop and mobile throw `cars is not defined`. Services additionally uses `Link` without importing it; that is a second source-level blocker masked by the first crash.
3. **Fleet crashes before its configurator renders.** `src/pages/PageHero.jsx` contains JSX but has no React import. The current Vite JSX transform requires it: browser error is `React is not defined`. About and Services also use this component, so fixing their data imports alone is insufficient. There is no application error boundary to preserve navigation when rendering fails.

## Sections and visual integrity

4. **The homepage has twelve section containers, but much of the detailed content is absent from current markup.** `HomeSections.jsx` reduces Experience, Chauffeur, Journey, Destinations and Reviews to small blocks of text/buttons. Experience has no `.exp-bg` photo or `.exp-inner`; Chauffeur has no `.ch-grid`/`.ch-copy`; Journey has no `.journey-track`; Destinations has no destination cards. Existing CSS still targets these richer structures. This establishes a current markup/CSS mismatch; no historical source comparison was performed to date when it happened.
5. **Experience is nearly unreadable in the default light theme.** Its heading is RGB 244/243/237 on a transparent section over RGB 231/227/219. The CSS assumes dark photography, but that background element is absent. Dark theme has a dark underlying background and is more readable. See `experience-light.png` and `experience-dark.png`.
6. **Large empty vertical areas remain.** Experience, Fleet and Journey each measured 900px tall in the 900px viewport despite their abbreviated content. Fixed viewport heights compound the appearance of missing sections. All twelve homepage sections had nonzero height and opacity 1 when scrolled into view; a universal opacity/reveal failure was not observed. Desktop `content-visibility:auto` exists, but was not established as the root cause.
7. **Footer is duplicated.** `AppRoot.jsx` renders a global footer and individual pages render another. Homepage and Booking each showed two; other pages contain the same duplication but crash first.
8. **Text encoding is corrupted.** Page labels, prices, footer branding, symbols and document title contain literal mojibake, confirmed in browser text, not merely terminal output. Booking document width measured 2306px at 1440px and 1814px at 390px. Long corrupted labels contribute to overflow, while `overflow-x:hidden` conceals it rather than resolving the layout.
9. **Mobile preview grids lack responsive column changes.** `.fleet-preview-grid` keeps three columns and `.journey-mini` four. Mobile cards become cramped; some long names force wider columns. Homepage document width was 395px at a 390px viewport.
10. **Requested typefaces are not loaded.** CSS references Manrope and DM Sans, but no font declarations/imports/links were found and `document.fonts` contained no font faces. Fallback fonts change the intended typography and geometry. `.sel-heading span {display:block}` also applies to the nested period, placing it on its own line.

## 3D asset and scene checks

An isolated browser harness replaced only the browser response for the entry module to render the existing `ConfiguratorScene`. It did not edit application source or repair the real routes. Each model was rendered at 1200×800 with the same scene and red paint after a 3.5-second wait.

| Model | File size | Isolated result |
|---|---:|---|
| Porsche 911 GT3 | 3,498,668 bytes | Canvas rendered; loader gone; no page error |
| Lamborghini Huracán EVO | 1,685,420 bytes | Canvas rendered; loader gone; no page error |
| Bentley Continental GT | 968,560 bytes | Canvas rendered; loader gone; no page error |
| Range Rover | 1,118,240 bytes | Canvas rendered; loader gone; no page error |

See `model-0.png` through `model-3.png` and `model-results.json`. Local Draco decoder files are present and these tests successfully decode the configured models.

11. **Camera framing needs correction.** A fixed 6.54-unit normalization and fixed camera do not fit every model safely. Range Rover's lower/front portion is visibly clipped even in the wide isolated harness; Porsche sits very close to the lower edge. Mobile framing has not been established as safe. Normalize to a ground plane and fit the camera to model bounds and viewport aspect.
12. **Advertised drag interaction is not implemented in the configurator.** `dragRotation` is initialized but no pointer handler updates it; OrbitControls has `enableRotate={false}`. The visible copy promises click-and-drag. Scroll-based rotation is implemented separately.
13. **Shadow and rendering resilience need attention.** ContactShadows is outside the model Suspense boundary with `frames={1}`; its single frame may occur before model load and cannot follow subsequent rotation/model changes. Shadow placement is not derived from the normalized model bottom. No explicit scene error/context-loss fallback is provided. These are source-level risks, not claims that a WebGL failure was reproduced.
14. **Performance work remains.** All routes are statically imported, including Fleet and the Three stack. Production output contains one 1,372.60 kB JS chunk (397.64 kB gzip) even though the homepage mounts no 3D canvas. The scene has no visibility-based render pause. `public/models/models.zip` adds 36,847,174 bytes to deployment output, although it was not requested at runtime. No device FPS, slow-network benchmark or GPU memory profile was measured.

## Interaction and accessibility

15. **Six homepage service links are broken anchors.** They target `#booking`, but the Booking block has only a class and no matching ID. The configurator also links to `#booking` although Fleet has no booking section.
16. **Experience buttons are inert.** They contain no click handlers or navigation and the Chauffeur active state is hard-coded.
17. **Booking claims success without submission.** Submitting the completed wizard only calls `setDone(true)`. Browser showed the success screen and made zero fetch/XHR requests. There is no backend persistence or concierge notification in this flow. Vehicle reserve links also do not pass selected vehicle context into the wizard.
18. **Accessibility gaps.** Car images lack alt text, mobile menu button lacks an accessible label/expanded state, and smooth scrolling has no reduced-motion branch. Existing input CSS removes outlines without an evident replacement. These are targeted findings; a full automated WCAG assessment was not run.
19. **Unknown routes have no route fallback.** No catch-all route exists. Production deep-link handling depends on hosting configuration and was not tested against a deployed host.

## Validation and recommended repair order

`npm.cmd run build` passed, with the large-chunk warning. A successful build did not catch the undefined runtime identifiers. No failed HTTP responses or broken homepage images were recorded in the route audit; three routes failed because of JavaScript rendering errors.

Repair missing imports and shared PageHero first; reconnect the scene to the intended homepage banner; reconcile section markup with CSS; correct encoding, light-theme contrast, mobile layout and duplicated footers; then fix model framing, controls and load/error behavior. Wire reservation delivery before presenting the booking success message as a real submission. Finally split route/3D bundles and re-test all routes, themes, model changes and representative mobile hardware.

Evidence: `browser-results.json`, `interactions.json`, `model-results.json`, route screenshots and isolated model screenshots. The all-page screenshots can include rendering artifacts from full-page capture with fixed elements/content visibility; route errors, DOM measurements and focused model/Experience screenshots are the primary evidence. This audit covers the local implementation, not production hosting or physical-device performance.
