<?php

require 'Response.class.php';

$url = $_GET['url'] ?? false;
// $url = 'https://api.github.com/repos/gmatheus66/reqon/commits';
$reload = $_GET['r'] ?? false;
if ($url === false) {
    exit();
}

$res = Response::get($url);
if ($res === false || $reload !== false || $res->isOutdated() || !$res->isResponseOk()) {
    $ch = curl_init($url);

    $auth = '';
    if (is_file('.github-auth')) {
        $auth = "Authorization: token " . file_get_contents('.github-auth');
    }

    curl_setopt_array($ch, [
        CURLOPT_USERAGENT => 'PHP CURL',
        CURLOPT_HEADER => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            $auth,
            'Accept: application/vnd.github.mockingbird-preview'
        ]
    ]);

    $res = new Response($url, curl_exec($ch));
    $res->save();
}

array_map(function($h) {
    header($h);
}, explode("\n", $res->header));
echo $res->body;

?>