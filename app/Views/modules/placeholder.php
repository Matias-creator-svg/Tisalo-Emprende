<?= $this->extend('layouts/main') ?>
<?= $this->section('content') ?>
<div class="module-placeholder">
    <span class="module-placeholder-icon"><i data-lucide="<?= esc($moduleIcon) ?>"></i></span>
    <span class="eyebrow">TISALEO EMPRENDE</span>
    <h1><?= esc($moduleName) ?></h1>
    <p>El módulo ya tiene su ruta preparada. Lo construiremos a continuación utilizando el diseño original de Figma.</p>
    <a class="primary-button" href="<?= site_url('/') ?>"><i data-lucide="arrow-left"></i> Volver al resumen</a>
</div>
<?= $this->endSection() ?>
