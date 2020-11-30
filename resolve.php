<?php
$includeFiles = array(
    'lib/functions.php',
    'lib/Pet.php',
);

$baseDir = null;
foreach ($includeFiles as $includeFile) {
    for ($n = 0; $n < 20; $n++) {
        if (file_exists($includeFile)) {
            include_once $includeFile;
            break;
        } else {
            $baseDir = "../$baseDir";
            $includeFile = "../$includeFile";
        }
    }
}
/*
 * create a new pet object
 *
 */

$pet = new Pet();