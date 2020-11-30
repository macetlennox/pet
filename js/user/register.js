/*
 @ This file will handle the joning a meeting
 @ Author: Adeniyi Anthony
 @ email: mlisoftinc@gmail.com
 */
'use strict';

/*
 define style to handle our select field
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Meet = function (_React$Component) {
    _inherits(Meet, _React$Component);

    function Meet(props) {
        _classCallCheck(this, Meet);

        var _this = _possibleConstructorReturn(this, (Meet.__proto__ || Object.getPrototypeOf(Meet)).call(this, props));

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
        };

        _this.disableButton = function (state) {
            _this.setState({ disabledButton: state });
        };

        _this.setMessage = function (msg) {
            _this.setState({ actionMsg: msg });
        };

        _this.createAccount = function () {
            /*
             disable the button first
             */
            _this.disableButton(true);
            /*
             * once this is completed, show the pop up indicating that we are logging in
             *
             */
            _this.setPopUp('visible');
            /*
             * process the login
             */
            var err = false;

            var user = document.getElementById('user').value;
            var email = document.getElementById('email').value;
            var password = document.getElementById('password').value;
            var passwordConfirm = document.getElementById('confirm-password').value;

            var rnd = Math.random();

            if (password == "") {
                _this.setMessage("Password cannot be empty");
                err = true;
            }
            if (password !== passwordConfirm) {
                _this.setMessage("Confirm password not matching");
                err = true;
            }
            if (email == "" || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
                _this.setMessage("Email empty or not valid");
                err = true;
            }
            if (user == "") {
                _this.setMessage("Username cannot be empty");
                err = true;
            }

            if (err == true) {
                _this.setPopUp('hidden', 2000);
                _this.disableButton(false);
                return false;
            }

            _this.setMessage(_this.state.actionMsg);
            var postUrl = _this.state.actionUrl + '?user=' + user + '&password=' + password + '&password-confirm=' + passwordConfirm + '&email=' + email + '&rnd=' + rnd;

            fetch(postUrl).then(function (response) {
                return response.json();
                //return (response.text());
            }).then(function (responseJson) {
                console.log(responseJson);
                var status = responseJson['status'];
                var msg = responseJson['msg'];

                if (status === true) {
                    _this.setMessage(msg);
                    /* create the socket incase we don't alreay have it running 
                    */
                    //meetSubmit.click();
                    document.location = _this.state.indexPath;
                } else {
                    // notify user of the login failure
                    //alert(msg);
                    _this.setMessage(msg);
                    // hide popup screen after 5 seconds
                    _this.setPopUp('hidden', 2000);
                    // re-enable login  button
                    _this.disableButton(false);
                }
            });
        };

        _this.formHtml = function () {
            var html = React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'form-holder' },
                    React.createElement(
                        'div',
                        { className: 'form-content' },
                        React.createElement(
                            'div',
                            { className: 'form-items', id: 'register-form-cont' },
                            React.createElement(
                                'div',
                                { className: 'website-logo-inside' },
                                React.createElement(
                                    'a',
                                    { href: 'join.php' },
                                    React.createElement(
                                        'div',
                                        { className: 'logo' },
                                        React.createElement('img', { className: 'logo-size', src: 'images/pet.svg', alt: '' })
                                    )
                                )
                            ),
                            React.createElement(
                                'h3',
                                null,
                                'Create an account'
                            ),
                            React.createElement(
                                'p',
                                null,
                                'Please fill out form'
                            ),
                            React.createElement(
                                'div',
                                { className: 'page-links' },
                                React.createElement(
                                    'a',
                                    { href: _this.state.indexPath, id: 'link-account-join' },
                                    'Login'
                                ),
                                React.createElement(
                                    'a',
                                    { className: 'active', href: _this.state.phpSelf },
                                    'Register'
                                )
                            ),
                            React.createElement(
                                'form',
                                { id: 'login-form', method: 'post', action: _this.state.indexPath, onSubmit: function onSubmit(e) {
                                        e.preventDefault();
                                        return false;
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
                                React.createElement('input', { className: _this.state.styles.formControl, type: 'text', name: 'user', id: 'user',
                                    placeholder: 'Choose a username', required: true }),
                                React.createElement('input', { className: _this.state.styles.formControl, type: 'text', name: 'email', id: 'email',
                                    placeholder: 'sample@mail.com' }),
                                React.createElement('input', { className: _this.state.styles.formControl, type: 'password', name: 'password',
                                    id: 'password', placeholder: 'Enter password' }),
                                React.createElement('input', { className: _this.state.styles.formControl, type: 'password', name: 'confirm-password',
                                    id: 'confirm-password', placeholder: 'Confirm password', onKeyUp: function onKeyUp(e) {
                                        if (parseInt(e.keyCode) === 13) _this.createAccount();
                                    } }),
                                React.createElement(
                                    'div',
                                    { className: _this.state.styles.formButton },
                                    React.createElement(
                                        'button',
                                        { id: 'submit', type: 'button', className: _this.state.styles.formIbtn,
                                            disabled: _this.state.disabledButton,
                                            onClick: function onClick() {
                                                return _this.createAccount();
                                            } },
                                        'Create Account'
                                    ),
                                    React.createElement(
                                        'button',
                                        { className: 'ibtn', type: 'BUTTON', id: 'meet-submit',
                                            style: { visibility: 'hidden' } },
                                        ' Submit'
                                    ),
                                    React.createElement('button', { id: 'meet-submit', type: 'submit', style: { visibility: 'hidden' } })
                                )
                            )
                        )
                    )
                )
            );
            return html;
        };

        _this.state = {
            disabledButton: false,
            popUp: 'hidden',
            meetContState: 'hidden',
            loginFormState: 'visible',
            actionMsg: 'Creating account. Please wait...',
            actionUrl: 'process/register.php',
            indexPath: 'index.php',
            phpSelf: 'register.php',
            styles: {
                formControl: "form-control",
                formButton: "form-button",
                formIbtn: "ibtn"
            }
        };
        return _this;
    }

    _createClass(Meet, [{
        key: 'render',
        value: function render() {
            //alert(this.formHtml());
            return this.formHtml();
        }
    }]);

    return Meet;
}(React.Component);

var domLayer = document.getElementById('app');

ReactDOM.render(React.createElement(Meet, null), domLayer);