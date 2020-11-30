<?php
include_once "./../resolve.php";
    $pet= new Pet();
    $res=$pet->logoutUser();
    echo json_encode($res);