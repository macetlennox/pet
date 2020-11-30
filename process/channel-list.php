<?php
include_once "./../resolve.php";
    $pet= new Pet();
    $res=$pet->getChannelList($_GET);
    echo json_encode($res);