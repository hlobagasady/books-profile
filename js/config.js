/* =====================================================================
   CONFIG — data & pengaturan. Edit konten di file ini.
   ===================================================================== */
window.App = window.App || {};

(function () {
  "use strict";

  const BASE_W = 480,
    BASE_H = 620; // fixed design size of one page
  const SITE_URL = "https://work-bagasady.vercel.app/";
  const PHOTO_SRC = SITE_URL + "foto/foto.png"; // photo is loaded from the reference site
  const PHOTO_ALT = "foto/foto.png"; // fallback if the first one fails (same project)
  const CV_URL = SITE_URL + "doc/CV BAGAS ARIEFIA PRIBADY.pdf";

  const P = {
    name: "Bagas Ariefia Pribady",
    role: "Head of Human Resource",
    email: "bagasstudy25@gmail.com",
    medium: "https://medium.com/@bagasadynotes",
    linkedin: "https://www.linkedin.com/in/bagasady/",
  };

  /* ---- PORTFOLIO: one entry = one page of the book. Edit / add / remove freely. ----
   Optional: image:'img/xxx.jpg'  (shows instead of the generated plate),  link:'https://...'   */
  const PORTFOLIO = [
    {
      title: "TRASPAC Competition",
      category: "Program Management",
      period: "2021 — 2024",
      role: "Program Coordinator",
      summary:
        "A national-level program coordinated end to end — from administration and stakeholder coordination to day-to-day operational execution.",
      highlights: [
        "Administration and participant coordination across the program",
        "Alignment with internal and external stakeholders",
        "Operational execution from planning to delivery",
      ],
      tags: ["Program", "Stakeholders", "Operations"],
      c1: "#0b1b3a",
      c2: "#2563eb",
    },
    {
      title: "Recruitment & Onboarding Framework",
      category: "Talent Acquisition",
      period: "2021 — Now",
      role: "HR Lead",
      summary:
        "A structured, end-to-end hiring flow from sourcing and selection to onboarding, built to make recruitment consistent and measurable.",
      highlights: [
        "Standardised selection stages and criteria",
        "Onboarding journey for new employees",
        "Supported by internal recruitment systems",
      ],
      tags: ["Recruitment", "Onboarding", "Process"],
      c1: "#111827",
      c2: "#374151",
    },
    {
      title: "HR Policy & SOP Standardization",
      category: "Policy & Compliance",
      period: "2021 — Now",
      role: "HR Lead",
      summary:
        "Standardised HR procedures and policies to improve operational consistency, compliance, and efficiency across the organisation.",
      highlights: [
        "SOPs for core HR processes",
        "Policy alignment with day-to-day operations",
        "Clearer, repeatable ways of working",
      ],
      tags: ["SOP", "Policy", "Compliance"],
      c1: "#1e3a8a",
      c2: "#3b82f6",
    },
    {
      title: "Performance & Talent Development",
      category: "People Development",
      period: "2021 — Now",
      role: "HR Lead",
      summary:
        "Performance management and development practices that connect individual growth with team and business goals.",
      highlights: [
        "Performance management cycle",
        "Coaching and capability building",
        "Team development initiatives",
      ],
      tags: ["Performance", "Coaching", "Talent"],
      c1: "#0f172a",
      c2: "#1d4ed8",
    },
    {
      title: "Internal Digital HR Systems",
      category: "HR Technology",
      period: "2024 — Now",
      role: "Head of Human Resource",
      summary:
        "Internal digital systems built to support HR and business operations — recruitment, employee services, inventory, accounting, and internal platforms.",
      highlights: [
        "Fewer manual processes",
        "More accurate data",
        "Integrated systems that support decisions",
      ],
      tags: ["HRIS", "Automation", "Digital HR"],
      c1: "#1f2937",
      c2: "#2563eb",
    },
    {
      title: "Government HRIS Platforms",
      category: "System Development",
      period: "2016 — 2021",
      role: "Head of Fullstack Developer",
      summary:
        "HRIS, employee services, regional budgeting, work planning and other platforms for central and local government institutions.",
      highlights: [
        "Built with PHP (Laravel, CodeIgniter) and PostgreSQL",
        "System integrations for data consistency",
        "Platforms supporting core public-sector operations",
      ],
      tags: ["Laravel", "PostgreSQL", "Integration"],
      c1: "#0b1020",
      c2: "#475569",
    },
  ];

  const CHAPTERS = [
    { id: "about", title: "About Me", tab: "About" },
    { id: "skills", title: "Skills", tab: "Skills" },
    { id: "portfolio", title: "Portfolio", tab: "Portfolio" },
    { id: "experience", title: "Experience", tab: "Experience" },
    { id: "contact", title: "Contact", tab: "Contact" },
  ];

  App.config = {
    BASE_W,
    BASE_H,
    SITE_URL,
    PHOTO_SRC,
    PHOTO_ALT,
    CV_URL,
    P,
    PORTFOLIO,
    CHAPTERS,
  };
})();
