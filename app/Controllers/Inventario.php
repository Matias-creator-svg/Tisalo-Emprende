<?php

namespace App\Controllers;

use App\Libraries\DemoData;

class Inventario extends BaseController
{
    public function index()
    {
        helper('url');
        if (! session()->get('tisaleo_user')) return redirect()->to(site_url('login'));

        return view('inventario/index', [
            'pageTitle' => 'Inventario | Tisaleo Emprende',
            'active' => 'Inventario',
            'products' => DemoData::products(),
            'services' => DemoData::services(),
        ]);
    }
}
