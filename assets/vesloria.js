(() => {
  const money = (c, cur) => `$${(Number(c || 0) / 100).toFixed(2).replace(/\.00$/, '')}${cur ? ' ' + cur : ''}`;

  class VesloriaCartDrawer extends HTMLElement {
    connectedCallback() {
      this.querySelectorAll('[data-cart-close]').forEach((el) => el.addEventListener('click', () => this.close()));
      this.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-cart-qty-change]');
        if (btn) this.updateLine(btn.dataset.key, Number(btn.dataset.quantity));
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.getAttribute('aria-hidden') === 'false') this.close();
      });
      document.querySelectorAll('[data-cart-open]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          if (window.Vesloria?.cartType === 'drawer') {
            e.preventDefault();
            this.open();
          }
        });
      });
    }

    open() {
      this.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    close() {
      this.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    async refresh() {
      const res = await fetch(`${window.Vesloria.routes.cart}.js`);
      this.renderCart(await res.json());
    }

    async updateLine(id, quantity) {
      const res = await fetch(`${window.Vesloria.routes.cartChange}.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, quantity })
      });
      this.renderCart(await res.json());
    }

    renderCart(cart) {
      document.querySelectorAll('[data-cart-count]').forEach((el) => { el.textContent = `(${cart.item_count})`; });
      const countEl = this.querySelector('[data-cart-drawer-count]');
      if (countEl) {
        countEl.textContent = `${String(cart.item_count).padStart(2, '0')} ${cart.item_count === 1 ? 'VESSEL' : 'VESSELS'} SELECTED`;
      }
      const itemsEl = this.querySelector('[data-cart-drawer-items]');
      const footerEl = this.querySelector('[data-cart-drawer-footer]');
      if (!itemsEl || !footerEl) return;

      if (!cart.items?.length) {
        footerEl.hidden = true;
        itemsEl.innerHTML = `<div class="vsl-drawer__empty"><h3 class="vsl-h3">Your bag is currently empty.</h3><p class="vsl-body-sm vsl-text-muted">Explore our daily Core Ritual staples and numbered Reserve formulations.</p><a href="${window.Vesloria.routes.root}collections/all" class="vsl-editorial-link">CONTINUE EXPLORING FORMULATIONS →</a></div>`;
        return;
      }

      footerEl.hidden = false;
      const cur = cart.currency || 'USD';
      const subEl = this.querySelector('[data-cart-drawer-subtotal]');
      const totEl = this.querySelector('[data-cart-drawer-total]');
      if (subEl) subEl.textContent = money(cart.total_price, cur);
      if (totEl) totEl.textContent = money(cart.total_price, cur);

      itemsEl.innerHTML = cart.items.map((item) => `
        <div class="vsl-drawer-item">
          <a href="${item.url}" class="vsl-drawer-item__media">
            ${item.image ? `<img src="${item.image}" alt="${item.product_title}" width="76" height="92" class="vsl-drawer-item__img" loading="lazy">` : ''}
          </a>
          <div class="vsl-drawer-item__body">
            <div class="vsl-drawer-item__top">
              <a href="${item.url}" class="vsl-drawer-item__title">${item.product_title}</a>
              <span class="vsl-drawer-item__price">${money(item.final_line_price, cur)}</span>
            </div>
            ${item.variant_title && item.variant_title !== 'Default Title' ? `<p class="vsl-mono-xs vsl-text-eyebrow">${item.variant_title}</p>` : ''}
            <div class="vsl-drawer-item__controls">
              <div class="vsl-qty-stepper">
                <button type="button" class="vsl-qty-btn" data-cart-qty-change data-key="${item.key}" data-quantity="${item.quantity - 1}" aria-label="Decrease">−</button>
                <span class="vsl-qty-val">${item.quantity}</span>
                <button type="button" class="vsl-qty-btn" data-cart-qty-change data-key="${item.key}" data-quantity="${item.quantity + 1}" aria-label="Increase">+</button>
              </div>
              <button type="button" class="vsl-remove-link vsl-mono-xs" data-cart-qty-change data-key="${item.key}" data-quantity="0">REMOVE</button>
            </div>
          </div>
        </div>`).join('');
    }
  }
  customElements.define('vsl-cart-drawer', VesloriaCartDrawer);

  class VesloriaMobileMenu extends HTMLElement {
    connectedCallback() {
      const btn = this.querySelector('[data-mobile-menu-toggle]');
      const drawer = this.querySelector('[data-mobile-drawer]');
      btn?.addEventListener('click', () => {
        const open = drawer?.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
        btn.textContent = open ? btn.dataset.closeLabel : btn.dataset.openLabel;
      });
    }
  }
  customElements.define('vsl-mobile-menu', VesloriaMobileMenu);

  class VesloriaAccordion extends HTMLElement {
    connectedCallback() {
      this.querySelectorAll('[data-accordion-trigger]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const panel = btn.closest('.vsl-accordion')?.querySelector('[data-accordion-panel]');
          const icon = btn.querySelector('.vsl-accordion__icon');
          if (!panel) return;
          const isOpen = btn.getAttribute('aria-expanded') === 'true';
          btn.setAttribute('aria-expanded', String(!isOpen));
          panel.hidden = isOpen;
          if (icon) icon.textContent = isOpen ? '+' : '−';
        });
      });
    }
  }
  customElements.define('vsl-accordion', VesloriaAccordion);

  class VesloriaProductForm extends HTMLElement {
    connectedCallback() {
      const form = this.querySelector('form');
      const submitBtn = this.querySelector('[data-add-to-bag]');
      const variantInput = this.querySelector('input[name="id"]');
      const priceEl = document.querySelector('[data-product-price]');
      const noteEl = this.querySelector('[data-variant-note]');

      this.querySelectorAll('[data-variant-tile]').forEach((tile) => {
        tile.addEventListener('click', () => {
          this.querySelectorAll('[data-variant-tile]').forEach((t) => t.classList.remove('is-active'));
          tile.classList.add('is-active');
          if (variantInput) variantInput.value = tile.dataset.variantId;
          if (priceEl && tile.dataset.variantPrice) priceEl.textContent = tile.dataset.variantPrice;
          if (noteEl && tile.dataset.variantNote) noteEl.textContent = tile.dataset.variantNote;
          if (submitBtn) {
            const avail = tile.dataset.variantAvailable === 'true';
            submitBtn.disabled = !avail;
            submitBtn.querySelector('span').textContent = avail ? window.Vesloria.strings.addToBag : window.Vesloria.strings.soldOut;
          }
        });
      });

      form?.addEventListener('submit', async (e) => {
        if (window.Vesloria?.cartType !== 'drawer' || !submitBtn) return;
        e.preventDefault();
        const span = submitBtn.querySelector('span');
        const orig = span.textContent;
        submitBtn.classList.add('vsl-btn--pending');
        span.textContent = window.Vesloria.strings.adding;
        try {
          const res = await fetch(`${window.Vesloria.routes.cartAdd}.js`, { method: 'POST', body: new FormData(form) });
          if (!res.ok) throw new Error();
          submitBtn.classList.remove('vsl-btn--pending');
          submitBtn.classList.add('vsl-btn--success');
          span.textContent = window.Vesloria.strings.added;
          const drawer = document.getElementById('VesloriaCartDrawer');
          if (drawer) { await drawer.refresh(); drawer.open(); }
          setTimeout(() => {
            submitBtn.classList.remove('vsl-btn--success');
            span.textContent = orig;
          }, 1400);
        } catch {
          submitBtn.classList.remove('vsl-btn--pending');
          submitBtn.classList.add('vsl-btn--error');
          span.textContent = orig;
        }
      });
    }
  }
  customElements.define('vsl-product-form', VesloriaProductForm);

  class VesloriaCollectionFilter extends HTMLElement {
    connectedCallback() {
      const tabs = this.querySelectorAll('[data-filter-tab]');
      const input = this.querySelector('[data-filter-search]');
      const resetBtn = this.querySelector('[data-filter-reset]');
      const cards = this.querySelectorAll('[data-product-card]');
      const emptyEl = this.querySelector('[data-filter-empty]');
      let activeCol = 'all';

      const apply = () => {
        const q = (input?.value || '').trim().toLowerCase();
        let visible = 0;
        cards.forEach((card) => {
          const show = (activeCol === 'all' || (card.dataset.collections || '').split(',').includes(activeCol))
            && (!q || (card.dataset.title || '').includes(q));
          card.hidden = !show;
          if (show) visible++;
        });
        if (emptyEl) emptyEl.hidden = visible > 0;
      };

      tabs.forEach((tab) => tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        activeCol = tab.dataset.filterTab;
        apply();
      }));

      input?.addEventListener('input', apply);
      resetBtn?.addEventListener('click', () => {
        activeCol = 'all';
        if (input) input.value = '';
        tabs.forEach((t) => t.classList.toggle('is-active', t.dataset.filterTab === 'all'));
        apply();
      });
    }
  }
  customElements.define('vsl-collection-filter', VesloriaCollectionFilter);
})();
