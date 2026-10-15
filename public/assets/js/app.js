(() => {
  const KEYS = {
    stock: 'tisaleo_inventory_stock_v2',
    products: 'tisaleo_products_v2',
    services: 'tisaleo_services_v2',
    movements: 'tisaleo_kardex_movements_v2',
    movementSequence: 'tisaleo_kardex_sequence_v2',
    sales: 'tisaleo_sales_v2',
    saleSequence: 'tisaleo_sale_sequence_v2',
    profile: 'tisaleo_business_profile_v2',
    modules: 'tisaleo_business_modules_v2',
  };

  const safeParse = (value, fallback) => {
    try { const parsed = JSON.parse(value); return parsed ?? fallback; } catch (_) { return fallback; }
  };
  const nowParts = () => {
    const now = new Date();
    return {
      date: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`,
      time: `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,
      createdAt: now.getTime(),
    };
  };
  const uniqueById = (items) => {
    const map = new Map();
    items.forEach(item => map.set(String(item.id), item));
    return [...map.values()];
  };

  window.TisaleoDemoStore = {
    getProducts(seed = []) {
      const existing = safeParse(localStorage.getItem(KEYS.products), null);
      if (Array.isArray(existing)) return existing;
      const oldStock = safeParse(localStorage.getItem(KEYS.stock), {});
      const initial = seed.map(p => ({ ...p, id: String(p.id), stock: Object.prototype.hasOwnProperty.call(oldStock, String(p.id)) ? Number(oldStock[String(p.id)]) : Number(p.stock || 0) }));
      localStorage.setItem(KEYS.products, JSON.stringify(initial));
      return initial;
    },
    saveProducts(items) { localStorage.setItem(KEYS.products, JSON.stringify(uniqueById(items))); },
    addProduct(product) {
      const items = this.getProducts([]);
      const record = { ...product, id: String(product.id || `p-${Date.now()}`) };
      items.unshift(record); this.saveProducts(items); return record;
    },
    getProduct(id, seed = []) { return this.getProducts(seed).find(p => String(p.id) === String(id)); },
    setStock(productId, value, seed = []) {
      const items = this.getProducts(seed);
      const found = items.find(p => String(p.id) === String(productId));
      if (found) { found.stock = Number(value); found.updatedDate = nowParts().date; this.saveProducts(items); }
      const stock = safeParse(localStorage.getItem(KEYS.stock), {}); stock[String(productId)] = Number(value); localStorage.setItem(KEYS.stock, JSON.stringify(stock));
    },
    getStock(productId, fallback, seed = []) {
      const found = this.getProduct(productId, seed);
      return found ? Number(found.stock) : Number(fallback || 0);
    },

    getServices(seed = []) {
      const normalize = (s) => {
        const status = s.status || (s.active === false ? 'Inactivo' : 'Activo');
        return {
          ...s,
          id: String(s.id),
          code: s.code || `SER-${String(s.id).replace(/[^a-z0-9]/gi, '').slice(-8).toUpperCase()}`,
          sector: s.sector || 'Servicios',
          unit: s.unit || 'Servicio',
          status,
          active: status === 'Activo',
          startDate: s.startDate || s.updatedDate || '',
          endDate: s.endDate || '',
        };
      };
      const existing = safeParse(localStorage.getItem(KEYS.services), null);
      if (Array.isArray(existing)) {
        const normalized = existing.map(normalize);
        localStorage.setItem(KEYS.services, JSON.stringify(normalized));
        return normalized;
      }
      const initial = seed.map(normalize);
      localStorage.setItem(KEYS.services, JSON.stringify(initial));
      return initial;
    },
    saveServices(items) { localStorage.setItem(KEYS.services, JSON.stringify(uniqueById(items))); },
    addService(service) { const items = this.getServices([]); const record = { ...service, id: String(service.id || `s-${Date.now()}`) }; items.unshift(record); this.saveServices(items); return record; },

    getMovements(seed = []) {
      const stored = safeParse(localStorage.getItem(KEYS.movements), []);
      const storedIds = new Set((Array.isArray(stored) ? stored : []).map(i => String(i.id)));
      return [...(Array.isArray(stored) ? stored : []), ...seed.filter(i => !storedIds.has(String(i.id)))].sort((a,b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
    },
    addMovement(movement) {
      const items = safeParse(localStorage.getItem(KEYS.movements), []);
      let sequence = Number(localStorage.getItem(KEYS.movementSequence) || 300); sequence += 1; localStorage.setItem(KEYS.movementSequence, String(sequence));
      const entry = { id: movement.id || `KDX-${String(sequence).padStart(4,'0')}`, ...nowParts(), user: 'María S.', ...movement };
      items.unshift(entry); localStorage.setItem(KEYS.movements, JSON.stringify(items.slice(0,500))); return entry;
    },

    getSales(seed = []) {
      const stored = safeParse(localStorage.getItem(KEYS.sales), []);
      const storedIds = new Set((Array.isArray(stored) ? stored : []).map(i => String(i.id)));
      return [...(Array.isArray(stored) ? stored : []), ...seed.filter(i => !storedIds.has(String(i.id)))].sort((a,b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
    },
    addSale(sale) {
      const items = safeParse(localStorage.getItem(KEYS.sales), []);
      let sequence = Number(localStorage.getItem(KEYS.saleSequence) || 100); sequence += 1; localStorage.setItem(KEYS.saleSequence, String(sequence));
      const record = { id: sale.id || `V-${String(sequence).padStart(5,'0')}`, ...nowParts(), ...sale };
      items.unshift(record); localStorage.setItem(KEYS.sales, JSON.stringify(items.slice(0,500))); return record;
    },

    getProfile() {
      return safeParse(localStorage.getItem(KEYS.profile), {
        businessName: 'Huerto Andino', ruc: '1792456789001', representative: 'María Sánchez', phone: '099 555 0123', sector: 'Agropecuario', address: 'Centro de Tisaleo'
      });
    },
    saveProfile(profile) { localStorage.setItem(KEYS.profile, JSON.stringify(profile)); this.applyProfile(); },
    getModules() { return safeParse(localStorage.getItem(KEYS.modules), { products: true, services: true }); },
    saveModules(modules) { localStorage.setItem(KEYS.modules, JSON.stringify(modules)); },
    applyProfile() {
      const profile = this.getProfile();
      document.querySelectorAll('[data-business-name]').forEach(el => el.textContent = profile.businessName || 'Huerto Andino');
      document.querySelectorAll('[data-business-sector]').forEach(el => el.textContent = profile.sector || 'Agropecuario');
      const initials = String(profile.businessName || 'HA').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,2).toUpperCase();
      document.querySelectorAll('[data-business-initials]').forEach(el => el.textContent = initials);
    },
    nowParts,
  };

  const sidebar = document.getElementById('sidebar');
  const menuButton = document.getElementById('menuButton');
  const mobileClose = document.getElementById('mobileClose');
  const backdrop = document.getElementById('backdrop');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer;
  const refreshIcons = () => window.lucide?.createIcons({ attrs: { 'stroke-width': 1.8 } });
  const setMenu = (open) => { sidebar?.classList.toggle('sidebar-open', open); backdrop?.classList.toggle('visible', open); document.body.classList.toggle('menu-open', open); };
  menuButton?.addEventListener('click', () => setMenu(true)); mobileClose?.addEventListener('click', () => setMenu(false)); backdrop?.addEventListener('click', () => setMenu(false));

  const showToast = (message) => {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  };
  window.showToast = showToast;
  document.querySelectorAll('.js-toast').forEach(el => el.addEventListener('click', () => showToast(el.dataset.message || 'Acción realizada')));

  const globalSearch = document.querySelector('.search input');
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); globalSearch?.focus(); }
    if (event.key === 'Escape') setMenu(false);
  });
  window.TisaleoDemoStore.applyProfile();
  refreshIcons();
})();
