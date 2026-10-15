<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#293238">
    <title><?= esc($pageTitle) ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Montserrat:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= base_url('assets/css/app.css') ?>">
</head>
<body class="auth-body">
<main class="auth-page">
    <section class="auth-card">
        <div class="auth-brand">
            <span class="auth-logo"><img src="<?= base_url('assets/img/tisaleo-emprende-icon.png') ?>" alt="Tisaleo Emprende"></span>
            <div><strong>Tisaleo Emprende</strong><span>Plataforma de gestión comercial</span></div>
        </div>

        <div class="auth-copy">
            <span class="module-eyebrow">ACCESO AL SISTEMA</span>
            <h1>Inicia sesión</h1>
            <p>Gestiona ventas, inventario, trazabilidad y análisis de tu emprendimiento desde un solo lugar.</p>
        </div>

        <?php if (! empty($error)): ?>
            <div class="auth-error"><i data-lucide="circle-alert"></i><?= esc($error) ?></div>
        <?php endif; ?>

        <form class="auth-form" method="post" action="<?= site_url('login') ?>">
            <?= csrf_field() ?>
            <label>Correo electrónico
                <input type="email" name="email" placeholder="nombre@correo.com" value="<?= esc(old('email') ?? 'maria@tisaleo.ec') ?>" required>
            </label>
            <label>Contraseña
                <input type="password" name="password" placeholder="Ingresa tu contraseña" value="demo1234" minlength="4" required>
            </label>
            <label>Perfil de prueba
                <select name="profile">
                    <option value="emprendedor">Emprendedor local</option>
                    <option value="auxiliar">Auxiliar</option>
                    <option value="administrador">Administrador</option>
                </select>
            </label>
            <label class="auth-check"><input type="checkbox" name="remember" value="1"><span>Recordar sesión en esta demostración</span></label>
            <button class="auth-submit" type="submit">Iniciar sesión <i data-lucide="arrow-right"></i></button>
        </form>

        <div class="auth-links"><span>Acceso interno · Tisaleo</span><button type="button" onclick="alert('Flujo de recuperación pendiente de conexión con correo.')">Olvidé mi contraseña</button></div>
        <div class="auth-demo"><i data-lucide="shield-check"></i><span>Modo demostrativo: las pantallas ya están conectadas entre sí, pero todavía no guardan datos en MySQL.</span></div>
    </section>
</main>
<script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"></script>
<script>window.lucide?.createIcons({attrs:{'stroke-width':1.8}});</script>
</body>
</html>
