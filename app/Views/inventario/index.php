<?= $this->extend('layouts/main') ?>
<?= $this->section('content') ?>
<div class="workspace-page" id="inventoryPage">
    <section class="module-heading">
        <div>
            <span class="module-eyebrow">CONTROL DE BODEGA · MÓDULOS 02 Y 03</span>
            <h1>Inventario</h1>
            <p>Consulta existencias, identifica alertas, administra servicios y registra movimientos justificados.</p>
        </div>
        <div class="module-actions">
            <a class="outline-action" href="<?= site_url('kardex') ?>"><i data-lucide="arrow-up-right"></i> Consultar Kardex</a>
        </div>
    </section>

    <div class="workspace-tabs inventory-main-tabs" id="inventoryMainTabs">
        <button class="active" type="button" data-panel="productsPanel">Productos físicos</button>
        <button type="button" data-panel="servicesPanel">Servicios</button>
    </div>

    <section class="workspace-card inventory-data-panel" id="productsPanel">
        <div class="data-card-head">
            <div><span class="panel-kicker">PRODUCTOS FÍSICOS</span><h2>Catálogo e inventario</h2><small id="productVisibleCount">0 productos</small></div>
            <div class="data-actions">
                <button class="primary-button" id="newProductButton" type="button"><i data-lucide="plus"></i> Nuevo registro</button>
                <button class="outline-action" id="exportProductsCsv" type="button"><i data-lucide="sheet"></i> Exportar CSV</button>
                <button class="outline-action" id="printProducts" type="button"><i data-lucide="file-text"></i> Exportar PDF</button>
            </div>
        </div>
        <div class="data-toolbar data-toolbar-wrap">
            <label class="table-search"><i data-lucide="search"></i><input id="productSearch" type="search" placeholder="Buscar SKU o producto..."></label>
            <select id="productStatus"><option value="Todos">Todos los estados</option><option>Stock correcto</option><option>Stock bajo</option><option>Sin stock</option></select>
            <select id="productSector"><option value="Todos">Todos los sectores</option></select>
            <label class="date-control"><span>Desde</span><input id="productDateFrom" type="date"></label>
            <label class="date-control"><span>Hasta</span><input id="productDateTo" type="date"></label>
        </div>
        <div class="responsive-table">
            <table class="business-table" id="productsTable">
                <thead><tr><th>SKU</th><th>Producto</th><th>Sector</th><th>Unidad</th><th>PVP</th><th>Stock actual</th><th>Estado</th><th>Acción</th></tr></thead>
                <tbody id="productsBody"></tbody>
            </table>
        </div>
        <div class="table-footer"><span id="productFooterCount">0 registros</span><span id="lowStockFooter">0 alertas de stock bajo</span></div>
    </section>

    <section class="workspace-card inventory-data-panel" id="servicesPanel" hidden>
        <div class="data-card-head">
            <div>
                <span class="panel-kicker">SERVICIOS</span>
                <h2>Catálogo de servicios</h2>
                <small>Servicios comerciales sin control de stock.</small>
            </div>
            <div class="data-actions">
                <button class="primary-button" id="newServiceButton" type="button"><i data-lucide="plus"></i> Nuevo servicio</button>
                <button class="outline-action" id="exportServicesCsv" type="button"><i data-lucide="sheet"></i> Exportar CSV</button>
                <button class="outline-action" id="printServices" type="button"><i data-lucide="file-text"></i> Exportar PDF</button>
            </div>
        </div>
        <div class="data-toolbar">
            <label class="table-search"><i data-lucide="search"></i><input id="serviceSearch" type="search" placeholder="Buscar nombre o descripción..."></label>
        </div>
        <div class="responsive-table">
            <table class="business-table services-table">
                <thead>
                    <tr><th>Nombre</th><th>Descripción</th><th>Precio</th><th>Estado</th><th>Fecha inicio</th><th>Fecha fin</th></tr>
                </thead>
                <tbody id="servicesBody"></tbody>
            </table>
        </div>
        <div class="table-footer"><span id="serviceFooterCount">0 servicios</span><span>Catálogo comercial</span></div>
    </section>
</div>

<div class="modal-backdrop" id="catalogModalBackdrop" hidden>
    <section class="catalog-modal" role="dialog" aria-modal="true" aria-labelledby="catalogModalTitle">
        <div class="modal-head">
            <div><span class="module-eyebrow" id="catalogModalEyebrow">CATÁLOGO</span><h2 id="catalogModalTitle">Nuevo producto físico</h2><p id="catalogModalHelp">Completa los datos del catálogo interno.</p></div>
            <button id="closeCatalogModal" type="button" aria-label="Cerrar"><i data-lucide="x"></i></button>
        </div>
        <form id="catalogForm" class="catalog-form">
            <input type="hidden" id="catalogKind" value="Producto">
            <select id="catalogKindSelect" hidden><option value="Producto">Producto físico</option><option value="Servicio">Servicio</option></select>

            <label class="product-catalog-field">Código SKU / código interno<input id="catalogCode"></label>
            <label>Nombre<input id="catalogName" required></label>
            <label class="span-2">Descripción<textarea id="catalogDescription" rows="3"></textarea></label>

            <label class="product-catalog-field">Sector económico<select id="catalogSector"><option>Agropecuario</option><option>Gastronómico</option><option>Artesanal</option><option>Textil</option><option>Turístico</option><option>Servicios</option></select></label>
            <label class="product-catalog-field">Unidad / forma de cobro<select id="catalogUnit"><option>Unidad</option><option>Libra</option><option>Frasco</option><option>Litro</option><option>Canasta</option><option>Por persona</option><option>Por grupo</option><option>Paquete turístico</option></select></label>
            <label id="catalogPriceLabel">PVP / precio base<input id="catalogPrice" type="number" min="0" step="0.01" required></label>

            <label class="product-only product-catalog-field">Stock inicial<input id="catalogStock" type="number" min="0" step="1" value="0"></label>
            <label class="product-only product-catalog-field">Stock mínimo para alerta<input id="catalogMinimum" type="number" min="0" step="1" value="2"></label>

            <label class="service-only" hidden>Estado<select id="catalogServiceStatus"><option value="Activo">Activo</option><option value="Inactivo">Inactivo</option></select></label>
            <label class="service-only" hidden>Fecha inicio<input id="catalogServiceStart" type="date"></label>
            <label class="service-only" hidden>Fecha fin<input id="catalogServiceEnd" type="date"></label>

            <div class="modal-actions span-2"><button class="outline-action" id="cancelCatalogModal" type="button">Cancelar</button><button class="primary-button" type="submit">Guardar registro</button></div>
        </form>
    </section>
</div>

<div class="modal-backdrop" id="movementBackdrop" hidden>
    <section class="catalog-modal movement-modal" role="dialog" aria-modal="true" aria-labelledby="movementTitle">
        <div class="modal-head"><div><span class="module-eyebrow" id="movementEyebrow">MOVIMIENTO DE BODEGA</span><h2 id="movementTitle">Registrar movimiento</h2><p id="movementHelp">El cambio quedará reflejado en el Kardex.</p></div><button id="closeMovement" type="button"><i data-lucide="x"></i></button></div>
        <form id="movementForm" class="catalog-form">
            <label class="span-2">Producto<select id="movementProduct" required></select></label>
            <label>Cantidad<input id="movementQuantity" type="number" min="0.01" step="0.01" required></label>
            <label>Unidad<input id="movementUnit" readonly></label>
            <label id="entryLotLabel">Lote / referencia<input id="movementLot" placeholder="LT-2026-001"></label>
            <label id="entryOriginLabel">Origen<input id="movementOrigin" placeholder="Proveedor / producción"></label>
            <label id="wasteReasonLabel" hidden>Motivo<select id="movementReason"><option>Caducidad</option><option>Producto dañado</option><option>Pérdida</option><option>Degustación / muestra</option><option>Otro</option></select></label>
            <label class="span-2">Justificación<textarea id="movementJustification" rows="3" placeholder="Describe brevemente el movimiento..."></textarea></label>
            <div class="modal-actions span-2"><button class="outline-action" id="cancelMovement" type="button">Cancelar</button><button class="primary-button" type="submit" id="saveMovement">Guardar movimiento</button></div>
        </form>
    </section>
</div>

<script id="inventoryProducts" type="application/json"><?= json_encode($products, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?></script>
<script id="inventoryServices" type="application/json"><?= json_encode($services, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?></script>
<?= $this->endSection() ?>
<?= $this->section('scripts') ?><script src="<?= base_url('assets/js/inventory.js') ?>"></script><?= $this->endSection() ?>
