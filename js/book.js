/* =====================================================================
   BOOK ENGINE — layout, page-curl, navigasi, input & boot.
   ===================================================================== */
(function () {
  "use strict";

  const { BASE_W, BASE_H, CHAPTERS } = App.config;
  const { pages, startOf } = App;
  const N = pages.length; // selalu genap

  const root = document.documentElement;
  const book = document.getElementById("book");
  const stage = document.getElementById("stage");
  const elStatus = document.getElementById("status");
  const bPrev = document.getElementById("bPrev"),
    bNext = document.getElementById("bNext");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let single = false,
    flipped = 0,
    L = 0,
    maxFlip = 0,
    PW = 480,
    PH = 620;
  let leaves = [],
    faces = [],
    leavesEl = null,
    tabsEl = null,
    chain = null;

  function measure() {
    const vw = innerWidth,
      vh = innerHeight;
    const was = single;
    single = vw < 820;
    const ratio = BASE_W / BASE_H;
    const availH = vh - (single ? 150 : 150);
    let ph = Math.min(availH, 940),
      pw = ph * ratio;
    const maxW = single ? vw - 24 : (vw - 130) / 2;
    if (pw > maxW) {
      pw = maxW;
      ph = pw / ratio;
    }
    PW = pw;
    PH = ph;
    root.style.setProperty("--pw", pw + "px");
    root.style.setProperty("--ph", ph + "px");
    root.style.setProperty("--s", pw / BASE_W);
    return was !== single;
  }

  function makeFace(pi, side) {
    const f = document.createElement("div");
    if (pi < 0) {
      f.className = "face back blank r";
      f.innerHTML = '<div class="shade"></div>';
      return f;
    }
    const pg = pages[pi];
    const spine = single ? "r" : pi % 2 === 1 ? "l" : "r";
    f.className = `face ${side} ${pg.type} ${pg.cls || ""} ${spine}`;
    f.innerHTML = pg.html + '<div class="shade"></div>';
    faces[pi] = f;
    return f;
  }

  function render() {
    cancelCurls();
    book.innerHTML = "";
    book.classList.toggle("single", single);
    leaves = [];
    faces = new Array(N);
    L = single ? N : N / 2;
    maxFlip = single ? N - 1 : L;
    const lv = document.createElement("div");
    lv.className = "leaves";
    lv.innerHTML =
      '<div class="base base-l"></div><div class="base base-r"></div>';
    for (let i = 0; i < L; i++) {
      const leaf = document.createElement("div");
      leaf.className = "leaf";
      leaf.appendChild(makeFace(single ? i : 2 * i, "front"));
      leaf.appendChild(makeFace(single ? -1 : 2 * i + 1, "back"));
      lv.appendChild(leaf);
      leaves.push(leaf);
    }
    book.appendChild(lv);
    leavesEl = lv;

    tabsEl = null;
    if (!single) {
      tabsEl = document.createElement("div");
      tabsEl.className = "tabs";
      tabsEl.innerHTML = CHAPTERS.map(
        (c) =>
          `<button class="tab" data-chap="${c.id}" data-goto="${startOf(c.id)}" aria-label="Go to ${c.title}">${c.tab}</button>`,
      ).join("");
      book.appendChild(tabsEl);
    }
  }

  const pageToFlip = (p) => (single ? p : Math.ceil(p / 2));
  const currentPage = () =>
    single ? flipped : flipped === 0 ? 0 : flipped === L ? N - 1 : 2 * flipped;
  const visiblePages = () => {
    if (single) return [flipped];
    const v = [];
    if (flipped >= 1) v.push(2 * flipped - 1);
    if (flipped < L) v.push(2 * flipped);
    return v;
  };

  function applyState() {
    leaves.forEach((leaf, i) => {
      const f = i < flipped;
      leaf.classList.toggle("flipped", f);
      leaf.style.zIndex = f ? i + 1 : L - i;
      if (single) leaf.style.visibility = f ? "hidden" : "visible";
    });
    updateUI();
  }

  function updateUI() {
    const cf = !single && flipped === 0,
      cb = !single && flipped === maxFlip;
    book.classList.toggle("closed-front", cf);
    book.classList.toggle("closed-back", cb);
    book.classList.toggle("notabs", PH < 430);
    book.style.transform = cf
      ? `translateX(${-PW / 2}px)`
      : cb
        ? `translateX(${PW / 2}px)`
        : "translateX(0)";

    const vs = visiblePages();
    faces.forEach((f, p) => {
      if (f) f.inert = !vs.includes(p);
    });

    const prim = vs[vs.length - 1];
    const chap = pages[prim].chap.replace(/\d+$/, "");
    if (tabsEl)
      tabsEl
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.toggle("on", t.dataset.chap === chap));

    let label;
    if (single)
      label =
        prim === 0 ? "Cover" : prim === N - 1 ? "Back cover" : `Page ${prim}`;
    else if (flipped === 0) label = "Cover";
    else if (flipped === L) label = "Back cover";
    else label = `Pages ${2 * flipped - 1}–${2 * flipped}`;
    elStatus.textContent = label;
    bPrev.disabled = flipped === 0;
    bNext.disabled = flipped === maxFlip;

    try {
      const h = prim === 0 ? location.pathname + location.search : "#p" + prim;
      history.replaceState(null, "", h);
    } catch (e) {}
  }

  function setDur(s) {
    book.style.setProperty("--dur", s + "s");
  }

  /* ---------------------------------------------------------------------
   PAGE CURL — while a leaf turns, it is rebuilt from NS thin vertical
   strips, each hinged to the previous one. Every frame the strips are
   rotated by slightly different amounts, so the paper bends (free edge
   trails behind the spine) instead of turning like a rigid door.
   --------------------------------------------------------------------- */
  const NS = 22; // number of strips (more = smoother curve)
  const BEND = 46; // max bend in degrees at mid-turn
  const active = new Set();
  let raf = 0;

  const ease = (p) =>
    p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

  function makeSlice(faceEl, left, back) {
    const el = document.createElement("div");
    el.className = "slice" + (back ? " sb" : "");
    const clone = faceEl.cloneNode(true);
    clone.classList.remove("back");
    clone.removeAttribute("inert");
    clone.style.cssText = `position:absolute;inset:auto;top:0;left:${left}px;width:${PW}px;height:${PH}px;transform:none;visibility:visible`;
    const sh = document.createElement("div");
    sh.className = "cshade";
    el.append(clone, sh);
    return { el, shade: sh };
  }

  function buildCurl(leaf) {
    const sw = PW / NS;
    const el = document.createElement("div");
    el.className = "curl";
    const front = leaf.children[0],
      backF = leaf.children[1];
    const strips = [];
    let parent = el;
    for (let k = 0; k < NS; k++) {
      const s = document.createElement("div");
      s.className = "strip";
      s.style.left = (k === 0 ? 0 : sw) + "px";
      s.style.width = sw + 1 + "px";
      const f = makeSlice(front, -k * sw, false);
      const b = makeSlice(backF, -(PW - (k + 1) * sw - 1), true);
      s.append(f.el, b.el);
      parent.appendChild(s);
      parent = s;
      strips.push({ s, f: f.shade, b: b.shade });
    }
    leaf.appendChild(el);
    return { el, strips };
  }

  /* t = turn progress 0..1 (0 = page lies on the right, 1 = lies on the left) */
  function applyCurl(c, t) {
    const bend = BEND * Math.sin(Math.PI * t);
    let prev = 0;
    for (let k = 0; k < NS; k++) {
      const x = (k + 0.5) / NS;
      const A = -180 * t + bend * Math.pow(x, 1.35);
      c.strips[k].s.style.transform = `rotateY(${(A - prev).toFixed(3)}deg)`;
      prev = A;
      const sh = (
        Math.pow(Math.abs(Math.sin((A * Math.PI) / 180)), 1.15) * 0.42
      ).toFixed(3);
      c.strips[k].f.style.opacity = sh;
      c.strips[k].b.style.opacity = sh;
    }
  }

  function finishCurl(leaf) {
    const c = leaf._curl;
    if (!c) return;
    leaf.classList.toggle("flipped", c.fwd);
    leaf.classList.remove("curling");
    c.el.remove();
    leaf._curl = null;
    active.delete(leaf);
    leaf.style.zIndex = c.fwd ? c.i + 1 : L - c.i;
    if (single) leaf.style.visibility = c.fwd ? "hidden" : "visible";
  }
  function cancelCurls() {
    active.forEach((l) => {
      l._curl = null;
    });
    active.clear();
  }

  function tick(now) {
    active.forEach((leaf) => {
      const c = leaf._curl;
      if (!c) {
        active.delete(leaf);
        return;
      }
      const p = Math.min(1, (now - c.start) / c.dur);
      const e = ease(p);
      applyCurl(c, c.fwd ? e : 1 - e);
      if (!c.mid && p >= 0.5) {
        c.mid = true;
        leaf.style.zIndex = c.fwd ? c.i + 1 : L - c.i;
      }
      if (p >= 1) finishCurl(leaf);
    });
    raf = active.size ? requestAnimationFrame(tick) : 0;
  }

  function turn(i, fwd) {
    const leaf = leaves[i];
    if (!leaf) return;
    if (leaf._curl) finishCurl(leaf);
    const dur = parseFloat(book.style.getPropertyValue("--dur")) || 0.95;
    if (reduced) {
      leaf.classList.toggle("flipped", fwd);
      leaf.style.zIndex = fwd ? i + 1 : L - i;
      if (single) leaf.style.visibility = fwd ? "hidden" : "visible";
      return;
    }
    leaf.style.zIndex = 1000;
    if (single) leaf.style.visibility = "visible";
    const built = buildCurl(leaf);
    leaf.classList.remove("flipped");
    leaf.classList.add("curling");
    const c = {
      el: built.el,
      strips: built.strips,
      i,
      fwd,
      start: performance.now(),
      dur: dur * 1000,
      mid: false,
    };
    leaf._curl = c;
    applyCurl(c, fwd ? 0 : 1);
    active.add(leaf);
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function flipTo(t) {
    t = Math.max(0, Math.min(maxFlip, t));
    clearTimeout(chain);
    if (t === flipped) return;
    const far = Math.abs(t - flipped) > 1;
    setDur(far ? 0.7 : 1.0);
    const dir = t > flipped ? 1 : -1;
    (function step() {
      if (flipped === t) return;
      turn(dir > 0 ? flipped : flipped - 1, dir > 0);
      flipped += dir;
      updateUI();
      if (flipped !== t) chain = setTimeout(step, 110);
    })();
  }
  const goToPage = (p) => flipTo(pageToFlip(Math.max(0, Math.min(N - 1, p))));
  const next = () => flipTo(flipped + 1);
  const prev = () => flipTo(flipped - 1);

  /* ---------- input ---------- */
  book.addEventListener("click", (e) => {
    const g = e.target.closest("[data-goto]");
    if (g) {
      e.preventDefault();
      goToPage(+g.dataset.goto);
      return;
    }
    if (e.target.closest("a,button,input")) return;
    if (String(window.getSelection()).length) return;
    const r = leavesEl.getBoundingClientRect(),
      x = e.clientX - r.left;
    if (single) x < r.width * 0.22 ? prev() : next();
    else x < r.width / 2 ? prev() : next();
  });
  document.getElementById("bCover").onclick = () => goToPage(0);
  document.getElementById("bToc").onclick = () => goToPage(2);
  document.getElementById("bHi").onclick = () => goToPage(startOf("contact"));
  bPrev.onclick = prev;
  bNext.onclick = next;

  addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case "ArrowRight":
      case "PageDown":
        next();
        break;
      case "ArrowLeft":
      case "PageUp":
        prev();
        break;
      case "Home":
        goToPage(0);
        break;
      case "End":
        goToPage(N - 1);
        break;
      default:
        return;
    }
    e.preventDefault();
  });

  let tx = 0,
    ty = 0;
  stage.addEventListener(
    "touchstart",
    (e) => {
      const t = e.changedTouches[0];
      tx = t.clientX;
      ty = t.clientY;
    },
    { passive: true },
  );
  stage.addEventListener(
    "touchend",
    (e) => {
      const t = e.changedTouches[0],
        dx = t.clientX - tx,
        dy = t.clientY - ty;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4)
        dx < 0 ? next() : prev();
    },
    { passive: true },
  );

  let rt;
  addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      const p = currentPage();
      const changed = measure();
      if (changed) {
        flipped = pageToFlip(p);
        render();
        book.classList.add("noanim");
        applyState();
        requestAnimationFrame(() =>
          requestAnimationFrame(() => book.classList.remove("noanim")),
        );
      } else updateUI();
    }, 120);
  });

  /* ---------- boot ---------- */
  function parseHash() {
    const h = location.hash.replace("#", "");
    if (!h) return 0;
    if (/^p\d+$/.test(h)) return Math.min(+h.slice(1), N - 1);
    const c = pages.find((p) => p.chap === h);
    return c ? c.index : 0;
  }
  measure();
  render();
  flipped = pageToFlip(parseHash());
  book.classList.add("noanim");
  applyState();
  requestAnimationFrame(() =>
    requestAnimationFrame(() => book.classList.remove("noanim")),
  );

  window.Book = { goToPage, next, prev, pages: N };
})();
