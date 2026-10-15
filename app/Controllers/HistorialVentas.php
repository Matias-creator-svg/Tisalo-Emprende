<?php

namespace App\Controllers;

use App\Libraries\DemoData;

class HistorialVentas extends BaseController
{
    public function index()
    {
        helper('url');
        if (! session()->get('tisaleo_user')) return redirect()->to(site_url('login'));

        return view('historial/index', [
            'pageTitle' => 'Histórico de ventas | Tisaleo Emprende',
            'active' => 'Historial de ventas',
            'sales' => DemoData::sales(),
        ]);
    }
}
