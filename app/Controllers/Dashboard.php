<?php

namespace App\Controllers;

class Dashboard extends BaseController
{
    public function index()
    {
        helper('url');
        if (! session()->get('tisaleo_user')) return redirect()->to(site_url('login'));

        return view('dashboard/index', [
            'pageTitle' => 'Resumen | Tisaleo Emprende',
            'active' => 'Resumen',
            'sales' => [
                ['day' => 'Lun', 'value' => 310, 'height' => 42],
                ['day' => 'Mar', 'value' => 475, 'height' => 63],
                ['day' => 'Mié', 'value' => 390, 'height' => 52],
                ['day' => 'Jue', 'value' => 610, 'height' => 82],
                ['day' => 'Vie', 'value' => 530, 'height' => 70],
                ['day' => 'Sáb', 'value' => 745, 'height' => 100],
                ['day' => 'Dom', 'value' => 580, 'height' => 78],
            ],
            'products' => [
                ['rank' => 1, 'name' => 'Mora fresca', 'meta' => 'Libra · Agropecuario', 'sold' => '38 lb', 'total' => '$76,00', 'icon' => 'M'],
                ['rank' => 2, 'name' => 'Mermelada artesanal', 'meta' => 'Frasco · Procesados', 'sold' => '24 un.', 'total' => '$96,00', 'icon' => 'JA'],
                ['rank' => 3, 'name' => 'Queso fresco', 'meta' => 'Unidad · Lácteos', 'sold' => '19 un.', 'total' => '$66,50', 'icon' => 'Q'],
            ],
            'alerts' => [
                ['name' => 'Yogur natural', 'stock' => '3 unidades', 'min' => 'Mín. 8', 'tone' => 'red'],
                ['name' => 'Mermelada de mora', 'stock' => '5 frascos', 'min' => 'Mín. 10', 'tone' => 'orange'],
                ['name' => 'Canasta de fresas', 'stock' => '4 canastas', 'min' => 'Mín. 6', 'tone' => 'orange'],
            ],
        ]);
    }

    public function module(string $slug = '')
    {
        helper('url');

        $modules = [
            'inventario' => ['Inventario', 'package'],
            'catalogo' => ['Catálogo', 'layers-3'],
            'kardex' => ['Kardex', 'book-open'],
            'caja' => ['Caja diaria', 'wallet-cards'],
            'reportes' => ['Reportes', 'chart-no-axes-combined'],
            'mi-negocio' => ['Mi negocio', 'store'],
            'configuracion' => ['Configuración', 'settings'],
        ];

        if (! isset($modules[$slug])) {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }

        [$name, $icon] = $modules[$slug];

        return view('modules/placeholder', [
            'pageTitle' => $name . ' | Tisaleo Emprende',
            'active' => $name,
            'moduleName' => $name,
            'moduleIcon' => $icon,
        ]);
    }
}
