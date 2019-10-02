<?php
class DB {
    private static $instance;
    private $dbConn;

    private function __construct($db) {
        $this->dbConn = new PDO("sqlite:{$db}.sqlite");
    }

    public static function getInstance($db) {
        if (self::$instance == null) {
            self::$instance = new DB($db);
        }
        return self::$instance->dbConn;
    }
}
?>