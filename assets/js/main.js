/* Portfolio Eva Desboeufs — comportements du site (langue + révélations) */
(function () {
  var root = document.documentElement;
  root.classList.add("js");

  /* ---------- Langue ----------
     1. Si le visiteur a déjà choisi FR ou EN, on respecte ce choix.
     2. Sinon, on suit la langue du navigateur (français -> FR, autre -> EN).
     La redirection n'a lieu qu'à l'arrivée sur le site (pas en navigation interne). */
  var KEY = "eva-lang";
  var pageLang = root.lang.slice(0, 2);
  var switchLink = document.querySelector("[data-lang-switch]");

  function store(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
  }
  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  if (switchLink) {
    switchLink.addEventListener("click", function () {
      store(switchLink.getAttribute("hreflang"));
    });
  }

  var fromOutside = !document.referrer || document.referrer.indexOf(location.host) === -1;
  if (switchLink && fromOutside) {
    var wanted = read();
    if (!wanted) {
      var nav = (navigator.languages && navigator.languages[0]) || navigator.language || "fr";
      wanted = nav.toLowerCase().indexOf("fr") === 0 ? "fr" : "en";
    }
    if (wanted !== pageLang && switchLink.getAttribute("hreflang") === wanted) {
      location.replace(switchLink.href);
      return;
    }
  }

  /* ---------- Révélation douce au défilement ---------- */
  var items = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  items.forEach(function (el) { io.observe(el); });
})();
