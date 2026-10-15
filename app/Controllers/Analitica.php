<?php

namespace App\Controllers;

use App\Libraries\DemoData;

class Analitica extends BaseController
{
    public function index()
    {
        helper('url');
        if (! session()->get('tisaleo_user')) return redirect()->to(site_url('login'));

        return view('analitica/index', [
            'pageTitle' => 'Analítica | Tisaleo Emprende',
            'active' => 'Analítica',
            'sales' => DemoData::sales(),
            'movements' => DemoData::movements(),
            'products' => DemoData::products(),
        ]);
    }
}
