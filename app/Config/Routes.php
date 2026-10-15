<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */

$routes->get('/', 'Auth::index');
$routes->get('login', 'Auth::index');
$routes->post('login', 'Auth::login');
$routes->get('logout', 'Auth::logout');

$routes->get('dashboard', 'Dashboard::index');
$routes->get('ventas', 'Ventas::index');
$routes->get('inventario', 'Inventario::index');
$routes->get('kardex', 'Kardex::index');
$routes->get('analitica', 'Analitica::index');
$routes->get('historial-ventas', 'HistorialVentas::index');
$routes->get('configuracion', 'Configuracion::index');