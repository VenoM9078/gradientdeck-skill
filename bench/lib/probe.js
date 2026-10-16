// Runs inside the rendered page. Returns measurements for the checker.
// Kept deliberately mechanical: it counts patterns, it doesn't judge taste.
(() => {
  const vw = innerWidth;
  const vh = innerHeight;
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && Number(cs.opacity) > 0.05;
  };
  const parseColor = (c) => {
    const m = c && c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return { r, g, b, a };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const hsl = ({ r, g, b }) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
    let h = 0;
    if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
    const s = d ? d / (1 - Math.abs(2 * l - 1)) : 0;
    return { h, s, l };
  };
  // Effective solid background behind an element; null when an image/gradient is involved.
  const bgOf = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== "none") return null;
      const c = parseColor(cs.backgroundColor);
      if (c && c.a > 0.9) return c;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  const all = [...document.querySelectorAll("body *")].filter(visible);
  const text = (document.body?.innerText || "").replace(/\s+/g, " ");
  const emoji = /\p{Extended_Pictographic}/u;

  // Gradients and gradient text.
  const gradients = [];
  let gradientText = 0;
  for (const el of all) {
    const cs = getComputedStyle(el);
    if (/gradient\(/.test(cs.backgroundImage)) {
      const stops = [...cs.backgroundImage.matchAll(/rgba?\([^)]+\)/g)].map((m) => parseColor(m[0])).filter((c) => c && c.a > 0.15).map(hsl);
      gradients.push(stops);
      if ((cs.webkitBackgroundClip === "text" || cs.backgroundClip === "text") && /transparent|rgba\(0, 0, 0, 0\)/.test(cs.color + cs.webkitTextFillColor)) gradientText++;
    }
  }
  const isPurpleBlue = (stops) => {
    const sat = stops.filter((s) => s.s > 0.35 && s.l > 0.2 && s.l < 0.85);
    const purple = sat.some((s) => s.h >= 255 && s.h <= 300);
    const blue = sat.some((s) => s.h >= 195 && s.h < 255);
    const magenta = sat.some((s) => s.h > 300 && s.h <= 345);
    const cyan = sat.some((s) => s.h >= 170 && s.h < 200);
    return (purple && (blue || magenta)) || (cyan && magenta);
  };

  // Hero: the first big block.
  const h1 = document.querySelector("h1");
  const h1cs = h1 ? getComputedStyle(h1) : null;
  let hero = h1;
  while (hero && hero.parentElement && hero.parentElement !== document.body && hero.getBoundingClientRect().height < vh * 0.6) hero = hero.parentElement;
  const heroRect = hero?.getBoundingClientRect();
  const heroCentered = !!(h1 && h1cs.textAlign === "center" && Math.abs((h1.getBoundingClientRect().left + h1.getBoundingClientRect().right) / 2 - vw / 2) < vw * 0.08);
  const heroFullHeight = !!(heroRect && heroRect.height >= vh * 0.9);

  // Small uppercase labels directly above headings ("eyebrows").
  let eyebrows = 0;
  for (const h of document.querySelectorAll("h1,h2,h3")) {
    const prev = h.previousElementSibling;
    if (!prev || !visible(prev)) continue;
    const cs = getComputedStyle(prev);
    const t = (prev.innerText || prev.textContent || "").trim();
    if (t && t.length < 40 && parseFloat(cs.fontSize) <= 14 && (cs.textTransform === "uppercase" || t === t.toUpperCase() && /[A-Z]/.test(t))) eyebrows++;
  }

  // Emoji used as UI (nav, buttons, headings, list items, small boxes).
  const emojiUi = [...document.querySelectorAll("nav, button, a, h1, h2, h3, h4, li, [class*=icon]")].filter((e) => visible(e) && emoji.test(e.innerText || "")).length;

  // Repeated identical card rows: 3+ siblings with the same tag/class and similar size.
  let cardRows = 0;
  for (const el of all) {
    const kids = Array.from(el.children || []).filter(visible);
    if (kids.length < 3 || kids.length > 6) continue;
    const sig = (k) => k.tagName + "|" + k.className + "|" + Math.round(k.getBoundingClientRect().width / 10);
    if (new Set(kids.map(sig)).size === 1 && kids[0].getBoundingClientRect().width < vw * 0.4 && kids[0].querySelector("h3,h4,strong")) cardRows++;
  }

  // Contrast failures on visible text with a solid background.
  let contrastFails = 0, contrastChecked = 0;
  const failSamples = [];
  for (const el of all) {
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!own) continue;
    const cs = getComputedStyle(el);
    const fg = parseColor(cs.color);
    const bg = bgOf(el);
    if (!fg || !bg || fg.a < 0.5) continue;
    contrastChecked++;
    const size = parseFloat(cs.fontSize), bold = Number(cs.fontWeight) >= 700;
    const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
    const ratio = contrast(fg, bg);
    if (ratio < need) {
      contrastFails++;
      if (failSamples.length < 5) failSamples.push(`${el.tagName.toLowerCase()} "${(el.innerText || el.textContent || "").trim().slice(0, 40)}" ${ratio.toFixed(2)}:1`);
    }
  }

  // CSS rules: transition: all, bounce easing.
  let transitionAll = 0;
  for (const sheet of document.styleSheets) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; }
    for (const r of rules || []) {
      const t = r.style?.transition || r.style?.transitionProperty || "";
      if (/(^|,|\s)all(\s|,|$)/.test(t)) transitionAll++;
    }
  }

  const fontOf = (el) => el ? getComputedStyle(el).fontFamily.split(",")[0].replace(/["']/g, "").trim() : null;
  const bodyEl = document.querySelector("main p, p") || document.body;
  const loadedFaces = document.fonts ? [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/["']/g, "")) : [];
  const bodyBg = parseColor(getComputedStyle(document.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 0 };
  const pageBg = bodyBg.a > 0.5 ? bodyBg : parseColor(getComputedStyle(document.documentElement).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 };
  const bgHsl = hsl(pageBg);
  // Accent: most common saturated background colour on buttons/links.
  const accents = {};
  for (const el of document.querySelectorAll("a, button, [class*=btn], [class*=button]")) {
    if (!visible(el)) continue;
    const c = parseColor(getComputedStyle(el).backgroundColor);
    if (c && c.a > 0.5) { const x = hsl(c); if (x.s > 0.25) accents[Math.round(x.h / 30) * 30] = (accents[Math.round(x.h / 30) * 30] || 0) + 1; }
  }
  const accentHue = Object.entries(accents).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    title: document.title,
    url: location.href,
    viewport: vw,
    overflowX: document.documentElement.scrollWidth > vw + 1,
    scrollWidth: document.documentElement.scrollWidth,
    pageHeight: document.documentElement.scrollHeight,
    textLength: text.length,
    sections: document.querySelectorAll("section, main > div, body > div > section").length,
    images: [...document.querySelectorAll("img, svg, picture, video")].filter(visible).length,
    fonts: { h1: fontOf(h1), body: fontOf(bodyEl), loaded: [...new Set(loadedFaces)] },
    page: { bg: pageBg, dark: lum(pageBg) < 0.2, cream: bgHsl.l > 0.88 && bgHsl.h >= 25 && bgHsl.h <= 65 && bgHsl.s > 0.15, accentHue: accentHue === null ? null : Number(accentHue) },
    tells: {
      gradients: gradients.length,
      purpleBlueGradients: gradients.filter(isPurpleBlue).length,
      gradientText,
      heroCentered,
      heroFullHeight,
      eyebrows,
      emojiUi,
      identicalCardRows: cardRows,
      transitionAll,
      arrowsOnLinks: [...document.querySelectorAll("a, button")].filter((e) => /[→➜➔›»]\s*$/.test((e.innerText || "").trim())).length,
      numberedMarkers: (text.match(/(^|\s)0[1-9](\s|\.|\/|—)/g) || []).length,
    },
    contrast: { checked: contrastChecked, fails: contrastFails, samples: failSamples },
    text: text.slice(0, 20000),
  };
})()
