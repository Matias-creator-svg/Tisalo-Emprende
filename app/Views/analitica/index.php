<?= $this->extend('layouts/main') ?>
<?= $this->section('content') ?>
<div class="workspace-page" id="analyticsPage">
  <section class="module-heading">
    <div><span class="module-eyebrow">INDICADORES DE NEGOCIO · MÓDULO 05</span><h1>Analítica</h1><p>Una lectura simple del rendimiento de tu emprendimiento.</p></div>
    <label class="view-select">Vista de datos<select id="analyticsView"><option>Vista Emprendedor</option><option>Vista Administrador</option></select></label>
  </section>

  <section class="analytics-kpis">
    <article><span>INGRESOS DE HOY</span><strong id="analyticsIncome">$0.00</strong><small>Actualizado con tus ventas</small></article>
    <article><span>COBROS POR MEDIO</span><strong id="analyticsPaymentSplit">0% / 0%</strong><small>Efectivo · Transferencia</small></article>
    <article><span>PRODUCTO MÁS VENDIDO</span><strong id="analyticsTopProduct">Sin datos</strong><small id="analyticsTopProductMeta">0 unidades</small></article>
    <article><span>PÉRDIDAS POR MERMAS</span><strong id="analyticsWaste">$0.00</strong><small id="analyticsWasteMeta">0 registros</small></article>
  </section>

  <section class="analytics-grid">
    <article class="workspace-card analytics-chart-card">
      <div class="data-card-head"><div><span class="panel-kicker">RENDIMIENTO</span><h2>Ingresos de la semana</h2><small>Resumen diario de ventas registradas</small></div></div>
      <div class="analytics-bars" id="analyticsBars"></div>
    </article>
    <article class="workspace-card">
      <div class="data-card-head"><div><span class="panel-kicker">DISTRIBUCIÓN</span><h2>Medios de cobro</h2><small>Participación de ingresos</small></div></div>
      <div class="payment-breakdown" id="analyticsPayments"></div>
      <div class="ranking-list" id="analyticsRanking"></div>
    </article>
  </section>
</div>
<script id="analyticsSalesSeed" type="application/json"><?= json_encode($sales, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?></script>
<script id="analyticsMovementsSeed" type="application/json"><?= json_encode($movements, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?></script>
<script id="analyticsProductsSeed" type="application/json"><?= json_encode($products, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?></script>
<?= $this->endSection() ?>
<?= $this->section('scripts') ?><script src="<?= base_url('assets/js/analytics.js') ?>"></script><?= $this->endSection() ?>
