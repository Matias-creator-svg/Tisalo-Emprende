<?php

namespace App\Controllers;

class Configuracion extends BaseController
{
    public function index()
    {
        helper('url');
        if (! session()->get('tisaleo_user')) return redirect()->to(site_url('login'));

        return view('configuracion/index', [
            'pageTitle' => 'Configuración | Tisaleo Emprende',
            'active' => 'Configuración',
        ]);
    }
}
