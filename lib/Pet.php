<?php

/*
 *
 * @Class Name:Pet
 * @Date Created: 29 Dec, 2020
 * @Version: 1.0
 * @Contributor: Adeniyi Anthony A <a.anthony@mlisoftinc.com>
 * @link:www.mlisoftinc@gmail.com
 *
 */


class Pet
{
    /*
     * -------------------------------------------------------
     * Handles all meeting interaction with our application
     * -------------------------------------------------------
     */
    protected $userDetails;
    protected $userSession;
    protected $app;
    protected $dateIn;
    protected $timeIn;
    protected $defaultAppName;

    /*
     * Set our class in motion to run
     */
    public function __construct()
    {
        /*
         * include utility functions for our class
         */
        include_once 'functions.php';
        include_once 'MidoDb.php';
        include_once 'InputValidation.php';
        $this->dateIn = createLocalDate('d/m/Y');
        $this->timeIn = createLocalDate('H:i:s');

    }

    public function addSubscription($data, $baseTable = "channel_subscriber", $status = 1)
    {
        $db = new MidoDb();

        $data = cleanPostArray($data);

        $channelId = $data['channel-id'];
        $userId = getSessionElement('user_id');


        if ($channelId == null) {
            $msg = "Please select a channel";
            return array(
                'status' => false,
                'msg' => $msg,
            );
        }

        if ($userId == null) {
            $msg = "Please  login first";
            return array(
                'status' => false,
                'msg' => $msg,
            );
        }

        $check = "SELECT* FROM $baseTable WHERE channel_id = $channelId and user_id=$userId";

        $subscribeExist = $db->isRecordFound($check);

        if ($subscribeExist === true) {
            $msg = "You are already subscribed";
            return array(
                'status' => false,
                'msg' => $msg,
            );
        }
        $dataUpd=[];
        $dataUpd['channel_id'] = $channelId;
        $dataUpd['user_id'] = $userId;
        $dataUpd['channel'] = $this->getChannelName($channelId);
        $dataUpd['status'] = $status;

        $tableData = array(
            'name' => $baseTable,
            'data' => $dataUpd
        );
        $insertRes = $db->insertRecordWithArray($tableData);

        if ($insertRes === false) {
            $msg = "Could not subscribe. Please try again";
            return array(
                'status' => false,
                'msg' => $msg,
            );
        } else {
            $msg = "You are now subscribed";
            return array(
                'status' => true,
                'msg' => $msg,
            );
        }
    }

    public function deleteSubscription($data, $baseTable = "channel_subscriber")
    {
        $db = new MidoDb();

        $data = cleanPostArray($data);

        $channelId= $data['channel-id'];
        $userId = $data['user-id'];

        $check = "DELETE FROM $baseTable WHERE channel_id=$channelId and user_id=$userId";
        $del = $db->deleteRecordWithSql($check);


        if ($del === false) {
            $msg = "Could not unsubscribed";
            return array(
                'status' => false,
                'msg' => $msg,
            );
        } else {
            $msg = "You are now unsubscribed";
            return array(
                'status' => true,
                'msg' => $msg,
            );
        }
    }

    public function getSubscriptionList($data, $baseTable = "channel_subscriber")
    {

        $data = cleanPostArray($data);

        $sessionUser = getSessionElement("user");
        $userEmail = getSessionElement("user_email");
        $userId = getSessionElement("user_id");

        if ($sessionUser == null || $userId == null) {
            $msg = "Please login first";
            return array(
                'status' => false,
                'msg' => $msg,
                'content' => null,
            );
        }

        $db = new MidoDb();

        $userSql = "SELECT* FROM $baseTable WHERE user_id=$userId";

        $userRes = $db->selectRecordWithSql($userSql);
        $userResDet = $db->fetchAssoc($userRes);


        if (!$userResDet || $userResDet === null) {
            $msg = "No Subscription";
            return array(
                'status' => false,
                'msg' => $msg,
                'content' => null,
                'user' => $sessionUser,
            );
        } else {
            $msg = "Subscription found";
            return array(
                'status' => true,
                'msg' => $msg,
                'content' =>  $userResDet,
                'user' => $sessionUser,
            );
        }

    }

    public function getChannelList($data, $baseTable = "channel_subscriber", $baseTableChannels = "channels")
    {

        $sessionUser = getSessionElement("user");
        $userId = getSessionElement("user_id");

        if ($sessionUser == null || $userId == null) {
            $msg = "Please login first";
            return array(
                'status' => false,
                'msg' => $msg,
                'content' => null,
            );
        }

        $db = new MidoDb();
        /*
         * first, load all the current user subscriptions
         */
        $userSql = "SELECT* FROM $baseTable WHERE user_id=$userId";
        $userRes = $db->selectRecordWithSql($userSql);

        $whereClause="";
        $sqlChannels="";
        if($userRes===null) {
            /*
             * load all the channels since no subscription yet
             */
            $sqlChannels = "SELECT* FROM $baseTableChannels order by id ASC";
        } else {
            /*
             * build an exclude clause for already subscribed channels
             */
            foreach ($db->fetchAssoc($userRes) as $sub) {
                $subId=$sub['channel_id'];
                if ($whereClause==="") {
                    $whereClause=" id <> $subId";
                } else {
                    $whereClause="$whereClause and id <>$subId";
                }
                $sqlChannels = "SELECT* FROM $baseTableChannels WHERE $whereClause order by id ASC";
            }

        }
        // select channels
        $channels = $db->selectRecordWithSql($sqlChannels);
        $channelsDet = $db->fetchAssoc($channels);

        if (!$channelsDet || $channelsDet === null) {
            $msg = "No Channel available";
            return array(
                'status' => false,
                'msg' => $msg,
                'content' => null,
            );
        } else {
            $msg = "Channels found";
            return array(
                'status' => true,
                'msg' => $msg,
                'content' =>  $channelsDet,
            );
        }

    }

    public function createUser($data, $baseTable = "users", $status = 1)
    {
        $db = new MidoDb();

        $data = cleanPostArray($data);
        $passcode = makeClean($data['password']);
        $user = makeClean($data['user']);
        $email = makeClean($data['email']);
        $confirmPasscode = makeClean($data['password-confirm']);
        $password = md5($passcode);

        $validator = new InputValidation();
        $val = $validator->validateInputs($data);

        if ($passcode == "" || $confirmPasscode == "") {
            $msg = "Password or confirmation cannot be empty";
            return array(
                'status' => false,
                'msg' => $msg,
            );
        }

        if ($passcode !== $confirmPasscode) {
            $msg = "Password not matching. Please use a matching password";
            return array(
                'status' => false,
                'msg' => $msg,
            );
        }

        if (isset($val['error']) && $val['error'] == true) {
            $msg = "Invalid input. Ensure all required form field are entered<br>";
            foreach ($val['error_list'] as $error) {
                $msg = $msg . $error['name'] . " cannot be empty<br>";
            }

            if ($val['error'] === true) {
                return array(
                    'status' => false,
                    'input_error' => true,
                    'error_list' => $val['error_list'],
                    'msg' => $msg,
                );
            }
        }

        $emailCheck = "SELECT* FROM $baseTable WHERE email = '$email'";

        $validUser = $db->isRecordFound($emailCheck);

        if ($validUser === true) {
            $error = true;
            $msg = "User already exist. Please use another email address";
            return array(
                'status' => false,
                'msg' => $msg,
            );
        }
        /*
         * assign variables to data before updating
         */
        $data['password'] = $password;
        $data['status'] = $status;

        $tableData = array(
            'name' => $baseTable,
            'data' => $data
        );
        $insertRes = $db->insertRecordWithArray($tableData);

        if ($insertRes === false) {
            $msg = "Could not complete registration. Please try again";
            //$msg = $conn->error;
            return array(
                'status' => false,
                'msg' => $msg,
            );
        } else {
            $msg = "Account created. Please wait...";
            return array(
                'status' => true,
                'msg' => $msg,
            );
        }

    }

    public function loginUser($data, $api = false,  $baseTable = "users", $status = 0)
    {
        $db = new MidoDb();

        $data = cleanPostArray($data);
        $passcode = makeClean($data['password']);
        $user = makeClean($data['user']);

        if ($api === false) {
            $password = md5($passcode);
        } else {
            // api login data must be provided encoded
            $password = $passcode;
        }

        $emailCheck = "SELECT* FROM $baseTable WHERE user = '$user' And password='$password'";

        $validUser = $db->selectRecordWithSql($emailCheck);

        if ($validUser === null || $validUser == null) {
            $msg = "Invalid login details";
            setSessionElement("meet_user", null);
            setSessionElement("meet_user_email", null);
            return array(
                'status' => false,
                'msg' => $msg,
            );
        } else {
            // check user status
            $userDetails = $db->fetchAssoc($validUser)[0];

            if ($userDetails["status"] <= $status) {
                $msg = "Account has been deactivated $user. Please contact admin";
                setSessionElement("user", null);
                setSessionElement("user_email", null);
                setSessionElement("user_id", null);
                return array(
                    'status' => false,
                    'msg' => $msg,
                );
            } else {
                $msg = "Welcome $user";
                // set session variables to track for app
                setSessionElement("user", $user);
                setSessionElement("user_email", $userDetails["email"]);
                setSessionElement("user_id", $userDetails["id"]);
                return array(
                    'status' => true,
                    'msg' => $msg,
                    'user' => $userDetails["user"],
                    'email' => $userDetails["email"]
                );
            }
        }
    }

    /*
     * This function will validate user login domain
     * @param domainRole    def: Student
     */
    public function validateLogin($loginPath = 'index.php', $dashboard = true)
    {
        /*
         * use this function to extract session variable
         */
        $user = getSessionElement('user');
        $email = getSessionElement('user_email');
        $userId = getSessionElement('user_id');

        if ($user === null || $email === null || !$user || !$email) {
            takeToPage($loginPath);
        } else {
            return true;
        }
    }

    /*
     * This function will logout  user
     */
    public function logoutUser()
    {
        setSessionElement("meet_user", null);
        setSessionElement("meet_user_email", null);
        setSessionElement("meet_id", null);
        setSessionElement("meet_owner_email", null);

        $msg = "Logout successful";
        return array(
            'status' => true,
            'msg' => $msg,
        );
    }


    /*
     * some private functions
     */
    public function getChannelName($channelId, $baseTable = "channels")
    {


        $db = new MidoDb();

        $userSql = "SELECT* FROM $baseTable WHERE id=$channelId";
        $userRes = $db->selectRecordWithSql($userSql);
        $userResDet = $db->fetchAssoc($userRes);

        if (!$userRes) {
            return null;
        } else {
            return $userResDet[0]['channel'];
        }
    }


}