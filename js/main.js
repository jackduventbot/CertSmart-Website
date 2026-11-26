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

  // Home hero: three muted background clips play in sequence and crossfade.
  // Progress bars show the current clip (click to jump); the round button pauses.
  // Pauses when off screen or the tab is hidden; no autoplay for reduced motion.
  var film = document.querySelector("[data-film]");
  if (film) {
    var clips = Array.prototype.slice.call(film.querySelectorAll(".film video"));
    var dots = Array.prototype.slice.call(film.querySelectorAll(".film-dot"));
    var toggleBtn = film.querySelector(".film-toggle");
    var FADE = 1.2; // seconds of overlap between clips
    var current = 0, userPaused = false, inView = true, switching = false;
    var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function setPausedUI(paused) {
      toggleBtn.setAttribute("aria-pressed", paused ? "true" : "false");
      toggleBtn.setAttribute("aria-label", paused ? "Play background video" : "Pause background video");
    }
    function shouldPlay() { return !userPaused && inView && !document.hidden; }
    function playClip(v) {
      var p = v.play();
      if (p && p.catch) p.catch(function () { userPaused = true; setPausedUI(true); });
    }
    function show(i) {
      var prev = clips[current];
      current = i;
      var next = clips[i];
      next.currentTime = 0;
      clips.forEach(function (v, k) { v.classList.toggle("is-on", k === i); });
      dots.forEach(function (d, k) {
        d.classList.toggle("is-on", k === i);
        if (k === i) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
        d.querySelector("span").style.setProperty("--p", k < i ? 1 : 0);
      });
      if (shouldPlay()) playClip(next);
      // let the previous clip finish its fade, then stop it
      setTimeout(function () { if (prev !== clips[current]) prev.pause(); switching = false; }, FADE * 1000);
      // warm up the clip after this one
      clips[(i + 1) % clips.length].preload = "auto";
    }

    clips.forEach(function (v, i) {
      v.addEventListener("timeupdate", function () {
        if (i !== current || !v.duration) return;
        dots[i].querySelector("span").style.setProperty("--p", Math.min(1, v.currentTime / v.duration));
        if (!switching && v.duration - v.currentTime <= FADE) {
          switching = true;
          show((i + 1) % clips.length);
        }
      });
      // safety net if timeupdate misses the fade window
      v.addEventListener("ended", function () {
        if (i === current && !switching) { switching = true; show((i + 1) % clips.length); }
      });
    });

    dots.forEach(function (d, i) {
      d.addEventListener("click", function () {
        if (i === current) return;
        if (userPaused) { userPaused = false; setPausedUI(false); }
        switching = true;
        show(i);
      });
    });

    toggleBtn.addEventListener("click", function () {
      userPaused = !userPaused;
      setPausedUI(userPaused);
      if (userPaused) clips[current].pause(); else playClip(clips[current]);
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (shouldPlay()) playClip(clips[current]); else clips[current].pause();
      }, { threshold: 0.15 }).observe(film);
    }
    document.addEventListener("visibilitychange", function () {
      if (shouldPlay()) playClip(clips[current]); else clips[current].pause();
    });

    if (prefersReduced) { userPaused = true; setPausedUI(true); }
    else playClip(clips[0]);
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
            // swap the form for the thank-you panel, greeting by first name
            var nameField = form.querySelector('[name="full_name"]');
            var first = nameField ? nameField.value.trim().split(/\s+/)[0] : "";
            var card = form.closest(".form-card");
            var success = document.getElementById("form-success");
            var title = document.getElementById("form-success-title");
            form.reset();
            if (otherGroup) otherGroup.hidden = true;
            if (status) status.className = "form-status";
            if (success) {
              if (title) title.textContent = first ? "Thanks for contacting us, " + first + "!" : "Thanks for contacting us!";
              form.hidden = true;
              if (card) card.classList.add("is-sent");
              success.hidden = false;
              success.focus();
            } else {
              show("Thanks for contacting us! One of our team will reach out shortly.", "success");
            }
          } else {
            show("Something went wrong. Please try again or email us directly.", "error");
          }
        })
        .catch(function () {
          show("Something went wrong. Please try again or email us directly.", "error");
        })
        .then(function () {
          if (button) { button.disabled = false; button.textContent = "Request my call"; }
        });
    });

    // "Send another message" brings the form back
    var again = document.getElementById("form-again");
    if (again) {
      again.addEventListener("click", function () {
        var card = form.closest(".form-card");
        document.getElementById("form-success").hidden = true;
        if (card) card.classList.remove("is-sent");
        form.hidden = false;
        var firstField = form.querySelector("input");
        if (firstField) firstField.focus();
      });
    }
  }
});
