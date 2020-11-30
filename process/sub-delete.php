<?php
include_once "./../resolve.php";
    $pet= new Pet();
    $res=$pet->deleteSubscription($_GET);
    echo json_encode($res);