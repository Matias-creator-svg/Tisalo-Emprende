(() => {
  if (!document.getElementById('inventoryPage')) return;
  const store = window.TisaleoDemoStore;
  const seedProducts = JSON.parse(document.getElementById('inventoryProducts')?.textContent || '[]');
  const seedServices = JSON.parse(document.getElementById('inventoryServices')?.textContent || '[]');
  let products = store.getProducts(seedProducts).map(p => ({ ...p, id: String(p.id), stock: Number(p.stock), minimum: Number(p.minimum), price: Number(p.price) }));
  let services = store.getServices(seedServices).map(s => ({ ...s, id: String(s.id), price: Number(s.price) }));
  const $ = id => document.getElementById(id);
  const money = v => `$${Number(v || 0).toFixed(2)}`;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
  const toast = m => window.showToast?.(m);
  const icons = () => window.lucide?.createIcons({ attrs: { 'stroke-width': 1.8 } });
  let movementType = 'entry';

  const statusOf = p => Number(p.stock) <= 0 ? 'Sin stock' : Number(p.stock) <= Number(p.minimum) ? 'Stock bajo' : 'Stock correcto';
  const sectorOptions = (select, items) => {
    const current = select.value;
    const sectors = [...new Set(items.map(x => x.sector).filter(Boolean))].sort();
    select.innerHTML = '<option value="Todos">Todos los sectores</option>' + sectors.map(s => `<option>${esc(s)}</option>`).join('');
    if ([...select.options].some(o => o.value === current)) select.value = current;
  };
  const within = (date, from, to) => (!from || date >= from) && (!to || date <= to);
  const serviceStatus = s => s.status || (s.active === false ? 'Inactivo' : 'Activo');
  const formatDate = value => {
    if (!value) return '—';
    const [y, m, d] = String(value).split('-');
    return y && m && d ? `${d}/${m}/${y}` : value;
  };

  function renderProducts() {
    products = store.getProducts(seedProducts).map(p => ({ ...p, id: String(p.id), stock: Number(p.stock), minimum: Number(p.minimum), price: Number(p.price) }));
    sectorOptions($('productSector'), products);
    const q = $('productSearch').value.trim().toLowerCase();
    const state = $('productStatus').value;
    const sector = $('productSector').value;
    const from = $('productDateFrom').value;
    const to = $('productDateTo').value;
    const filtered = products.filter(p => `${p.name} ${p.sku}`.toLowerCase().includes(q) && (state === 'Todos' || statusOf(p) === state) && (sector === 'Todos' || p.sector === sector) && within(p.updatedDate || '', from, to));

    $('productsBody').innerHTML = filtered.map(p => {
      const st = statusOf(p);
      return `<tr>
        <td><code>${esc(p.sku)}</code></td>
        <td><strong>${esc(p.name)}</strong><small>${esc(p.description || '')}</small></td>
        <td>${esc(p.sector)}</td>
        <td>${esc(p.unit)}</td>
        <td><strong>${money(p.price)}</strong></td>
        <td><strong>${p.stock}</strong> <small>${esc(p.unit)}</small></td>
        <td><span class="stock-state ${st === 'Stock correcto' ? 'ok' : st === 'Stock bajo' ? 'low' : 'empty'}">● ${esc(st)}</span></td>
        <td><div class="row-actions"><button class="entry-action" data-move="entry" data-id="${esc(p.id)}"><span data-lucide="package-plus"></span> Registrar entrada</button><button class="waste-action" data-move="waste" data-id="${esc(p.id)}"><span data-lucide="trash-2"></span> Registrar merma</button></div></td>
      </tr>`;
    }).join('') || '<tr><td colspan="8" class="empty-row">No hay productos que coincidan con los filtros.</td></tr>';

    const low = products.filter(p => statusOf(p) === 'Stock bajo' || statusOf(p) === 'Sin stock').length;
    $('productVisibleCount').textContent = `${products.length} productos · ${filtered.length} visibles`;
    $('productFooterCount').textContent = `${filtered.length} registros`;
    $('lowStockFooter').textContent = `${low} alertas de stock bajo`;
    icons();
  }

  function renderServices() {
    services = store.getServices(seedServices).map(s => ({ ...s, id: String(s.id), price: Number(s.price) }));
    const q = $('serviceSearch').value.trim().toLowerCase();
    const filtered = services.filter(s => `${s.name} ${s.description || ''}`.toLowerCase().includes(q));

    $('servicesBody').innerHTML = filtered.map(s => {
      const state = serviceStatus(s);
      return `<tr>
        <td><strong>${esc(s.name)}</strong></td>
        <td class="service-description">${esc(s.description || '—')}</td>
        <td><strong>${money(s.price)}</strong></td>
        <td><span class="stock-state ${state === 'Activo' ? 'ok' : 'empty'}">● ${esc(state)}</span></td>
        <td>${esc(formatDate(s.startDate))}</td>
        <td>${esc(formatDate(s.endDate))}</td>
      </tr>`;
    }).join('') || '<tr><td colspan="6" class="empty-row">No hay servicios que coincidan con la búsqueda.</td></tr>';

    $('serviceFooterCount').textContent = `${filtered.length} servicios`;
    icons();
  }

  $('inventoryMainTabs').addEventListener('click', e => {
    const b = e.target.closest('button[data-panel]');
    if (!b) return;
    $('inventoryMainTabs').querySelectorAll('button').forEach(x => x.classList.toggle('active', x === b));
    ['productsPanel', 'servicesPanel'].forEach(id => $(id).hidden = id !== b.dataset.panel);
  });
  ['productSearch', 'productStatus', 'productSector', 'productDateFrom', 'productDateTo'].forEach(id => $(id).addEventListener(id.includes('Search') ? 'input' : 'change', renderProducts));
  $('serviceSearch').addEventListener('input', renderServices);

  const catalogBackdrop = $('catalogModalBackdrop');
  function openCatalog(kind) {
    $('catalogForm').reset();
    $('catalogKindSelect').value = kind;
    $('catalogKind').value = kind;
    syncCatalogKind();
    if (kind === 'Servicio') {
      $('catalogServiceStatus').value = 'Activo';
      $('catalogServiceStart').value = store.nowParts().date;
    } else {
      $('catalogStock').value = '0';
      $('catalogMinimum').value = '2';
    }
    catalogBackdrop.hidden = false;
    document.body.classList.add('modal-open');
    setTimeout(() => (kind === 'Producto' ? $('catalogCode') : $('catalogName')).focus(), 50);
  }
  function closeCatalog() {
    catalogBackdrop.hidden = true;
    document.body.classList.remove('modal-open');
  }
  function syncCatalogKind() {
    const kind = $('catalogKindSelect').value;
    const product = kind === 'Producto';
    $('catalogKind').value = kind;
    $('catalogModalTitle').textContent = product ? 'Nuevo producto físico' : 'Nuevo servicio';
    $('catalogModalEyebrow').textContent = product ? 'CATÁLOGO DE PRODUCTOS' : 'CATÁLOGO DE SERVICIOS';
    $('catalogModalHelp').textContent = product ? 'Completa los datos del producto y su inventario inicial.' : 'Completa los campos comerciales definidos para el servicio.';
    document.querySelectorAll('.product-catalog-field').forEach(x => x.hidden = !product);
    document.querySelectorAll('.service-only').forEach(x => x.hidden = product);
    $('catalogPriceLabel').firstChild.textContent = product ? 'PVP / precio base' : 'Precio';
    $('catalogCode').required = product;
    $('catalogServiceStatus').required = !product;
    $('catalogServiceStart').required = !product;
  }

  $('newProductButton').addEventListener('click', () => openCatalog('Producto'));
  $('newServiceButton').addEventListener('click', () => openCatalog('Servicio'));
  $('closeCatalogModal').addEventListener('click', closeCatalog);
  $('cancelCatalogModal').addEventListener('click', closeCatalog);
  catalogBackdrop.addEventListener('click', e => { if (e.target === catalogBackdrop) closeCatalog(); });

  $('catalogForm').addEventListener('submit', e => {
    e.preventDefault();
    const kind = $('catalogKind').value;
    const name = $('catalogName').value.trim();
    const description = $('catalogDescription').value.trim();
    const price = Number($('catalogPrice').value || 0);

    if (kind === 'Producto') {
      const common = { name, sector: $('catalogSector').value, unit: $('catalogUnit').value, price, description, updatedDate: store.nowParts().date };
      const record = store.addProduct({ ...common, id: `p-${Date.now()}`, sku: $('catalogCode').value.trim(), category: common.sector, stock: Number($('catalogStock').value || 0), minimum: Number($('catalogMinimum').value || 0), image: '' });
      if (record.stock > 0) store.addMovement({ productId: record.id, product: record.name, sku: record.sku, sector: record.sector, type: 'Entrada', detail: 'Stock inicial', quantity: record.stock, unit: record.unit, previous: 0, final: record.stock });
      toast('Producto creado correctamente');
      renderProducts();
    } else {
      const status = $('catalogServiceStatus').value;
      const startDate = $('catalogServiceStart').value;
      const endDate = $('catalogServiceEnd').value;
      if (endDate && startDate && endDate < startDate) {
        toast('La fecha fin no puede ser anterior a la fecha inicio');
        return;
      }
      store.addService({
        id: `s-${Date.now()}`,
        code: `SER-${String(Date.now()).slice(-6)}`,
        name,
        description,
        price,
        status,
        active: status === 'Activo',
        startDate,
        endDate,
        sector: 'Servicios',
        unit: 'Servicio',
        updatedDate: store.nowParts().date,
      });
      toast('Servicio creado correctamente');
      renderServices();
    }
    closeCatalog();
  });

  const movementBackdrop = $('movementBackdrop');
  function openMovement(type, id) {
    movementType = type;
    products = store.getProducts(seedProducts);
    $('movementProduct').innerHTML = products.map(p => `<option value="${esc(p.id)}">${esc(p.name)} · ${esc(p.sku)}</option>`).join('');
    $('movementProduct').value = String(id || products[0]?.id || '');
    syncMovementProduct();
    const waste = type === 'waste';
    $('movementTitle').textContent = waste ? 'Registrar merma' : 'Registrar entrada';
    $('movementEyebrow').textContent = waste ? 'SALIDA JUSTIFICADA' : 'ENTRADA DE INVENTARIO';
    $('entryLotLabel').hidden = waste;
    $('entryOriginLabel').hidden = waste;
    $('wasteReasonLabel').hidden = !waste;
    movementBackdrop.hidden = false;
    document.body.classList.add('modal-open');
  }
  function closeMovement() {
    movementBackdrop.hidden = true;
    document.body.classList.remove('modal-open');
    $('movementForm').reset();
  }
  function syncMovementProduct() {
    const p = products.find(x => String(x.id) === $('movementProduct').value);
    $('movementUnit').value = p?.unit || '';
  }
  $('productsBody').addEventListener('click', e => {
    const b = e.target.closest('button[data-move]');
    if (b) openMovement(b.dataset.move, b.dataset.id);
  });
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
    if (qty <= 0) { toast('Ingresa una cantidad válida'); return; }
    const previous = Number(p.stock || 0);
    if (movementType === 'waste' && qty > previous) { toast(`No puedes registrar más merma que el stock disponible (${previous})`); return; }
    const final = movementType === 'entry' ? previous + qty : previous - qty;
    store.setStock(id, final, seedProducts);
    const detail = movementType === 'entry' ? [$('movementLot').value, $('movementOrigin').value, $('movementJustification').value].filter(Boolean).join(' · ') || 'Entrada manual' : [$('movementReason').value, $('movementJustification').value].filter(Boolean).join(' · ');
    store.addMovement({ productId: id, product: p.name, sku: p.sku, sector: p.sector, type: movementType === 'entry' ? 'Entrada' : 'Merma', detail, quantity: movementType === 'entry' ? qty : -qty, unit: p.unit, previous, final });
    closeMovement();
    renderProducts();
    toast(movementType === 'entry' ? 'Entrada registrada' : 'Merma registrada');
  });

  function downloadCsv(filename, rows) {
    const csv = '\uFEFF' + rows.map(r => r.map(v => `"${String(v ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const u = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = u; a.download = filename; a.click(); URL.revokeObjectURL(u);
  }
  $('exportProductsCsv').addEventListener('click', () => downloadCsv('inventario-productos.csv', [['SKU', 'Producto', 'Sector', 'Unidad', 'PVP', 'Stock', 'Mínimo', 'Estado'], ...products.map(p => [p.sku, p.name, p.sector, p.unit, p.price, p.stock, p.minimum, statusOf(p)])]));
  $('exportServicesCsv').addEventListener('click', () => downloadCsv('catalogo-servicios.csv', [['Nombre', 'Descripción', 'Precio', 'Estado', 'Fecha inicio', 'Fecha fin'], ...services.map(s => [s.name, s.description || '', s.price, serviceStatus(s), s.startDate || '', s.endDate || ''])]));
  $('printProducts').addEventListener('click', () => window.print());
  $('printServices').addEventListener('click', () => window.print());

  renderProducts();
  renderServices();
  syncCatalogKind();
})();
