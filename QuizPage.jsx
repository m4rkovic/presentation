@import "tailwindcss";

@theme {
  --color-asca-orange: #f79554;
  --color-asca-bg: #090b0f;
  --color-asca-panel: #10141a;
  --color-asca-text: #f2f4f6;
  --color-asca-muted: #8b929b;
}

:root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #f2f4f6;
  background: #090b0f;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  scroll-behavior: smooth;
  background: #090b0f;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background: #090b0f;
}

button,
a,
input,
textarea,
select {
  font: inherit;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

img {
  display: block;
}

.eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #f79554;
}

.section-title {
  margin-top: 0.75rem;
  max-width: 780px;
  font-size: clamp(2.4rem, 5vw, 4.8rem);
  line-height: 0.98;
  font-weight: 600;
  letter-spacing: -0.055em;
  color: #fff;
}

.field {
  width: 100%;
  border-radius: 0.85rem;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.035);
  padding: 1rem 1.05rem;
  color: white;
  outline: none;
  transition: border-color .2s ease, background .2s ease, box-shadow .2s ease;
}

.field::placeholder {
  color: rgba(255,255,255,.34);
}

.field:focus {
  border-color: rgba(247,149,84,.72);
  background: rgba(255,255,255,.055);
  box-shadow: 0 0 0 3px rgba(247,149,84,.08);
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
