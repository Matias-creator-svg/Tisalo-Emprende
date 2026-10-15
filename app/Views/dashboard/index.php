<?= $this->extend('layouts/main') ?>
<?= $this->section('content') ?>

<div class="content">
    <section class="welcome">
        <div>
            <span class="eyebrow"><?= esc(mb_strtoupper((new IntlDateFormatter('es_EC', IntlDateFormatter::FULL, IntlDateFormatter::NONE))->format(time()))) ?></span>
            <h1>Buenos días, <?= esc(explode(' ', session()->get('tisaleo_user.name') ?? 'María')[0]) ?></h1>
            <p>Este es el pulso de tu negocio hoy. Todo está bajo control.</p>
        </div>
        <a class="primary-button" href="<?= site_url('ventas') ?>">
            <i data-lucide="plus"></i> Nueva venta
        </a>
    </section>

    <section class="kpi-grid">
        <article class="kpi-card featured">
            <div class="kpi-top">
                <span class="kpi-icon"><i data-lucide="banknote"></i></span>
                <span class="trend positive"><i data-lucide="trending-up"></i> 12,5%</span>
            </div>
            <span class="kpi-label">INGRESOS DE HOY</span>
            <strong class="kpi-value">$ 584,50</strong>
            <small>vs. $519,50 ayer</small>
            <div class="spark" aria-hidden="true">
                <?php foreach ([35, 48, 42, 65, 58, 86, 100] as $height): ?>
                    <i style="height: <?= $height ?>%"></i>
                <?php endforeach; ?>
            </div>
        </article>

        <article class="kpi-card">
            <div class="kpi-top">
                <span class="kpi-icon green"><i data-lucide="shopping-cart"></i></span>
                <span class="trend positive"><i data-lucide="trending-up"></i> 8,2%</span>
            </div>
            <span class="kpi-label">VENTAS REALIZADAS</span>
            <strong class="kpi-value">18</strong>
            <small>Ticket promedio: $32,47</small>
        </article>

        <article class="kpi-card">
            <div class="kpi-top">
                <span class="kpi-icon amber"><i data-lucide="package"></i></span>
                <span class="status-pill">Revisar</span>
            </div>
            <span class="kpi-label">PRODUCTOS CON STOCK BAJO</span>
            <strong class="kpi-value">3</strong>
            <a class="text-link" href="<?= site_url('inventario') ?>">Ver inventario <i data-lucide="arrow-right"></i></a>
        </article>

        <article class="kpi-card">
            <div class="kpi-top">
                <span class="kpi-icon coral"><i data-lucide="triangle-alert"></i></span>
                <span class="trend negative">2,1%</span>
            </div>
            <span class="kpi-label">MERMAS ESTE MES</span>
            <strong class="kpi-value">$ 38,20</strong>
            <small>12,4 kg registrados</small>
        </article>
    </section>

    <section class="dashboard-grid">
        <article class="panel sales-panel">
            <div class="panel-head">
                <div><span class="panel-kicker">RENDIMIENTO</span><h2>Ingresos por ventas</h2></div>
                <select aria-label="Periodo del reporte">
                    <option>Esta semana</option>
                    <option>Este mes</option>
                    <option>Últimos 3 meses</option>
                </select>
            </div>
            <div class="chart-summary">
                <strong>$ 3.640,00</strong>
                <span><i data-lucide="trending-up"></i> 15,8% vs. semana anterior</span>
            </div>
            <div class="bar-chart">
                <div class="y-axis"><span>$800</span><span>$600</span><span>$400</span><span>$200</span><span>$0</span></div>
                <div class="bars">
                    <?php foreach ($sales as $item): ?>
                        <div class="bar-item">
                            <div class="bar-wrap"><i style="height: <?= (int) $item['height'] ?>%"><span>$<?= esc($item['value']) ?></span></i></div>
                            <small><?= esc($item['day']) ?></small>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </article>

        <article class="panel payment-panel">
            <div class="panel-head">
                <div><span class="panel-kicker">CAJA DE HOY</span><h2>Medios de pago</h2></div>
                <button class="more-button js-toast" type="button" data-message="Opciones de caja">•••</button>
            </div>
            <div class="donut-row">
                <div class="donut"><div><strong>100%</strong><span>cobrado</span></div></div>
                <div class="payment-total"><span>Total recibido</span><strong>$584,50</strong><small>18 transacciones</small></div>
            </div>
            <div class="payment-list">
                <div><i class="dot cash-dot"></i><span><strong>Efectivo</strong><small>11 ventas</small></span><b>$362,50</b><em>62%</em></div>
                <div><i class="dot bank-dot"></i><span><strong>Transferencia</strong><small>7 ventas</small></span><b>$222,00</b><em>38%</em></div>
            </div>
            <a class="secondary-button" href="<?= site_url('analitica') ?>">Ver analítica <i data-lucide="arrow-right"></i></a>
        </article>

        <article class="panel products-panel">
            <div class="panel-head">
                <div><span class="panel-kicker">DESEMPEÑO</span><h2>Productos más vendidos</h2></div>
                <a class="text-link" href="<?= site_url('analitica') ?>">Ver analítica <i data-lucide="arrow-right"></i></a>
            </div>
            <div class="product-list">
                <?php foreach ($products as $product): ?>
                    <div class="product-row">
                        <span class="rank"><?= esc($product['rank']) ?></span>
                        <span class="product-icon p<?= esc($product['rank']) ?>"><?= esc($product['icon']) ?></span>
                        <span class="product-info"><strong><?= esc($product['name']) ?></strong><small><?= esc($product['meta']) ?></small></span>
                        <span class="product-sold"><strong><?= esc($product['sold']) ?></strong><small>vendidos</small></span>
                        <b><?= esc($product['total']) ?></b>
                    </div>
                <?php endforeach; ?>
            </div>
        </article>

        <article class="panel alerts-panel">
            <div class="panel-head">
                <div><span class="panel-kicker">REQUIERE ATENCIÓN</span><h2>Alertas de inventario</h2></div>
                <span class="alert-count">3</span>
            </div>
            <div class="alert-list">
                <?php foreach ($alerts as $alert): ?>
                    <div class="alert-row">
                        <span class="alert-icon <?= esc($alert['tone']) ?>"><i data-lucide="triangle-alert"></i></span>
                        <span><strong><?= esc($alert['name']) ?></strong><small><?= esc($alert['stock']) ?> disponibles</small></span>
                        <em><?= esc($alert['min']) ?></em>
                    </div>
                <?php endforeach; ?>
            </div>
            <a class="secondary-button" href="<?= site_url('inventario') ?>">Gestionar inventario <i data-lucide="arrow-right"></i></a>
        </article>
    </section>

    <section class="quick-section">
        <div class="section-title">
            <div><span class="panel-kicker">ACCESOS DIRECTOS</span><h2>Operaciones frecuentes</h2></div>
            <p>Registra los movimientos de tu negocio en pocos pasos.</p>
        </div>
        <div class="quick-grid">
            <a href="<?= site_url('ventas') ?>"><span class="quick-icon sale"><i data-lucide="shopping-cart"></i></span><span><strong>Nueva venta</strong><small>Registra una venta rápida</small></span><i data-lucide="arrow-right"></i></a>
            <a href="<?= site_url('inventario') ?>"><span class="quick-icon entry"><i data-lucide="package-plus"></i></span><span><strong>Registrar entrada</strong><small>Añade stock a bodega</small></span><i data-lucide="arrow-right"></i></a>
            <a href="<?= site_url('inventario') ?>"><span class="quick-icon waste"><i data-lucide="triangle-alert"></i></span><span><strong>Registrar merma</strong><small>Reporta pérdidas de stock</small></span><i data-lucide="arrow-right"></i></a>
            <a href="<?= site_url('kardex') ?>"><span class="quick-icon kardex"><i data-lucide="book-open"></i></span><span><strong>Consultar Kardex</strong><small>Revisa todos los movimientos</small></span><i data-lucide="arrow-right"></i></a>
        </div>
    </section>
</div>

<?= $this->endSection() ?>
