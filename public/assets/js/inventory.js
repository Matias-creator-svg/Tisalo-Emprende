(() => {
  if (!document.getElementById('inventoryPage')) return;

  const store = window.TisaleoDemoStore;
  const seedProducts = JSON.parse(document.getElementById('inventoryProducts')?.textContent || '[]');
  const seedServices = JSON.parse(document.getElementById('inventoryServices')?.textContent || '[]');
  const $ = id => document.getElementById(id);
  const money = v => `$${Number(v || 0).toFixed(2)}`;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
  const toast = m => window.showToast?.(m);
  const icons = () => window.lucide?.createIcons({ attrs: { 'stroke-width': 1.8 } });
  const today = () => store.nowParts().date;

  let products = [];
  let services = [];
  let movementType = 'entry';
  let pendingImage = '';
  let editingKind = null;
  let editingId = null;
  let catalogReturnToOpen = false;
  let lotProductId = null;

  const refreshData = () => {
    products = store.getProducts(seedProducts).map(p => ({ ...p, id: String(p.id), stock: Number(p.stock), minimum: Number(p.minimum), price: Number(p.price), active: p.active !== false }));
    services = store.getServices(seedServices).map(s => ({ ...s, id: String(s.id), price: Number(s.price), active: s.active !== false }));
  };
  const statusOf = p => Number(p.stock) <= 0 ? 'Sin stock' : Number(p.stock) <= Number(p.minimum) ? 'Stock bajo' : 'Stock correcto';
  const commercialState = p => p.active === false ? 'Inactivo' : 'Activo';
  const serviceStatus = s => s.status || (s.active === false ? 'Inactivo' : 'Activo');
  const formatDate = value => {
    if (!value) return '—';
    const [y, m, d] = String(value).split('-');
    return y && m && d ? `${d}/${m}/${y}` : value;
  };
  const within = (date, from, to) => (!from || date >= from) && (!to || date <= to);
  const sectorOptions = (select, items) => {
    const current = select.value;
    const sectors = [...new Set(items.map(x => x.sector).filter(Boolean))].sort();
    select.innerHTML = '<option value="Todos">Todos los sectores</option>' + sectors.map(s => `<option>${esc(s)}</option>`).join('');
    if ([...select.options].some(o => o.value === current)) select.value = current;
  };
  const lotCount = productId => store.getLots(productId).filter(l => Number(l.quantity) > 0).length;

  function renderProducts() {
    refreshData();
    sectorOptions($('productSector'), products);
    const q = $('productSearch').value.trim().toLowerCase();
    const state = $('productStatus').value;
    const commercial = $('productCommercial').value;
    const sector = $('productSector').value;
    const from = $('productDateFrom').value;
    const to = $('productDateTo').value;
    const filtered = products.filter(p =>
      `${p.name} ${p.sku} ${p.description || ''}`.toLowerCase().includes(q) &&
      (state === 'Todos' || statusOf(p) === state) &&
      (commercial === 'Todos' || commercialState(p) === commercial) &&
      (sector === 'Todos' || p.sector === sector) &&
      within(p.updatedDate || '', from, to)
    );

    $('productsBody').innerHTML = filtered.map(p => {
      const st = statusOf(p);
      const active = commercialState(p);
      const lots = lotCount(p.id);
      return `<tr class="${active === 'Inactivo' ? 'catalog-row-inactive' : ''}">
        <td>
          <div class="inventory-product-cell">
            <div class="inventory-thumb">${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}">` : '<i data-lucide="package"></i>'}</div>
            <div><strong>${esc(p.name)}</strong><small>${esc(p.description || 'Sin descripción')}</small></div>
          </div>
        </td>
        <td><code>${esc(p.sku)}</code></td>
        <td>${esc(p.sector)}</td>
        <td>${esc(p.unit)}</td>
        <td><strong>${money(p.price)}</strong></td>
        <td><strong>${p.stock}</strong><small>${esc(p.unit)} · ${lots} lote${lots === 1 ? '' : 's'} activo${lots === 1 ? '' : 's'}</small></td>
        <td><span class="stock-state ${st === 'Stock correcto' ? 'ok' : st === 'Stock bajo' ? 'low' : 'empty'}">● ${esc(st)}</span><small>Mín. ${p.minimum}</small></td>
        <td><span class="commercial-state ${active === 'Activo' ? 'active' : 'inactive'}">${esc(active)}</span></td>
        <td>
          <div class="row-actions row-actions-v060">
            <button class="neutral-action" data-action="edit" data-id="${esc(p.id)}"><i data-lucide="pencil"></i> Editar</button>
            <button class="entry-action" data-action="entry" data-id="${esc(p.id)}"><i data-lucide="package-plus"></i> Registrar entrada</button>
            <button class="waste-action" data-action="waste" data-id="${esc(p.id)}"><i data-lucide="trash-2"></i> Registrar merma</button>
            <button class="neutral-action" data-action="lots" data-id="${esc(p.id)}"><i data-lucide="layers-3"></i> Lotes</button>
            <button class="toggle-action ${active === 'Activo' ? 'danger-soft' : 'success-soft'}" data-action="toggle" data-id="${esc(p.id)}"><i data-lucide="${active === 'Activo' ? 'pause-circle' : 'play-circle'}"></i> ${active === 'Activo' ? 'Deshabilitar' : 'Activar'}</button>
          </div>
        </td>
      </tr>`;
    }).join('') || '<tr><td colspan="9" class="empty-row">No hay productos que coincidan con los filtros.</td></tr>';

    const low = products.filter(p => p.active !== false && (statusOf(p) === 'Stock bajo' || statusOf(p) === 'Sin stock')).length;
    $('productVisibleCount').textContent = `${products.length} productos · ${filtered.length} visibles`;
    $('productFooterCount').textContent = `${filtered.length} registros`;
    $('lowStockFooter').textContent = `${low} alertas de stock bajo`;
    icons();
  }

  function renderServices() {
    refreshData();
    const q = $('serviceSearch').value.trim().toLowerCase();
    const stateFilter = $('serviceStatusFilter').value;
    const filtered = services.filter(s => `${s.name} ${s.description || ''}`.toLowerCase().includes(q) && (stateFilter === 'Todos' || serviceStatus(s) === stateFilter));

    $('servicesBody').innerHTML = filtered.map(s => {
      const state = serviceStatus(s);
      return `<tr class="${state === 'Inactivo' ? 'catalog-row-inactive' : ''}">
        <td><strong>${esc(s.name)}</strong></td>
        <td class="service-description">${esc(s.description || '—')}</td>
        <td><strong>${money(s.price)}</strong></td>
        <td><span class="stock-state ${state === 'Activo' ? 'ok' : 'empty'}">● ${esc(state)}</span></td>
        <td>${esc(formatDate(s.startDate))}</td>
        <td>${esc(formatDate(s.endDate))}</td>
        <td><div class="row-actions row-actions-service">
          <button class="neutral-action" data-service-action="edit" data-id="${esc(s.id)}"><i data-lucide="pencil"></i> Editar</button>
          <button class="toggle-action ${state === 'Activo' ? 'danger-soft' : 'success-soft'}" data-service-action="toggle" data-id="${esc(s.id)}"><i data-lucide="${state === 'Activo' ? 'pause-circle' : 'play-circle'}"></i> ${state === 'Activo' ? 'Deshabilitar' : 'Activar'}</button>
        </div></td>
      </tr>`;
    }).join('') || '<tr><td colspan="7" class="empty-row">No hay servicios que coincidan con la búsqueda.</td></tr>';

    $('serviceFooterCount').textContent = `${filtered.length} servicios`;
    icons();
  }

  // Tabs y filtros
  $('inventoryMainTabs').addEventListener('click', e => {
    const b = e.target.closest('button[data-panel]');
    if (!b) return;
    $('inventoryMainTabs').querySelectorAll('button').forEach(x => x.classList.toggle('active', x === b));
    ['productsPanel', 'servicesPanel'].forEach(id => $(id).hidden = id !== b.dataset.panel);
  });
  ['productSearch', 'productStatus', 'productCommercial', 'productSector', 'productDateFrom', 'productDateTo'].forEach(id => $(id).addEventListener(id.includes('Search') ? 'input' : 'change', renderProducts));
  $('serviceSearch').addEventListener('input', renderServices);
  $('serviceStatusFilter').addEventListener('change', renderServices);

  // Unidades de medida
  const unitsBackdrop = $('unitsBackdrop');
  function populateUnitSelect(selected = '') {
    const units = store.getUnits();
    $('catalogUnit').innerHTML = units.map(u => `<option value="${esc(u.name)}">${esc(u.name)}${u.abbreviation ? ` (${esc(u.abbreviation)})` : ''}</option>`).join('');
    if (selected && [...$('catalogUnit').options].some(o => o.value === selected)) $('catalogUnit').value = selected;
  }
  function renderUnits() {
    const units = store.getUnits();
    $('unitsCount').textContent = `${units.length} unidades`;
    $('unitsList').innerHTML = units.map(u => `<div class="unit-list-row"><div><strong>${esc(u.name)}</strong><small>${esc(u.abbreviation || 'Sin abreviatura')}</small></div><span>${esc(u.magnitude)}</span>${u.system ? '<em>Base</em>' : '<em>Personalizada</em>'}</div>`).join('');
    populateUnitSelect($('catalogUnit').value);
  }
  function openUnits(returnToCatalog = false) {
    catalogReturnToOpen = returnToCatalog;
    renderUnits();
    unitsBackdrop.hidden = false;
    document.body.classList.add('modal-open');
    setTimeout(() => $('unitName').focus(), 50);
  }
  function closeUnits() {
    unitsBackdrop.hidden = true;
    if (!catalogReturnToOpen || $('catalogModalBackdrop').hidden) document.body.classList.remove('modal-open');
    $('unitForm').reset();
  }
  $('manageUnitsButton').addEventListener('click', () => openUnits(false));
  $('openUnitsFromCatalog').addEventListener('click', () => openUnits(true));
  $('closeUnits').addEventListener('click', closeUnits);
  unitsBackdrop.addEventListener('click', e => { if (e.target === unitsBackdrop) closeUnits(); });
  $('unitForm').addEventListener('submit', e => {
    e.preventDefault();
    const before = store.getUnits().length;
    const unit = store.addUnit({ name: $('unitName').value, abbreviation: $('unitAbbreviation').value, magnitude: $('unitMagnitude').value });
    const after = store.getUnits().length;
    renderUnits();
    if (unit) $('catalogUnit').value = unit.name;
    toast(after > before ? 'Unidad de medida agregada' : 'Esa unidad ya estaba registrada');
    $('unitForm').reset();
  });

  // Catálogo: crear/editar
  const catalogBackdrop = $('catalogModalBackdrop');
  const setImagePreview = value => {
    pendingImage = value || '';
    $('catalogImagePreview').innerHTML = pendingImage ? `<img src="${esc(pendingImage)}" alt="Vista previa">` : '<i data-lucide="image"></i><span>Sin imagen</span>';
    icons();
  };
  const compressImage = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const max = 720;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  function syncCatalogKind() {
    const kind = $('catalogKindSelect').value;
    const product = kind === 'Producto';
    const editing = Boolean(editingId);
    $('catalogKind').value = kind;
    $('catalogModalTitle').textContent = editing ? (product ? 'Editar producto físico' : 'Editar servicio') : (product ? 'Nuevo producto físico' : 'Nuevo servicio');
    $('catalogModalEyebrow').textContent = product ? 'CATÁLOGO DE PRODUCTOS' : 'CATÁLOGO DE SERVICIOS';
    $('catalogModalHelp').textContent = product ? 'Administra la ficha comercial, unidad, alerta de stock y fotografía.' : 'Campos del servicio: Nombre, Descripción, Precio, Estado, Fecha Inicio y Fecha Fin.';
    document.querySelectorAll('.product-catalog-field').forEach(x => x.hidden = !product);
    document.querySelectorAll('.service-only').forEach(x => x.hidden = product);
    $('initialStockField').hidden = !product || editing;
    $('productEditNote').hidden = !product || !editing;
    const first = $('catalogPriceLabel').childNodes[0];
    if (first?.nodeType === Node.TEXT_NODE) first.nodeValue = product ? 'PVP / precio base' : 'Precio';
    $('catalogCode').required = product;
    $('catalogProductStatus').required = product;
    $('catalogServiceStatus').required = !product;
    $('catalogServiceStart').required = !product;
    $('saveCatalogButton').textContent = editing ? 'Guardar cambios' : 'Guardar registro';
  }

  function openCatalog(kind, id = null) {
    refreshData();
    editingKind = kind;
    editingId = id ? String(id) : null;
    $('catalogForm').reset();
    $('catalogEditId').value = editingId || '';
    $('catalogKindSelect').value = kind;
    $('catalogKind').value = kind;
    populateUnitSelect();
    setImagePreview('');

    if (kind === 'Producto') {
      const p = editingId ? products.find(x => String(x.id) === editingId) : null;
      if (p) {
        $('catalogCode').value = p.sku || '';
        $('catalogName').value = p.name || '';
        $('catalogDescription').value = p.description || '';
        $('catalogSector').value = p.sector || 'Agropecuario';
        populateUnitSelect(p.unit || 'Unidad');
        $('catalogPrice').value = Number(p.price || 0).toFixed(2);
        $('catalogMinimum').value = Number(p.minimum || 0);
        $('catalogProductStatus').value = p.active === false ? 'Inactivo' : 'Activo';
        setImagePreview(p.image || '');
      } else {
        $('catalogStock').value = '0';
        $('catalogMinimum').value = '2';
        $('catalogProductStatus').value = 'Activo';
        $('catalogSector').value = store.getProfile().sector || 'Agropecuario';
      }
    } else {
      const s = editingId ? services.find(x => String(x.id) === editingId) : null;
      if (s) {
        $('catalogName').value = s.name || '';
        $('catalogDescription').value = s.description || '';
        $('catalogPrice').value = Number(s.price || 0).toFixed(2);
        $('catalogServiceStatus').value = serviceStatus(s);
        $('catalogServiceStart').value = s.startDate || '';
        $('catalogServiceEnd').value = s.endDate || '';
      } else {
        $('catalogServiceStatus').value = 'Activo';
        $('catalogServiceStart').value = today();
      }
    }

    syncCatalogKind();
    catalogBackdrop.hidden = false;
    document.body.classList.add('modal-open');
    setTimeout(() => (kind === 'Producto' ? $('catalogCode') : $('catalogName')).focus(), 50);
    icons();
  }
  function closeCatalog() {
    catalogBackdrop.hidden = true;
    editingKind = null;
    editingId = null;
    pendingImage = '';
    document.body.classList.remove('modal-open');
  }

  $('newProductButton').addEventListener('click', () => openCatalog('Producto'));
  $('newServiceButton').addEventListener('click', () => openCatalog('Servicio'));
  $('closeCatalogModal').addEventListener('click', closeCatalog);
  $('cancelCatalogModal').addEventListener('click', closeCatalog);
  catalogBackdrop.addEventListener('click', e => { if (e.target === catalogBackdrop) closeCatalog(); });
  $('catalogImage').addEventListener('change', async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) { toast('Selecciona una imagen PNG, JPG o WEBP'); e.target.value = ''; return; }
    try {
      setImagePreview(await compressImage(file));
    } catch (_) { toast('No se pudo procesar la imagen'); }
  });
  $('removeCatalogImage').addEventListener('click', () => { $('catalogImage').value = ''; setImagePreview(''); });

  $('catalogForm').addEventListener('submit', e => {
    e.preventDefault();
    const kind = $('catalogKind').value;
    const name = $('catalogName').value.trim();
    const description = $('catalogDescription').value.trim();
    const price = Number($('catalogPrice').value || 0);
    if (!name) { toast('Ingresa un nombre'); return; }
    if (price < 0) { toast('El precio no puede ser negativo'); return; }

    if (kind === 'Producto') {
      const sku = $('catalogCode').value.trim();
      if (!sku) { toast('Ingresa el código SKU'); return; }
      const duplicate = products.find(p => p.sku.toLowerCase() === sku.toLowerCase() && String(p.id) !== String(editingId || ''));
      if (duplicate) { toast('Ya existe un producto con ese SKU'); return; }
      const active = $('catalogProductStatus').value === 'Activo';
      const common = {
        name, sku, sector: $('catalogSector').value, unit: $('catalogUnit').value,
        price, description, minimum: Number($('catalogMinimum').value || 0), image: pendingImage,
        active, status: active ? 'Activo' : 'Inactivo', updatedDate: today(), category: $('catalogSector').value,
      };
      if (editingId) {
        store.updateProduct(editingId, common, seedProducts);
        toast('Producto actualizado correctamente');
      } else {
        const stock = Number($('catalogStock').value || 0);
        const record = store.addProduct({ ...common, id: `p-${Date.now()}`, stock });
        if (record.stock > 0) {
          const autoLot = store.addLot({ productId: record.id, code: `INI-${record.sku}`, quantity: record.stock, receivedDate: today(), origin: 'Stock inicial', notes: 'Creación de producto' });
          store.addMovement({ productId: record.id, product: record.name, sku: record.sku, sector: record.sector, type: 'Entrada', detail: `Stock inicial · Lote ${autoLot.code}`, quantity: record.stock, unit: record.unit, previous: 0, final: record.stock, date: today() });
        }
        toast('Producto creado correctamente');
      }
      renderProducts();
    } else {
      const status = $('catalogServiceStatus').value;
      const startDate = $('catalogServiceStart').value;
      const endDate = $('catalogServiceEnd').value;
      if (endDate && startDate && endDate < startDate) { toast('La fecha fin no puede ser anterior a la fecha inicio'); return; }
      const data = {
        name, description, price, status, active: status === 'Activo', startDate, endDate,
        sector: store.getProfile().sector || 'Agropecuario', unit: 'Servicio', updatedDate: today(),
      };
      if (editingId) {
        store.updateService(editingId, data, seedServices);
        toast('Servicio actualizado correctamente');
      } else {
        store.addService({ ...data, id: `s-${Date.now()}`, code: `SER-${String(Date.now()).slice(-6)}` });
        toast('Servicio creado correctamente');
      }
      renderServices();
    }
    closeCatalog();
  });

  // Acciones de filas
  $('productsBody').addEventListener('click', e => {
    const b = e.target.closest('button[data-action]');
    if (!b) return;
    const id = b.dataset.id;
    if (b.dataset.action === 'edit') openCatalog('Producto', id);
    else if (b.dataset.action === 'entry') openMovement('entry', id);
    else if (b.dataset.action === 'waste') openMovement('waste', id);
    else if (b.dataset.action === 'lots') openLots(id);
    else if (b.dataset.action === 'toggle') {
      const updated = store.toggleProduct(id, seedProducts);
      renderProducts();
      toast(updated?.active === false ? 'Producto deshabilitado para la venta' : 'Producto activado para la venta');
    }
  });
  $('servicesBody').addEventListener('click', e => {
    const b = e.target.closest('button[data-service-action]');
    if (!b) return;
    const id = b.dataset.id;
    if (b.dataset.serviceAction === 'edit') openCatalog('Servicio', id);
    else if (b.dataset.serviceAction === 'toggle') {
      const updated = store.toggleService(id, seedServices);
      renderServices();
      toast(updated?.active === false ? 'Servicio deshabilitado' : 'Servicio activado');
    }
  });

  // Movimientos y lotes
  const movementBackdrop = $('movementBackdrop');
  function refreshWasteLots() {
    const id = $('movementProduct').value;
    const lots = store.getLots(id).filter(l => Number(l.quantity) > 0).sort((a,b) => (a.expiryDate || '9999-12-31').localeCompare(b.expiryDate || '9999-12-31') || String(a.receivedDate || '').localeCompare(String(b.receivedDate || '')));
    $('movementWasteLot').innerHTML = '<option value="">Aplicar PEPS/FIFO automáticamente</option>' + lots.map(l => `<option value="${esc(l.id)}">${esc(l.code)} · ${l.quantity} disponibles${l.expiryDate ? ` · vence ${formatDate(l.expiryDate)}` : ''}</option>`).join('');
  }
  function syncMovementProduct() {
    refreshData();
    const p = products.find(x => String(x.id) === $('movementProduct').value);
    $('movementUnit').value = p?.unit || '';
    refreshWasteLots();
  }
  function openMovement(type, id) {
    movementType = type;
    refreshData();
    $('movementForm').reset();
    $('movementProduct').innerHTML = products.map(p => `<option value="${esc(p.id)}">${esc(p.name)} · ${esc(p.sku)}</option>`).join('');
    $('movementProduct').value = String(id || products[0]?.id || '');
    $('movementDate').value = today();
    const waste = type === 'waste';
    $('movementTitle').textContent = waste ? 'Registrar merma' : 'Registrar entrada';
    $('movementEyebrow').textContent = waste ? 'SALIDA JUSTIFICADA' : 'ENTRADA DE INVENTARIO';
    $('movementHelp').textContent = waste ? 'Tipifica la salida y conserva la trazabilidad del lote descontado.' : 'Registra compra, producción propia o cosecha y, cuando aplique, su lote y vencimiento.';
    document.querySelectorAll('.entry-only').forEach(x => x.hidden = waste);
    document.querySelectorAll('.waste-only').forEach(x => x.hidden = !waste);
    $('movementJustification').required = waste;
    syncMovementProduct();
    movementBackdrop.hidden = false;
    document.body.classList.add('modal-open');
    icons();
  }
  function closeMovement() {
    movementBackdrop.hidden = true;
    document.body.classList.remove('modal-open');
    $('movementForm').reset();
  }
  $('movementProduct').addEventListener('change', syncMovementProduct);
  $('closeMovement').addEventListener('click', closeMovement);
  $('cancelMovement').addEventListener('click', closeMovement);
  movementBackdrop.addEventListener('click', e => { if (e.target === movementBackdrop) closeMovement(); });

  $('movementForm').addEventListener('submit', e => {
    e.preventDefault();
    const id = $('movementProduct').value;
    const p = store.getProduct(id, seedProducts);
    if (!p) return;
    const qty = Number($('movementQuantity').value || 0);
    const movementDate = $('movementDate').value || today();
    if (qty <= 0) { toast('Ingresa una cantidad válida'); return; }
    const previous = Number(p.stock || 0);

    if (movementType === 'entry') {
      const expiryDate = $('movementExpiry').value;
      if (expiryDate && expiryDate < movementDate) { toast('La fecha de vencimiento no puede ser anterior al ingreso'); return; }
      const final = previous + qty;
      const lot = store.addLot({
        productId: id,
        code: $('movementLot').value.trim() || `LT-${String(Date.now()).slice(-6)}`,
        quantity: qty,
        receivedDate: movementDate,
        expiryDate,
        cost: Number($('movementCost').value || 0),
        origin: $('movementOrigin').value,
        notes: $('movementJustification').value,
      });
      store.setStock(id, final, seedProducts);
      const detailParts = [`Lote ${lot.code}`];
      if (lot.expiryDate) detailParts.push(`vence ${formatDate(lot.expiryDate)}`);
      if (lot.origin) detailParts.push(lot.origin);
      if (lot.cost > 0) detailParts.push(`costo ${money(lot.cost)}`);
      if (lot.notes) detailParts.push(lot.notes);
      store.addMovement({ productId: id, product: p.name, sku: p.sku, sector: p.sector, type: 'Entrada', detail: detailParts.join(' · '), quantity: qty, unit: p.unit, previous, final, date: movementDate });
      closeMovement(); renderProducts(); toast('Entrada y lote registrados correctamente');
      return;
    }

    if (qty > previous) { toast(`No puedes registrar más merma que el stock disponible (${previous})`); return; }
    const reason = $('movementReason').value;
    const justification = $('movementJustification').value.trim();
    if (!justification) { toast('La justificación de la merma es obligatoria'); return; }
    const selectedLot = $('movementWasteLot').value;
    if (selectedLot) {
      const lot = store.getLots(id).find(l => String(l.id) === String(selectedLot));
      if (lot && qty > Number(lot.quantity)) { toast(`El lote ${lot.code} solo tiene ${lot.quantity} disponibles`); return; }
    }
    const allocations = store.consumeLots(id, qty, selectedLot || null);
    const final = previous - qty;
    store.setStock(id, final, seedProducts);
    const lotsText = allocations.length ? `Lotes: ${allocations.map(a => `${a.code} (${a.quantity})`).join(', ')}` : 'Stock sin lote histórico';
    store.addMovement({ productId: id, product: p.name, sku: p.sku, sector: p.sector, type: 'Merma', detail: `${reason} · ${lotsText} · ${justification}`, quantity: -qty, unit: p.unit, previous, final, date: movementDate });
    closeMovement(); renderProducts(); toast('Merma registrada y stock actualizado');
  });

  // Consulta de lotes
  const lotsBackdrop = $('lotsBackdrop');
  const lotState = lot => {
    if (!lot.expiryDate) return { label: 'Sin vencimiento', cls: 'neutral' };
    const now = new Date(`${today()}T00:00:00`);
    const expiry = new Date(`${lot.expiryDate}T00:00:00`);
    const days = Math.ceil((expiry - now) / 86400000);
    if (days < 0) return { label: 'Vencido', cls: 'expired' };
    if (days <= 30) return { label: `Por vencer (${days} d)`, cls: 'warning' };
    return { label: 'Vigente', cls: 'active' };
  };
  function openLots(id) {
    refreshData();
    lotProductId = String(id);
    const p = products.find(x => String(x.id) === lotProductId);
    if (!p) return;
    $('lotsTitle').textContent = `Lotes · ${p.name}`;
    $('lotsSubtitle').textContent = `${p.sku} · Stock total registrado: ${p.stock} ${p.unit}`;
    renderLots();
    lotsBackdrop.hidden = false;
    document.body.classList.add('modal-open');
    icons();
  }
  function renderLots() {
    const p = products.find(x => String(x.id) === lotProductId);
    const lots = store.getLots(lotProductId).sort((a,b) => (a.expiryDate || '9999-12-31').localeCompare(b.expiryDate || '9999-12-31') || String(a.receivedDate || '').localeCompare(String(b.receivedDate || '')));
    const tracked = lots.reduce((sum,l) => sum + Number(l.quantity || 0), 0);
    const untracked = Math.max(0, Number(p?.stock || 0) - tracked);
    $('lotSummary').innerHTML = `<article><span>Stock total</span><strong>${p?.stock || 0}</strong><small>${esc(p?.unit || '')}</small></article><article><span>En lotes</span><strong>${tracked}</strong><small>${lots.filter(l => Number(l.quantity)>0).length} lotes activos</small></article><article><span>Stock histórico sin lote</span><strong>${untracked}</strong><small>Existencias previas a v0.6.0</small></article>`;
    $('lotsBody').innerHTML = lots.map(l => {
      const st = lotState(l);
      return `<tr><td><strong>${esc(l.code)}</strong></td><td><strong>${l.quantity}</strong><small>de ${l.originalQuantity}</small></td><td>${esc(formatDate(l.receivedDate))}</td><td>${esc(formatDate(l.expiryDate))}</td><td>${l.cost ? money(l.cost) : '—'}</td><td>${esc(l.origin || '—')}</td><td><span class="lot-state ${st.cls}">${esc(st.label)}</span></td></tr>`;
    }).join('') || '<tr><td colspan="7" class="empty-row">Este producto todavía no tiene lotes registrados. Las existencias actuales se consideran stock histórico sin lote.</td></tr>';
  }
  function closeLots() { lotsBackdrop.hidden = true; lotProductId = null; document.body.classList.remove('modal-open'); }
  $('closeLots').addEventListener('click', closeLots);
  lotsBackdrop.addEventListener('click', e => { if (e.target === lotsBackdrop) closeLots(); });

  // Exportaciones
  function downloadCsv(filename, rows) {
    const csv = '\uFEFF' + rows.map(r => r.map(v => `"${String(v ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const u = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = u; a.download = filename; a.click(); URL.revokeObjectURL(u);
  }
  $('exportProductsCsv').addEventListener('click', () => {
    refreshData();
    downloadCsv('inventario-productos.csv', [['SKU', 'Producto', 'Sector', 'Unidad', 'PVP', 'Stock', 'Mínimo', 'Alerta', 'Estado comercial'], ...products.map(p => [p.sku, p.name, p.sector, p.unit, p.price, p.stock, p.minimum, statusOf(p), commercialState(p)])]);
  });
  $('exportServicesCsv').addEventListener('click', () => {
    refreshData();
    downloadCsv('catalogo-servicios.csv', [['Nombre', 'Descripción', 'Precio', 'Estado', 'Fecha inicio', 'Fecha fin'], ...services.map(s => [s.name, s.description || '', s.price, serviceStatus(s), s.startDate || '', s.endDate || ''])]);
  });
  $('printProducts').addEventListener('click', () => window.print());
  $('printServices').addEventListener('click', () => window.print());

  populateUnitSelect();
  renderProducts();
  renderServices();
  syncCatalogKind();
  icons();
})();
