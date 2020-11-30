/*
 @ This file will handle the dashboard
 @ Author: Adeniyi Anthony
 @ email: mlisoftinc@gmail.com
 */
'use strict';

/*
 define style to handle our select field
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

        _this.disableButton = function (state) {
            _this.setState({ disabledButton: state });
        };

        _this.setMessage = function (msg) {
            var callBack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            _this.setState({ actionMsg: msg }, function () {
                return callBack !== null && typeof callBack === 'function' ? callBack() : null;
            });
        };

        _this.getSubList = function () {

            var rnd = Math.random();

            var postUrl = _this.state.actionUrlSubList + '?rnd=' + rnd;

            fetch(postUrl)
            //.then((response) => response.json())
            .then(function (response) {
                return response.json();
                //return (response.text());
            }).then(function (responseJson) {
                console.log(responseJson);
                var status = responseJson['status'];
                var msg = responseJson['msg'];
                var content = responseJson['content'];
                var meetingCount = 0;

                if (status == true) {
                    var curHtml = content.map(function (sub) {

                        var list = React.createElement(
                            'div',
                            { id: sub['id'], key: sub['id'], className: 'dashboard-list-cont' },
                            React.createElement(
                                'div',
                                null,
                                React.createElement(
                                    'span',
                                    { className: 'title' },
                                    sub['channel']
                                ),
                                React.createElement('i', { className: 'dashboard-list-delete icon-030 ', onClick: function onClick() {
                                        _this.deleteSub(sub['user_id'], sub['channel_id']);
                                    } })
                            ),
                            React.createElement(
                                'div',
                                null,
                                'Channel: ',
                                sub['channel']
                            )
                        );
                        return list;
                    });
                    //alert(curHtml);
                    _this.setState({ subList: curHtml });
                } else {

                    var list = React.createElement(
                        'div',
                        { className: 'dashboard-list-cont' },
                        React.createElement(
                            'div',
                            null,
                            msg
                        )
                    );
                    _this.setState({ subList: list });
                }
            });
        };

        _this.getChannelList = function () {

            var rnd = Math.random();

            var postUrl = _this.state.actionUrlChannelList + '?rnd=' + rnd;

            fetch(postUrl)
            //.then((response) => response.json())
            .then(function (response) {
                return response.json();
                //return (response.text());
            }).then(function (responseJson) {
                console.log(responseJson);
                var status = responseJson['status'];
                var msg = responseJson['msg'];
                var content = responseJson['content'];

                if (status == true) {
                    var curHtml = content.map(function (sub) {

                        var list = React.createElement(
                            'div',
                            { id: sub['id'], key: sub['id'], className: 'dashboard-list-cont' },
                            React.createElement(
                                'div',
                                null,
                                React.createElement(
                                    'span',
                                    { className: 'title' },
                                    sub['channel']
                                ),
                                React.createElement('i', { className: 'dashboard-list-delete icon-040', onClick: function onClick() {
                                        _this.subscribe(sub['id']);
                                    } })
                            ),
                            React.createElement(
                                'div',
                                null,
                                sub['des']
                            )
                        );
                        return list;
                    });
                    //alert(curHtml);
                    _this.setState({ channelList: curHtml });
                } else {

                    var list = React.createElement(
                        'div',
                        { className: 'dashboard-list-cont' },
                        React.createElement(
                            'div',
                            null,
                            msg
                        )
                    );
                    _this.setState({ channelList: list });
                }
            });
        };

        _this.logoutUser = function () {

            var rnd = Math.random();
            PopUp.setMessage(_this, React.createElement(
                'div',
                { className: 'alert alert-info' },
                'Signing out...'
            ));
            var postUrl = _this.state.actionUrlLogout + '?rnd=' + rnd;
            fetch(postUrl).then(function (response) {
                return response.json();
            }).then(function (responseJson) {
                console.log(responseJson);
                var status = responseJson['status'];
                var msg = responseJson['status'];
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

        _this.deleteSub = function (userId, channelId) {

            var del = confirm(_this.state.confirmDeleteMsg);
            if (del == false) {
                return null;
            }

            var rnd = Math.random();
            PopUp.setMessage(_this, React.createElement(
                'div',
                { className: 'alert alert-info' },
                'Unsubscribing, please wait...'
            ));

            var postUrl = _this.state.actionUrlDeleteSub + '?user-id=' + userId + '&channel-id=' + channelId + '&rnd=' + rnd;

            fetch(postUrl)
            //.then((response) => response.json())
            .then(function (response) {
                return response.json();
                //return (response.text());
            }).then(function (responseJson) {
                console.log(responseJson);
                var status = responseJson['status'];
                var msg = responseJson['msg'];

                if (status === true) {
                    PopUp.setMessage(_this, React.createElement(
                        'div',
                        { className: 'alert alert-success' },
                        msg
                    ));
                    _this.getSubList();
                    _this.getChannelList();
                } else {
                    // notify user of the login failure
                    PopUp.setMessage(_this, React.createElement(
                        'div',
                        { className: 'alert alert-danger' },
                        msg
                    ));
                }
            });
        };

        _this.subscribe = function (channelId) {
            var rnd = Math.random();
            PopUp.setMessage(_this, React.createElement(
                'div',
                { className: 'alert alert-info' },
                'Subscribing, please wait...'
            ));

            var postUrl = _this.state.actionUrlSub + '?channel-id=' + channelId + '&rnd=' + rnd;
            //alert(postUrl);
            fetch(postUrl)
            //.then((response) => response.json())
            .then(function (response) {
                return response.json();
                //return (response.text());
            }).then(function (responseJson) {
                console.log(responseJson);
                var status = responseJson['status'];
                var msg = responseJson['msg'];
                if (status === true) {
                    PopUp.setMessage(_this, React.createElement(
                        'div',
                        { className: 'alert alert-success' },
                        msg
                    ));
                    _this.getSubList();
                    _this.getChannelList();
                } else {
                    // notify user
                    PopUp.setMessage(_this, React.createElement(
                        'div',
                        { className: 'alert alert-danger' },
                        msg
                    ));
                }
            });
        };

        _this.formHtml = function () {
            var locationName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Dashboard";


            var defaultHeader = React.createElement(
                'aside',
                { className: 'dashboard-header' },
                React.createElement(
                    'div',
                    { style: {
                            color: "#ffff", fontSize: "18pt", marginRight: "auto"
                        }
                    },
                    locationName
                ),
                React.createElement(
                    'div',
                    { style: {
                            color: "#ffff",
                            marginLeft: "auto"
                        },
                        onClick: function onClick() {
                            _this.logoutUser();
                        }
                    },
                    React.createElement('i', { className: ' dashboard-logout icon-086' })
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
                    defaultHeader
                ),
                React.createElement(
                    'section',
                    _defineProperty({ className: 'room-body-dashboard' }, 'className', 'dashboard-content'),
                    React.createElement(
                        'div',
                        { className: 'dashboard-list-cont-no-effect col-sm-6 ', id: 'room-list' },
                        React.createElement(
                            'div',
                            { className: 'dashboard-list-cont-no-effect dashboard-list-header' },
                            'Your Channels'
                        ),
                        _this.state.subList
                    ),
                    React.createElement(
                        'div',
                        { className: 'dashboard-list-cont-no-effect col-sm-6 ', id: 'subscription-list' },
                        React.createElement(
                            'div',
                            { className: 'dashboard-list-cont-no-effect dashboard-list-header' },
                            'Available Channels'
                        ),
                        _this.state.channelList
                    )
                ),
                React.createElement('section', { className: 'room-footer-dashboard' })
            );
            return html;
        };

        _this.componentDidMount = function () {
            _this.getSubList();
            _this.getChannelList();
        };

        _this.state = {
            disabledButton: false,
            popUp: 'hidden',
            popUpContent: null,
            popUpWindow: null,

            actionMsg: null,
            confirmDeleteMsg: "Are you sure?",
            actionUrlSubList: 'process/sub-list.php',
            actionUrlSub: 'process/sub.php',
            actionUrlChannelList: 'process/channel-list.php',
            actionUrlLogout: 'process/logout.php',
            actionUrlDeleteSub: 'process/sub-delete.php',
            actionUrlGenerateMeetId: 'process/meet-new-id.php',
            actionUrlUser: 'process/user.php',

            indexPath: 'index.php',
            roomPath: 'room.php',
            defaultUserRole: 'admin',
            subList: null,
            channelList: [],
            styles: {
                formControl: "form-control",
                formButton: "form-button",
                formIbtn: "ibtn"
            },
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