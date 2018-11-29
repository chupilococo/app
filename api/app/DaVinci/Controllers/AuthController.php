<?php

namespace DaVinci\Controllers;

use DaVinci\Auth\Auth;
use DaVinci\Core\App;
use DaVinci\Core\View;

class AuthController
{
    public function login()
    {
        $input = file_get_contents('php://input');
        $postData = json_decode($input, true);
        //print_r($postData);
        View::renderJson(Auth::login($postData['usuario'],$postData['password']));
    }
}