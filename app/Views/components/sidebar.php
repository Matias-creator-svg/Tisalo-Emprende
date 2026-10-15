<?php
$navGroups = [
    'OPERACIÓN' => [
        ['Resumen', 'layout-grid', site_url('dashboard')],
        ['Venta rápida', 'shopping-cart', site_url('ventas')],
        ['Inventario', 'package', site_url('inventario')],
        ['Kardex', 'book-open', site_url('kardex')],
    ],
    'GESTIÓN' => [
        ['Analítica', 'chart-no-axes-combined', site_url('analitica')],
        ['Historial de ventas', 'receipt-text', site_url('historial-ventas')],
    ],
];
?>
<aside class="sidebar" id="sidebar">
    <div class="brand">
        <div class="brand-mark"><img src="<?= base_url('assets/img/tisaleo-emprende-icon.png') ?>" alt="Logo Tisaleo Emprende"></div>
        <div class="brand-copy"><strong>Tisaleo</strong><span>Emprende</span></div>
        <button class="mobile-close" id="mobileClose" type="button" aria-label="Cerrar menú"><i data-lucide="x"></i></button>
    </div>

    <div class="business-card">
        <div class="business-avatar" data-business-initials>HA</div>
        <div><strong data-business-name>Huerto Andino</strong><span data-business-sector>Agropecuario</span></div>
        <i data-lucide="chevron-right"></i>
    </div>

    <nav>
        <?php foreach ($navGroups as $group => $items): ?>
            <div class="nav-group">
                <span class="nav-label"><?= esc($group) ?></span>
                <?php foreach ($items as [$label, $icon, $url]): ?>
                    <a class="nav-item <?= ($active ?? '') === $label ? 'active' : '' ?>" href="<?= $url ?>">
                        <i data-lucide="<?= esc($icon) ?>"></i><span><?= esc($label) ?></span>
                    </a>
                <?php endforeach; ?>
            </div>
        <?php endforeach; ?>
    </nav>

    <div class="sidebar-bottom">
        <a class="nav-item <?= ($active ?? '') === 'Configuración' ? 'active' : '' ?>" href="<?= site_url('configuracion') ?>">
            <i data-lucide="settings"></i><span>Configuración</span>
        </a>
        <a class="nav-item logout-link" href="<?= site_url('logout') ?>"><i data-lucide="log-out"></i><span>Cerrar sesión</span></a>
    </div>
</aside>
