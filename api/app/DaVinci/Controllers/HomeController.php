<?php

namespace DaVinci\Controllers;

use DaVinci\Auth\Auth;
use DaVinci\Core\App;
use DaVinci\Core\View;

class HomeController
{
    public function index()
    {
    	// Renderiza la vista "home.php" en la carpeta "views".
        View::render('home');
    }

    public function acerca()
    {
    	// Llamamos a la vista.
    	// La vista se la pasamos como string al método View::render()
    	// Y se va a buscar en la carpeta "views".
    	// Nota: No lleva la extensión ".php".
    	View::render('about');
    }

    public function serviciosHistoria()
    {
    	View::render('servicios-historia');
    }
}