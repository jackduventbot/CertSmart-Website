// CertSmart — main.js
document.addEventListener("DOMContentLoaded", function () {
  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    function setOpen(open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }
    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("open"));
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) setOpen(false);
    });
  }

  // How It Works: steps are linked to the demo video. Clicking a step jumps
  // the video to that part; while it plays, the matching step lights up and
  // its progress bar fills. Start times come from each step's data-start.
  var stepList = document.querySelector("[data-steps]");
  var demo = document.querySelector(".video-frame video");
  if (stepList && demo) {
    var steps = Array.prototype.slice.call(stepList.querySelectorAll(".step"));
    var starts = steps.map(function (s) { return parseFloat(s.getAttribute("data-start")) || 0; });

    function render(t) {
      var dur = demo.duration || 0;
      var active = 0;
      for (var i = 0; i < starts.length; i++) if (t >= starts[i]) active = i;
      steps.forEach(function (s, i) {
        var end = i + 1 < starts.length ? starts[i + 1] : dur;
        var p = i < active ? 1 : i > active ? 0 : end > starts[i] ? (t - starts[i]) / (end - starts[i]) : 0;
        s.classList.toggle("is-active", i === active);
        s.classList.toggle("is-done", i < active || (demo.ended && i === active));
        s.querySelector(".step-body").setAttribute("aria-pressed", i === active ? "true" : "false");
        s.querySelector(".step-progress span").style.width = Math.max(0, Math.min(1, p)) * 100 + "%";
      });
      stepList.style.setProperty("--p", dur ? Math.min(1, t / dur) : 0);
    }

    steps.forEach(function (s, i) {
      var btn = s.querySelector(".step-body");
      btn.addEventListener("click", function () {
        demo.currentTime = starts[i];
        render(starts[i]);
        var play = demo.play();
        if (play && play.catch) play.catch(function () {});
      });
      // Arrow keys move between steps
      btn.addEventListener("keydown", function (e) {
        var next = e.key === "ArrowDown" ? i + 1 : e.key === "ArrowUp" ? i - 1 : -1;
        if (next >= 0 && next < steps.length) {
          e.preventDefault();
          steps[next].querySelector(".step-body").focus();
        }
      });
    });

    ["timeupdate", "seeked", "loadedmetadata", "ended"].forEach(function (ev) {
      demo.addEventListener(ev, function () { render(demo.currentTime); });
    });
  }

  // Contact form: show/require "If Other, please specify" only when
  // "Other" is chosen in the "What best describes you?" dropdown.
  var describesSelect = document.getElementById("describes-you");
  var otherGroup = document.getElementById("other-specify-group");
  var otherInput = document.getElementById("other-specify");
  if (describesSelect && otherGroup && otherInput) {
    describesSelect.addEventListener("change", function () {
      if (describesSelect.value === "Other") {
        otherGroup.hidden = false;
        otherInput.required = true;
        otherInput.focus();
      } else {
        otherGroup.hidden = true;
        otherInput.required = false;
        otherInput.value = "";
      }
    });
  }

  // Contact form submission (Formspree).
  // Endpoint is set in contact.html's form action attribute.
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      var status = document.getElementById("form-status");
      var action = form.getAttribute("action") || "";
      var button = form.querySelector('button[type="submit"]');

      function show(msg, kind) {
        if (!status) return;
        status.textContent = msg;
        status.className = "form-status show " + kind;
      }

      e.preventDefault();
      if (!action || action.indexOf("YOUR_FORM_ID") !== -1) {
        show("Form backend not yet connected. See README.txt for setup instructions.", "error");
        return;
      }

      if (button) { button.disabled = true; button.textContent = "Sending…"; }
      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            if (otherGroup) otherGroup.hidden = true;
            show("Thanks! Your message has been sent.", "success");
          } else {
            show("Something went wrong. Please try again or email us directly.", "error");
          }
        })
        .catch(function () {
          show("Something went wrong. Please try again or email us directly.", "error");
        })
        .then(function () {
          if (button) { button.disabled = false; button.textContent = "Submit"; }
        });
    });
  }
});
