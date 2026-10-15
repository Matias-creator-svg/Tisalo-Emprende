<?php

namespace App\Controllers;

use App\Libraries\DemoData;

class Kardex extends BaseController
{
    public function index()
    {
        helper('url');
        if (! session()->get('tisaleo_user')) return redirect()->to(site_url('login'));

        return view('kardex/index', [
            'pageTitle' => 'Kardex histórico | Tisaleo Emprende',
            'active' => 'Kardex',
            'movements' => DemoData::movements(),
        ]);
    }
}
