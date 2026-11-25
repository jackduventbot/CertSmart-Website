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
