<?php
require_once __DIR__ . "/../Models/UserModel.php";

class AuthController {

  public static function signup() {
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data["email"] ?? "";
    $password = $data["password"] ?? "";

    if (!$email || !$password) {
      http_response_code(400);
      echo json_encode(["error" => "Missing email/password"]);
      return;
    }

    UserModel::create($email, $password);
    echo json_encode(["message" => "User created"]);
  }



  public static function Login(){
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data["email"] ?? "";
    $password = $data["password"] ?? "";

    if (!$email || !$password) {
      http_response_code(400);
      echo json_encode(["error" => "Missing email/password"]);
      return;
    }

    UserModel::VerifyUser($email, $password);
    echo json_encode(["message" => "Login Successfully"]);
  }
}
?>
