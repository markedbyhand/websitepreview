/* ============================================================
   MARKED BY HAND — site chrome
   Injects the shared header + footer into every page so nav lives
   in ONE place. To add the template to any page (including your
   quote / night-light / engrave tools):
     1. <link rel="stylesheet" href="theme.css">
     2. <div id="site-header"></div>  ... your content ...  <div id="site-footer"></div>
     3. <script src="site.js"></script>  (just before </body>)
   Edit NAV and TOOLS below to change links sitewide.
   ============================================================ */

(function () {
  "use strict";

  /* ---- single source of truth for navigation ---- */
  const NAV = [
    { label: "Shop", href: "shop.html" },
    { label: "Custom orders", href: "quote.html" },
    { label: "About", href: "about.html" },
    { label: "Contact", href: "contact.html" },
  ];

  // Tools dropdown — point these at your real tool files.
  const TOOLS = [
    { label: "Instant quote", href: "quote.html", desc: "Drop a DXF, get a price on the spot", status: "live", icon: "tag" },
    { label: "Night light builder", href: "night-light.html", desc: "Turn line-art + a name into a layered DXF", status: "live", icon: "bulb" },
    { label: "Engraving previewer", href: "engrave-preview.html", desc: "See your text on the product before you order", status: "beta", icon: "eye" },
    { label: "3D Printing Quote", href: "print-quote.html", desc: "We do 3D printing", status: "beta", icon: "eye" }, 
    { label: "Owner Tools", href: "owner.html", desc: "SHH Secret", status: "beta", icon: "eye" }, 
  ];

  const SOCIAL = [
    { label: "Instagram", href: "#", icon: "ig" },
    { label: "Facebook", href: "#", icon: "fb" },
    { label: "Email", href: "mailto:hello@markedbyhand.com.au", icon: "mail" },
  ];

  const ico = {
    tag: '<path d="M3 7v5l8 8 6-6-8-8H3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="7" cy="11" r="1.4" fill="currentColor"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.7.6 1 1.2 1 2h6c0-.8.3-1.4 1-2A6 6 0 0012 3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    chev: '<path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    cart: '<path d="M4 5h2l2 11h9l2-7H7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="20" r="1.3" fill="currentColor"/><circle cx="17" cy="20" r="1.3" fill="currentColor"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    ig: '<rect x="4" y="4" width="16" height="16" rx="4.5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="16.5" cy="7.5" r="1" fill="currentColor"/>',
    fb: '<path d="M14 8h2V5h-2.2C12 5 11 6.3 11 8v1.5H9V13h2v6h3v-6h2.2L17 9.5h-3V8.2c0-.5.2-.7.7-.7z" fill="currentColor"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.5"/>',
  };

  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const isActive = (href) => href.toLowerCase() === here;

  function svg(name, cls) {
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true">' + (ico[name] || "") + "</svg>";
  }

  /* ---------- HEADER ---------- */
  function header() {
    const links = NAV.map(
      (n) => `<a class="navlink ${isActive(n.href) ? "active" : ""}" href="${n.href}">${n.label}</a>`
    ).join("");

    const toolsMenu = TOOLS.map(
      (t) => `<a class="dd-item" href="${t.href}">
        ${svg(t.icon, "di-ic")}
        <span><b>${t.label}</b><small>${t.desc}</small></span>
      </a>`
    ).join("");

    const mtools = TOOLS.map((t) => `<a class="sub" href="${t.href}">${t.label}</a>`).join("");
    const mlinks = NAV.map((n) => `<a href="${n.href}">${n.label}</a>`).join("");

    return `
    <header class="top">
      <div class="wrap top-inner">
        <a class="brand" href="index.html">
          <span class="mark" aria-hidden="true"></span>
          <span><b>Marked By Hand</b><small>Laser &amp; handmade · Sydney</small></span>
        </a>
        <nav class="nav" aria-label="Primary">
          ${links}
          <div class="dd" id="ddTools">
            <button class="navlink" id="ddBtn" aria-haspopup="true" aria-expanded="false">Tools ${svg("chev","dd-chev")}</button>
            <div class="dd-menu" role="menu">${toolsMenu}</div>
          </div>
        </nav>
        <a class="cartbtn desk" href="cart.html" aria-label="Cart">${svg("cart")}<span>Cart</span><span class="ct" id="cartCount">0</span></a>
        <button class="burger" id="burger" aria-label="Menu" aria-expanded="false">${svg("menu")}</button>
      </div>
      <div class="mnav wrap" id="mnav">
        ${mlinks}
        <div class="mhead">Tools</div>
        ${mtools}
        <a href="cart.html">Cart (<span id="cartCountM">0</span>)</a>
      </div>
    </header>`;
  }

  /* ---------- FOOTER ---------- */
  function footer() {
    const toolLinks = TOOLS.map((t) => `<a href="${t.href}">${t.label}</a>`).join("");
    const soc = SOCIAL.map(
      (s) => `<a href="${s.href}" aria-label="${s.label}">${svg(s.icon)}</a>`
    ).join("");
    return `
    <footer class="site-foot">
      <div class="wrap foot-top">
        <div class="foot-brand">
          <a class="brand" href="index.html"><span class="mark" aria-hidden="true"></span>
            <span><b>Marked By Hand</b><small>Built by hand, naturally</small></span></a>
          <h3>Custom, cut &amp; engraved in Sydney</h3>
          <p>A two-person home workshop. We design it, price it on the spot, and make it on a CO₂ laser — then post it to your door.</p>
        </div>
        <div class="foot-col">
          <h4>Shop</h4>
          <a href="shop.html">All products</a>
          <a href="shop.html#gifts">Personalised gifts</a>
          <a href="shop.html#homewares">Homewares</a>
          <a href="shop.html#nightlights">Night lights</a>
        </div>
        <div class="foot-col">
          <h4>Make something</h4>
          ${toolLinks}
        </div>
        <div class="foot-col">
          <h4>Help</h4>
          <a href="faq.html">FAQ</a>
          <a href="policies.html#shipping">Shipping</a>
          <a href="policies.html#returns">Returns</a>
          <a href="contact.html">Contact</a>
        </div>
      </div>
      <div class="wrap foot-bottom">
        <span class="fm">// MARKED BY HAND · ABN 00 000 000 000 · © <span id="yr"></span></span>
        <span class="fsoc">${soc}</span>
      </div>
    </footer>`;
  }

  /* ---------- mount + behaviour ---------- */
  function mount() {
    const h = document.getElementById("site-header");
    const f = document.getElementById("site-footer");
    if (h) h.innerHTML = header();
    if (f) f.innerHTML = footer();

    const yr = document.getElementById("yr");
    if (yr) yr.textContent = new Date().getFullYear();

    // tools dropdown
    const dd = document.getElementById("ddTools");
    const ddBtn = document.getElementById("ddBtn");
    if (dd && ddBtn) {
      ddBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = dd.classList.toggle("open");
        ddBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      document.addEventListener("click", () => {
        dd.classList.remove("open");
        ddBtn.setAttribute("aria-expanded", "false");
      });
    }

    // mobile drawer
    const burger = document.getElementById("burger");
    const mnav = document.getElementById("mnav");
    if (burger && mnav) {
      burger.addEventListener("click", () => {
        const open = mnav.classList.toggle("open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    refreshCart();
  }

  /* ---------- cart stub (Shopify replaces this later) ---------- */
  // Reads a simple in-memory count other pages can set via window.MBH.setCart(n).
  let _cart = 0;
  function refreshCart() {
    const a = document.getElementById("cartCount");
    const b = document.getElementById("cartCountM");
    if (a) a.textContent = _cart;
    if (b) b.textContent = _cart;
  }
  window.MBH = {
    setCart(n) { _cart = n | 0; refreshCart(); },
    addToCart() { _cart += 1; refreshCart(); },
    nav: NAV, tools: TOOLS,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
