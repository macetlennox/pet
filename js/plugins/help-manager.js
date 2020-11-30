var HelpManager = {

    startHelp: function startHelp() {
        var introType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'user';
        var completeCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        var help = introJs();

        // get intro presentations
        var introOptions = helpNavigator[introType];
        help.setOptions(introOptions);
        help.start().oncomplete(function () {
            if (completeCallback !== null) {
                return completeCallback();
            }
        });
    },

    runHelpWithUrl: function runHelpWithUrl() {
        var gotoUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        // check if there is help to continue
        var winLoc = window.location.toString();
        var regEx = /#/;
        if (regEx.test(winLoc)) {
            var arrLoc = winLoc.split(regEx);
            if (arrLoc[1]) {
                var helpIndex = arrLoc[1];
                HelpManager.startHelp(helpIndex, function () {
                    if (gotoUrl !== null) {
                        window.location.href = gotoUrl;
                    }
                });
            }
        }
    }
};

var helpNavigator = {
    user: {
        steps: [{
            intro: "<div><h2>Hello! Welcome to Virtual Class</h2>" + "<p>This is the user help section</p>" + "<p>Click on the 'Next' button below to start going through your help</p>" + "</div>"
        }, {
            element: '#tool-board',
            intro: "<div><h5>Hey, it's the candy</h5>" + "<p>Open whiteboard and follow up on class in real-time.</p>" + "<p>To hide, click on this button when whiteboard is in view</p>" + "</div>"
        }, {
            element: '#tool-assignment',
            intro: "<div><h5>Check out assignments</h5>" + "<p>Follow up on assignments</p>" + "<p>Use the upload button on the page to upload assignments completed.</p>" + "</div>"
        }, {
            element: '#tool-lesson',
            intro: "<div><h5>Check out previous lessons</h5>" + "<p>Use this button to see previously saved lessons for this class</p>" + "<p>On the page, click on view to see content.</p>" + "</div>"
        }]
    },
    presenter: {
        doneLabel: "EXPLORE WHITEBOARD FEATURES",
        steps: [{
            intro: "<div><h2>Hello! Welcome to Virtual Class</h2>" + "<p>This is the Instructor help guide</p>" + "<p>Click on the 'Next' button below to start</p>" + "</div>"
        }, {
            element: '#tool-board',
            intro: "<div><h5>The board is the 'Key'!</h5>" + "<p>The whiteboard is your real-time presentation partner. Use the board to add your content </p>" + "<p>To hide, click on this button when whiteboard is in view</p>" + "</div>"
        }, {
            element: '#tool-assignment',
            intro: "<div><h5>Create Assignments</h5>" + "<p>Use this to create new assignments</p>" + "<p>You can also use this tool to follow up on submission and upload answers.</p>" + "</div>"
        }, {
            element: '#tool-lesson',
            intro: "<div><h5>Save lessons</h5>" + "<p>Save current lesson so that user can have offline access</p>" + "<p>You can also manage previous saved lessons.</p>" + "</div>"
        }]
    },
    admin: {
        steps: [{
            intro: "<div><h2>Hey Sparky! Welcome to Virtual Class</h2>" + "<p>I will take you through step by step approach to using your application</p>" + "<p>Click on the 'Next' button below to start</p>" + "</div>"
        }, {
            element: '#create-meet',
            intro: "Start using virtual class by creating your class or meet."
        }, {
            element: '#room-list',
            intro: "<div><h5>Your Virtual Class is here!</h5>" + "<p>The list of available virtual classes with their details  will be available here</p>" + "<p>You can share these link for students to join your class or meeting</p>" + "</div>"
        }, {
            element: '#tool-account',
            intro: "<div><h5>Your Account is Free</h5>" + "<p>Check your account details here</p>" + "<p>Upgrade to a bigger plan and enjoy more product and services</p>" + "</div>"
        }, {
            element: '#tool-settings',
            intro: "<div><h5>Customize your Settings</h5>" + "<p>Use this tool to customize your account using personalized banner</p>" + "<p>You can also change passoword and other user details.</p>" + "</div>"
        }]
    },

    getting_started: {
        doneLabel: "HOW TO CREATE ACCOUNT",
        steps: [{
            intro: "<div><h2>Thank you for choosing Virtual Class</h2>" + "<img class='card-img' src='assets/images/help/girl.jpeg' /> " + "<p>Quick tips on setting up your application</p>" + "<p>I will take you through the steps one after the other</p>" + "</div>"
        }, {
            element: '#register-form-cont',
            intro: "<div><h5>Create your Free Account!</h5>" + "<p>Click on 'Register' tab to create an account and start using the application</p>" + "</div>"
        }]
    },
    getting_started_register: {
        doneLabel: "HOW TO JOIN A CLASS",
        steps: [{
            element: '#register-form-cont',
            intro: "<div><h5>Create a new Account!</h5>" + "<p>Choose a unique username and provide a valid email address.</p>" + "<p>Click on 'Create Account' button</p>" + "</div>"
        }, {
            element: '#link-account-login',
            intro: "<div><h5>Congratulations!</h5>" + "<p>Now that you have an account, Login to begin using your Virtual Class</p>" + "<p>Click on 'Account Login' link to go to Dashboard</p>" + "</div>"
        }, {
            element: '#link-account-join',
            intro: "<div><h5>Start Inviting!</h5>" + "<p>Your users don't have to create an account.</p>" + "<p>You can send them the link form your Dashboard or go to join page and provide details.</p>" + "</div>"
        }]
    },
    getting_started_join: {
        doneLabel: "START NOW",
        steps: [{
            element: '#join-form-cont',
            intro: "<div><h5>Join a Meeting!</h5>" + "<p>After you created your virtual class, share the link with your user</p>" + "<p>If your user follow the link, the meeting ID field be hidden </p>" + "<p>User should enter name in the 'Choose a name' field and click on 'Enter Virtual Meeting' button</p>" + "<h3>Ready to go? Create an Account Now!</h3>" + "</div>"
        }]
    },

    /*
        ================================= White board features section =======================================================
     */
    tour_white_board: {
        steps: [{
            element: '#editor-toolbar',
            intro: "<div><h5>The White Board Toolbar</h5>" + "<p>This section contains all the tools for adding and formatting content on the board</p>" + "<p>I will go through the major tools and explain the functionality</p>" + "</div>"
        }, {
            element: '#editor-toolbar-image',
            intro: "<div><h5>Add Image or Video</h5>" + "<p>Use this button to add image or video to your content</p>" + "<p>Position the cursor where you want image or video to be inserted</p>" + "<p>Note: This is only applicable to local images or videos.</p>" + "</div>"
        }, {
            element: '#editor-toolbar-video',
            intro: "<div><h5>Add External Video</h5>" + "<p>Use this button to add external video to your content. E.g. youtube videos. </p>" + "<p>Copy and paste the video link</p>" + "</div>"
        }]
    }
};