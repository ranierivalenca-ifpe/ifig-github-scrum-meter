<?php

require 'Response.class.php';

$url = $_GET['url'] ?? false;
// $url = 'https://api.github.com/repos/gmatheus66/reqon/commits';
$reload = $_GET['r'] ?? false;
if ($url === false) {
    exit();
}

$cache_data = is_file('data.dump') ? file_get_contents('data.dump') : false;
$cache = $cache_data !== false ? unserialize($cache_data) : [];

$res = $cache[$url] ?? false;
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

    $res = new Response(curl_exec($ch));
    $cache[$url] = $res;
    file_put_contents('data.dump', serialize($cache));
}

array_map(function($h) {
    header($h);
}, explode("\n", $res->header));
echo $res->body;

?>