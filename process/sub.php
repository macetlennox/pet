<?php
include_once "./../resolve.php";
    $pet= new Pet();
    $res=$pet->addSubscription($_GET);
    echo json_encode($res);