<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#293238">
    <title><?= esc($pageTitle ?? 'Tisaleo Emprende') ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Montserrat:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= base_url('assets/css/app.css') ?>">
</head>
<body>
<div class="app-shell">
    <?= $this->include('components/sidebar') ?>

    <button class="backdrop" id="backdrop" type="button" aria-label="Cerrar menú"></button>

    <main class="main">
        <?= $this->include('components/topbar') ?>
        <?= $this->renderSection('content') ?>
    </main>
</div>

<div class="toast" id="toast" role="status" aria-live="polite">
    <span><i data-lucide="leaf"></i></span>
    <b id="toastMessage"></b>
</div>

<script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"></script>
<script src="<?= base_url('assets/js/app.js') ?>"></script>
<?= $this->renderSection('scripts') ?>
</body>
</html>
