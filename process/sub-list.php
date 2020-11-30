<?php
include_once "./../resolve.php";
    $pet= new Pet();
    $res=$pet->getSubscriptionList($_GET);
    echo json_encode($res);