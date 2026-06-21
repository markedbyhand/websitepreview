# Marked By Hand — site structure

Workshop Dark theme, shared across every page. Built as static HTML so it works
now and drops cleanly behind Shopify / a backend after July 1.

## Files
```
theme.css        ← the whole design system. Edit tokens here, all pages restyle.
site.js          ← header + footer + nav. Edit links ONCE here, all pages update.
index.html       ← home page (the finished one)
shop.html        ← product grid + category filter   (sample data → Shopify feed)
product.html     ← single product + personalise hand-off (reads ?id=)
cart.html        ← cart/checkout slot (Shopify mounts here)
about.html       ← story
contact.html     ← contact form stub
faq.html         ← accordion
policies.html    ← shipping / returns / privacy / terms (tabs)
```

Your tool files sit alongside these and are linked from the nav:
`quote.html`, `night-light.html`, `engrave-preview.html`
(rename the links in site.js → TOOLS if your filenames differ).

## The page template — 3 lines to adopt it anywhere
To put any page (including your existing tools) into the site shell:

```html
<head>
  ...your fonts...
  <link rel="stylesheet" href="theme.css">     <!-- 1 -->
</head>
<body>
  <div id="site-header"></div>                  <!-- 2 -->
     ...page content...
  <div id="site-footer"></div>                  <!-- 2 -->
  <script src="site.js"></script>               <!-- 3 -->
</body>
```

Your quote tool already uses the exact same CSS variables, so linking theme.css
won't change its look — it just lets you delete the duplicated :root block and
share one source of truth.

## Where the funnel lives
preview → price → order is the "pipeline" section on the home page, each step
linking to the matching tool. product.html also hands off to the engraving
previewer and the quote tool. Keep that wording consistent as you build out.

## Editing nav / footer
All navigation, the tools dropdown, and footer columns are arrays at the top of
site.js (NAV, TOOLS, SOCIAL). Change them there once.
```
