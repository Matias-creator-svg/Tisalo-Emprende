<?= $this->extend('layouts/main') ?>
<?= $this->section('content') ?>
<div class="workspace-page" id="settingsPage">
  <section class="module-heading"><div><span class="module-eyebrow">PERFIL DEL EMPRENDIMIENTO</span><h1>Configuración</h1><p>Actualiza los datos del negocio y elige los módulos que utilizas.</p></div></section>
  <div class="settings-grid">
    <section class="workspace-card settings-card">
      <div class="data-card-head"><div><span class="panel-kicker">INFORMACIÓN DEL NEGOCIO</span><h2>Datos de perfil</h2><small>Información visible dentro de la plataforma.</small></div></div>
      <form id="businessProfileForm" class="catalog-form settings-form">
        <label>Nombre comercial<input id="cfgBusinessName" required></label>
        <label>RUC / RIMPE<input id="cfgRuc"></label>
        <label>Representante<input id="cfgRepresentative"></label>
        <label>Teléfono<input id="cfgPhone"></label>
        <label>Sector económico principal<select id="cfgSector"><option>Agropecuario</option><option>Gastronómico</option><option>Artesanal</option><option>Textil</option><option>Turístico</option><option>Servicios</option></select></label>
        <label>Dirección<input id="cfgAddress"></label>
        <div class="span-2"><button class="primary-button" type="submit"><i data-lucide="save"></i> Guardar perfil</button></div>
      </form>
    </section>
    <section class="workspace-card settings-card">
      <div class="data-card-head"><div><span class="panel-kicker">MÓDULOS DEL NEGOCIO</span><h2>Modelo de catálogo</h2><small>Activa las operaciones que corresponden a tu actividad.</small></div></div>
      <div class="module-toggle-list">
        <label><span><strong>Productos físicos</strong><small>POS, inventario, Kardex y mermas</small></span><input id="cfgProductsModule" type="checkbox"></label>
        <label><span><strong>Servicios</strong><small>Servicios y cobros sin manejo de stock</small></span><input id="cfgServicesModule" type="checkbox"></label>
      </div>
      <div class="settings-note"><i data-lucide="info"></i><span>Puedes trabajar con productos, servicios o un modelo mixto. En esta etapa los cambios se guardan en el navegador.</span></div>
    </section>
  </div>
</div>
<?= $this->endSection() ?>
<?= $this->section('scripts') ?><script src="<?= base_url('assets/js/settings.js') ?>"></script><?= $this->endSection() ?>
