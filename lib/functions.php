<?php
//ini_set('display_errors', 1);
if (!isset($_SESSION)) {
   // session_start();
}
//
// database connection

include_once 'MidoDb.php';

// create the DB Connection

function makeClean($value)
{
    $db = new MidoDb();
    $conn = $db->createConnection("LI");

    if ($value) {
        $value = strip_tags($value);
        $value = stripslashes($value);
        $value = mysqli_real_escape_string($conn, $value);
        return $value;
    }
}


function cleanPostArray($postData)
{
    /*
     * define array to hold cleaned content
     */
    $arrCleanValue = null;

    if ($postData) {
        foreach ($postData as $key => $postValue) {
            if ($postValue != '') {
                $cleanValue = makeClean($postValue);
            }
            $arrCleanValue[$key] = $postValue;
        }
        //var_dump($arrCleanValue);
        return $arrCleanValue;
    }
}

function isInjected($str)
{
    $injections = array('(\n+)',
        '(\r+)',
        '(\t+)',
        '(%0A+)',
        '(%0D+)',
        '(%08+)',
        '(%09+)'
    );
    $inject = join('|', $injections);
    $inject = "/$inject/i";
    if (preg_match($inject, $str)) {
        return true;
    } else {
        return false;
    }
}

function startSession()
{
    try{
        if (!isset($_SESSION)) {
            session_start();
        }
    } catch (Exception $e) {

    }
}

function getSessionElement($sessionKey)
{
    startSession();

    if (isset($_SESSION[$sessionKey])) {
		//var_dump('set');
        return $_SESSION[$sessionKey];
    } else {
        return null;
    }
}

function getPageUrlNoQuery($loadDefault = null)
{
    $pageUrl = ($_SERVER['PHP_SELF']);
    //var_dump($pageUrl);
    return $pageUrl;
}

function getPageAshQuery($loadDefault = null)
{
   // var_dump($_SERVER);

}

function setSessionElement($sessionKey, $newValue = null)
{
    startSession();
    $_SESSION[$sessionKey] = $newValue;
    return true;
}

function logOut($loginPage = null, $redirect = true)
{
    $currentDomain=getSessionElement('api_domain');
    startSession();
    session_destroy();
    if ($redirect != false) {
        if ($loginPage != null) {
            $logOutRes = takeToLogin("$loginPage/$currentDomain");
        } else {
            $logOutRes = takeToLogin("/../.../index.php/$currentDomain");
        }
        return $logOutRes;
    }

}

function takeToLogin($loginPage = '../login.php', $locDepth = null, $echoLocation = false)
{
    if ($locDepth) {
        /*
         * append the location depth prefix to loginpage
         */
        $loginPage = $locDepth . "/" . $loginPage;
    }

    if ($echoLocation == true) {
        return $loginPage;
    } else {
        header("location:$loginPage");
    }
}

function takeToPage($defaultPage = 'index.php', $locDepth = null)
{
    if ($locDepth) {
        /*
         * append the location depth prefix to defaultpage
         */
        $defaultPage = $locDepth . "/" . $defaultPage;
    }

    header("location:$defaultPage");
}

function validateAdmin($loginPath = '/index.php')
{
    $userType = getSessionElement('user_type');

    if ($userType <= 0) {
        takeToPage($loginPath);
    }
}

function validateLogin($domainRole="student", $loginPath = '../../login.php')
{
    $user = getSessionElement('user_name');
    $role = getSessionElement('user_role');
    $id = getSessionElement('user_id');
	//var_dump($user);
    if (!$user) {
        takeToPage($loginPath);
    }
}

function createLocalDate($format = null, $locale = 'Africa/Lagos')
{
    $today = \DateTime::createFromFormat('d/m/Y', date('d/m/Y'), timezone_open($locale));
    if ($format == null) {
        return $today;
    } else {
        return date_format($today, $format);
    }
}

function createLocalTime($format = null, $locale = 'Africa/Lagos')
{
    $time = \DateTime::createFromFormat('H:i:s', date('H:i:s'), timezone_open($locale));
    if ($format == null) {
        return $time;
    } else {
        return date_format($time, $format);
    }
}

function createDateObjFromString($dateValue, $dateInFormat, $format = null, $locale = 'Africa/Lagos')
{
    $date = \DateTime::createFromFormat($dateInFormat, $dateValue, timezone_open($locale));

    if ($format) {
        return date_format($date, $format);
    } else {
        return $date;

    }
}


function createDateDiff($dateValue, $timeSpan = '24 Hours', $locale = 'Africa/Lagos')
{
    $timeLimit = date_interval_create_from_date_string($timeSpan);
    //var_dump($dateValue);
    return date_add($dateValue, $timeLimit);
}

function createTimeDiff($timeValue, $timeSpan = '24 Hours', $locale = 'Africa/Lagos')
{
    $timeLimit = date_interval_create_from_date_string($timeSpan);
    //$curTime = \DateTime::createFromFormat('H:i:s', $timeValue, timezone_open($locale));
    $time = date_add($timeValue, $timeLimit);
    return date_format($time, "H:i:s");
}


function uploadFile($file, $uploadDirectory, $shortDirectory=null, $acceptedFormat = null, $uniqueId=null, $autoCreateDirectory=false)
{
    $image = $file['name'];
    $fileType = $file['type'];
    $fileSize = $file['size'];
    $fileTempName = $file['tmp_name'];
    $fileBasename = basename($image);

    if($uniqueId!==null) {
        $fileBasename="$uniqueId-$fileBasename";
    }

    /*
     * Check validity of the file passed
     */
    $validFile = checkValidFile($fileBasename, $acceptedFormat);
    if ($validFile == false) {
        $msg = "Could not upload file. Invalid file type or file size. Please check and try again";
        return array(
            'status' => false,
            'msg' => $msg,
        );
    }
    // check if directory exist

    if(!is_dir($uploadDirectory)) {
        // check if we are to auto create a new directory
        if($autoCreateDirectory===true) {
            createLoopedDirectory($uploadDirectory);
        } else {
            $msg = "Directory does not exist";
            return array(
                'status' => false,
                'msg' => $msg,
            );
        }
    }
    /*
     * remove any space or ur formatting added to filenam
     */
    $fileBasename= str_replace(" ", "_", $fileBasename);
    $finalDir = $uploadDirectory . "/" . $fileBasename;
    $shortDir = $shortDirectory . "/" . $fileBasename;

    if (move_uploaded_file($fileTempName, $finalDir)) {
        return array(
            'status' => true,
            'msg' => 'File uploaded',
            'full_file_path' => $finalDir,
            'short_file_path' => $shortDir,
        );
    } else {
        return array(
            'status' => false,
            'msg' => 'File could not be uploaded',
        );
    }
}

function checkValidFile($fileBaseName, $acceptList = null)
{
    /*
     * default valid to false
     */
    $valid = false;

    if ($fileBaseName && $acceptList == null) {
        /*
         * just accept
         */
        return true;
    }
    /*
     * check for injection
     */
    if (isInjected($fileBaseName)) {
        return false;
    }
    /*
     * split the file name to get extension
     */

    //var_dump($fileBaseName);

    $arrExt = explode('.', $fileBaseName);
    if (!is_array($arrExt)) {
        return false;
    }
    $ext = strtolower($arrExt[count($arrExt) - 1]);

    /*
     * check against the accepted format provided
     */
    $arrAccep = explode('/', $acceptList);
    foreach ($arrAccep as $curExt) {
        if ($ext == strtolower($curExt)) {
            $valid = true;
            break;
        }
    }
    return $valid;
}

function createLoopedDirectory($path, $delim='/') {
    if (!$path|| $path==='') {
        return false;
    }
    $arrPaths= explode($delim, $path);

    $loopedPath=null;
    $n=0;
     foreach ($arrPaths as $curPath) {
         // build string
         if($n===0 ) {
             $loopedPath=$curPath;
         } else {
             $loopedPath=$loopedPath.$delim.$curPath;
         }
         if(!is_dir($loopedPath)) {
            if($loopedPath!=='' && $loopedPath!==null && $loopedPath!=null) {
                // echo("Will create $loopedPath <br/>");
                 mkdir($loopedPath);
             }
         }
         $n++;
     }
}