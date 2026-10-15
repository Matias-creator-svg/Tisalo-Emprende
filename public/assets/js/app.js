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
    units: 'tisaleo_units_v1',
    lots: 'tisaleo_inventory_lots_v1',
  };

  const VALID_SECTORS = ['Agropecuario', 'Artesanal', 'Textil', 'Gastronómico', 'Turístico'];
  const DEFAULT_UNITS = [
    { id: 'u-unidad', name: 'Unidad', abbreviation: 'un.', magnitude: 'Conteo', system: true },
    { id: 'u-libra', name: 'Libra', abbreviation: 'lb', magnitude: 'Peso', system: true },
    { id: 'u-kilogramo', name: 'Kilogramo', abbreviation: 'kg', magnitude: 'Peso', system: true },
    { id: 'u-litro', name: 'Litro', abbreviation: 'L', magnitude: 'Volumen', system: true },
    { id: 'u-frasco', name: 'Frasco', abbreviation: 'frasco', magnitude: 'Conteo', system: true },
    { id: 'u-canasta', name: 'Canasta', abbreviation: 'can.', magnitude: 'Conteo', system: true },
    { id: 'u-par', name: 'Par', abbreviation: 'par', magnitude: 'Conteo', system: true },
    { id: 'u-arroba', name: 'Arroba', abbreviation: '@', magnitude: 'Peso', system: true },
  ];

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
  const profileSector = () => {
    const profile = safeParse(localStorage.getItem(KEYS.profile), {});
    return VALID_SECTORS.includes(profile?.sector) ? profile.sector : 'Agropecuario';
  };
  const normalizeProduct = (p) => ({
    ...p,
    id: String(p.id),
    stock: Number(p.stock || 0),
    minimum: Number(p.minimum || 0),
    price: Number(p.price || 0),
    active: p.active !== false,
    status: p.active === false ? 'Inactivo' : 'Activo',
    image: p.image || '',
  });
  const normalizeService = (s) => {
    const status = s.status || (s.active === false ? 'Inactivo' : 'Activo');
    const sector = VALID_SECTORS.includes(s.sector) ? s.sector : profileSector();
    return {
      ...s,
      id: String(s.id),
      code: s.code || `SER-${String(s.id).replace(/[^a-z0-9]/gi, '').slice(-8).toUpperCase()}`,
      sector,
      unit: s.unit || 'Servicio',
      status,
      active: status === 'Activo',
      startDate: s.startDate || s.updatedDate || '',
      endDate: s.endDate || '',
      price: Number(s.price || 0),
    };
  };

  window.TisaleoDemoStore = {
    validSectors: VALID_SECTORS,

    getProducts(seed = []) {
      const existing = safeParse(localStorage.getItem(KEYS.products), null);
      if (Array.isArray(existing)) {
        const normalized = existing.map(normalizeProduct);
        localStorage.setItem(KEYS.products, JSON.stringify(normalized));
        return normalized;
      }
      const oldStock = safeParse(localStorage.getItem(KEYS.stock), {});
      const initial = seed.map(p => normalizeProduct({ ...p, stock: Object.prototype.hasOwnProperty.call(oldStock, String(p.id)) ? Number(oldStock[String(p.id)]) : Number(p.stock || 0) }));
      localStorage.setItem(KEYS.products, JSON.stringify(initial));
      return initial;
    },
    saveProducts(items) { localStorage.setItem(KEYS.products, JSON.stringify(uniqueById(items.map(normalizeProduct)))); },
    addProduct(product) {
      const items = this.getProducts([]);
      const record = normalizeProduct({ ...product, id: String(product.id || `p-${Date.now()}`) });
      items.unshift(record); this.saveProducts(items); return record;
    },
    updateProduct(id, patch, seed = []) {
      const items = this.getProducts(seed);
      const idx = items.findIndex(p => String(p.id) === String(id));
      if (idx < 0) return null;
      items[idx] = normalizeProduct({ ...items[idx], ...patch, id: items[idx].id, updatedDate: nowParts().date });
      this.saveProducts(items);
      return items[idx];
    },
    toggleProduct(id, seed = []) {
      const p = this.getProduct(id, seed);
      return p ? this.updateProduct(id, { active: p.active === false, status: p.active === false ? 'Activo' : 'Inactivo' }, seed) : null;
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
      const existing = safeParse(localStorage.getItem(KEYS.services), null);
      if (Array.isArray(existing)) {
        const normalized = existing.map(normalizeService);
        localStorage.setItem(KEYS.services, JSON.stringify(normalized));
        return normalized;
      }
      const initial = seed.map(normalizeService);
      localStorage.setItem(KEYS.services, JSON.stringify(initial));
      return initial;
    },
    saveServices(items) { localStorage.setItem(KEYS.services, JSON.stringify(uniqueById(items.map(normalizeService)))); },
    addService(service) {
      const items = this.getServices([]);
      const record = normalizeService({ ...service, id: String(service.id || `s-${Date.now()}`) });
      items.unshift(record); this.saveServices(items); return record;
    },
    updateService(id, patch, seed = []) {
      const items = this.getServices(seed);
      const idx = items.findIndex(s => String(s.id) === String(id));
      if (idx < 0) return null;
      items[idx] = normalizeService({ ...items[idx], ...patch, id: items[idx].id, updatedDate: nowParts().date });
      this.saveServices(items);
      return items[idx];
    },
    toggleService(id, seed = []) {
      const s = this.getServices(seed).find(x => String(x.id) === String(id));
      if (!s) return null;
      const next = s.active === false ? 'Activo' : 'Inactivo';
      return this.updateService(id, { status: next, active: next === 'Activo' }, seed);
    },

    getUnits() {
      const existing = safeParse(localStorage.getItem(KEYS.units), null);
      if (Array.isArray(existing) && existing.length) {
        const merged = uniqueById([...DEFAULT_UNITS, ...existing]);
        localStorage.setItem(KEYS.units, JSON.stringify(merged));
        return merged;
      }
      localStorage.setItem(KEYS.units, JSON.stringify(DEFAULT_UNITS));
      return [...DEFAULT_UNITS];
    },
    addUnit(unit) {
      const units = this.getUnits();
      const name = String(unit.name || '').trim();
      if (!name) return null;
      const duplicate = units.find(u => u.name.toLowerCase() === name.toLowerCase());
      if (duplicate) return duplicate;
      const record = { id: unit.id || `u-${Date.now()}`, name, abbreviation: String(unit.abbreviation || '').trim(), magnitude: unit.magnitude || 'Conteo', system: false };
      units.push(record); localStorage.setItem(KEYS.units, JSON.stringify(units)); return record;
    },

    getLots(productId = null) {
      const all = safeParse(localStorage.getItem(KEYS.lots), []);
      const items = Array.isArray(all) ? all.map(l => ({ ...l, id: String(l.id), productId: String(l.productId), quantity: Number(l.quantity || 0), cost: Number(l.cost || 0) })) : [];
      return productId == null ? items : items.filter(l => String(l.productId) === String(productId));
    },
    saveLots(items) { localStorage.setItem(KEYS.lots, JSON.stringify(uniqueById(items))); },
    addLot(lot) {
      const items = this.getLots();
      const record = {
        id: String(lot.id || `lot-${Date.now()}-${Math.random().toString(36).slice(2,6)}`),
        productId: String(lot.productId),
        code: String(lot.code || '').trim() || `LT-${String(Date.now()).slice(-6)}`,
        quantity: Number(lot.quantity || 0),
        originalQuantity: Number(lot.originalQuantity ?? lot.quantity ?? 0),
        expiryDate: lot.expiryDate || '',
        receivedDate: lot.receivedDate || nowParts().date,
        cost: Number(lot.cost || 0),
        origin: String(lot.origin || '').trim(),
        notes: String(lot.notes || '').trim(),
        createdAt: Date.now(),
      };
      items.push(record); this.saveLots(items); return record;
    },
    consumeLots(productId, quantity, preferredLotId = null) {
      const qty = Number(quantity || 0);
      if (qty <= 0) return [];
      const all = this.getLots();
      const productLots = all.filter(l => String(l.productId) === String(productId) && Number(l.quantity) > 0);
      const byPriority = (a, b) => {
        const ax = a.expiryDate || '9999-12-31';
        const bx = b.expiryDate || '9999-12-31';
        return ax.localeCompare(bx) || String(a.receivedDate || '').localeCompare(String(b.receivedDate || '')) || Number(a.createdAt || 0) - Number(b.createdAt || 0);
      };
      productLots.sort(byPriority);
      if (preferredLotId) productLots.sort((a,b) => String(a.id) === String(preferredLotId) ? -1 : String(b.id) === String(preferredLotId) ? 1 : byPriority(a,b));
      let remaining = qty;
      const allocations = [];
      for (const lot of productLots) {
        if (remaining <= 0) break;
        const take = Math.min(Number(lot.quantity), remaining);
        if (take <= 0) continue;
        lot.quantity = Number(lot.quantity) - take;
        remaining -= take;
        allocations.push({ lotId: lot.id, code: lot.code, quantity: take, expiryDate: lot.expiryDate || '' });
        const original = all.find(x => String(x.id) === String(lot.id));
        if (original) original.quantity = lot.quantity;
      }
      this.saveLots(all);
      return allocations;
    },

    getMovements(seed = []) {
      const stored = safeParse(localStorage.getItem(KEYS.movements), []);
      const storedIds = new Set((Array.isArray(stored) ? stored : []).map(i => String(i.id)));
      return [...(Array.isArray(stored) ? stored : []), ...seed.filter(i => !storedIds.has(String(i.id)))].sort((a,b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
    },
    addMovement(movement) {
      const items = safeParse(localStorage.getItem(KEYS.movements), []);
      let sequence = Number(localStorage.getItem(KEYS.movementSequence) || 300); sequence += 1; localStorage.setItem(KEYS.movementSequence, String(sequence));
      const current = nowParts();
      const entry = {
        id: movement.id || `KDX-${String(sequence).padStart(4,'0')}`,
        ...current,
        date: movement.date || current.date,
        time: movement.time || current.time,
        user: 'María S.',
        ...movement,
      };
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
    toastMessage.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
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
