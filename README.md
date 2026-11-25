# VESLORIA — Shopify Liquid Custom Theme

Custom Online Store 2.0 Shopify Liquid theme engineered from the **VESLORIA — Luxury Skincare** Framer design system.

## Architecture & Latest Shopify Standards
- **Online Store 2.0 JSON Templates** across Home, Collections Directory, Collection Detail, Shop All (`collection.shop-all`), Formulation Detail (`product`), Shopping Bag (`cart`), Search (`search`), 404, Password, and Editorial/Policy pages (`about`, `ritual-guide`, `contact`, `shipping`, `returns`, `terms`, `disclaimer`).
- **Theme Blocks (`/blocks`) & `{% content_for 'blocks' %}`** supporting `@theme` and `@app` blocks (`eyebrow-heading`, `ritual-button`, `pillar-card`, `accordion-item`, `sections/flexible-canvas.liquid`).
- **Section Groups** (`sections/header-group.json`, `sections/footer-group.json`) with sticky header, announcement bar, and multi-column footer.
- **New Customer Accounts Ready**: Integrates `<shopify-account menu="customer-account-main-menu">` in the header and omits deprecated `templates/customers/*.liquid` files.
- **Self-Hosted Webfonts** (`Boska`, `Switzer`, `Geist Mono` `.woff2` served from `assets/` via `preload_tag` and `asset_url`) — zero external font dependencies or `RemoteAsset` warnings.
- **Color Schemes (`color_scheme_group`)**:
  - `scheme-1`: Pure White (`#FFFFFF` / `#161616`)
  - `scheme-2`: Alabaster Surface (`#F6F5F2` / `#161616`)
  - `scheme-3`: Deep Olive Clay (`#3D423A` / `#FFFFFF`)
  - `scheme-4`: Mineral Ink (`#161616` / `#FFFFFF`)
- **Fluid Responsive Design**: `clamp()` typography and spacing tuned across Desktop (`1440px`), Tablet (`810px`), and Mobile (`390px`).

## Recommended Metafields (Shopify Admin → Settings → Custom Data)
- **Products**:
  - `custom.step_or_batch` (`single_line_text_field`, e.g. `STEP 01 · CLEANSE`)
  - `custom.sku_reference` (`single_line_text_field`, e.g. `VSL-001`)
  - `custom.texture` (`single_line_text_field`, e.g. `Silk-milk emulsion`)
  - `custom.volume_summary` (`single_line_text_field`, e.g. `100 ML · 200 ML`)
  - `custom.technical_strip` (`single_line_text_field`, e.g. `SILK-MILK · pH 5.2–5.6 · AM / PM · FRAGRANCE-FREE`)
  - `custom.option_helper_note` (`single_line_text_field`)
  - `custom.formulation_notes` (`multi_line_text_field`)
  - `custom.key_actives_inci` (`multi_line_text_field`)
  - `custom.application_ritual` (`multi_line_text_field`)
- **Collections**:
  - `custom.reference` (`single_line_text_field`, e.g. `01 / CORE COLLECTION · VSL-CO-001`)
  - `custom.subtitle` (`single_line_text_field`, e.g. `Equilibrium, daily.`)
  - `custom.editorial_title` (`single_line_text_field`)
  - `custom.editorial_body` (`multi_line_text_field`)

## Verification
```bash
shopify theme check --fail-level warning
```
