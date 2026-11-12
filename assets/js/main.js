/* Portfolio Eva Desboeufs — comportements du site
   1. Langue (FR / EN)  2. Apparitions au défilement  3. Parallaxe */
(function () {
  var root = document.documentElement;
  root.classList.add("js");

  /* =========================================================
     1. Langue
     - Si le visiteur a déjà choisi FR ou EN, on respecte ce choix.
     - Sinon, on suit la langue du navigateur (français -> FR, autre -> EN).
     La redirection n'a lieu qu'à l'arrivée sur le site.
     ========================================================= */
  var KEY = "eva-lang";
  var pageLang = root.lang.slice(0, 2);
  var switchLink = document.querySelector("[data-lang-switch]");

  function store(value) { try { localStorage.setItem(KEY, value); } catch (e) {} }
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

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

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  /* =========================================================
     2. Préparation des effets (ajoutés ici pour garder le HTML simple)
     ========================================================= */

  // Images : rideau qui s'ouvre, direction qui change d'une image à l'autre
  var dirs = ["up", "left", "right", "center", "down"];
  all(".feature__media, .gallery figure, .strip figure").forEach(function (el, i) {
    el.classList.remove("reveal");
    el.classList.add("reveal-media");
    el.setAttribute("data-dir", dirs[i % dirs.length]);
  });

  // Textes des projets phares : glissent depuis le côté opposé à l'image
  all(".feature").forEach(function (f, i) {
    var text = f.querySelector(".feature__media + div, div.reveal");
    if (text) text.setAttribute("data-dir", i % 2 ? "left" : "right");
  });

  // Titres en capitales : apparition lettre par lettre
  all(".feature__title, .project-hero__text .title-xl, .contact__title").forEach(function (t) {
    var txt = t.textContent.trim();
    var chars = txt.split("").map(function (c, i) {
      return '<span class="char" style="--i:' + i + '">' + (c === " " ? " " : c) + "</span>";
    }).join("");
    t.innerHTML = '<span class="visually-hidden">' + txt + "</span>" +
      '<span class="split-mask" aria-hidden="true"><span class="split">' + chars + "</span></span>";
  });

  // Étapes du processus : apparition décalée
  all(".steps li").forEach(function (li, i) { li.style.transitionDelay = (i * 150) + "ms"; });

  // Image d'ouverture des pages projet : enveloppe pour la parallaxe interne
  all(".project-hero__img").forEach(function (img) {
    var wrap = document.createElement("div");
    wrap.className = "project-hero__media";
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
    img.setAttribute("data-speed", "0.25");
  });

  /* ---- Parallaxe : chaque élément a sa vitesse et sa direction ----
     data-speed : vertical (positif = plus lent que la page, négatif = plus rapide)
     data-x     : horizontal (positif = vers la droite en descendant) */
  function set(sel, attr, values) {
    all(sel).forEach(function (el, i) { el.setAttribute(attr, values[i % values.length]); });
  }
  set(".hero__bg", "data-speed", ["0.4"]);
  set(".hero__title .title-xl", "data-speed", ["-0.12"]);
  set(".signature", "data-x", ["0.35"]);
  set(".hero__lead, .hero__status, .hero__actions", "data-speed", ["0.08", "0.12", "0.16"]);
  set(".feature__media img", "data-speed", ["0.07"]);                // l'image bouge dans son cadre
  set(".feature__title .split-mask", "data-x", ["-0.25", "0.25"]);   // titres en sens opposés
  set(".section__head .title-l, .chapter__label", "data-x", ["0.12", "-0.12"]);
  set(".strip figure", "data-speed", ["0.06", "-0.08", "0.14"]);
  set(".gallery--pair figure", "data-speed", ["0.05", "-0.07"]);
  set(".gallery--trio figure", "data-speed", ["0.08", "-0.05", "0.12"]);
  set(".steps li", "data-speed", ["0.04", "-0.04", "0.08"]);
  set(".swatches span, .project-swatches span", "data-speed", ["-0.1", "0.06", "-0.16", "0.1"]);
  set(".marquee__row--a", "data-x", ["-0.6"]);
  set(".marquee__row--b", "data-x", ["0.6"]);

  // Éléments « libres » : ils bougent en continu (fonds, bandeau, accroche qui
  // quitte l'écran). Tous les autres s'arrêtent net une fois à leur place.
  all(".hero__bg, .hero__title .title-xl, .signature, .hero__lead, .hero__status, .hero__actions," +
      " .project-hero__img, .feature__media img, .marquee__row")
    .forEach(function (el) { el.setAttribute("data-free", ""); });

  /* =========================================================
     3. Apparitions au défilement
     ========================================================= */
  // (On mesure la position à chaque défilement plutôt qu'avec IntersectionObserver,
  //  qui ne « voit » pas un élément entièrement masqué par clip-path.)
  var pending = all(".reveal, .reveal-media, .split");
  if (reduce) {
    pending.forEach(function (el) { el.classList.add("is-visible"); });
    return; // pas de parallaxe si l'appareil demande moins d'animations
  }
  function revealVisible() {
    if (!pending.length) return;
    pending = pending.filter(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.9 && r.bottom > 0) { el.classList.add("is-visible"); return false; }
      return true;
    });
  }

  /* =========================================================
     4. Parallaxe (une seule boucle, calée sur l'affichage)
     ========================================================= */
  var layers = all("[data-speed], [data-x]").map(function (el) {
    return { el: el, sy: parseFloat(el.getAttribute("data-speed")) || 0,
             sx: parseFloat(el.getAttribute("data-x")) || 0,
             free: el.hasAttribute("data-free"), center: 0, land: 0 };
  });
  var vh = window.innerHeight;
  var factor = 1;
  var LAND = 0.6; // un élément est « en place » quand son centre atteint 60 % de l'écran

  function measure() {
    vh = window.innerHeight;
    factor = window.innerWidth < 760 ? 0.6 : 1; // plus doux sur téléphone
    var maxScroll = document.documentElement.scrollHeight - vh;
    layers.forEach(function (l) {
      l.el.style.setProperty("--px", "0px");
      l.el.style.setProperty("--py", "0px");
    });
    layers.forEach(function (l) {
      var r = l.el.getBoundingClientRect();
      l.center = r.top + window.scrollY + r.height / 2;
      // Position de défilement où l'élément se pose (jamais au-delà du bas de page,
      // sinon les éléments tout en bas n'arriveraient jamais à leur place)
      l.land = Math.max(0, Math.min(l.center - vh * LAND, maxScroll));
    });
    update();
  }

  var ticking = false;
  function update() {
    ticking = false;
    revealVisible();
    var y = window.scrollY;
    for (var i = 0; i < layers.length; i++) {
      var l = layers[i], off;
      if (l.free) {
        var d = l.center - y - vh / 2; // distance au centre de l'écran
        if (d > vh * 1.5 || d < -vh * 1.5) continue;
        off = -d;
      } else {
        // Reste à parcourir avant d'être en place : 0 = posé, l'élément ne bouge plus.
        // Courbe en carré : l'élément ralentit en douceur avant de s'arrêter.
        var rest = Math.min(l.land - y, vh * 1.5);
        off = rest > 0 ? -(rest * rest) / vh : 0;
        if (off === 0 && l.done) continue;
        l.done = off === 0;
      }
      if (l.sy) l.el.style.setProperty("--py", (off * l.sy * factor).toFixed(1) + "px");
      if (l.sx) l.el.style.setProperty("--px", (off * l.sx * factor).toFixed(1) + "px");
    }
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure);
  measure();
})();
