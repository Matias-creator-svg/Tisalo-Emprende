<?php $user = session()->get('tisaleo_user') ?? ['name' => 'María Sánchez', 'role' => 'Administradora']; ?>
<header class="topbar">
    <button class="menu-button" id="menuButton" type="button" aria-label="Abrir menú"><i data-lucide="menu"></i></button>
    <label class="search">
        <i data-lucide="search"></i>
        <input type="search" placeholder="Buscar productos, ventas..." aria-label="Buscar">
        <kbd>Ctrl K</kbd>
    </label>
    <div class="top-actions">
        <span class="top-date"><?= esc(date('d/m/Y')) ?></span>
        <button class="icon-button notification js-toast" type="button" data-message="Revisa las alertas de inventario" aria-label="Notificaciones"><i data-lucide="bell"></i><span class="notification-dot"></span></button>
        <div class="divider"></div>
        <button class="user-menu js-toast" type="button" data-message="Perfil de <?= esc($user['name']) ?>">
            <div class="avatar"><?= esc(mb_strtoupper(mb_substr($user['name'], 0, 1) . mb_substr(strrchr($user['name'], ' ') ?: 'S', 1, 1))) ?></div>
            <div><strong><?= esc($user['name']) ?></strong><span><?= esc($user['role']) ?></span></div><span class="down">⌄</span>
        </button>
    </div>
</header>
