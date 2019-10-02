<?php
include 'Response.class.php';
$cache = unserialize(file_get_contents('data.dump'));
var_dump(
    $cache[array_keys($cache)[0]]->responseCode()[0] == '2'
);
?>