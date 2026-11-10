/* =====================================================================
   PAGES — membangun HTML tiap halaman buku dari App.config.
   ===================================================================== */
(function () {
  "use strict";

  const { PHOTO_SRC, PHOTO_ALT, CV_URL, P, PORTFOLIO, CHAPTERS } = App.config;

  const pad = (n) => String(n).padStart(2, "0");
  const pages = [];
  const add = (o) => {
    o.index = pages.length;
    pages.push(o);
    return o;
  };
  const run = (label) =>
    `<div class="run"><span class="ra">${P.name}</span><span class="rb">${label}</span></div>`;
  const wrap = (i, label, inner) =>
    `<section class="sheet">${run(label)}${inner}<div class="folio">${pad(i)}</div></section>`;
  const chapNo = (id) => pad(CHAPTERS.findIndex((c) => c.id === id) + 1);
  const startOf = (id) => pages.find((p) => p.chap === id).index;

  window.__imgFB = function (el) {
    if (!el.dataset.t) {
      el.dataset.t = 1;
      el.src = PHOTO_ALT;
      return;
    }
    el.onerror = null;
    const d = document.createElement("div");
    d.className = "ph";
    d.textContent = "BAP";
    el.replaceWith(d);
  };

  /* 0 — cover */
  add({
    type: "cover",
    chap: "cover",
    label: "Cover",
    render: () => `
<section class="sheet cvr">
  <div class="in">
    <span class="pill dot">Available for Collaboration</span>
    <div>
      <div class="lab">Human Resource · Portfolio</div>
      <h1>People,<br><em>Systems</em><br>and Growth.</h1>
      <p class="tag">I build HR systems that connect people, processes, and business goals — more structured and ready to scale.</p>
    </div>
    <div class="bot">
      <div class="who">${P.name}<small>${P.role}</small></div>
      <div class="open">Open <span>→</span></div>
    </div>
  </div>
</section>`,
  });

  /* 1 — photo (inside cover) */
  add({
    type: "paper",
    cls: "tint",
    chap: "front",
    label: "Hello",
    render: () => `
<section class="sheet pp">
  <div class="photo"><img src="${PHOTO_SRC}" alt="${P.name}" onerror="__imgFB(this)"></div>
  <div class="pcap">
    <div class="pname">${P.name}</div>
    <div class="prole">${P.role}</div>
    <span class="pill dot">Available for Collaboration</span>
    <div class="pq">Real change starts with the right system.</div>
  </div>
</section>`,
  });

  /* 2 — table of contents */
  add({
    type: "paper",
    chap: "toc",
    label: "Contents",
    render: (i) => {
      const row = (n, t, pg, sub) =>
        `<button class="tr${sub ? " sub" : ""}" data-goto="${pg}"><span class="n">${n || ""}</span><span class="t">${t}</span><span class="pn">${pad(pg)}</span></button>`;
      let rows = "";
      CHAPTERS.forEach((c) => {
        rows += row(chapNo(c.id), c.title, startOf(c.id));
        if (c.id === "portfolio")
          pages
            .filter((p) => p.item)
            .forEach((p) => {
              rows += row("", p.item.title, p.index, true);
            });
      });
      return wrap(
        i,
        "Contents",
        `
  <div class="eyebrow">Inside this book</div>
  <h2 class="ch">Table of <em>Contents</em></h2>
  <div class="tocl">${rows}</div>
  <div class="tip">Turn pages with the arrows below, the ← → keys, by swiping, or by clicking a page edge.</div>`,
      );
    },
  });

  /* 3 — About (left) */
  add({
    type: "paper",
    chap: "about",
    label: "About Me",
    render: (i) =>
      wrap(
        i,
        "About Me",
        `
  <div class="eyebrow">About Me</div>
  <h2 class="ch">Real Change <em>starts</em> with the right <em>system</em></h2>
  <p class="lead">With over four years of experience in building and managing end-to-end Human Resource processes—including recruitment and onboarding, talent development, performance management, and employee relations.</p>
  <p>I focus on designing HR practices that deliver measurable value across the entire employee lifecycle.</p>
  <ul class="facts">
    <li><b>Now</b><span>Head of Human Resource, PT. TRASPAC Makmur Sejahtera</span></li>
    <li><b>Education</b><span>S1 Informatics Engineering, Widya Gama Malang University</span></li>
    <li><b>Certified</b><span>Certified Human Resource Professional, 2024</span></li>
  </ul>`,
      ),
  });

  /* 4 — About (right): numbers + CV download */
  add({
    type: "paper",
    chap: "about",
    label: "About Me",
    render: (i) =>
      wrap(
        i,
        "About Me",
        `
  <div class="eyebrow">By the numbers</div>
  <div class="stats">
    <div class="stat"><b>10<i>+</i></b><span>Years work experience</span></div>
    <div class="stat"><b>10<i>+</i></b><span>End-to-end HR programs implemented</span></div>
    <div class="stat"><b>50<i>%</i></b><span>Effective hiring process</span></div>
    <div class="stat"><b>90<i>+</i></b><span>Employees managed across the end-to-end lifecycle</span></div>
  </div>
  <div class="eyebrow sm">Curriculum Vitae</div>
  <div class="cv">
    <svg viewBox="0 0 42 52" fill="none"><path d="M3 2h24l12 12v36H3z" fill="#fff" stroke="#0b1020" stroke-width="1.6"/><path d="M27 2v12h12" stroke="#0b1020" stroke-width="1.6"/><path d="M10 24h22M10 31h22M10 38h14" stroke="#2563eb" stroke-width="2.2" stroke-linecap="round"/></svg>
    <div><div class="cvt">Download my CV</div><div class="cvs">${P.name} · PDF</div></div>
  </div>
  <div class="actions">
    <a class="btn" href="${encodeURI(CV_URL)}" download target="_blank" rel="noopener">Download CV ↓</a>
    <a class="btn ghost" href="${P.medium}" target="_blank" rel="noopener">Read Blog →</a>
  </div>`,
      ),
  });

  /* 5 — Skills (left): soft skills */
  add({
    type: "paper",
    chap: "skills",
    label: "Skills",
    render: (i) =>
      wrap(
        i,
        "Skills",
        `
  <div class="eyebrow">Expertise</div>
  <h2 class="ch">Core competencies <em>and areas of expertise</em></h2>
  <div class="eyebrow sm">Soft skills</div>
  <div class="chips">${["Integrity", "Leadership", "People Development", "Communication", "Team Management", "Task Management", "Talent Management", "Problem Solving", "Coaching", "Strategic Thinking", "Analytical Thinking", "Digital & HR technology fluency"].map((s, k) => `<span class="chip${k % 5 === 0 ? " b" : ""}">${s}</span>`).join("")}</div>`,
      ),
  });

  /* 6 — Skills (right): hard skills */
  add({
    type: "paper",
    chap: "skills",
    label: "Skills",
    render: (i) =>
      wrap(
        i,
        "Skills",
        `
  <div class="eyebrow">Hard skills</div>
  <h2 class="ch">What I <em>build</em> with</h2>
  <ol class="hard">
    <li>HRIS &amp; Digital HR systems</li>
    <li>HR Strategy &amp; Workforce planning</li>
    <li>Process automation &amp; digital HR</li>
    <li>Compensation &amp; Benefits</li>
    <li>HR Policy &amp; SOP Development</li>
  </ol>
  <div class="eyebrow sm">Technical stack</div>
  <div class="chips">${["PHP (Laravel, CodeIgniter)", "PostgreSQL", "WordPress", "Web system development"].map((s) => `<span class="chip">${s}</span>`).join("")}</div>`,
      ),
  });

  /* 7 — Portfolio opener */
  add({
    type: "paper",
    chap: "portfolio",
    label: "Portfolio",
    render: (i) =>
      wrap(
        i,
        "Portfolio",
        `
  <div class="eyebrow">Work</div>
  <h2 class="ch">Program &amp; <em>Portfolio.</em></h2>
  <p>Selected programs I have worked on. Each program has its own page — turn the page, or jump straight to one below.</p>
  <div class="tocl">${PORTFOLIO.map((it, k) => {
    const pg = i + 1 + k;
    return `<button class="tr" style="font-size:15px;padding:9px 0" data-goto="${pg}"><span class="n">${pad(k + 1)}</span><span class="t">${it.title}</span><span class="pn">${pad(pg)}</span></button>`;
  }).join("")}</div>`,
      ),
  });

  /* 8… — one page per portfolio item */
  PORTFOLIO.forEach((it, k) => {
    add({
      type: "paper",
      chap: "portfolio",
      item: it,
      label: "Portfolio",
      render: (i) =>
        wrap(
          i,
          "Portfolio",
          `
  <div class="eyebrow">Program ${pad(k + 1)} / ${pad(PORTFOLIO.length)}</div>
  <div class="plateimg" style="--c1:${it.c1};--c2:${it.c2}">${it.image ? `<img src="${it.image}" alt="${it.title}">` : `<span class="big">${pad(k + 1)}</span><span class="cat">${it.category}</span>`}</div>
  <h3 class="pt">${it.title}</h3>
  <div class="meta">${it.period} · ${it.role}</div>
  <p>${it.summary}</p>
  <div class="eyebrow sm">Highlights</div>
  <ul class="hl">${it.highlights.map((x) => `<li>${x}</li>`).join("")}</ul>
  <div class="tags">${it.tags.map((t) => `<span>${t}</span>`).join("")}</div>
  ${it.link ? `<a class="lnk" href="${it.link}" target="_blank" rel="noopener">View project →</a>` : ""}`,
        ),
    });
  });

  /* Experience */
  add({
    type: "paper",
    chap: "experience",
    label: "Experience",
    render: (i) =>
      wrap(
        i,
        "Experience",
        `
  <div class="eyebrow">Journey</div>
  <h2 class="ch">Experience &amp; <em>Education.</em></h2>
  <p>My career journey and educational background that have shaped me as a Human Resource Professional.</p>
  <div class="role"><div class="when">2024 — Now</div><h3>Head of Human Resource</h3><div class="org">PT. TRASPAC Makmur Sejahtera · Full-time</div>
  <ul>
    <li>Led end-to-end HR operations: recruitment, performance management, development, compensation &amp; benefits, industrial relations, and SOP standardization.</li>
    <li>Drove team development initiatives to strengthen collaboration, capability, and performance.</li>
    <li>Initiated and managed internal digital systems for HR and business operations (recruitment, employee services, inventory, accounting, internal platforms).</li>
    <li>Supported digital transformation by reducing manual processes, improving data accuracy, and enabling decisions through integrated systems.</li>
  </ul></div>`,
      ),
  });

  add({
    type: "paper",
    chap: "experience2",
    label: "Experience",
    render: (i) =>
      wrap(
        i,
        "Experience",
        `
  <div class="eyebrow">Experience · continued</div>
  <div class="role"><div class="when">2024 — Now</div><h3>Web System &amp; WordPress Developer</h3><div class="org">Freelance · Remote</div>
  <ul><li>Developed and maintained web-based application systems for clients, supporting core public-sector operations.</li></ul></div>
  <div class="role"><div class="when">2021 — 2024</div><h3>Human Resource Development</h3><div class="org">PT. TRASPAC Makmur Sejahtera · Full-time</div>
  <ul>
    <li>Executed end-to-end HR processes: recruitment, development, performance management, compensation &amp; benefits, industrial relations, SOP standardization, and personnel administration.</li>
    <li>Supported standardized HR procedures to improve consistency, compliance, and efficiency.</li>
    <li>Coordinated and managed a national-level program (TRASPAC Competition): administration, stakeholder coordination, and operational execution.</li>
  </ul></div>`,
      ),
  });

  add({
    type: "paper",
    chap: "experience3",
    label: "Experience",
    render: (i) =>
      wrap(
        i,
        "Experience",
        `
  <div class="eyebrow">Experience · continued</div>
  <div class="role"><div class="when">2019 — 2021</div><h3>Head of Fullstack Developer</h3><div class="org">PT. TRASPAC Makmur Sejahtera · Full-time</div>
  <ul>
    <li>Developed and maintained web systems for central and local government institutions.</li>
    <li>Designed and implemented government platforms: HRIS, employee services, regional budgeting, work planning, and national defense systems.</li>
    <li>Built system integrations for data consistency and interoperability.</li>
    <li>Stack: PHP (Laravel, CodeIgniter), PostgreSQL.</li>
  </ul></div>
  <div class="role"><div class="when">2016 — 2019</div><h3>Fullstack Developer</h3><div class="org">PT. TRASPAC Makmur Sejahtera · Full-time</div>
  <ul>
    <li>Supported development of web systems for Indonesian ministries and government institutions.</li>
    <li>Implemented public-sector systems: HRIS, attendance, talent management, workload analysis, employee services, and citizen services.</li>
    <li>Contributed to system integration for data consistency. Stack: PHP (Laravel, CodeIgniter), PostgreSQL.</li>
  </ul></div>`,
      ),
  });

  add({
    type: "paper",
    chap: "experience4",
    label: "Education",
    render: (i) =>
      wrap(
        i,
        "Education",
        `
  <div class="eyebrow">Education &amp; certification</div>
  <h2 class="ch">Learning, <em>formally.</em></h2>
  <div class="edu"><div class="ic">🎓</div><div><span class="yr">2020 — 2023</span><b>S1 Informatics Engineering</b><small>Widya Gama Malang University · IPK 3.53/4.0</small></div></div>
  <div class="edu"><div class="ic">🏅</div><div><span class="yr">2024</span><b>Certified Human Resource Professional</b><small>Bizani x HR Indonesia</small></div></div>
  <div class="eyebrow sm" style="margin-top:18px">Career at a glance</div>
  <div class="tl"><div class="row"><span class="dev">Systems</span><span class="hr">People</span></div>
  <div class="yrs"><span>2016</span><span>2021</span><span>Now</span></div></div>`,
      ),
  });

  /* Contact */
  add({
    type: "paper",
    chap: "contact",
    label: "Contact",
    render: (i) =>
      wrap(
        i,
        "Contact",
        `
  <div class="eyebrow">Get in Touch</div>
  <h2 class="ch">Let's <em>Collaborate.</em></h2>
  <p class="lead">Open to freelance opportunities, full-time roles, or discussions around Human Resources and System Application. Feel free to reach out!</p>
  <ul class="clist">
    <li><a href="mailto:${P.email}">Send Email <small>${P.email}</small></a></li>
    <li><a href="${P.medium}" target="_blank" rel="noopener">Medium <small>@bagasadynotes</small></a></li>
    <li><a href="${P.linkedin}" target="_blank" rel="noopener">LinkedIn <small>in/bagasady</small></a></li>
    <li><a href="${encodeURI(CV_URL)}" download target="_blank" rel="noopener">Curriculum Vitae <small>Download PDF ↓</small></a></li>
  </ul>
  <span class="pill dot">Available for Collaboration</span>`,
      ),
  });

  /* filler so the back cover lands on a left-hand page */
  while (pages.length % 2 === 0) {
    add({
      type: "paper",
      chap: "notes",
      label: "Notes",
      render: (i) =>
        wrap(
          i,
          "Notes",
          `
    <div class="eyebrow">Notes</div>
    <p style="margin-top:90px;font:italic 400 30px/1.2 var(--serif);color:var(--ink-2)">Every good system starts with a conversation.</p>`,
        ),
    });
  }

  /* last — back cover */
  add({
    type: "cover",
    chap: "back",
    label: "Back cover",
    render: () => `
<section class="sheet cvr backc">
  <div class="in">
    <div class="thx">Thank you<br><em>for reading.</em></div>
    <small>© ${new Date().getFullYear()} ${P.name}</small>
    <button class="btn" data-goto="0" style="border:0;cursor:pointer">← Back to cover</button>
  </div>
</section>`,
  });

  pages.forEach((p) => {
    p.html = p.render(p.index);
  });

  App.pages = pages;
  App.startOf = startOf;
})();
