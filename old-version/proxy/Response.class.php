<?php

require_once 'DB.class.php';

class Response {
    public $updated_at;
    public $header;
    public $body;


    public function __construct($url, $response = false) {
        $this->url = $url;

        if ($response === false) {
            return;
        }

        $parts = explode("\n", $response);

        for ($i = 0; ; $i++) {
            if (trim($parts[$i]) == '') break;
        }

        $this->updated_at = time();
        $this->header = implode("\n", array_slice($parts, 0, $i));
        $this->body = implode("\n", array_slice($parts, $i + 1));
    }

    public function save() {
        $db = DB::getInstance('cache');
        $stmt = $db->prepare(
            'delete from responses where url = ?;'
        );
        $stmt->execute([$this->url]);

        $stmt = $db->prepare(
            'insert into responses(url, header, body, updated_at) values (?, ?, ?, ?)'
        );
        $stmt->execute([
            $this->url, $this->header, $this->body, $this->updated_at
        ]);
    }

    public function isOutdated() {
        return $this->updated_at < (time() - 48 * 60 * 60);
    }

    public function responseCode() {
        $res =  explode("\n", $this->header)[0];
        preg_match('/HTTP.*?([\d]{3})/', $res, $match);
        $code = $match[1];
        return $code;
    }

    public function isResponseOk() {
        return $this->responseCode() == '200';
    }

    public static function get($url) {
        $db = DB::getInstance('cache');
        $stmt = $db->prepare(
            'select * from responses where url = ?'
        );
        $stmt->execute([$url]);
        $data = $stmt->fetch();
        if ($data === false) {
            return false;
        }
        $res = new Response($url);
        $res->header = $data['header'];
        $res->body = $data['body'];
        $res->updated_at = $data['updated_at'];
        return $res;
    }
}
?>