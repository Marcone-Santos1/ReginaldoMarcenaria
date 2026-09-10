/* ==========================================================================
   RGM Marcenaria
   ========================================================================== */

(function () {
  "use strict";

  var WA_NUMBER = "(11) 95024-9407";
  var WA_LINK =
    "https://wa.me/5511950249407?text=Ol%C3%A1%21%20Tentei%20enviar%20o%20formul%C3%A1rio%20do%20site%20e%20n%C3%A3o%20consegui.";

  /* ------------------------------------------------------------ helpers -- */

  function track(name, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params || {});
    }
  }

  /* ----------------------------------------------------- header sticky --- */

  var header = document.querySelector("header");

  if (header) {
    var ticking = false;

    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        header.classList.toggle("sticky", window.scrollY > 0);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------- menu mobile --- */

  var btnMobile = document.getElementById("btn-mobile");
  var nav = document.getElementById("nav");

  if (btnMobile && nav) {
    var setMenu = function (open) {
      nav.classList.toggle("active", open);
      btnMobile.setAttribute("aria-expanded", String(open));
      btnMobile.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    };

    btnMobile.addEventListener("click", function () {
      setMenu(!nav.classList.contains("active"));
    });

    // fecha ao clicar em um item do menu
    nav.addEventListener("click", function (e) {
      if (e.target.closest("#menu a")) setMenu(false);
    });

    // fecha com ESC
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("active")) setMenu(false);
    });
  }

  /* -------------------------------------------------- reveal on scroll --- */

  var reveals = document.querySelectorAll(".reveal");

  if (reveals.length) {
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("active");
              observer.unobserve(entry.target); // anima uma vez e para de observar
            }
          });
        },
        { rootMargin: "0px 0px -80px 0px", threshold: 0.05 }
      );

      reveals.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // sem IntersectionObserver: mostra tudo
      reveals.forEach(function (el) {
        el.classList.add("active");
      });
    }
  }

  /* ---------------------------------------------- cliques de WhatsApp ---- */

  document.addEventListener("click", function (e) {
    var link = e.target.closest("[data-wa]");
    if (!link) return;
    track("contato_whatsapp", {
      origem: link.getAttribute("data-wa"),
      transport_type: "beacon"
    });
  });

  /* ------------------------------------------------- mascara telefone ---- */

  var tel = document.getElementById("telefone");

  function maskPhone(value) {
    var d = value.replace(/\D/g, "").slice(0, 11);
    if (!d) return "";
    if (d.length <= 2) return "(" + d;
    if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length <= 10)
      return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
  }

  if (tel) {
    tel.addEventListener("input", function (e) {
      e.target.value = maskPhone(e.target.value);
    });
  }

  /* ------------------------------------------------------- formulario ---- */

  var form = document.getElementById("form");
  var button = document.getElementById("formButton");
  var status = document.getElementById("formStatus");

  function setStatus(state, html) {
    if (!status) return;
    status.className = "formStatus" + (state ? " is-" + state : "");
    status.innerHTML = html || "";
  }

  function setLoading(loading) {
    if (!button) return;
    if (loading) {
      button.setAttribute("disabled", "disabled");
      button.textContent = "Enviando...";
    } else {
      button.removeAttribute("disabled");
      button.textContent = "Enviar pedido de orçamento";
    }
  }

  if (form) {
    form.addEventListener("submit", async function (e) {
      // O form tem action="https://api.web3forms.com/submit", entao se este
      // script falhar ou nao carregar, o POST nativo ainda funciona.
      e.preventDefault();

      if (!form.reportValidity()) return;

      setLoading(true);
      setStatus("loading", "Enviando seu pedido...");

      // Enviamos FormData (multipart) de proposito: e um Content-Type
      // "CORS-safelisted", entao o navegador NAO faz requisicao preflight
      // OPTIONS. O endpoint do Web3Forms responde 403 a preflights (fica
      // atras do Cloudflare), o que faria um POST em JSON falhar sempre.
      var payload = new FormData(form);

      try {
        var res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: payload
        });

        var data = await res.json().catch(function () {
          return {};
        });

        if (res.ok && data.success) {
          // Sucesso confirmado pelo servidor -- so agora limpamos e avisamos.
          form.reset();
          setStatus(
            "success",
            "Pedido enviado! Entraremos em contato em breve. " +
              'Se preferir falar agora, chame no <a href="' +
              WA_LINK +
              '" target="_blank" rel="noopener">WhatsApp</a>.'
          );
          track("generate_lead", { method: "formulario_site" });
        } else {
          throw new Error(data.message || "Falha no envio (HTTP " + res.status + ")");
        }
      } catch (err) {
        // Os dados do usuario permanecem no formulario -- nada e perdido.
        setStatus(
          "error",
          "Não conseguimos enviar seu pedido agora. Chame no WhatsApp " +
            '<a href="' +
            WA_LINK +
            '" target="_blank" rel="noopener">' +
            WA_NUMBER +
            "</a> ou tente novamente em alguns instantes."
        );
        track("form_error", { mensagem: String((err && err.message) || err).slice(0, 100) });
      } finally {
        setLoading(false);
      }
    });
  }
})();
