<?php
class DB {
    private static $instance;
    private $dbConn;

    private function __construct($db) {
        $dbName = "{$db}.db";
        if (!is_file($dbName)) {
            if (!is_file("{$db}.sql")) {
                throw new Exception("Can't find or create database {$db}", 1);
                exit();
            }
            (new SQLite3($dbName))->exec(file_get_contents("{$db}.sql"));
        }
        $this->dbConn = new PDO("sqlite:{$dbName}");
    }

    public static function getInstance($db) {
        if (self::$instance == null) {
            self::$instance = new DB($db);
        }
        return self::$instance->dbConn;
    }
}
?>