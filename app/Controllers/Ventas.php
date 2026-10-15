<?php

namespace App\Controllers;

use App\Libraries\DemoData;

class Ventas extends BaseController
{
    public function index()
    {
        helper('url');
        if (! session()->get('tisaleo_user')) return redirect()->to(site_url('login'));

        return view('ventas/index', [
            'pageTitle' => 'Venta rápida | Tisaleo Emprende',
            'active' => 'Venta rápida',
            'saleNumber' => 'V-' . date('His'),
            'products' => DemoData::products(),
            'services' => DemoData::services(),
        ]);
    }
}
