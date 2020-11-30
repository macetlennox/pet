var _this2 = this;

var PopUp = {

    showPopUpWindow: function showPopUpWindow(_this, content) {
        var wait = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var callBack = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var closeCaption = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'Close';
        var backArrow = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'fa fa-arrow-left';

        // _this.showHideNotePad(true);

        var popUp = React.createElement(
            'div',
            { className: 'modal-backdrop modal-backdrop_full' },
            React.createElement(
                'div',
                { className: 'modal-footer' },
                React.createElement(
                    'button',
                    { className: 'ibtn float-left', type: 'button', onClick: function onClick() {
                            previousPage(_this);
                        } },
                    React.createElement('i', { className: backArrow })
                ),
                React.createElement(
                    'button',
                    { className: 'ibtn', type: 'button', onClick: function onClick() {
                            _closePopUpWindow(_this);
                        } },
                    closeCaption
                )
            ),
            React.createElement(
                'div',
                { className: 'modal-content modal-content-full' },
                AdManager.getAdsPanel(_this),
                React.createElement(
                    'div',
                    { className: 'modal-body' },
                    content
                )
            )
        );
        _this.setState({ popUpWindow: popUp }, function () {
            if (callBack !== null) {
                callBack();
            }
            return popUp;
        });
    },

    closePopUpWindow: function closePopUpWindow(_this) {
        return _closePopUpWindow(_this);
    },

    setMessage: function setMessage(_this, msg) {
        var wait = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5000;
        var autoDismiss = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

        _this.setState({ actionMsg: msg }, function () {
            // clear after a wait
            if (autoDismiss === true) {
                setTimeout(function () {
                    _this.setState({ actionMsg: null });
                }, wait);
            }
        });
    },
    clearMessage: function clearMessage(_this) {
        _this.setState({ actionMsg: null });
    },

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

    suggestDropdown: function suggestDropdown(content, id) {
        var successCallBack = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var autoDismiss = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var wait = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 5000;


        var el = document.getElementById(id);
        var dropDown = document.getElementById(id + "-dropdown");

        if (dropDown === null) {

            // create new
            var parentEl = el.parentNode;
            dropDown = document.createElement("div");
            dropDown.setAttribute("id", id + "-dropdown");
            parentEl.appendChild(dropDown);
        }

        var suggestedList = content;

        var list = [];
        if (dropDown.getAttribute("class") !== null && dropDown.getAttribute("class").indexOf("visible") !== -1) {
            return dropDown.setAttribute("class", "hidden");
        }

        if (suggestedList && suggestedList.length > 0) {
            suggestedList.map(function (listValue, k) {
                var listItemId = 'list-item-id-' + id + '-' + k;
                if (listValue !== null) list = list.concat(React.createElement(
                    'div',
                    { key: listItemId, id: listItemId, className: 'card dropdown-list' },
                    listValue
                ));
            });
            //dropDown.setAttribute("class", "visible dropdown dropdown-menu .dropdown-cont-video");
            dropDown.setAttribute("class", "visible dropdown dropdown-menu dropdown-cont-video");
            var dropDownList = React.createElement(
                'fragment',
                { style: { width: "100%" } },
                list
            );
            ReactDOM.render(dropDownList, dropDown);
            //console.log(dropDownList, "drop down list");
        }

        if (successCallBack !== null) {
            successCallBack();
        }

        if (autoDismiss === true) {
            setTimeout(function () {
                dropDown.setAttribute("class", "hidden");
            }, wait);
        }
    }

    /*
        private functions
     */

};var previousPage = _this = {};

var _closePopUpWindow = function _closePopUpWindow(_this) {
    _this.setState({ popUpWindow: null });
};