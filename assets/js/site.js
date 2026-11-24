(function () {
  "use strict";

  // Footer year
  var year = String(new Date().getFullYear());
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = year; });

  // Contact form: submit to Web3Forms without leaving the page.
  // Without JavaScript the form still posts normally and Web3Forms shows its own confirmation page.
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var button = form.querySelector('button[type="submit"]');

  function show(msg, kind) {
    status.textContent = msg;
    status.className = "form-status full" + (kind ? " " + kind : "");
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
