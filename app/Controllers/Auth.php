<?php

namespace App\Controllers;

class Auth extends BaseController
{
    public function index()
    {
        helper(['url', 'form']);

        if (session()->get('tisaleo_user')) {
            return redirect()->to(site_url('dashboard'));
        }

        return view('auth/login', [
            'pageTitle' => 'Iniciar sesión | Tisaleo Emprende',
            'error' => session()->getFlashdata('login_error'),
        ]);
    }

    public function login()
    {
        helper('url');

        $email = trim((string) $this->request->getPost('email'));
        $password = (string) $this->request->getPost('password');
        $profile = (string) $this->request->getPost('profile');

        if ($email === '' || strlen($password) < 4) {
            session()->setFlashdata('login_error', 'Ingresa un correo y una contraseña de al menos 4 caracteres.');
            return redirect()->back()->withInput();
        }

        $roles = [
            'emprendedor' => 'Emprendedora local',
            'auxiliar' => 'Auxiliar',
            'administrador' => 'Administradora',
        ];

        session()->set('tisaleo_user', [
            'name' => 'María Sánchez',
            'email' => $email,
            'role' => $roles[$profile] ?? 'Emprendedora local',
        ]);

        return redirect()->to(site_url('dashboard'));
    }

    public function logout()
    {
        helper('url');
        session()->remove('tisaleo_user');
        return redirect()->to(site_url('login'));
    }
}
