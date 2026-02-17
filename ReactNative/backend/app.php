<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") { exit; }

$route = $_GET["route"] ?? "";

require_once __DIR__ . "/../controllers/AuthController.php"; 


switch ($route) {
  case "user/signup":
    AuthController::signup();
    break;

  case "":
    AuthController::Login();
    break;

  case "":

  default:
    http_response_code(404);
    echo json_encode(["error" => "Route not found"]);
}
