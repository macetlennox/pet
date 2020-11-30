<?php
include_once "./../resolve.php";
if (isset($_GET['user']) && isset($_GET['password'])) {
    $pet= new Pet();
    $res=$pet->createUser($_GET);
    echo json_encode($res);
}