/*
 @ This file will handle the joning a meeting
 @ Author: Adeniyi Anthony
 @ email: mlisoftinc@gmail.com
 */
'use strict';

/*
 define style to handle our select field
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dashboard = function (_React$Component) {
    _inherits(Dashboard, _React$Component);

    function Dashboard(props) {
        _classCallCheck(this, Dashboard);

        var _this = _possibleConstructorReturn(this, (Dashboard.__proto__ || Object.getPrototypeOf(Dashboard)).call(this, props));

        _this.setPopUp = function (state) {
            var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (wait === null) {
                _this.setState({ popUp: state });
            } else {
                // wait for the stipulated time before taking action
                setTimeout(function () {
                    _this.setState({ popUp: state });
                }, wait);
            }

            if (state == 'hidden') {
                // clear the action msg
                _this.setState({ actionMsg: null });
            }
        };

        _this.setLoginFormView = function (state) {
            var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (wait === null) {
                _this.setState({ loginFormState: state });
            } else {
                // wait for the stipulated time before taking action
                setTimeout(function () {
                    _this.setState({ loginFormState: state });
                }, wait);
            }
        };

        _this.disableButton = function (state) {
            _this.setState({ disabledButton: state });
        };

        _this.setMessage = function (msg) {
            var callBack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            _this.setState({ actionMsg: msg }, function () {
                return callBack !== null && typeof callBack === 'function' ? callBack() : null;
            });
        };

        _this.getRoomList = function () {

            var rnd = Math.random();

            var postUrl = _this.state.actionUrlRoomList + '?rnd=' + rnd;

            fetch(postUrl)
            //.then((response) => response.json())
            .then(function (response) {
                //console.log(response.json);
                return response.json();
                // return (response.text());
            }).then(function (responseJson) {
                var status = responseJson['status'];
                var msg = responseJson['msg'];
                var content = responseJson['content'];
                var meetingCount = 0;

                if (content !== null) {
                    meetingCount = content.length;
                }

                _this.setState({ userMeetingCount: meetingCount });

                if (status == true) {
                    var curHtml = content.map(function (meet) {
                        var startButtId = 'start-butt-' + meet['meet'];
                        var linkFieldId = 'link-field-' + meet['meet'];
                        var list = React.createElement(
                            'div',
                            { id: meet['meet'], key: meet['meet'], className: 'dashboard-list-cont' },
                            React.createElement(
                                'div',
                                null,
                                React.createElement(
                                    'span',
                                    { className: 'title' },
                                    meet['meeting']
                                ),
                                React.createElement('i', { className: 'icon-030 dashboard-list-delete', onClick: function onClick() {
                                        _this.deleteMeeting(meet['user'], meet['meet'], meet['meeting']);
                                    } }),
                                React.createElement('i', { className: 'icon-090 dashboard-list-delete', onClick: function onClick() {
                                        _this.copyMeetingLink(linkFieldId);
                                    } }),
                                React.createElement('i', { className: 'icon-221 dashboard-list-delete', onClick: function onClick() {
                                        _this.shareMeetingLink(linkFieldId, meet['meet'], meet['meeting']);
                                    } })
                            ),
                            React.createElement(
                                'div',
                                null,
                                'Meeting ID: ',
                                meet['meet']
                            ),
                            React.createElement(
                                'div',
                                null,
                                React.createElement('input', { className: 'dashboard-list-cont-link', type: 'text', id: linkFieldId,
                                    name: linkFieldId, value: meet['link'] })
                            ),
                            React.createElement(
                                'button',
                                { id: startButtId, className: 'ibtn', onClick: function onClick() {
                                        _this.startMeeting(meet['user'], meet['meet'], meet['port'], meet['link'], meet['meeting']);
                                    } },
                                'Start ',
                                React.createElement('i', { className: 'mls icon-078' })
                            ),
                            React.createElement(
                                'button',
                                { id: startButtId, className: 'ibtn', onClick: function onClick() {
                                        _this.generateNewMeetingID(meet['id'], meet['meet']);
                                    } },
                                'New ID  ',
                                React.createElement('i', { className: 'mls icon-042' })
                            ),
                            React.createElement(
                                'button',
                                { id: startButtId, className: 'ibtn', onClick: function onClick() {
                                        _this.toolBoxSetupView(meet['meet']);
                                    } },
                                'Courses  ',
                                React.createElement('i', { className: 'mls icon-079' })
                            ),
                            React.createElement(
                                'button',
                                { id: startButtId, className: 'ibtn', onClick: function onClick() {
                                        _this.toolBoxContent(meet['meet'], meet['meeting'], true);
                                    } },
                                'Contents ',
                                React.createElement('i', { className: 'mls icon-028' })
                            )
                        );
                        return list;
                    });
                    //alert(curHtml);
                    _this.setState({ roomList: curHtml });
                } else {

                    var list = React.createElement(
                        'div',
                        { className: 'dashboard-list-cont' },
                        React.createElement(
                            'div',
                            null,
                            React.createElement(
                                'h3',
                                null,
                                'Start creating now!'
                            )
                        ),
                        React.createElement(
                            'div',
                            null,
                            msg
                        )
                    );
                    _this.setState({ roomList: list });
                }
            });
        };

        _this.getUserPlan = function () {
            var successCallBack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            var errorCallBack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var action = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'get';


            var rnd = Math.random(100);

            var postUrl = _this.state.actionUrlPlans + '?action=' + action + '&rnd=' + rnd;

            fetch(postUrl).then(function (response) {
                return response.json();
                //return (response.text());
            }).then(function (responseJson) {
                //console.log(responseJson);
                var status = responseJson['status'];
                var msg = responseJson['msg'];
                if (status == true) {
                    var plans = responseJson['plans'];
                    var userPlanId = responseJson['user_plan_id'];
                    var cycles = responseJson['cycles'];
                    var userDetails = responseJson['user_details'];
                    var user = responseJson['user'];
                    var userEmail = responseJson['user_email'];

                    _this.setState({
                        userPlan: userPlanId,
                        paymentPlans: plans,
                        paymentCycles: cycles,
                        userDetails: userDetails,
                        formUser: user
                    }, function () {
                        if (successCallBack !== null) {
                            return successCallBack();
                        }
                        // check if we can show adverts
                        _this.canShowAdvert();
                    });
                } else {
                    _this.setState({ userPlan: null }, function () {
                        if (errorCallBack !== null) {
                            return errorCallBack();
                        }
                    });
                }
            });
        };

        _this.getToolBox = function () {

            var tools = React.createElement(
                'div',
                { className: 'room-toolbox', id: 'mid-header' },
                React.createElement(
                    'button',
                    { className: 'toolbox-button-cont-full ', onClick: function onClick() {
                            _this.startAdminHelp();
                        } },
                    React.createElement('div', { className: 'icon-341 toolbox-button' }),
                    React.createElement(
                        'p',
                        { className: 'toolbox-button-text' },
                        'Help'
                    )
                ),
                React.createElement(
                    'button',
                    { className: 'toolbox-button-cont-full', onClick: function onClick() {
                            _this.logoutUser();
                        } },
                    React.createElement('div', { className: 'icon-086 toolbox-button' }),
                    React.createElement(
                        'p',
                        { className: 'toolbox-button-text' },
                        'Logout'
                    )
                ),
                React.createElement(
                    'button',
                    { id: 'tool-settings', className: 'toolbox-button-cont-full', onClick: function onClick() {
                            _this.toolBoxSettings();
                        } },
                    React.createElement('div', { className: 'icon-272 toolbox-button' }),
                    React.createElement(
                        'p',
                        { className: 'toolbox-button-text' },
                        'Settings'
                    ),
                    React.createElement(
                        'i',
                        { className: 'new-label' },
                        'New'
                    )
                ),
                React.createElement(
                    'button',
                    { id: 'tool-account', className: 'toolbox-button-cont-full', onClick: function onClick() {
                            _this.toolBoxMyAccount();
                        } },
                    React.createElement('div', { className: 'icon-299 toolbox-button' }),
                    React.createElement(
                        'p',
                        { className: 'toolbox-button-text' },
                        'My Account'
                    )
                )
            );
            return tools;
        };

        _this.startMeeting = function (user, meetId) {
            var port = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
            var link = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
            var meeting = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
            var owner = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

            /*
             disable the button first
             */
            //this.disableButton(true);
            /*
             * once this is completed, show the pop up indicating that we are logging in
             *
             */
            //alert(meeting);
            _this.setMessage('Starting...');

            _this.setPopUp('visible');
            /*
             * process the login
             */
            var rnd = Math.random();
            var role = _this.state.defaultUserRole;

            if (meetId == "" || user == "") {
                _this.setMessage("Meeting ID or name cannot be empty");
                // hide popup screen after 5 seconds
                _this.setPopUp('hidden', 2000);
                // enable login button
                _this.disableButton(false);
                return null;
            }
            var postUrl = _this.state.actionUrlJoin + '?user=' + user + '&meet=' + meetId + '&role=' + role + '&rnd=' + rnd;

            fetch(postUrl).then(function (response) {
                return response.json();
            }).then(function (responseJson) {

                var status = responseJson['status'];
                var msg = responseJson['msg'];
                owner = responseJson['owner'];
                link = responseJson['link'];
                port = responseJson['port'];
                meeting = responseJson['meeting'];

                //console.log(responseJson);
                //return false;
                var meetSubmit = document.getElementById('meet-submit');

                /* set the state for the form values */
                _this.setState({
                    formMeetId: meetId,
                    formUser: user,
                    formPort: port,
                    formOwner: owner,
                    formRole: role,
                    formLink: link,
                    formMeeting: meeting
                }, function () {
                    // once completed, go to dashboard
                    if (status === true) {
                        _this.setMessage(msg);
                        /* create the socket incase we don't alreay have it running
                        */
                        _this.createWebSocket(port);
                        meetSubmit.setAttribute("type", "submit");
                        meetSubmit.click();
                        _this.setPopUp('hidden', 2000);
                    } else {
                        // notify user of the failure

                        _this.setMessage(msg);
                        // hide popup screen after 5 seconds
                        _this.setPopUp('hidden', 2000);
                        // re-enable login  button
                        _this.disableButton(false);
                    }
                });
            });
        };

        _this.startMeetingWithApi = function () {
            var wait = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5000;

            var method = document.getElementById('method').value;
            var mode = document.getElementById('mode').value;
            var apiMeetId = document.getElementById('meet-id-api').value;
            var apiUser = document.getElementById('api-user').value;

            if (mode === 'start' && method === 'api') {
                //attempt to start using api method
                _this.startMeeting(apiUser, apiMeetId);
                setTimeout(function () {
                    // close window after some seconds.
                    window.close();
                }, wait);
            }
        };

        _this.logoutUser = function () {

            var rnd = Math.random(100);

            _this.setMessage('Signing out...');
            _this.setPopUp('visible');

            var postUrl = _this.state.actionUrlLogout + '?rnd=' + rnd;
            //alert(postUrl);
            fetch(postUrl).then(function (response) {
                return response.json();
            }).then(function (responseJson) {
                var status = responseJson['status'];
                var msg = responseJson['status'];
                //const logoutSubmit=document.getElementById('logout-submit');


                // once completed, go to dashboard
                if (status === true) {
                    _this.setMessage(msg);
                    /* create the socket incase we don't alreay have it running
                    */
                    _this.setPopUp('hidden', 2000);
                    document.location = _this.state.indexPath;
                } else {
                    // notify user of the failure
                    //alert(msg);
                    _this.setMessage(msg);
                    // hide popup screen after 5 seconds
                    _this.setPopUp('hidden', 2000);
                    // re-enable login  button
                    _this.disableButton(false);
                }
            });
        };

        _this.deleteMeeting = function (user, meet, meetName) {

            var del = confirm(_this.state.confirmDeleteMsg);
            if (del == false) {
                return null;
            }

            var rnd = Math.random(100);
            _this.setMessage('Deleting ' + meetName);
            _this.setPopUp('visible');

            var postUrl = _this.state.actionUrlDeleteMeet + '?meet-name=' + meetName + '&user=' + user + '&meet=' + meet + '&rnd=' + rnd;
            //console.log(postUrl);

            fetch(postUrl)
            //.then((response) => response.json())
            .then(function (response) {
                return response.json();
                // return (response.text());
            }).then(function (responseJson) {
                //console.log(responseJson);
                var status = responseJson['status'];
                var msg = responseJson['msg'];

                if (status === true) {
                    _this.setMessage(msg);
                    /* create the socket incase we don't alreay have it running 
                    */
                    //meetSubmit.click();
                    _this.setPopUp('hidden', 2000);
                    _this.getRoomList();
                } else {
                    // notify user of the login failure

                    _this.setMessage(msg);
                    // hide popup screen after 5 seconds
                    _this.setPopUp('hidden', 2000);
                }
            });
        };

        _this.generateNewMeetingID = function (id, meet) {

            var del = confirm(_this.state.confirmDeleteMsg);
            if (del == false) {
                return null;
            }

            var rnd = Math.random(100);
            _this.setMessage('Generating new ID');
            _this.setPopUp('visible');

            var postUrl = _this.state.actionUrlGenerateMeetId + '?meet=' + meet + '&id=' + id + '&rnd=' + rnd;

            fetch(postUrl)
            //.then((response) => response.json())
            .then(function (response) {
                return response.json();
                //return (response.text());
            }).then(function (responseJson) {
                //console.log(responseJson);
                var status = responseJson['status'];
                var msg = responseJson['msg'];

                if (status === true) {
                    _this.setMessage(msg);
                    /* create the socket in case we don't already have it running
                    */
                    //meetSubmit.click();
                    _this.setPopUp('hidden', 2000);
                    _this.getRoomList();
                } else {
                    // notify user of the login failure

                    _this.setMessage(msg);
                    // hide popup screen after 5 seconds
                    _this.setPopUp('hidden', 2000);
                }
            });
        };

        _this.copyMeetingLink = function (linkId) {
            var link = document.getElementById(linkId);
            link.select();
            link.setSelectionRange(0, 99999);
            document.execCommand("copy");
            link.blur();
            var msg = "copied " + link.value;
            PopUp.setMessage(_this, React.createElement(
                'div',
                { className: 'alert alert-success' },
                ' ',
                msg,
                ' '
            ));
        };

        _this.shareMeetingLink = function (linkId, meetId, meetName) {
            var link = document.getElementById(linkId).value;
            var appName = _this.state.userDetails['caption'];
            var appFiles = [_this.state.userDetails['banner']];
            var title = appName + ' @ Virtual Class. Realtime & delayed learning';
            var desc = 'Join ' + meetName + ' now and start learning offline and realtime. ID: ' + meetId;
            console.log(desc);
            console.log(link);

            if (navigator.canShare) {
                navigator.share({
                    //files:appFiles,
                    title: title,
                    text: desc,
                    url: 'https://' + link
                }).then(function (data) {}).catch(function (err) {
                    console.log("error while sharing");
                });
            } else {
                var msg = "Your browser cannot share. Please copy link and send to contacts";
                PopUp.setMessage(_this, React.createElement(
                    'div',
                    { className: 'alert alert-info' },
                    ' ',
                    msg,
                    ' '
                ));
            }
        };

        _this.createMeeting = function () {

            var canCreateMeet = _this.canCreateMeeting();

            if (canCreateMeet.status === false) {

                var upgradeHtml = React.createElement(
                    'div',
                    { className: 'alert alert-info' },
                    React.createElement(
                        'div',
                        { className: 'h4' },
                        'You have reached the limit on ',
                        canCreateMeet['label']
                    ),
                    React.createElement(
                        'div',
                        null,
                        'Upgrade your account to access more features and options'
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement('br', null),
                        React.createElement(
                            'button',
                            { id: 'submit', type: 'button', className: _this.state.styles.formIbtn,
                                onClick: function onClick() {
                                    PopUp.clearMessage(_this);
                                } },
                            'Close'
                        ),
                        React.createElement(
                            'button',
                            { id: 'submit', type: 'button', className: _this.state.styles.formIbtn,
                                onClick: function onClick() {
                                    _this.toolBoxMyAccount();
                                    PopUp.clearMessage(_this);
                                } },
                            'My Account'
                        )
                    )
                );
                PopUp.setMessage(_this, upgradeHtml, 5000, false);
                return false;
            }

            //this.setPopUp('visible');

            /*
             disable the button first
             */
            _this.disableButton(true);
            /*
             * once this is completed, show the pop up indicating that we are logging in
             *
             */
            //this.setPopUp('visible');
            /*
             * process the login
             */
            var err = false;

            var meetName = document.getElementById('meet-name').value;

            var rnd = Math.random();
            var msg = "Please choose a name";
            if (meetName == "") {
                msg = "Please choose a name";
                err = true;
            }

            if (err == true) {
                PopUp.setMessage(_this, React.createElement(
                    'div',
                    { className: 'alert alert-danger' },
                    msg
                ));
                _this.disableButton(false);
                return false;
            }

            PopUp.setMessage(_this, React.createElement(
                'div',
                { className: 'alert alert-info' },
                _this.state.actionMsg
            ));
            var postUrl = _this.state.actionUrl + '?meet-name=' + meetName + '&rnd=' + rnd;

            fetch(postUrl)
            //.then((response) => response.json())
            .then(function (response) {
                //console.log(response.json);
                return response.json();
            }).then(function (responseJson) {
                var status = responseJson['status'];
                var msg = responseJson['msg'];

                var meetSubmit = document.getElementById('meet-submit');

                if (status === true) {
                    //this.setMessage(msg);
                    PopUp.setMessage(_this, React.createElement(
                        'div',
                        { className: 'alert alert-success' },
                        msg
                    ));
                    /* create the socket incase we don't alreay have it running 
                    */
                    //meetSubmit.click();
                    //this.setPopUp('hidden', 2000);
                    _this.getRoomList();
                    _this.disableButton(false);
                    document.getElementById('meet-name').value = '';
                } else {
                    // notify user of the login failure
                    //alert(msg);
                    //this.setMessage(msg);
                    PopUp.setMessage(_this, React.createElement(
                        'div',
                        { className: 'alert alert-danger' },
                        msg
                    ));
                    // hide popup screen after 5 seconds
                    //this.setPopUp('hidden', 2000);
                    // re-enable login  button
                    _this.disableButton(false);
                }
            });
        };

        _this.getMeetCourses = function () {
            var selectedMeet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            var callBack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var showPopUp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
            var action = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'get-courses';


            //const meetId = this.state.formMeetId;
            if (selectedMeet === null) {
                selectedMeet = _this.state.formSelectedMeet;
            }
            var rnd = Math.random(100);

            PopUp.showPopUpWindow(_this, _this.state.pageLoader);

            var postUrl = _this.state.actionUrlSubjectList + '?action=' + action + '&meet=' + selectedMeet + '&rnd=' + rnd;

            fetch(postUrl).then(function (response) {
                return response.json();
                //return (response.text());
            }).then(function (responseJson) {
                var status = responseJson['status'];
                var msg = responseJson['msg'];
                if (status == true) {
                    var content = responseJson['content'];
                    _this.refreshCourses(content, callBack);
                } else {
                    _this.setState({ subjectList: null }, function () {
                        PopUp.setMessage(_this, React.createElement(
                            'div',
                            { className: 'alert alert-info' },
                            msg
                        ));
                        if (showPopUp === true) {
                            _this.toolBoxSetup();
                        }
                    });
                }
            });
        };

        _this.refreshCourses = function (content, callBack) {
            var curHtml = content.map(function (subject) {
                var list = React.createElement(
                    'div',
                    { id: subject['id'], key: subject['id'], className: 'col-md-12 card',
                        style: { marginBottom: 10, maxHeight: '50px' } },
                    React.createElement(
                        'div',
                        { className: 'card-body' },
                        React.createElement(
                            'p',
                            { className: 'card-text' },
                            ' ',
                            subject['course'],
                            ' '
                        )
                    ),
                    React.createElement('i', { className: 'fa fa-trash dashboard-list-delete-small', onClick: function onClick() {
                            _this.deleteCourse(subject['id'], subject['meet']);
                        } }),
                    React.createElement('br', null)
                );
                return list;
            });

            _this.setState({ subjectList: curHtml }, function () {
                if (callBack !== null) {
                    return callBack();
                }
            });
        };

        _this.saveCourse = function () {
            var elementId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "course";
            var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'save-course';


            //const meetId = this.state.formMeetId;
            var meetId = _this.state.formSelectedMeet;

            var subject = document.getElementById(elementId).value.trim();

            var rnd = Math.random(100);
            var postUrl = _this.state.actionUrlSubjectList + '?action=' + action + '&meet=' + meetId + '&course=' + subject + '&rnd=' + rnd;

            fetch(postUrl).then(function (response) {
                return response.json();
                //return (response.text());
            }).then(function (responseJson) {
                var status = responseJson['status'];
                var msg = responseJson['msg'];
                if (status == true) {
                    PopUp.setMessage(_this, React.createElement(
                        'div',
                        { className: 'alert alert-success' },
                        msg
                    ));
                    _this.getMeetCourses(_this.state.formSelectedMeet, _this.toolBoxSetup);
                    document.getElementById(elementId).value = '';
                } else {
                    PopUp.setMessage(_this, React.createElement(
                        'div',
                        { className: 'alert alert-danger' },
                        msg
                    ));
                }
            });
        };

        _this.deleteCourse = function () {
            var courseId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "course";
            var selectedMeet = arguments[1];
            var action = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'delete-course';


            var del = confirm(_this.state.confirmDeleteMsg);
            if (del == false) {
                return null;
            }

            var rnd = Math.random(100);
            var postUrl = _this.state.actionUrlSubjectList + '?action=' + action + '&id=' + courseId + '&meet=' + selectedMeet + '&rnd=' + rnd;

            fetch(postUrl).then(function (response) {
                return response.json();
                //return (response.text());
            }).then(function (responseJson) {
                var status = responseJson['status'];
                var msg = responseJson['msg'];
                if (status == true) {
                    PopUp.setMessage(_this, React.createElement(
                        'div',
                        { className: 'alert alert-success' },
                        msg
                    ));
                    _this.getMeetCourses(selectedMeet, _this.toolBoxSetup);
                } else {
                    PopUp.setMessage(_this, React.createElement(
                        'div',
                        { className: 'alert alert-danger' },
                        msg
                    ));
                }
            });
        };

        _this.toolBoxMyAccount = function () {
            // get the details for user current plan
            var userPlanId = _this.state.userPlan;
            var userPlan = _this.state.paymentPlans.filter(function (curPlan) {
                return curPlan['plan_id'] === userPlanId;
            })[0];
            // get billing cycle
            var billCycle = _this.getBillingCycle(userPlan['cycle']);
            var userPlanHtml = React.createElement(
                'div',
                { className: 'col-md-12 card', style: { marginBottom: 10 } },
                React.createElement('br', null),
                React.createElement(
                    'h4',
                    { className: 'card-title' },
                    'My Current Plan '
                ),
                React.createElement(
                    'div',
                    { className: 'card-body bg-primary text-white', style: { borderRadius: '5px' } },
                    React.createElement(
                        'p',
                        { className: 'card-text' },
                        userPlan['label']
                    ),
                    React.createElement(
                        'p',
                        { className: 'card-text' },
                        'Price: ',
                        _this.numberWithCommas(userPlan['price']),
                        ' ',
                        billCycle['label']
                    ),
                    React.createElement(
                        'p',
                        { className: 'card-text' },
                        'Maximum Virtual Class: ',
                        userPlan['max_meet']
                    )
                ),
                React.createElement('br', null)
            );

            // list other plans that user is not currently subscribed to
            var otherPlanHtml = _this.state.paymentPlans.map(function (plan) {
                // only do for plan that user is not currently in
                var billCycle = _this.getBillingCycle(plan['cycle']);
                //console.log(billCycle);
                var buttonLabel = "Start Plan";
                if (plan['plan_id'] !== userPlanId) {
                    if (plan['plan_id'] > userPlanId) {
                        buttonLabel = "Upgrade";
                    } else {
                        buttonLabel = "Downgrade";
                    }
                    var fieldId = 'upgrade-' + plan.plan_id;
                    var list = React.createElement(
                        'div',
                        { key: plan.id, className: 'col-md-12 card', style: { marginBottom: 10 } },
                        React.createElement('br', null),
                        React.createElement(
                            'h4',
                            { className: 'card-title' },
                            plan['label'],
                            ' '
                        ),
                        React.createElement(
                            'div',
                            { className: 'card-body bg-info   text-white', style: { borderRadius: '5px' } },
                            React.createElement(
                                'p',
                                { className: 'card-text' },
                                'Price: ',
                                _this.numberWithCommas(plan['price']),
                                ' ',
                                billCycle['label']
                            ),
                            React.createElement(
                                'p',
                                { className: 'card-text' },
                                plan['description'],
                                ' '
                            ),
                            React.createElement(
                                'p',
                                { className: 'card-text' },
                                'Maximum Virtual Class: ',
                                _this.numberWithCommas(plan['max_meet'])
                            )
                        ),
                        React.createElement('br', null),
                        React.createElement(
                            'div',
                            { className: 'float-right' },
                            React.createElement('input', { type: 'hidden', id: fieldId, name: fieldId, value: plan['plan_id'] }),
                            React.createElement(
                                'button',
                                { id: 'submit', type: 'button', className: _this.state.styles.formIbtn,
                                    disabled: _this.state.disabledButton,
                                    onClick: function onClick() {
                                        return _this.upgradeUserPlan(plan['plan_id']);
                                    } },
                                buttonLabel
                            )
                        ),
                        React.createElement('br', null)
                    );
                    return list;
                }
            });

            var html = React.createElement(
                'div',
                null,
                userPlanHtml,
                otherPlanHtml
            );
            PopUp.showPopUpWindow(_this, html);
        };

        _this.suggestDropdown = function (content, listIndex, id) {
            var successCallBack = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;


            var el = document.getElementById(id);
            var dropDown = document.getElementById(id + "-dropdown");

            if (dropDown === null) {

                // create new
                var parentEl = el.parentNode;
                dropDown = document.createElement("div");
                dropDown.setAttribute("id", id + "-dropdown");
                parentEl.appendChild(dropDown);
            }
            var value = el.value.trim();

            var regEx = new RegExp(value, 'i');
            var suggestedList = content.filter(function (list) {
                return regEx.test(list[listIndex]);
            });

            var list = [];

            if (suggestedList && suggestedList.length > 0) {
                suggestedList.map(function (curList) {
                    var listValue = curList[listIndex];
                    //list = list + "<div id='" + id + "' class='card dropdown-list' onclick='document.getElementById(this.id).value=this.innerText'>" + listValue + "</div>";
                    list = list.concat(React.createElement(
                        'div',
                        { id: id, className: 'card dropdown-list' },
                        listValue
                    ));
                });
                dropDown.setAttribute("class", "visible dropdown dropdown-menu dropdown-cont");
                //dropDown.innerHTML = list;
                //alert(list);
            } else {
                dropDown.setAttribute("class", "hidden");
                //dropDown.innerHTML = "";
            }

            if (value == "") {
                dropDown.setAttribute("class", "hidden");
                //dropDown.innerHTML = "";
            }

            dropDown.addEventListener("click", function () {
                dropDown.setAttribute("class", "hidden");
            });

            if (successCallBack !== null) {
                successCallBack();
            }
        };

        _this.getCourseListForContents = function () {
            var elementId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "lesson-course";
            var onChangeCallBack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var defaultEmpty = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var notifyNoList = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
            var defaultValue = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "Select Subject";
            var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "get-global-courses";


            var content = _this.state.globalCourseList;
            var defaultOption = null;
            var defaultSelected = _this.state.formCourse;

            var list = null;
            var selected = false;

            var rnd = Math.random(100);
            var optionHtml = null;

            optionHtml = content.map(function (subject, k) {
                var key = 'course-' + k;
                if (k === 0) {
                    selected = true;
                }
                list = React.createElement(
                    'option',
                    { value: subject['course'], key: key },
                    subject['course']
                );
                return list;
            });
            if (defaultEmpty === true) {
                defaultOption = React.createElement(
                    'option',
                    { value: '' },
                    defaultValue
                );
                defaultSelected = '';
            }
            var subjectHtml = React.createElement(
                'select',
                { defaultValue: defaultSelected, className: _this.state.styles.formControl,
                    name: elementId,
                    id: elementId, placeholder: '', required: true, onChange: function onChange() {
                        if (onChangeCallBack !== null) {
                            return onChangeCallBack();
                        }
                    } },
                defaultOption,
                optionHtml
            );
            return subjectHtml;
        };

        _this.loadGlobalCourses = function () {
            var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "get-global-courses";


            var rnd = Math.random(100);
            var optionHtml = null;

            var postUrl = _this.state.actionUrlContentManager + '?action=' + action + '&rnd=' + rnd;
            fetch(postUrl)
            //.then((response) => response.json())
            .then(function (response) {
                //console.log(response.json);
                return response.json();
                // return (response.text());
            }).then(function (responseJson) {
                var status = responseJson['status'];
                var msg = responseJson['msg'];
                var courses = responseJson['courses'];
                var authors = responseJson['authors'];
                var courseContents = responseJson['course_contents'];

                if (status == true) {
                    _this.setState({
                        globalCourseList: courses,
                        globalAuthorList: authors,
                        globalAuthorContents: courseContents,
                        globalAuthorContentFilter: courseContents

                    });
                } else {
                    _this.setState({
                        globalCourseList: [],
                        globalAuthorList: [],
                        globalAuthorContents: [],
                        globalAuthorContentFilter: []
                    });
                }
            });
        };

        _this.toolBoxContent = function (selectedMeet, meetName) {
            var showPopUp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
            var headerContent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;


            var filterHtml = React.createElement(
                'div',
                { className: 'col-md-12 card card-header', style: { marginBottom: '20px' } },
                React.createElement(
                    'form',
                    null,
                    React.createElement(
                        'div',
                        { className: 'col-md-4', style: { display: 'inline-block' } },
                        React.createElement('input', { id: 'lesson-content-creator', type: 'text', className: _this.state.styles.formControl,
                            placeholder: 'Content creator name',
                            onChange: function onChange() {
                                _this.suggestDropdown(_this.state.globalAuthorList, "user", "lesson-content-creator", _this.filterContent(selectedMeet, meetName));
                            } })
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-md-4', style: { display: 'inline-block' } },
                        React.createElement('input', { id: 'lesson-content-course', type: 'text', className: _this.state.styles.formControl,
                            placeholder: 'Course',
                            onChange: function onChange() {
                                _this.suggestDropdown(_this.state.globalCourseList, "course", "lesson-content-course", _this.filterContent(selectedMeet, meetName));
                            } })
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-md-4', style: { display: 'inline-block' } },
                        React.createElement('input', { id: 'lesson-content-topic', type: 'text', className: _this.state.styles.formControl,
                            placeholder: 'Enter topic', onChange: function onChange() {
                                _this.suggestDropdown(_this.state.globalAuthorContents, "topic", "lesson-content-topic", _this.filterContent(selectedMeet, meetName));
                            } })
                    )
                )
            );

            if (selectedMeet !== null) {
                if (showPopUp === true) {
                    PopUp.showPopUpWindow(_this, _this.state.pageLoader);
                }

                var leftPanel = React.createElement('div', { className: 'col-md-12' });

                //if (content === null) {
                // use all available contents loaded
                var content = _this.state.globalAuthorContentFilter;
                //}

                var curHtml = content.map(function (lesson) {
                    var id = lesson['id'];
                    var formId = 'lesson-form-' + lesson['id'];
                    var buttId = 'lesson-butt-' + lesson['id'];

                    var list = React.createElement(
                        'div',
                        { id: lesson['id'], key: lesson['id'], className: 'col-md-12 card',
                            style: { marginBottom: 10 } },
                        React.createElement(
                            'div',
                            { className: 'card-body' },
                            React.createElement(
                                'p',
                                { className: 'card-text float-right' },
                                lesson['date_in'],
                                ' '
                            ),
                            React.createElement(
                                'h4',
                                { className: 'card-title' },
                                lesson['course'],
                                ' '
                            ),
                            React.createElement(
                                'h5',
                                { className: 'card-title' },
                                lesson['topic'],
                                ' '
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'card-footer' },
                            React.createElement(
                                'form',
                                { id: formId },
                                React.createElement(
                                    'div',
                                    { className: _this.state.styles.formButton },
                                    React.createElement('br', null),
                                    React.createElement(
                                        'button',
                                        { type: 'button', className: _this.state.styles.formIbtn },
                                        'Preview'
                                    ),
                                    React.createElement(
                                        'button',
                                        { type: 'button', className: _this.state.styles.formIbtn, onClick: function onClick() {
                                                _this.addContentFormMeet(lesson['id'], selectedMeet, lesson['port'], lesson['topic']);
                                            } },
                                        'Use Content'
                                    ),
                                    React.createElement('br', null)
                                )
                            )
                        ),
                        React.createElement('br', null)
                    );
                    return list;
                });
                _this.setState({ globalAuthorContentFilterList: curHtml }, function () {
                    var html = React.createElement(
                        'div',
                        { className: 'row' },
                        React.createElement(
                            'h3',
                            null,
                            meetName
                        ),
                        filterHtml,
                        React.createElement(
                            'h3',
                            null,
                            'Suggested Contents'
                        ),
                        _this.state.globalAuthorContentFilterList
                    );
                    if (showPopUp === true) {
                        PopUp.showPopUpWindow(_this, html);
                    }
                });
            }
        };

        _this.toolBoxPreviewContent = function (id) {
            var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'view';


            var lessonPreviewDataArray = _this.state.lessonRawData.filter(function (lesson) {
                return lesson['id'] === id;
            });

            if (lessonPreviewDataArray !== null) {
                var lessonPreviewData = lessonPreviewDataArray[0];
                var preview = _this.getPreviewBoard(lessonPreviewData, mode);

                //this.setState({popUpContent: preview}, () => {
                // initialize the preview board
                //this.setPopUp('visible');
                PopUp.showPopUpWindow(_this, preview, null, function () {
                    _this.initPreviewBoard(mode);
                    // set preview board content lastly
                    var content = JSON.parse(_this.reformatGetBoardContent(lessonPreviewData['content']));
                    _this.previewBoard.setContents(content);
                });
                // });
            } else {
                _this.setMessage(React.createElement(
                    'div',
                    { className: 'alert alert-info' },
                    'Preview could not load. Please try again'
                ));
            }
        };

        _this.getPreviewBoard = function (data) {
            var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'view';
            var previewToolbarId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'editor-toolbar-preview';


            var audio = React.createElement(
                'div',
                { className: 'audio-panel' },
                React.createElement(
                    'h7',
                    null,
                    'No audio available'
                ),
                React.createElement('i', { className: 'fa fa-audio-description', style: { marginLeft: '20px' } })
            );

            var video = React.createElement(
                'div',
                { className: 'video-panel' },
                React.createElement(
                    'h7',
                    null,
                    'No video available'
                ),
                React.createElement('i', { className: 'fa fa-video', style: { marginLeft: '20px' } })
            );

            var editButton = null;
            var toolBars = null;

            var lessonId = data['id'];
            var topic = 'Topic: ' + data['topic'];
            var delimReg = /,/;

            var getMediaButtons = function getMediaButtons(filePath) {
                var fileType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "video";
                var divId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

                fileType = fileType.trim();
                var buttons = null;
                if (mode === 'edit') {
                    if (fileType == 'video') {
                        buttons = React.createElement(
                            'div',
                            { className: 'video-action-buttons' },
                            React.createElement(
                                'button',
                                { className: _this.state.styles.formIbtn, onClick: function onClick() {
                                        removeLessonMedia(filePath, fileType, divId);
                                    } },
                                'Remove'
                            )
                        );
                    } else if (fileType == 'audio') {
                        buttons = React.createElement(
                            'div',
                            { className: 'audio-action-buttons' },
                            React.createElement(
                                'button',
                                { className: _this.state.styles.formIbtn, onClick: function onClick() {
                                        removeLessonMedia(filePath, fileType, divId);
                                    } },
                                'Remove Audio'
                            )
                        );
                    }
                }
                return buttons;
            };

            var removeLessonMedia = function removeLessonMedia(filePath) {
                var fileType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "video";
                var divId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;


                var del = confirm("Are you sure?");
                if (del == false) {
                    return null;
                }

                var el = null;
                var elValue = null;

                if (fileType == "video") {
                    el = document.getElementById("lesson-video-update");
                    elValue = el.value;
                } else {
                    el = document.getElementById("lesson-audio-update");
                    elValue = el.value;
                }

                var newList = null;
                // alert(divId);

                if (delimReg.test(elValue)) {
                    var arrFilePaths = elValue.toString().split(delimReg);
                    newList = arrFilePaths.filter(function (n) {
                        return n !== filePath;
                    }).join(delimReg.toString());
                    var domEl = document.getElementById(divId);
                    domEl.parentNode.removeChild(domEl);
                } else {
                    newList = null;
                    var _domEl = document.getElementById(divId);
                    _domEl.parentNode.removeChild(_domEl);
                }

                el.value = newList;
                // alert(newList);
            };

            if (mode === 'edit') {
                var topicId = 'lesson-topic-update-' + lessonId;

                editButton = React.createElement(
                    'button',
                    { type: 'button', className: _this.state.styles.formIbtn, onClick: function onClick() {
                            _this.updateLessonContent(data['id'], topicId);
                        } },
                    'Update'
                );
                topic = React.createElement('input', { id: topicId, type: 'text', className: _this.state.styles.formControl, defaultValue: data['topic'] });
                toolBars = _this.getWhiteBoardToolbar(previewToolbarId, true);
            }

            if (data['audio'] != "" && data['audio'] != null) {

                if (delimReg.test(data['audio'])) {
                    // multiple video available for lesson
                    var audioArr = data['audio'].toString().split(delimReg);
                    audio = audioArr.map(function (file, k) {
                        var divId = 'audio-view-' + k;
                        var list = React.createElement(
                            'div',
                            { id: divId, key: k, className: 'audio-panel-cont' },
                            getMediaButtons(file, "audio", divId),
                            React.createElement(
                                'audio',
                                { controls: true },
                                React.createElement('source', { src: file, type: 'audio/mpeg' })
                            )
                        );
                        return list;
                    });
                    audio = React.createElement(
                        'div',
                        { className: 'audio-panel' },
                        audio
                    );
                } else {
                    var k = 0;
                    var divId = 'audio-view-' + k;
                    audio = React.createElement(
                        'div',
                        { className: 'audio-panel' },
                        React.createElement(
                            'div',
                            { id: divId, key: k, className: 'audio-panel-cont' },
                            getMediaButtons(data['audio'], "audio", divId),
                            React.createElement(
                                'audio',
                                { controls: true },
                                React.createElement('source', { src: data['audio'], type: 'audio/mpeg' })
                            )
                        )
                    );
                }
            }

            if (data['video'] != "" && data['video'] != null) {

                if (delimReg.test(data['video'])) {
                    // multiple video available for lesson
                    var videoArr = data['video'].toString().split(delimReg);
                    video = videoArr.map(function (file, k) {
                        var divId = 'video-view-' + k;
                        var list = React.createElement(
                            'div',
                            { id: divId, key: k, className: 'video-panel-cont' },
                            getMediaButtons(file, "video", divId),
                            React.createElement(
                                'video',
                                { controls: true },
                                React.createElement('source', { src: file, type: 'video/mp4' })
                            )
                        );
                        return list;
                    });
                    video = React.createElement(
                        'div',
                        { className: 'video-panel' },
                        video
                    );
                } else {
                    var _k = 0;
                    var _divId = 'video-view-' + _k;
                    video = React.createElement(
                        'div',
                        { className: 'video-panel' },
                        React.createElement(
                            'div',
                            { id: _divId, key: _k, className: 'video-panel-cont' },
                            getMediaButtons(data['video'], "video", _divId),
                            React.createElement(
                                'video',
                                { controls: true },
                                React.createElement('source', { src: data['video'], type: 'video/mp4' })
                            )
                        )
                    );
                }
            }

            var html = React.createElement(
                'div',
                { className: 'editor-container' },
                editButton,
                audio,
                React.createElement(
                    'div',
                    { className: 'lesson-preview-header' },
                    React.createElement(
                        'span',
                        { className: 'float-right' },
                        data['date_in']
                    ),
                    React.createElement(
                        'h5',
                        null,
                        topic
                    ),
                    React.createElement('input', { className: _this.state.styles.formControl, type: 'hidden', name: 'video',
                        id: 'lesson-video-update', defaultValue: data['video'] }),
                    React.createElement('input', { className: _this.state.styles.formControl, type: 'hidden', name: 'audio',
                        id: 'lesson-audio-update', defaultValue: data['audio'] }),
                    React.createElement('input', { className: _this.state.styles.formControl, type: 'hidden', name: 'course',
                        id: 'lesson-course-update', defaultValue: data['course'] })
                ),
                toolBars,
                React.createElement('div', { id: 'preview-board-0', className: 'ql-editor-preview' }),
                video
            );

            return html;
        };

        _this.addContentFormMeet = function (contentId, selectedMeet, port, topic) {
            var action = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "add-content-for-meet";


            var rnd = Math.random(100);
            var user = _this.state.formUser;

            PopUp.setMessage(_this, React.createElement(
                'div',
                { className: 'alert alert-info' },
                'Adding ',
                topic
            ));

            var postUrl = '' + _this.state.actionUrlContentManager;
            var postBody = 'action=' + action + '&content-id=' + contentId + '&meet=' + selectedMeet + '&user=' + user + '&port=' + port + '&rnd=' + rnd;
            //alert(postBody);
            fetch(postUrl, {
                method: "POST",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: postBody
            }).then(function (response) {
                return response.json();
                //return (response.text());
            }).then(function (responseJson) {
                //console.log(responseJson);
                var status = responseJson['status'];
                var msg = responseJson['msg'];

                if (status == true) {
                    PopUp.setMessage(_this, React.createElement(
                        'div',
                        { className: 'alert alert-success' },
                        msg
                    ));
                } else {
                    PopUp.setMessage(_this, React.createElement(
                        'div',
                        { className: 'alert alert-danger' },
                        msg
                    ));
                }
            });
        };

        _this.filterContent = function (selectedMeet, meetName) {
            var elementPrefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'lesson-content';


            var topic = document.getElementById(elementPrefix + '-topic').value.trim();
            var course = document.getElementById(elementPrefix + '-course').value.trim();
            var author = document.getElementById(elementPrefix + '-creator').value.trim();

            var lessonList = _this.state.globalAuthorContents;

            // build the filter criteria

            if (author != "" && author != null) {
                var regEx = new RegExp(author, 'ig');
                lessonList = lessonList.filter(function (lesson) {
                    return regEx.test(lesson['user']);
                });
            }

            if (topic != "" && topic != null) {
                var _regEx = new RegExp(topic, 'ig');
                lessonList = lessonList.filter(function (lesson) {
                    return _regEx.test(lesson['topic']);
                });
            }

            if (course != "" && course != null) {
                var _regEx2 = new RegExp(course, 'ig');
                lessonList = lessonList.filter(function (lesson) {
                    return _regEx2.test(lesson['course']);
                });
            }

            console.log(lessonList);
            _this.setState({ globalAuthorContentFilter: lessonList }, function () {
                _this.toolBoxContent(_this.state.formSelectedMeet);
            });
        };

        _this.toolBoxSetupView = function (selectedMeet) {
            if (selectedMeet !== null) {
                _this.setState({ formSelectedMeet: selectedMeet }, function () {
                    _this.getMeetCourses(_this.state.formSelectedMeet, _this.toolBoxSetup);
                });
            }
        };

        _this.toolBoxSetup = function () {

            var addCourseForm = React.createElement(
                'div',
                { className: 'card col-md-6', style: { marginRight: '20px' } },
                React.createElement(
                    'div',
                    { className: 'form-content' },
                    React.createElement(
                        'div',
                        { className: 'form-items' },
                        React.createElement(
                            'h3',
                            null,
                            'Add Course or subject'
                        ),
                        React.createElement(
                            'form',
                            { id: 'save-lesson-form', method: 'post' },
                            React.createElement(
                                'div',
                                { className: _this.state.styles.formControl },
                                React.createElement(
                                    'label',
                                    { id: 'lb-course', htmlFor: 'course' },
                                    'Course Name'
                                ),
                                React.createElement('input', { className: _this.state.styles.formControl, type: 'text', name: 'course',
                                    id: 'course', placeholder: 'Enter course or subject name' })
                            ),
                            React.createElement('br', null),
                            React.createElement(
                                'div',
                                { className: _this.state.styles.formButton },
                                React.createElement(
                                    'button',
                                    { id: 'submit', type: 'button', className: _this.state.styles.formIbtn,
                                        onClick: function onClick() {
                                            return _this.saveCourse();
                                        } },
                                    'Save'
                                )
                            )
                        )
                    )
                ),
                _this.state.subjectList
            );
            var html = React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { className: 'row' },
                    addCourseForm
                )
            );

            PopUp.showPopUpWindow(_this, html);
        };

        _this.toolBoxSettings = function () {
            var bannerFormId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'profile-form';
            var bannerFileId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'banner-file';


            PopUp.showPopUpWindow(_this, _this.state.pageLoader);

            var passwordUpdateForm = React.createElement(
                'div',
                { className: 'card col-md-5', style: { marginRight: '20px' } },
                React.createElement(
                    'div',
                    { className: 'form-content' },
                    React.createElement(
                        'div',
                        { className: 'form-items' },
                        '.',
                        React.createElement(
                            'h3',
                            null,
                            'Change Password '
                        ),
                        React.createElement(
                            'form',
                            { id: 'save-lesson-form', method: 'post' },
                            React.createElement(
                                'div',
                                { className: _this.state.styles.formControl },
                                React.createElement(
                                    'label',
                                    { id: 'lb-topic', htmlFor: 'topic' },
                                    'Old Password'
                                ),
                                React.createElement('input', { className: _this.state.styles.formControl, type: 'password', name: 'password-old',
                                    id: 'password-old', placeholder: 'Enter old password' })
                            ),
                            React.createElement('br', null),
                            React.createElement(
                                'div',
                                { className: _this.state.styles.formControl },
                                React.createElement(
                                    'label',
                                    { id: 'lb-topic', htmlFor: 'topic' },
                                    'New Password'
                                ),
                                React.createElement('input', { className: _this.state.styles.formControl, type: 'password', name: 'password-new',
                                    id: 'password-new', placeholder: 'Enter password' })
                            ),
                            React.createElement('br', null),
                            React.createElement(
                                'div',
                                { className: _this.state.styles.formControl },
                                React.createElement(
                                    'label',
                                    { id: 'lb-deadline', htmlFor: 'deadline' },
                                    'Password Confirmation'
                                ),
                                React.createElement('input', { className: _this.state.styles.formControl, type: 'password', name: 'password-confirm',
                                    id: 'password-confirm', placeholder: 'Confirm password' })
                            ),
                            React.createElement('br', null),
                            React.createElement(
                                'div',
                                { className: _this.state.styles.formButton },
                                React.createElement(
                                    'button',
                                    { id: 'submit', type: 'button', className: _this.state.styles.formIbtn,
                                        onClick: function onClick() {
                                            return _this.toolBoxUpdatePassword();
                                        } },
                                    'Update Password'
                                )
                            )
                        )
                    )
                )
            );

            var updateProfileForm = React.createElement(
                'div',
                { className: ' card col-md-6' },
                React.createElement(
                    'div',
                    { className: 'form-content' },
                    React.createElement(
                        'div',
                        { className: 'form-items' },
                        '.',
                        React.createElement(
                            'h3',
                            null,
                            'Profile Update'
                        ),
                        React.createElement(
                            'form',
                            { id: bannerFormId, method: 'post', encType: 'application/x-www-form-urlencoded' },
                            React.createElement('input', { type: 'hidden', id: 'action', name: 'action', defaultValue: 'upload-banner' }),
                            React.createElement('input', { type: 'hidden', id: 'banner', name: 'banner', defaultValue: _this.state.userDetails['banner'] }),
                            React.createElement('input', { type: 'hidden', id: 'user-id', name: 'user-id', defaultValue: _this.state.userDetails['id'] }),
                            React.createElement(
                                'div',
                                { className: _this.state.styles.formControl },
                                React.createElement(
                                    'label',
                                    { id: 'lb-topic', htmlFor: 'caption' },
                                    'Site name or caption'
                                ),
                                React.createElement('input', { className: _this.state.styles.formControl, type: 'text', name: 'caption', id: 'caption',
                                    placeholder: 'Site caption or name', defaultValue: _this.state.userDetails['caption'] })
                            ),
                            React.createElement('br', null),
                            React.createElement(
                                'div',
                                { className: _this.state.styles.formControl },
                                React.createElement(
                                    'label',
                                    { id: 'lb-deadline', htmlFor: 'deadline' },
                                    'Site slogan'
                                ),
                                React.createElement('input', { className: _this.state.styles.formControl, type: 'text', name: 'slogan', id: 'slogan',
                                    placeholder: 'Site slogan', defaultValue: _this.state.userDetails['slogan'] })
                            ),
                            React.createElement('br', null),
                            React.createElement(
                                'div',
                                { className: _this.state.styles.formControl },
                                React.createElement(
                                    'label',
                                    { id: 'lb-deadline', htmlFor: bannerFileId },
                                    'Site Banner ',
                                    React.createElement(
                                        'label',
                                        null,
                                        'Best image size width:800px Height: 1200px'
                                    )
                                )
                            ),
                            React.createElement('br', null),
                            React.createElement('img', { src: _this.state.userDetails['banner'], alt: _this.state.userDetails['caption'],
                                style: { maxWidth: '400px', maxHeight: '800px' }, className: 'card-img' }),
                            React.createElement('br', null),
                            React.createElement('br', null),
                            React.createElement('input', { type: 'file', name: bannerFileId, id: bannerFileId,
                                style: { display: 'none', visibility: 'hidden' },
                                onInput: function onInput() {
                                    _this.toolBoxSettingsUploadBanner(bannerFormId, bannerFileId);
                                } }),
                            React.createElement(
                                'button',
                                { type: 'button', className: _this.state.styles.formIbtn, onClick: function onClick() {
                                        _this.pickFile(bannerFileId);
                                    } },
                                'Choose Banner'
                            ),
                            React.createElement(
                                'div',
                                { className: _this.state.styles.formButton },
                                React.createElement(
                                    'button',
                                    { id: 'submit', type: 'button', className: _this.state.styles.formIbtn,
                                        onClick: function onClick() {
                                            return _this.toolBoxUpdateSettings(bannerFormId, bannerFileId);
                                        } },
                                    'Update Profile'
                                )
                            )
                        )
                    )
                )
            );

            var html = React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { className: 'row' },
                    passwordUpdateForm,
                    updateProfileForm
                )
            );

            PopUp.showPopUpWindow(_this, html);
        };

        _this.upgradeUserPlan = function (planId) {
            var process = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var caption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Proceed to Payment";

            var confirmMsg = React.createElement(
                'div',
                { className: 'alert alert-info' },
                React.createElement(
                    'div',
                    { className: 'h4' },
                    'Click on the button to proceed to payment'
                ),
                React.createElement(
                    'div',
                    null,
                    _this.state.supportInfo
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement('br', null),
                    React.createElement(
                        'button',
                        { id: 'submit', type: 'button', className: _this.state.styles.formIbtn,
                            onClick: function onClick() {
                                PopUp.clearMessage(_this);
                            } },
                        'Cancel'
                    ),
                    React.createElement(
                        'button',
                        { id: 'submit', type: 'button', className: _this.state.styles.formIbtn,
                            onClick: function onClick() {
                                return _this.upgradeUserPlan(planId, true);
                            } },
                        caption
                    )
                )
            );

            if (process === false) {
                // just show confirmation
                PopUp.setMessage(_this, confirmMsg, 5000, false);
            } else {}
        };

        _this.toolBoxUpdateSettings = function (formId, fileId) {
            var action = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'update-profile';


            _this.setMessage(React.createElement(
                'div',
                { className: 'alert alert-info' },
                'Updating profile... '
            ), 5000, false);

            var rnd = Math.random(100);
            var caption = document.getElementById('caption').value;
            var msg = "Site caption or name cannot be empty. Please provide a name";

            if (caption == '' || caption == null) {
                PopUp.setMessage(_this, React.createElement(
                    'div',
                    { className: 'alert alert-danger' },
                    ' ',
                    msg,
                    ' '
                ));
                return false;
            }
            var slogan = document.getElementById('slogan').value;
            var banner = document.getElementById('banner').value;
            var userId = document.getElementById('user-id').value;

            var postUrl = _this.state.actionUrlPlans + '?action=' + action + '&caption=' + caption + '&slogan=' + slogan + '&banner=' + banner + '&id=' + userId + '&rnd=' + rnd;

            fetch(postUrl, {}).then(function (response) {
                return response.json();
                //return (response.text());
            }).then(function (responseJson) {
                // console.log(responseJson);
                var status = responseJson['status'];
                var msg = responseJson['msg'];
                if (status === true) {
                    //alert(status);
                    PopUp.setMessage(_this, React.createElement(
                        'div',
                        { className: 'alert alert-success' },
                        ' ',
                        msg,
                        ' '
                    ));
                    // reload the settings
                    _this.getUserPlan(_this.toolBoxSettings);
                } else {
                    PopUp.setMessage(_this, React.createElement(
                        'div',
                        { className: 'alert alert-danger' },
                        ' ',
                        msg,
                        ' '
                    ));
                }
            });
        };

        _this.toolBoxUpdatePassword = function (formId, fileId) {
            var action = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'update-password';


            PopUp.setMessage(_this, React.createElement(
                'div',
                { className: 'alert alert-info' },
                'Updating password... '
            ), 5000, false);

            var rnd = Math.random(100);
            var user = _this.state.userDetails['user'];
            var email = _this.state.userDetails['email'];
            var userId = _this.state.userDetails['id'];

            var passwordOld = document.getElementById('password-old').value;
            var password = document.getElementById('password-new').value;
            var passwordConfirm = document.getElementById('password-confirm').value;

            var err = null;

            if (passwordOld == "") {
                PopUp.setMessage(_this, React.createElement(
                    'div',
                    { className: 'alert alert-danger' },
                    ' Old password cannot be empty'
                ));
                err = true;
                return false;
            }

            if (password == "") {
                PopUp.setMessage(_this, React.createElement(
                    'div',
                    { className: 'alert alert-danger' },
                    'Password cannot be empty'
                ));
                err = true;
                return false;
            }
            if (password !== passwordConfirm) {
                PopUp.setMessage(_this, React.createElement(
                    'div',
                    { className: 'alert alert-danger' },
                    'Confirm password not matching'
                ));
                err = true;
                return false;
            }
            if (email == "" || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
                PopUp.setMessage(_this, React.createElement(
                    'div',
                    { className: 'alert alert-danger' },
                    'Email empty or not valid'
                ));
                err = true;
                return false;
            }
            if (user == "") {
                PopUp.setMessage(_this, React.createElement(
                    'div',
                    { className: 'alert alert-danger' },
                    'Username cannot be empty'
                ));
                err = true;
                return false;
            }

            var postUrl = _this.state.actionUrlUser + '?user=' + user + '&password=' + password + '&id=' + userId + '&action=' + action + '&password-old=' + passwordOld + '&password-confirm=' + passwordConfirm + '&email=' + email + '&rnd=' + rnd;

            fetch(postUrl, {}).then(function (response) {
                return response.json();
                //return (response.text());
            }).then(function (responseJson) {
                //console.log(responseJson);
                var status = responseJson['status'];
                var msg = responseJson['msg'];
                if (status === true) {
                    //alert(status);
                    PopUp.setMessage(_this, React.createElement(
                        'div',
                        { className: 'alert alert-success' },
                        ' ',
                        msg,
                        ' '
                    ));
                    _this.cleanUpFieldValues('password-new,password-old,password-confirm');
                } else {
                    PopUp.setMessage(_this, React.createElement(
                        'div',
                        { className: 'alert alert-danger' },
                        ' ',
                        msg,
                        ' '
                    ));
                }
            });
        };

        _this.toolBoxSettingsUploadBanner = function (formId, fileId) {
            var action = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'upload-banner';


            _this.setMessage(React.createElement(
                'div',
                { className: 'alert alert-info' },
                ' Uploading banner, please wait... '
            ), 5000, false);

            var rnd = Math.random(100);
            var postUrl = _this.state.actionUrlPlans + '?action=' + action + '&rnd=' + rnd;
            //alert(postUrl);
            var postForm = document.getElementById(formId);
            var postData = new FormData(postForm);
            // alert(postUrl);

            fetch(postUrl, {
                method: 'POST',
                body: postData
            }).then(function (response) {
                return response.json();
                //return (response.text());
            }).then(function (responseJson) {
                console.log(responseJson);
                var status = responseJson['status'];
                var msg = responseJson['msg'];
                var filePath = responseJson['file_path'];
                if (status === true) {
                    //alert(status);
                    _this.setMessage(React.createElement(
                        'div',
                        { className: 'alert alert-success' },
                        ' ',
                        msg,
                        ' '
                    ));
                    var userDetails = _this.state.userDetails;
                    userDetails['banner'] = filePath;
                    document.getElementById('banner').value = filePath;
                    // refresh screen
                    _this.setState({ userDetails: userDetails }, function () {
                        _this.toolBoxSettings();
                    });
                    return filePath;
                } else {
                    _this.setMessage(React.createElement(
                        'div',
                        { className: 'alert alert-danger' },
                        ' ',
                        msg,
                        ' '
                    ));
                    return null;
                }
            });
        };

        _this.cleanUpFieldValues = function (values) {
            var delim = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ',';

            if (values !== _typeof('object')) {
                values = values.split(delim);
            }
            var l = values.length;

            for (n = 0; n < l; n++) {
                var curFieldId = values[n];
                document.getElementById(curFieldId).value = null;
            }
        };

        _this.getBillingCycle = function (cycleId) {
            // console.log(this.state.paymentCycles);
            return _this.state.paymentCycles.filter(function (cycle) {
                return cycle['cycle_id'] === cycleId;
            })[0];
        };

        _this.canCreateMeeting = function () {
            var planId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.state.userPlan;

            var maxMeet = _this.state.paymentPlans.filter(function (plan) {
                return plan['plan_id'] === planId;
            })[0];
            var maxMeetAllowed = parseInt(maxMeet['max_meet']);
            var userMeetCount = parseInt(_this.state.userMeetingCount);
            //alert("Max Allowed:" + maxMeetAllowed +" User Max Meet:" + userMeetCount);

            if (userMeetCount >= maxMeetAllowed) {
                return { status: false, label: maxMeet['label'], plan_id: maxMeet['plan_id'] };
            } else {
                return { status: true };
            }
        };

        _this.canShowAdvert = function () {
            var advertIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            var userPlan = _this.state.userPlan;

            if (advertIndex >= userPlan) {
                // this users will have adverts shown
                _this.setState({ advertDisplay: 'block' });
            } else {
                _this.setState({ advertDisplay: 'none' });
            }
        };

        _this.pickFile = function (fileId) {
            var file = document.getElementById(fileId);
            file.click();
        };

        _this.numberWithCommas = function (value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

        _this.startAdminHelp = function () {
            HelpManager.startHelp('admin');
        };

        _this.formHtml = function () {
            var locationName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Dashboard";


            var defaultHeader = React.createElement(
                'aside',
                { className: 'room-header-left' },
                React.createElement(
                    'div',
                    { className: 'room-logo' },
                    React.createElement(
                        'picture',
                        null,
                        React.createElement('source', { media: '(max-width: 600px)', srcSet: 'assets/images/logo-white.png' }),
                        React.createElement('source', { media: '(max-width: 960px)', srcSet: 'assets/images/logo.png' }),
                        React.createElement('img', { src: 'assets/images/logo.png', alt: 'Logo' })
                    )
                ),
                React.createElement(
                    'h3',
                    { className: 'room-title' },
                    locationName
                )
            );

            var html = React.createElement(
                'div',
                { className: 'room' },
                React.createElement(
                    'section',
                    { id: 'room-header', className: 'room-header' },
                    _this.state.actionMsg,
                    _this.state.popUpWindow,
                    defaultHeader,
                    _this.getToolBox()
                ),
                React.createElement(
                    'section',
                    { className: 'room-body-dashboard' },
                    React.createElement(
                        'div',
                        { className: 'room-body-dashboard-section', id: 'room-list' },
                        _this.state.roomList
                    ),
                    React.createElement(
                        'div',
                        { className: 'room-body-dashboard-section', id: 'subscription-list' },
                        React.createElement(
                            'div',
                            { className: 'dashboard-list-cont' },
                            React.createElement(
                                'div',
                                { id: 'create-meet' },
                                React.createElement(
                                    'div',
                                    { className: 'form-items' },
                                    React.createElement(
                                        'h3',
                                        null,
                                        'Create meeting'
                                    ),
                                    React.createElement(
                                        'form',
                                        { id: 'login-form', method: 'post', action: _this.state.roomPath, target: '_blank', onSubmit: function onSubmit(e) {
                                                var meetName = document.getElementById("meet-name").value;
                                                if (meetName != "") {
                                                    e.preventDefault();
                                                    return false;
                                                }
                                            } },
                                        React.createElement(
                                            'div',
                                            { className: 'modal-backdrop', style: { visibility: _this.state.popUp } },
                                            React.createElement(
                                                'div',
                                                { className: 'modal-content modal_content' },
                                                React.createElement(
                                                    'div',
                                                    { className: 'modal-body' },
                                                    React.createElement('div', { className: 'loader06' }),
                                                    React.createElement(
                                                        'div',
                                                        { className: 'text-primary' },
                                                        _this.state.actionMsg
                                                    )
                                                ),
                                                React.createElement(
                                                    'div',
                                                    { className: 'modal-footer' },
                                                    React.createElement(
                                                        'button',
                                                        { className: 'ibtn', type: 'button', onClick: function onClick() {
                                                                _this.setPopUp('hidden');
                                                                _this.disableButton(false);
                                                            } },
                                                        'Close'
                                                    )
                                                )
                                            )
                                        ),
                                        React.createElement('input', { className: _this.state.styles.formControl, type: 'text', name: 'meet-name',
                                            id: 'meet-name', placeholder: 'Choose a name', onKeyUp: function onKeyUp(e) {
                                                if (parseInt(e.keyCode) === 13) _this.createMeeting();
                                                e.preventDefault();
                                                return false;
                                            } }),
                                        React.createElement('input', { type: 'hidden', name: 'meet-id', id: 'meet-id', value: _this.state.formMeetId }),
                                        React.createElement('input', { type: 'hidden', name: 'user', id: 'user', value: _this.state.formUser }),
                                        React.createElement('input', { type: 'hidden', name: 'port', id: 'port', value: _this.state.formPort }),
                                        React.createElement('input', { type: 'hidden', name: 'owner', id: 'owner', value: _this.state.formOwner }),
                                        React.createElement('input', { type: 'hidden', name: 'role', id: 'role', value: _this.state.formRole }),
                                        React.createElement('input', { type: 'hidden', name: 'link', id: 'link', value: _this.state.formLink }),
                                        React.createElement('input', { type: 'hidden', name: 'meeting', id: 'meeting', value: _this.state.formMeeting }),
                                        React.createElement(
                                            'div',
                                            { className: _this.state.styles.formButton },
                                            React.createElement('br', null),
                                            React.createElement(
                                                'button',
                                                { id: 'submit', type: 'button', className: _this.state.styles.formIbtn,
                                                    disabled: _this.state.disabledButton,
                                                    onClick: function onClick() {
                                                        return _this.createMeeting();
                                                    } },
                                                'Create Meeting'
                                            ),
                                            React.createElement(
                                                'button',
                                                { className: 'ibtn', type: 'button', id: 'meet-submit',
                                                    style: { visibility: 'hidden' } },
                                                ' Submit'
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                ),
                React.createElement('section', { className: 'room-footer-dashboard' })
            );
            return html;
        };

        _this.createWebSocket = function (port) {
            fetch(_this.state.socketUrl + '?port=' + port);
        };

        _this.componentDidMount = function () {
            _this.getRoomList();
            _this.startMeetingWithApi();
            _this.getUserPlan();
            _this.loadGlobalCourses();
            //this.getMeetCourses(null,null, false);
        };

        _this.state = {
            disabledButton: false,
            popUp: 'hidden',
            popUpContent: null,
            popUpWindow: null,

            meetContState: 'hidden',
            loginFormState: 'visible',

            actionMsg: null,
            confirmDeleteMsg: "Are you sure?",
            actionUrl: 'process/meet-create.php',
            actionUrlRoomList: 'process/meet-room-list.php',
            actionUrlJoin: 'process/join.php',
            actionUrlLogout: 'process/logout.php',
            actionUrlDeleteMeet: 'process/meet-delete.php',
            actionUrlGenerateMeetId: 'process/meet-new-id.php',
            actionUrlPlans: 'process/meet-plans.php',
            actionUrlUser: 'process/user.php',
            actionUrlSubjectList: 'process/meet-course.php',
            actionUrlContentManager: 'process/meet-global-content.php',

            indexPath: 'index.php',
            roomPath: 'room.php',
            defaultUserRole: 'admin',
            roomList: null,
            subjectList: [],
            globalCourseList: [],
            globalAuthorList: [],
            globalAuthorContents: [],
            globalTopicList: [],
            globalAuthorContentFilter: [],
            globalAuthorContentFilterList: null,

            styles: {
                formControl: "form-control",
                formButton: "form-button",
                formIbtn: "ibtn"
            },

            formMeetId: null,
            formUser: null,
            formPort: null,
            formOwner: null,
            formRole: null,
            formLink: null,
            formMeeting: null,
            formSelectedMeet: null,

            userPlan: null,
            paymentPlans: null,
            paymentCycles: null,
            userDetails: null,
            userMeetingCount: null,
            advertDisplay: 'none',

            supportInfo: React.createElement(
                'div',
                null,
                React.createElement(
                    'p',
                    null,
                    React.createElement(
                        'i',
                        { className: 'fa fa-inbox' },
                        ': sales@mlisoft.com, class@mlisoft.com '
                    )
                ),
                React.createElement(
                    'p',
                    null,
                    React.createElement(
                        'i',
                        { className: 'fa fa-phone' },
                        '+234 9037605757, +234 8069256743'
                    )
                )
            ),
            pageLoader: React.createElement('div', { className: 'loader09' })
        };
        return _this;
    }

    _createClass(Dashboard, [{
        key: 'render',
        value: function render() {
            //alert(this.formHtml());
            return this.formHtml();
        }
    }]);

    return Dashboard;
}(React.Component);

var domLayer = document.getElementById('app');

ReactDOM.render(React.createElement(Dashboard, null), domLayer);