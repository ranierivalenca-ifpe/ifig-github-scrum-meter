<?php
    header('Content-type: text/css');
    system('sass scss-src/style.scss style.css');
    echo file_get_contents('style.css');
?>