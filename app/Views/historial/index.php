<?= $this->extend('layouts/main') ?>
<?= $this->section('content') ?>
<div class="workspace-page" id="salesHistoryPage">
  <section class="module-heading"><div><span class="module-eyebrow">CONTROL COMERCIAL · REGISTRO INTERNO</span><h1>Histórico de ventas</h1><p>Consulta y exporta las ventas registradas por fecha y sector.</p></div><div class="module-actions"><button class="outline-action" id="exportSalesCsv"><i data-lucide="sheet"></i> Exportar CSV</button><button class="outline-action" id="printSales"><i data-lucide="file-text"></i> Exportar PDF</button></div></section>
  <section class="workspace-card">
    <div class="data-toolbar data-toolbar-wrap"><label class="date-control"><span>Desde</span><input id="salesDateFrom" type="date"></label><label class="date-control"><span>Hasta</span><input id="salesDateTo" type="date"></label><select id="salesSector"><option value="Todos">Todos los sectores</option></select><select id="salesKind"><option value="Todos">Productos y servicios</option><option>Producto</option><option>Servicio</option></select><label class="table-search"><i data-lucide="search"></i><input id="salesSearch" type="search" placeholder="Buscar comprobante, SKU o nombre..."></label></div>
    <div class="responsive-table"><table class="business-table"><thead><tr><th>Fecha / hora</th><th>Comprobante</th><th>SKU / código</th><th>Producto o servicio</th><th>Sector</th><th>Tipo</th><th>Cantidad</th><th>Medio de cobro</th><th>Total</th></tr></thead><tbody id="salesHistoryBody"></tbody></table></div>
    <div class="table-footer"><span id="salesHistoryCount">0 registros</span><strong id="salesHistoryTotal">Total: $0.00</strong></div>
  </section>
</div>
<script id="salesHistorySeed" type="application/json"><?= json_encode($sales, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?></script>
<?= $this->endSection() ?>
<?= $this->section('scripts') ?><script src="<?= base_url('assets/js/sales-history.js') ?>"></script><?= $this->endSection() ?>
