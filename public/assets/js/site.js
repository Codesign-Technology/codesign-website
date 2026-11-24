(function () {
  "use strict";

  // Slide-in menu
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("site-menu");
  if (toggle && menu) {
    var closeBtn = menu.querySelector(".menu-close");
    var open = function () {
      menu.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open");
      (menu.querySelector("a") || closeBtn).focus();
    };
    var close = function () {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
      toggle.focus();
    };
    toggle.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) close(); });
    document.addEventListener("click", function (e) {
      if (!menu.hidden && !menu.contains(e.target) && e.target !== toggle) close();
    });
  }

  // Contact form: submit to Web3Forms without leaving the page.
  // Without JavaScript the form still posts normally and Web3Forms shows its own confirmation page.
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var button = form.querySelector('button[type="submit"]');

  function show(msg, kind) {
    status.textContent = msg;
    status.className = "form-status" + (kind ? " " + kind : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      var bad = form.querySelector(":invalid");
      show("Please add your first name and a valid email address.", "err");
      if (bad) bad.focus();
      return;
    }
    if (form.botcheck && form.botcheck.checked) return; // honeypot tripped: silently drop

    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    data.name = [data.first_name, data.last_name].filter(Boolean).join(" ");
    data.replyto = data.email;

    button.disabled = true;
    show("Sending…");

    fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && res.j.success !== false) {
          form.reset();
          show("Thanks, your message has been sent. We'll be in touch soon.", "ok");
        } else {
          show("Sorry, your message couldn't be sent. Please email hello@codesign.technology instead.", "err");
        }
      })
      .catch(function () {
        show("Sorry, your message couldn't be sent. Please email hello@codesign.technology instead.", "err");
      })
      .then(function () { button.disabled = false; });
  });
})();
