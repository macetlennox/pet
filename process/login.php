<?php
include_once "./../resolve.php";
if (isset($_GET['user']) && isset($_GET['password'])) {
    $pet= new Pet();
    $res=$pet->loginUser($_GET);
    echo json_encode($res);
} else if (isset($_GET['action']) && isset($_GET['action'])=="recover-login") {
    $pet= new Pet();
    $res=$pet->loginRecover($_GET);
    echo json_encode($res);
}