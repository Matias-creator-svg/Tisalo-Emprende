<?= $this->extend('layouts/main') ?>
<?= $this->section('content') ?>
<div class="workspace-page" id="kardexPage">
    <section class="module-heading">
        <div>
            <span class="module-eyebrow">TRAZABILIDAD · MÓDULO 03</span>
            <h1>Kardex histórico</h1>
            <p>Libro cronológico de entradas, ventas y ajustes de inventario.</p>
        </div>
        <div class="module-actions"><button class="outline-action" id="exportKardex" type="button"><i data-lucide="sheet"></i> Exportar Excel/CSV</button><button class="outline-action" id="printKardex" type="button"><i data-lucide="file-text"></i> Exportar PDF</button></div>
    </section>

    <div class="audit-banner"><i data-lucide="check-circle-2"></i><span><strong>Registro de auditoría · Solo lectura.</strong> Los movimientos son inalterables y cada cambio de stock queda registrado automáticamente.</span></div>

    <section class="workspace-card">
        <div class="data-card-head"><div><span class="panel-kicker">MOVIMIENTOS DE BODEGA</span><h2>Historial de movimientos</h2><small id="kardexCount">0 movimientos</small></div></div>
        <div class="data-toolbar data-toolbar-wrap">
            <select id="kardexType"><option value="Todos">Todos los movimientos</option><option>Entrada</option><option>Venta</option><option>Merma</option></select>
            <label class="date-control"><span>Desde</span><input id="kardexDateFrom" type="date"></label>
            <label class="date-control"><span>Hasta</span><input id="kardexDateTo" type="date"></label>
            <select id="kardexSector"><option value="Todos">Todos los sectores</option></select>
            <label class="table-search"><i data-lucide="search"></i><input id="kardexSearch" type="search" placeholder="Buscar SKU o nombre..."></label>
        </div>
        <div class="responsive-table">
            <table class="business-table kardex-table"><thead><tr><th>Fecha / hora</th><th>Producto</th><th>Movimiento</th><th>Cantidad</th><th>Saldo anterior</th><th>Saldo final</th><th>Usuario</th></tr></thead><tbody id="kardexRows"></tbody></table>
        </div>
        <div class="table-footer"><span id="kardexFooter">0 registros</span><span>Historial inalterable</span></div>
    </section>
</div>
<script id="kardexBaseMovements" type="application/json"><?= json_encode($movements, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?></script>
<?= $this->endSection() ?>
<?= $this->section('scripts') ?><script src="<?= base_url('assets/js/kardex.js') ?>"></script><?= $this->endSection() ?>
