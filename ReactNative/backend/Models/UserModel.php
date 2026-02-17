<?php
require_once __DIR__ . "/../database.php";

class UserModel {

    // 
    public static function create($email, $password) {
        global $pdo;

        // 
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare(
            "INSERT INTO users (email, password) VALUES (?, ?)"
        );

        return $stmt->execute([$email, $hashedPassword]);
    }

    
    // 
    public static function findByEmail($email) {
        global $pdo;

        $stmt = $pdo->prepare(
            "SELECT * FROM users WHERE email = ?"
        );

        $user = UserModel::findByEmail($email);

        if (!$user || !password_verify($password, $user["password"])) {
            return 
    //
}

        $stmt->execute([$email]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

}
