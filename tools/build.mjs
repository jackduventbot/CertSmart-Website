// Generates the CertSmart static pages into the folder given as argv[2].
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = process.argv[2];
const I = JSON.parse(fs.readFileSync(path.join(here, "icons.json"), "utf8"));
const ic = (n, cls = "icon") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${I[n]}</svg>`;
const QUOTE = '<svg class="qmark" viewBox="0 0 32 32" aria-hidden="true" fill="currentColor"><path d="M9.6 26C5.4 26 2.5 22.9 2.5 18.4 2.5 11.6 7.6 6.4 14 5l1.1 2.4c-3.7 1.2-6 4.1-6.3 7.3 3.4-.3 6.2 2.3 6.2 5.6 0 3.2-2.4 5.7-5.4 5.7zm15.6 0c-4.2 0-7.1-3.1-7.1-7.6 0-6.8 5.1-12 11.5-13.4l1.1 2.4c-3.7 1.2-6 4.1-6.3 7.3 3.4-.3 6.2 2.3 6.2 5.6 0 3.2-2.4 5.7-5.4 5.7z"/></svg>';
const UNDERLINE = '<svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true"><path d="M3 8.5C40 3.5 120 2.5 197 6.5"/></svg>';
const NAV = [["index.html", "Home"], ["about.html", "About"], ["how-it-works.html", "How it Works"], ["vision.html", "Vision"], ["contact.html", "Contact Us"]];
const FONTS = "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400..600&amp;family=Plus+Jakarta+Sans:wght@500..800&amp;display=swap";
const V = "20261127b";

function page(filename, title, bodyClass, main, desc = "") {
  const links = NAV.map(([href, label]) => {
    const cls = [];
    if (href === filename) cls.push("active");
    if (href === "contact.html") cls.push("nav-cta");
    const c = cls.length ? ` class="${cls.join(" ")}"` : "";
    const cur = href === filename ? ' aria-current="page"' : "";
    return `<a href="${href}"${c}${cur}>${label}</a>`;
  }).join("\n        ");
  const foot = NAV.map(([h, l]) => `<a href="${h}">${l}</a>`).join("\n        ");
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/img/favicon-32.png">
  <link rel="icon" type="image/png" sizes="192x192" href="assets/img/favicon-192.png">
  <link rel="apple-touch-icon" href="assets/img/favicon-180.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${FONTS}" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css?v=${V}">
</head>
<body class="${bodyClass}">
  <div class="patent-bar">
    ${ic("shield-check")}
    Proprietary Technology &mdash; Patent Pending
  </div>

  <header class="site-header">
    <div class="wrap header-inner">
      <a href="index.html" class="brand"><img src="assets/img/logo.webp" alt="CertSmart logo" width="300" height="127"></a>
      <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="main-nav">
        ${ic("menu", "icon icon-menu")}${ic("x", "icon icon-close")}
      </button>
      <nav class="main-nav" id="main-nav" aria-label="Main">
        ${links}
      </nav>
    </div>
  </header>

  <main>
${main}
  </main>

  <footer class="site-footer">
    <div class="wrap footer-inner">
      <a href="index.html" class="footer-brand"><img src="assets/img/logo.webp" alt="CertSmart logo" width="300" height="127"></a>
      <nav class="footer-nav" aria-label="Footer">
        ${foot}
      </nav>
      <div class="footer-right">
        <a href="mailto:info@certsmart.ai">info@certsmart.ai</a>
        <a class="social" href="https://www.linkedin.com/in/karen-adamsbaum/" aria-label="Karen Adamsbaum on LinkedIn" target="_blank" rel="noopener">${ic("linkedin")}</a>
      </div>
      <span class="footer-copy">&copy; 2026 CertSmart</span>
    </div>
  </footer>

  <script src="js/main.js?v=${V}"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, filename), html, "utf8");
}

// ---------------------------------------------------------------- Home
page("index.html", "CertSmart | Insurance Compliance, Simplified", "page-home", `    <section class="hero-film" data-film aria-label="CertSmart introduction">
      <div class="film" aria-hidden="true">
        <video class="is-on" muted playsinline preload="auto" poster="assets/video/hero-poster.jpg" src="assets/video/hero-1-site.mp4"></video>
        <video muted playsinline preload="metadata" src="assets/video/hero-2-contractor.mp4"></video>
        <video muted playsinline preload="metadata" src="assets/video/hero-3-signing.mp4"></video>
      </div>
      <div class="wrap film-inner">
        <div class="hero-copy">
          <span class="pill">${ic("star")}Patent-pending proprietary technology</span>
          <h1 class="h-display">
            <span>Insurance</span>
            <span>Compliance.</span>
            <span><span class="mark">Simplified.</span></span>
          </h1>
          <p class="lead">CertSmart reviews your contracts and insurance policies, verifies every requirement, and prepares the certificate&mdash;so you can build with confidence.</p>
          <div class="hero-actions">
            <a href="how-it-works.html" class="btn btn-primary">See How It Works ${ic("arrow-right")}</a>
            <a href="contact.html" class="btn btn-light">Book a 20-minute call</a>
          </div>
        </div>
      </div>
      <div class="wrap film-foot">
        <div class="founder-chip">
          <span class="av"><img src="assets/img/karen-photo.webp" alt="Karen Adamsbaum"></span>
          <div><b>Founded by Karen Adamsbaum, CIC</b><span>Software Developer for 13 years and 20+ years in the insurance industry</span></div>
        </div>
        <div class="film-controls">
        <div class="film-dots" role="group" aria-label="Background videos">
          <button type="button" class="film-dot is-on" aria-label="Video 1: construction site" aria-current="true"><span></span></button>
          <button type="button" class="film-dot" aria-label="Video 2: contractor on site"><span></span></button>
          <button type="button" class="film-dot" aria-label="Video 3: contract signing"><span></span></button>
        </div>
          <button type="button" class="film-toggle" aria-label="Pause background video" aria-pressed="false">${ic("pause", "icon icon-pause")}${ic("play", "icon icon-play")}</button>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="eyebrow">Who it&rsquo;s for</span>
            <h2 class="h2">Built for anyone whose contracts require insurance.</h2>
          </div>
          <p>If your agreements require another party to carry insurance, CertSmart confirms the coverage actually meets those requirements&mdash;before a problem arises.</p>
        </div>
        <div class="audience">
          <article class="tile">
            <img src="assets/img/photo-builders.webp" alt="Two builders in hard hats reading a construction plan on site" loading="lazy" style="object-position: 50% 35%;">
            <div class="tile-body"><span class="tag">Contractors</span><h3>Know your subs are covered</h3><p>Check every subcontractor&rsquo;s policies against the agreement before work begins.</p></div>
          </article>
          <article class="tile">
            <img src="assets/img/photo-keys.webp" alt="Hand holding a set of house keys in an apartment hallway" loading="lazy">
            <div class="tile-body"><span class="tag">Landlords</span><h3>Leases backed by real coverage</h3><p>Confirm tenant insurance matches what the lease requires.</p></div>
          </article>
          <article class="tile">
            <img src="assets/img/photo-desk.webp" alt="Person reviewing a document at a conference table" loading="lazy">
            <div class="tile-body"><span class="tag">Property managers</span><h3>Every property, audit ready</h3><p>Keep vendor certificates current across every building.</p></div>
          </article>
          <article class="tile">
            <img src="assets/img/photo-review.webp" alt="Business owner in a suit reviewing and signing a contract" loading="lazy">
            <div class="tile-body"><span class="tag">Business owners</span><h3>Fewer surprises after you sign</h3><p>Verify vendor coverage before the work starts, not after a claim.</p></div>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="wrap">
        <div class="who-grid">
          <div class="stat-card">
            <span class="n">70%</span>
            <span class="t">of collected certificates may already be noncompliant at the time of collection.</span>
          </div>
          <div class="feature-strip">
            <div class="item">
              <span class="icon-tile">${ic("clock")}</span>
              <div><h3>Save Time</h3><p>Replace manual certificate reviews with one automated check.</p></div>
            </div>
            <div class="item">
              <span class="icon-tile">${ic("shield-check")}</span>
              <div><h3>Reduce Risk</h3><p>Catch missing coverage and endorsements before they cost you.</p></div>
            </div>
            <div class="item">
              <span class="icon-tile">${ic("trending-up")}</span>
              <div><h3>Build Confidence</h3><p>Know every certificate matches the contract behind it.</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="photo-band">
          <img src="assets/img/photo-signing.webp" alt="Two people signing a contract at a wooden desk" loading="lazy">
          <div class="band-copy">
            <span class="eyebrow">Why it matters</span>
            <h2 class="h2">A certificate is only a snapshot.</h2>
            <p>Only a review of the actual policies and endorsements against the contract can determine whether the required coverage is in place.</p>
            <div class="band-actions">
              <a href="how-it-works.html" class="btn btn-primary">See How It Works ${ic("arrow-right")}</a>
              <a href="contact.html" class="btn btn-light">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </section>`, "CertSmart reviews contracts and insurance policies, verifies every requirement, and prepares the certificate of insurance. Patent-pending compliance technology.");

// ---------------------------------------------------------------- About
const board = [
  ["KA", "Karen Adamsbaum", "Founder", "Founded CertSmart and brings more than 20 years of insurance experience to shaping how the platform creates certificates and checks policies against contract requirements."],
  ["FC", "Frank R Coppola III", "Chief Executive Officer", "Leads CertSmart&rsquo;s business strategy and operations and guides the company&rsquo;s next stage of growth."],
  ["KD", "Kan Devnani", "Chief Technology Officer", "Leads the architecture and engineering of CertSmart&rsquo;s platform."],
  ["DB", "David Bernardino", "Chief Marketing Officer", "Leads CertSmart&rsquo;s brand and marketing strategy."],
  ["GS", "Gregory Stouffer", "Director", "Leads investor outreach and helps shape CertSmart&rsquo;s fundraising strategy."],
  ["JW", "Jeffrey Williams", "Director", "Leads CertSmart on building industry relationships and developing strategic partnerships."],
];
const people = board.map(([i, n, r, b]) => `          <article class="person">
            <div class="person-top"><span class="ini">${i}</span><div><h4>${n}</h4><span class="role">${r}</span></div></div>
            <p>${b}</p>
          </article>`).join("\n");
const benefits = [["shield-check", "Reduce Risk", "Identify coverage gaps early and prevent costly compliance failures."],
  ["clock", "Save Time", "Automate the manual work of reviewing agreements, policies and certificates."],
  ["target", "Improve Accuracy", "Policies are checked requirement by requirement against the contract."],
  ["circle-check", "Stay Compliant", "Continuous tracking and monitoring keeps you audit ready."]];
const ben = benefits.map(([k, h, p]) => `          <div class="benefit">
            <span class="icon-tile">${ic(k)}</span>
            <div><h3>${h}</h3><p>${p}</p></div>
          </div>`).join("\n");
page("about.html", "About CertSmart | Smarter Compliance, Stronger Confidence", "page-about", `    <section class="section">
      <div class="wrap split">
        <div class="split-copy">
          <span class="eyebrow">About CertSmart</span>
          <h1 class="h1">Smarter Compliance.<span class="soft">Stronger Confidence.</span></h1>
          <div class="prose">
            <p class="lead">A certificate of insurance is a snapshot of coverage&mdash;it doesn&rsquo;t prove a contract&rsquo;s requirements are met. Only a review of the actual policies and endorsements can.</p>
            <p>CertSmart is a proprietary platform for insurance verification, contract analysis and certificate management. It helps organizations prepare, manage and track certificates that hold up to the contract.</p>
          </div>
          <a href="how-it-works.html" class="btn btn-primary">See How It Works ${ic("arrow-right")}</a>
        </div>
        <div class="device-panel">
          <img src="assets/img/dashboard-mockup.webp" alt="CertSmart dashboard on laptop and mobile showing certificates reviewed, compliant count, exceptions, pending items, and recent activity." width="1000" height="600">
        </div>
      </div>
    </section>

    <section class="section section--tight-top">
      <div class="wrap">
        <div class="benefits">
${ben}
        </div>
      </div>
    </section>

    <section class="section section--tight-top">
      <div class="wrap photo-split">
        <div class="photo-frame">
          <img src="assets/img/photo-policy-review.webp" alt="Two people reviewing an insurance policy form together at a desk" loading="lazy">
          <div class="photo-badge"><span class="icon-tile">${ic("award")}</span><div><b>20+ years in insurance</b><small>Industry expertise guiding every review</small></div></div>
        </div>
        <div>
          <span class="eyebrow">Our approach</span>
          <h2 class="h2">Insurance expertise, built into the software.</h2>
          <div class="prose">
            <p class="lead">CertSmart was founded by an insurance professional who is also a software developer. That experience shapes how the platform creates certificates and checks policies against contract requirements.</p>
          </div>
          <ul class="fact-list">
            <li>${ic("award")}<span><b>Certified Insurance Counselor</b> with 20+ years in the industry</span></li>
            <li>${ic("repeat")}<span><b>13 years</b> of software development</span></li>
            <li>${ic("shield-check")}<span><b>Patent-pending</b> proprietary technology</span></li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="wrap board">
        <div class="board-head">
          <span class="eyebrow">Leadership</span>
          <h2 class="h2">Advisory board</h2>
        </div>
        <div class="board-grid">
${people}
        </div>
      </div>
    </section>`, "CertSmart is a proprietary platform for insurance verification, contract analysis and certificate management, founded by insurance professional Karen Adamsbaum, CIC.");

// ---------------------------------------------------------------- How it works
// data-start = where each step begins in the demo video (seconds)
const steps = [["1", "Upload Agreement", "Upload the subcontractor agreement. CertSmart identifies the insurance it requires.", "file-up", 0],
  ["2", "Upload Policies", "Add the required policies&mdash;general liability, auto, umbrella, workers&rsquo; comp and E&amp;O.", "upload", 15.5],
  ["3", "Compliance Review &amp; COI", "Every requirement is checked and the certificate of insurance is prepared.", "file-check", 34]];
const st = steps.map(([n, h, p, k, t], i) => `            <li class="step${i === 0 ? " is-active" : ""}" data-start="${t}">
              <span class="step-num"><span class="n">${n}</span>${ic("check", "icon done-icon")}</span>
              <button type="button" class="step-body" aria-pressed="${i === 0}">
                <span class="step-text"><span class="step-title">${h}</span><span class="step-desc">${p}</span></span>${ic(k)}
                <span class="step-progress" aria-hidden="true"><span></span></span>
              </button>
            </li>`).join("\n");
page("how-it-works.html", "How It Works | CertSmart", "page-how", `    <section class="section">
      <div class="wrap how-grid">
        <div class="how-copy">
          <span class="eyebrow">How It Works</span>
          <h1 class="h1">From Agreement<span class="soft">to Compliance.</span></h1>
          <p class="steps-label">Three Simple Steps <span class="steps-hint">${ic("play")} Click a step to see it in the demo</span></p>
          <ol class="steps" data-steps>
${st}
          </ol>
        </div>
        <div class="video-frame">
          <video controls preload="metadata" poster="assets/video/demo-poster.jpg?v=20261125a" playsinline>
            <source src="assets/video/how-it-works-demo.mp4?v=20261125a" type="video/mp4">
            Your browser does not support embedded video. You can
            <a href="assets/video/how-it-works-demo.mp4?v=20261125a">download the video</a> instead.
          </video>
        </div>
      </div>
    </section>

    <section class="section section--tight-top">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="eyebrow">The result</span>
            <h2 class="h2">A certificate you can stand behind.</h2>
          </div>
          <p>Not just a document&mdash;a verified record of what the contract requires and what the policies provide.</p>
        </div>
        <div class="feature-strip">
          <div class="item">
            <span class="icon-tile">${ic("circle-check")}</span>
            <div><h3>Requirements checklist</h3><p>Each coverage, limit and endorsement marked as met or missing.</p></div>
          </div>
          <div class="item">
            <span class="icon-tile">${ic("file-check")}</span>
            <div><h3>Certificate of insurance</h3><p>A completed COI, ready to download and share.</p></div>
          </div>
          <div class="item">
            <span class="icon-tile">${ic("award")}</span>
            <div><h3>Carrier ratings</h3><p>A.M. Best ratings for every insurer on the certificate.</p></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="wrap voices">
        <div class="voices-head">
          <span class="eyebrow">Testimonials</span>
          <h2 class="h2">What people say</h2>
        </div>
        <div class="quotes">
          <figure class="quote quote--dark">
            ${QUOTE}
            <p>&ldquo;CertSmart helps identify missing coverage, required endorsements, and insurance deficiencies before they become costly problems. It saves time, reduces back-and-forth with insurance agents, and gives everyone involved&mdash;from the parties signing the contract to insurance carriers&mdash;greater confidence that contractual insurance requirements are being met.&rdquo;</p>
            <figcaption><b>John M.</b>, Agency Owner</figcaption>
          </figure>
          <figure class="quote">
            ${QUOTE}
            <p>&ldquo;CertSmart takes the risk, complexity, and headaches out of insurance contract compliance. It simplifies the process for everyone involved&mdash;from the parties signing the contract to insurance agents and carriers&mdash;while helping reduce costly coverage gaps and potential disputes.&rdquo;</p>
            <figcaption><b>Maria O.</b>, Insurance Professional</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="photo-band">
          <img src="assets/img/photo-plans.webp" alt="Engineer in a hard hat pointing at building plans on a large screen" loading="lazy" style="object-position: 70% 30%;">
          <div class="band-copy">
            <span class="eyebrow">Get started</span>
            <h2 class="h2">See what your certificates are hiding.</h2>
            <p>Book a 20-minute call and we&rsquo;ll show you exactly what CertSmart finds in your current certificates.</p>
            <div class="band-actions">
              <a href="contact.html" class="btn btn-primary">Contact Us ${ic("arrow-right")}</a>
            </div>
          </div>
        </div>
      </div>
    </section>`, "Upload the agreement, upload the policies, and CertSmart checks every requirement and prepares the certificate of insurance. See the three-step process.");

// ---------------------------------------------------------------- Vision
const future = [["zap", "Faster Compliance", "Shorten every review and verification cycle, from agreement to certificate."],
  ["shield-alert", "Reduced Risk", "Identify gaps early and prevent compliance failures."],
  ["award", "Expert-Driven Accuracy", "Industry expertise guiding every review and validation."],
  ["repeat", "Operational Efficiency", "Automate repetitive tasks so teams can focus on exceptions."],
  ["users", "Stronger Partnerships", "Build trust with subcontractors, vendors, agents and carriers."],
  ["dashboard", "Complete Visibility", "Real-time dashboards and actionable insights across every certificate."]];
const fu = future.map(([k, h, p], i) => `          <article class="future-card">
            <div class="future-top"><span class="future-icon">${ic(k)}</span><span class="future-num">0${i + 1}</span></div>
            <h3>${h}</h3>
            <p>${p}</p>
          </article>`).join("\n");
page("vision.html", "Our Vision | CertSmart", "page-vision", `    <section class="vision-hero">
      <div class="vision-copy-wrap">
        <div class="vision-copy">
          <span class="eyebrow">Founder's Vision</span>
          <h1 class="h1">Born from Experience.<span class="soft">Built to Simplify Compliance.</span></h1>
          <div class="prose">
            <p class="lead">I&rsquo;ve spent more than twenty years in insurance and risk management, with a background in software development. I share that real-world insight on my podcast, <b>Risk Intelligence</b>, on Apple, Spotify, Google and Podbean.</p>
            <p>Having witnessed firsthand the disconnect between contractual insurance requirements, certificates of insurance, and actual policy coverage, I was inspired to create CertSmart to help bridge that gap.</p>
          </div>
        </div>
      </div>
      <div class="portrait">
        <img src="assets/img/karen-photo.webp" alt="Karen Adamsbaum, founder of CertSmart, smiling in an office setting." class="karen" width="900" height="804">
        <blockquote class="portrait-quote">
          <p>&ldquo;Compliance should enhance clarity and confidence, not create delays.&rdquo;</p>
          <cite>Karen Adamsbaum, CIC, Founder</cite>
        </blockquote>
      </div>
    </section>

    <section class="section section--alt">
      <div class="wrap">
        <div class="future-head">
          <span class="eyebrow">Looking ahead</span>
          <h2 class="h2">The Future We're Building</h2>
        </div>
        <div class="future-grid">
${fu}
        </div>
      </div>
    </section>`, "Founder Karen Adamsbaum, CIC, on why she built CertSmart: to close the gap between contract insurance requirements, certificates and actual policy coverage.");

// ---------------------------------------------------------------- Contact
page("contact.html", "Contact Us | CertSmart", "page-contact", `    <section class="section">
      <div class="wrap contact-grid">
        <div class="contact-copy">
          <span class="eyebrow">Contact Us</span>
          <h1 class="h1">See What Your Certificates <span class="mark">Are Hiding.</span></h1>
          <div class="prose">
            <p class="lead">Questions about CertSmart? We&rsquo;d love to hear from you.</p>
            <p>Share your details and we&rsquo;ll schedule a 20-minute call to show you exactly what CertSmart finds in your current certificates.</p>
          </div>
          <ol class="expect">
            <li><span class="expect-num">1</span><span><b>Tell us about your contracts</b> and the insurance they require.</span></li>
            <li><span class="expect-num">2</span><span><b>We review your current certificates</b> against those requirements.</span></li>
            <li><span class="expect-num">3</span><span><b>See the gaps</b>, requirement by requirement.</span></li>
          </ol>
          <ul class="info-list">
            <li><span class="icon-tile">${ic("mail")}</span><div><a href="mailto:info@certsmart.ai">info@certsmart.ai</a><small>We reply within one business day</small></div></li>
            <li><span class="icon-tile">${ic("phone")}</span><div><a href="tel:+19086332040">908-633-2040</a></div></li>
            <li><span class="icon-tile">${ic("map-pin")}</span><div><span>Nationwide Service</span><small>Supporting companies across the U.S.</small></div></li>
          </ul>
        </div>

        <div class="form-card">
          <h2 class="h2">Book your 20-minute call</h2>
          <!--
            FORM SETUP: connected to Formspree (formspree.io). Submissions
            deliver to the inbox configured on the Formspree dashboard.
            To change the destination or endpoint, update the account at
            formspree.io and swap the URL in the form's action attribute below.
          -->
          <form id="contact-form" action="https://formspree.io/f/xwlkgrvr" method="POST">
            <div class="form-row">
              <div class="form-group">
                <label for="full-name">Full Name*</label>
                <input type="text" id="full-name" name="full_name" autocomplete="name" required>
              </div>
              <div class="form-group">
                <label for="company-name">Company Name*</label>
                <input type="text" id="company-name" name="company_name" autocomplete="organization" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="email">Email*</label>
                <input type="email" id="email" name="email" autocomplete="email" required>
              </div>
              <div class="form-group">
                <label for="describes-you">What best describes you?*</label>
                <select id="describes-you" name="describes_you" required>
                  <option value="" disabled selected>Select one</option>
                  <option value="General Contractor">General Contractor</option>
                  <option value="Subcontractor">Subcontractor</option>
                  <option value="Insurance Agent / Broker">Insurance Agent / Broker</option>
                  <option value="Vendor / Service Provider">Vendor / Service Provider</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div class="form-group" id="other-specify-group" hidden>
              <label for="other-specify">If Other, please specify:</label>
              <input type="text" id="other-specify" name="other_specify">
            </div>
            <div class="form-group">
              <label for="message">Your Message*</label>
              <textarea id="message" name="message" required rows="6"></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Request my call</button>
            <p class="form-status" id="form-status" role="status" aria-live="polite"></p>
            <p class="form-note">${ic("lock")}Your information is kept private and is never shared.</p>
          </form>
          <div class="form-success" id="form-success" hidden tabindex="-1" role="status" aria-live="polite">
            <span class="success-icon">${ic("check")}</span>
            <h3 id="form-success-title">Thanks for contacting us!</h3>
            <p>One of our team will reach out to you shortly&mdash;usually within one business day&mdash;to schedule your 20-minute call.</p>
            <p class="form-success-alt">Need us sooner? Call <a href="tel:+19086332040">908-633-2040</a> or email <a href="mailto:info@certsmart.ai">info@certsmart.ai</a>.</p>
            <button type="button" class="btn btn-ghost" id="form-again">Send another message</button>
          </div>
        </div>
      </div>
    </section>`, "Book a 20-minute call with CertSmart and see exactly what your current certificates of insurance are missing. Nationwide service.");

console.log("built:", fs.readdirSync(OUT).filter(f => f.endsWith(".html")).join(", "));
