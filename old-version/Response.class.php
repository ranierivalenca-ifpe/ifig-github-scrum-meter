<?php
class Response {
    public $timestamp;
    public $header;
    public $body;

    public function __construct($response) {
        $parts = explode("\n", $response);

        for ($i = 0; ; $i++) {
            if (trim($parts[$i]) == '') break;
        }

        $this->timestamp = time();
        $this->header = implode("\n", array_slice($parts, 0, $i));
        $this->body = implode("\n", array_slice($parts, $i + 1));
    }

    public function isOutdated() {
        return $this->timestamp < (time() - 24 * 60 * 60);
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
}
?>