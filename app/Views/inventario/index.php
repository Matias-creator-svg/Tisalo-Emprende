<?= $this->extend('layouts/main') ?>
<?= $this->section('content') ?>
<div class="workspace-page" id="inventoryPage">
    <section class="module-heading">
        <div>
            <span class="module-eyebrow">CONTROL DE BODEGA · MÓDULOS 02 Y 03</span>
            <h1>Inventario y catálogo</h1>
            <p>Administra productos, servicios, existencias, lotes, vencimientos y movimientos de bodega.</p>
        </div>
        <div class="module-actions">
            <button class="outline-action" id="manageUnitsButton" type="button"><i data-lucide="ruler"></i> Unidades de medida</button>
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
                <button class="primary-button" id="newProductButton" type="button"><i data-lucide="plus"></i> Nuevo producto</button>
                <button class="outline-action" id="exportProductsCsv" type="button"><i data-lucide="sheet"></i> Exportar CSV</button>
                <button class="outline-action" id="printProducts" type="button"><i data-lucide="file-text"></i> Exportar PDF</button>
            </div>
        </div>
        <div class="data-toolbar data-toolbar-wrap">
            <label class="table-search"><i data-lucide="search"></i><input id="productSearch" type="search" placeholder="Buscar SKU o producto..."></label>
            <select id="productStatus"><option value="Todos">Todos los stocks</option><option>Stock correcto</option><option>Stock bajo</option><option>Sin stock</option></select>
            <select id="productCommercial"><option value="Todos">Todos comerciales</option><option value="Activo">Activos</option><option value="Inactivo">Inactivos</option></select>
            <select id="productSector"><option value="Todos">Todos los sectores</option></select>
            <label class="date-control"><span>Desde</span><input id="productDateFrom" type="date"></label>
            <label class="date-control"><span>Hasta</span><input id="productDateTo" type="date"></label>
        </div>
        <div class="responsive-table">
            <table class="business-table inventory-v060-table" id="productsTable">
                <thead><tr><th>Producto</th><th>SKU</th><th>Sector</th><th>Unidad</th><th>PVP</th><th>Stock</th><th>Alerta</th><th>Comercial</th><th>Acciones</th></tr></thead>
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
                <small>Servicios comerciales sin control de existencias.</small>
            </div>
            <div class="data-actions">
                <button class="primary-button" id="newServiceButton" type="button"><i data-lucide="plus"></i> Nuevo servicio</button>
                <button class="outline-action" id="exportServicesCsv" type="button"><i data-lucide="sheet"></i> Exportar CSV</button>
                <button class="outline-action" id="printServices" type="button"><i data-lucide="file-text"></i> Exportar PDF</button>
            </div>
        </div>
        <div class="data-toolbar data-toolbar-wrap">
            <label class="table-search"><i data-lucide="search"></i><input id="serviceSearch" type="search" placeholder="Buscar nombre o descripción..."></label>
            <select id="serviceStatusFilter"><option value="Todos">Todos los estados</option><option value="Activo">Activos</option><option value="Inactivo">Inactivos</option></select>
        </div>
        <div class="responsive-table">
            <table class="business-table services-table">
                <thead>
                    <tr><th>Nombre</th><th>Descripción</th><th>Precio</th><th>Estado</th><th>Fecha inicio</th><th>Fecha fin</th><th>Acciones</th></tr>
                </thead>
                <tbody id="servicesBody"></tbody>
            </table>
        </div>
        <div class="table-footer"><span id="serviceFooterCount">0 servicios</span><span>Los servicios heredan internamente el sector económico del emprendimiento.</span></div>
    </section>
</div>

<!-- Alta y edición de catálogo -->
<div class="modal-backdrop" id="catalogModalBackdrop" hidden>
    <section class="catalog-modal" role="dialog" aria-modal="true" aria-labelledby="catalogModalTitle">
        <div class="modal-head">
            <div><span class="module-eyebrow" id="catalogModalEyebrow">CATÁLOGO</span><h2 id="catalogModalTitle">Nuevo producto físico</h2><p id="catalogModalHelp">Completa los datos del catálogo interno.</p></div>
            <button id="closeCatalogModal" type="button" aria-label="Cerrar"><i data-lucide="x"></i></button>
        </div>
        <form id="catalogForm" class="catalog-form">
            <input type="hidden" id="catalogKind" value="Producto">
            <input type="hidden" id="catalogEditId" value="">
            <select id="catalogKindSelect" hidden><option value="Producto">Producto físico</option><option value="Servicio">Servicio</option></select>

            <label class="product-catalog-field">Código SKU / código interno<input id="catalogCode"></label>
            <label>Nombre<input id="catalogName" required></label>
            <label class="span-2">Descripción<textarea id="catalogDescription" rows="3"></textarea></label>

            <label class="product-catalog-field">Sector económico<select id="catalogSector"><option>Agropecuario</option><option>Gastronómico</option><option>Artesanal</option><option>Textil</option><option>Turístico</option></select></label>
            <label class="product-catalog-field unit-field-wrap">Unidad de medida<div class="field-with-action"><select id="catalogUnit"></select><button id="openUnitsFromCatalog" class="mini-field-action" type="button" title="Gestionar unidades"><i data-lucide="settings-2"></i></button></div></label>
            <label id="catalogPriceLabel">PVP / precio base<input id="catalogPrice" type="number" min="0" step="0.01" required></label>
            <label class="product-catalog-field">Estado comercial<select id="catalogProductStatus"><option value="Activo">Activo</option><option value="Inactivo">Inactivo</option></select></label>

            <label class="product-only product-catalog-field" id="initialStockField">Stock inicial<input id="catalogStock" type="number" min="0" step="0.01" value="0"></label>
            <label class="product-only product-catalog-field">Stock mínimo para alerta<input id="catalogMinimum" type="number" min="0" step="0.01" value="2"></label>

            <label class="product-only product-catalog-field span-2">Fotografía representativa
                <div class="image-field-row">
                    <div class="catalog-image-preview" id="catalogImagePreview"><i data-lucide="image"></i><span>Sin imagen</span></div>
                    <div class="image-field-controls">
                        <input id="catalogImage" type="file" accept="image/png,image/jpeg,image/webp">
                        <small>PNG, JPG o WEBP. La imagen se optimiza para el prototipo.</small>
                        <button type="button" class="text-action" id="removeCatalogImage">Quitar imagen</button>
                    </div>
                </div>
            </label>

            <!-- Servicios: campos fijos acordados -->
            <label class="service-only" hidden>Estado<select id="catalogServiceStatus"><option value="Activo">Activo</option><option value="Inactivo">Inactivo</option></select></label>
            <label class="service-only" hidden>Fecha Inicio<input id="catalogServiceStart" type="date"></label>
            <label class="service-only" hidden>Fecha Fin<input id="catalogServiceEnd" type="date"></label>

            <div class="form-note product-edit-note span-2" id="productEditNote" hidden><i data-lucide="info"></i><span>El stock actual no se modifica desde la edición del producto. Usa <strong>Registrar entrada</strong> o <strong>Registrar merma</strong> para conservar la trazabilidad.</span></div>
            <div class="modal-actions span-2"><button class="outline-action" id="cancelCatalogModal" type="button">Cancelar</button><button class="primary-button" type="submit" id="saveCatalogButton">Guardar registro</button></div>
        </form>
    </section>
</div>

<!-- Entradas y mermas -->
<div class="modal-backdrop" id="movementBackdrop" hidden>
    <section class="catalog-modal movement-modal-v060" role="dialog" aria-modal="true" aria-labelledby="movementTitle">
        <div class="modal-head"><div><span class="module-eyebrow" id="movementEyebrow">MOVIMIENTO DE BODEGA</span><h2 id="movementTitle">Registrar movimiento</h2><p id="movementHelp">El cambio quedará reflejado en el Kardex.</p></div><button id="closeMovement" type="button"><i data-lucide="x"></i></button></div>
        <form id="movementForm" class="catalog-form">
            <label class="span-2">Producto<select id="movementProduct" required></select></label>
            <label>Cantidad<input id="movementQuantity" type="number" min="0.01" step="0.01" required></label>
            <label>Unidad<input id="movementUnit" readonly></label>
            <label>Fecha del movimiento<input id="movementDate" type="date" required></label>

            <label class="entry-only">Costo unitario <span class="optional-text">(opcional)</span><input id="movementCost" type="number" min="0" step="0.01" placeholder="0.00"></label>
            <label class="entry-only">Lote / referencia<input id="movementLot" placeholder="LT-2026-001"></label>
            <label class="entry-only">Fecha de vencimiento<input id="movementExpiry" type="date"></label>
            <label class="entry-only">Origen<input id="movementOrigin" placeholder="Proveedor / producción / cosecha"></label>

            <label class="waste-only" hidden>Lote a descontar<select id="movementWasteLot"><option value="">Aplicar PEPS/FIFO automáticamente</option></select></label>
            <label class="waste-only" hidden>Motivo<select id="movementReason" required><option value="Caducidad/Dañado">Caducidad/Dañado</option><option value="Degustación/Muestra">Degustación/Muestra</option><option value="Autoconsumo">Autoconsumo</option><option value="Pérdida">Pérdida</option></select></label>

            <label class="span-2">Observaciones / justificación<textarea id="movementJustification" rows="3" placeholder="Describe brevemente el movimiento..."></textarea></label>
            <div class="form-note span-2" id="fifoNote"><i data-lucide="layers-3"></i><span>Las salidas descuentan primero los lotes con vencimiento más cercano y, en igualdad de condiciones, el lote ingresado primero.</span></div>
            <div class="modal-actions span-2"><button class="outline-action" id="cancelMovement" type="button">Cancelar</button><button class="primary-button" type="submit" id="saveMovement">Guardar movimiento</button></div>
        </form>
    </section>
</div>

<!-- Parametrización de unidades -->
<div class="modal-backdrop" id="unitsBackdrop" hidden>
    <section class="catalog-modal units-modal" role="dialog" aria-modal="true" aria-labelledby="unitsTitle">
        <div class="modal-head"><div><span class="module-eyebrow">PARAMETRIZACIÓN</span><h2 id="unitsTitle">Unidades de medida</h2><p>Administra unidades flexibles para productos heterogéneos.</p></div><button id="closeUnits" type="button"><i data-lucide="x"></i></button></div>
        <div class="units-layout">
            <form id="unitForm" class="unit-create-card">
                <h3>Nueva unidad</h3>
                <label>Nombre<input id="unitName" required placeholder="Ej. Docena"></label>
                <label>Abreviatura<input id="unitAbbreviation" required placeholder="Ej. doc."></label>
                <label>Tipo de magnitud<select id="unitMagnitude"><option>Peso</option><option>Volumen</option><option>Conteo</option></select></label>
                <button class="primary-button" type="submit"><i data-lucide="plus"></i> Agregar unidad</button>
            </form>
            <div class="units-list-card">
                <div class="units-list-head"><strong>Unidades disponibles</strong><span id="unitsCount">0 unidades</span></div>
                <div id="unitsList" class="units-list"></div>
            </div>
        </div>
    </section>
</div>

<!-- Consulta de lotes -->
<div class="modal-backdrop" id="lotsBackdrop" hidden>
    <section class="catalog-modal lots-modal" role="dialog" aria-modal="true" aria-labelledby="lotsTitle">
        <div class="modal-head"><div><span class="module-eyebrow">PEPS / FIFO</span><h2 id="lotsTitle">Lotes del producto</h2><p id="lotsSubtitle">Consulta existencias por lote y fecha de vencimiento.</p></div><button id="closeLots" type="button"><i data-lucide="x"></i></button></div>
        <div class="lots-content">
            <div class="lot-summary" id="lotSummary"></div>
            <div class="responsive-table">
                <table class="business-table lots-table">
                    <thead><tr><th>Lote</th><th>Disponible</th><th>Ingreso</th><th>Vencimiento</th><th>Costo</th><th>Origen</th><th>Estado</th></tr></thead>
                    <tbody id="lotsBody"></tbody>
                </table>
            </div>
            <div class="form-note"><i data-lucide="info"></i><span>Las ventas y mermas automáticas priorizan los lotes con vencimiento más cercano. Si no hay vencimiento, se respeta el orden de ingreso.</span></div>
        </div>
    </section>
</div>

<script id="inventoryProducts" type="application/json"><?= json_encode($products, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?></script>
<script id="inventoryServices" type="application/json"><?= json_encode($services, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?></script>
<?= $this->endSection() ?>
<?= $this->section('scripts') ?><script src="<?= base_url('assets/js/inventory.js') ?>"></script><?= $this->endSection() ?>
