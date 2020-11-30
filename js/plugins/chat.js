var _this2 = this;

var Chat = {
    app: null,
    messageStore: {},
    defaultStyle: {
        chatWindow: "chat-window",
        chatWrapper: "chat-wrapper",
        chatTitle: "chat-title",
        chatTitleText: "chat-title-text",
        chatTitleClose: "chat-title-close",
        chatContainer: "chat-container",
        message: "chat-message",
        messageIn: "chat-message-in",
        messageOut: "chat-message-out",
        messageTime: "chat-message-time",
        input: "chat-input",
        sendButton: "chat-send",
        button: "chat-button"
    },
    startPrivateChat: function startPrivateChat(_this, remoteUserId, localUserId, remoteUser, localUser) {
        return Chat.getChatContainer(_this, remoteUserId, localUserId, remoteUser, localUser);
    },

    getChatWindow: function getChatWindow(_this) {
        var sendLabel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Send Message";
        var chatWindowId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "chat-window-panel";

        var style = { chatWindow: "chat-window" };
        return React.createElement(
            "div",
            { id: chatWindowId, className: style.chatWindow },
            _this.state.chatWindowList
        );
    },

    getChatContainer: function getChatContainer(_this, remoteUserId) {
        var localUserId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var remoteUser = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var localUser = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
        var style = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
        var sendLabel = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "Send Message";
        var chatWindowId = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : "chat-window-panel";

        style = style !== null ? style : Chat.defaultStyle;
        var chatContainerId = "private-chat-cont-" + localUserId + "-" + remoteUserId;
        var chatMessageId = "private-chat-msg-" + localUserId + "-" + remoteUserId;
        var chatInputId = "private-chat-input-" + localUserId + "-" + remoteUserId;

        if (!Chat.messageStore[remoteUserId])
            //Chat.messageStore[remoteUserId]=[]; // initialize an empty array for messages
            Chat.messageStore[remoteUserId] = [];

        var chatContainer = React.createElement(
            "div",
            { id: chatContainerId, key: chatContainerId, className: style.chatWrapper },
            React.createElement(
                "div",
                { className: style.chatTitle },
                React.createElement(
                    "div",
                    { className: style.chatTitleText },
                    remoteUser
                ),
                React.createElement(
                    "div",
                    { className: style.chatTitleClose },
                    React.createElement("i", { className: "fa fa-window-close", onClick: function onClick() {
                            var newChatWindowList = _this.state.chatWindowList.filter(function (list) {
                                return list !== chatContainer;
                            });
                            _this.setState({ chatWindowList: newChatWindowList });
                        } })
                )
            ),
            React.createElement(
                "div",
                { className: style.chatContainer },
                React.createElement(
                    "div",
                    { id: chatMessageId, className: style.message },
                    Chat.getChatScreenList(remoteUserId, style)
                ),
                React.createElement("textarea", { id: chatInputId, className: style.input, onKeyUp: function onKeyUp(e) {
                        if (parseInt(e.keyCode) === 13) Chat.sendChatMessage(_this, remoteUserId, localUserId, remoteUser, localUser, chatInputId, chatMessageId, style);
                    } }),
                React.createElement(
                    "button",
                    { className: style.sendButton, onClick: function onClick() {
                            Chat.sendChatMessage(_this, remoteUserId, localUserId, remoteUser, localUser, chatInputId, chatMessageId, style);
                        } },
                    sendLabel
                )
            )
        );

        var newChatWindowList = _this.state.chatWindowList ? _this.state.chatWindowList.concat(chatContainer) : [chatContainer];
        _this.setState({ chatWindowList: newChatWindowList });
        return { chatContainer: chatContainer, chatMessageId: chatMessageId, chatInputId: chatInputId };
    },

    sendChatMessage: function sendChatMessage(_this, remoteUserId, localUserId, remoteUser, localUser, messageInputId, messageScreenId, style) {
        var type = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : "messageOut";
        var timeDelim = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : ":";
        var dateDelim = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : "/";

        var message = document.getElementById(messageInputId) ? document.getElementById(messageInputId).value : null;

        if (!Chat.messageStore[remoteUserId]) Chat.messageStore[remoteUserId] = []; // initialize  message as empty array

        if (message === null || message == "" || message === undefined) return null;

        var messageId = (remoteUserId + localUser + remoteUser + localUser + Math.random()).replace(".", "").split("").reverse().join("");
        var curDate = new Date();
        var timeIn = "" + curDate.getHours() + timeDelim + curDate.getMinutes() + timeDelim + curDate.getSeconds();
        var dateIn = "" + curDate.getDay() + dateDelim + curDate.getMinutes() + dateDelim + curDate.getFullYear();

        var chatMessage = [{
            type: type,
            id: messageId,
            senderId: localUserId,
            sender: localUser,
            message: message,
            dateIn: dateIn,
            timeIn: timeIn
        }];
        Chat.appendChatMessage(remoteUserId, messageScreenId, chatMessage, style);
        // const conn=_this.conferenceUsers.filter(user=>user.user.userId===remoteUserId)[0]['textConn'];
        //alert(remoteUserId);
        var conn = _this.conferenceUsers.find(function (user) {
            return user.userId === remoteUserId;
        }).textConn;
        // send websocket notification of this message
        _this.sendWebSocket('private-chat', true, chatMessage, null, conn);
        // clean message input
        document.getElementById(messageInputId).value = null;
    },

    appendChatMessage: function appendChatMessage(remoteUserId, messageScreenId, chatMessage) {
        var style = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

        style = style !== null ? style : Chat.defaultStyle;
        var newMessages = Chat.messageStore[remoteUserId].concat(chatMessage);
        Chat.messageStore[remoteUserId] = newMessages;
        var chatMessageStr = Chat.getChatScreenList(remoteUserId, style, chatMessage, true);
        var chatScreen = document.getElementById(messageScreenId);
        chatScreen.innerHTML = chatScreen.innerHTML + chatMessageStr;
        chatScreen.scrollTop = chatScreen.scrollHeight;
        return chatScreen.innerHTML;
    },

    getChatScreenList: function getChatScreenList(remoteUserId) {
        var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var messageStore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var stringFormat = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        var chatMessageList = messageStore !== null ? messageStore : Chat.messageStore[remoteUserId];
        var chatString = "";
        var chatDom = chatMessageList.map(function (message, k) {
            var messageId = "message-" + message['id'] + "-" + k;
            var className = style[message['type']] ? style[message['type']] : style.messageIn;
            var list = React.createElement(
                "div",
                { className: className, id: messageId, key: messageId },
                React.createElement(
                    "div",
                    { className: style.messageTime },
                    message['timeIn'],
                    " "
                ),
                message['message']
            );

            var listString = "<div class='" + className + "' id='" + messageId + "'  key='" + messageId + "' > <div class='" + style.messageTime + "'>" + message['timeIn'] + " </div>" + message['message'] + " </div>";
            // chatString += React.renderToString(list);
            chatString += listString;
            return list;
        });
        return stringFormat === true ? chatString : chatDom;
    },
    /*
        * ================= Some utility functions =======================
     */
    renderDismiss: null,
    renderDomElement: function renderDomElement(content, elementId) {
        var wait = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5000;
        var autoDismiss = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        var el = document.getElementById(elementId);
        ReactDOM.render(content, el);

        if (_this2.renderDismiss !== null) clearTimeout(_this2.renderDismiss);

        if (autoDismiss === true) {
            _this2.renderDismiss = setTimeout(function () {
                document.getElementById(elementId).innerHTML = null;
            }, wait);
        }
    },
    renderStaticDomElement: function renderStaticDomElement(content, elementId) {
        var wait = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5000;
        var autoDismiss = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        var el = document.getElementById(elementId);
        content = React.renderToString(React.createElement(
            "fragment",
            null,
            content
        ));
        el.innerHTML = content;
        if (_this2.renderDismiss !== null) clearTimeout(_this2.renderDismiss);

        if (autoDismiss === true) {
            _this2.renderDismiss = setTimeout(function () {
                el.innerHTML = null;
            }, wait);
        }
    }
};