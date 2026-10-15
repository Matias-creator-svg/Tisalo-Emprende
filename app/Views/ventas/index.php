<?= $this->extend('layouts/main') ?>
<?= $this->section('content') ?>
<div class="sale-page" id="quickSalePage">
    <section class="sale-heading module-heading">
        <div>
            <span class="module-eyebrow">PUNTO DE VENTA · MÓDULO 04</span>
            <h1>Venta rápida</h1>
            <p>Registra productos o servicios en pocos pasos y mantén tu operación al día.</p>
        </div>
        <div class="module-actions">
            <a class="outline-action" href="<?= site_url('historial-ventas') ?>"><i data-lucide="receipt-text"></i> Ver ventas</a>
            <a class="outline-action" href="<?= site_url('kardex') ?>"><i data-lucide="arrow-up-right"></i> Ver movimientos</a>
        </div>
    </section>

    <div class="pos-layout">
        <section class="catalog-area">
            <div class="catalog-card-head">
                <div><span class="panel-kicker">CATÁLOGO</span><h2>Selecciona para añadir al ticket</h2></div>
                <label class="catalog-search"><i data-lucide="search"></i><input id="catalogSearch" type="search" placeholder="Buscar producto o servicio..." autocomplete="off"></label>
            </div>

            <div class="workspace-tabs" id="saleTypeTabs">
                <button class="active" type="button" data-kind="products">Productos</button>
                <button type="button" data-kind="services">Servicios</button>
            </div>

            <div class="category-tabs" id="categoryTabs"></div>
            <div class="catalog-meta"><span id="catalogCount">0 registros</span><small>Haz clic en una tarjeta para añadirla</small></div>
            <div class="sale-product-grid" id="productGrid"></div>
            <div class="catalog-empty" id="catalogEmpty" hidden><i data-lucide="search-x"></i><strong>No encontramos resultados</strong><span>Prueba con otra búsqueda o categoría.</span></div>
        </section>

        <aside class="ticket-panel">
            <div class="ticket-head"><div><span>TICKET DE VENTA</span><h2 id="ticketProductCount">0 registros</h2></div><button id="clearCart" type="button">Limpiar</button></div>
            <div class="customer-field"><span>CLIENTE</span><button class="js-toast" type="button" data-message="Cliente actual: Consumidor final"><div>CF</div><span><strong>Consumidor final</strong><small>Sin identificación</small></span><i data-lucide="chevron-right"></i></button></div>
            <div class="ticket-items" id="ticketItems"></div>
            <div class="payment-section">
                <span>MEDIO DE COBRO</span>
                <div class="payment-options" id="paymentOptions">
                    <button class="active" type="button" data-payment="Efectivo"><i data-lucide="banknote"></i><span>Efectivo</span></button>
                    <button type="button" data-payment="Transferencia"><i data-lucide="landmark"></i><span>Transferencia</span></button>
                    <button type="button" data-payment="Mixto"><i data-lucide="wallet-cards"></i><span>Mixto</span></button>
                </div>
                <div class="mixed-payment" id="mixedPayment" hidden>
                    <label>Efectivo<input id="mixedCash" type="number" min="0" step="0.01" value="0.00"></label>
                    <label>Transferencia<input id="mixedTransfer" type="number" min="0" step="0.01" value="0.00"></label>
                </div>
            </div>
            <div class="ticket-totals"><div><span>Subtotal</span><strong id="subtotalValue">$0.00</strong></div><div><span>Impuestos</span><strong>$0.00</strong></div><div class="grand-total"><span>Total</span><strong id="totalValue">$0.00</strong></div></div>
            <button class="complete-sale" id="completeSale" type="button"><span><small>CONFIRMAR Y GUARDAR</small><strong>Completar venta</strong></span><i data-lucide="arrow-right"></i></button>
            <p class="stock-note"><i data-lucide="package"></i> El stock se actualizará al confirmar la venta.</p>
        </aside>
    </div>
</div>
<script id="quickSaleProducts" type="application/json"><?= json_encode($products, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?></script>
<script id="quickSaleServices" type="application/json"><?= json_encode($services, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?></script>
<?= $this->endSection() ?>
<?= $this->section('scripts') ?><script src="<?= base_url('assets/js/quick-sale.js') ?>"></script><?= $this->endSection() ?>
