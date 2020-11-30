const PopUp = {

    showPopUpWindow: (_this, content, wait = null, callBack = null, closeCaption = 'Close', backArrow = 'fa fa-arrow-left') => {
        // _this.showHideNotePad(true);

        const popUp = <div className="modal-backdrop modal-backdrop_full">
            <div className="modal-footer">

                <button className="ibtn float-left" type="button" onClick={() => {
                    previousPage(_this);
                }}>
                    <i className={backArrow}></i>
                </button>

                <button className="ibtn" type="button" onClick={() => {
                    closePopUpWindow(_this);
                }}>
                    {closeCaption}
                </button>
            </div>
            <div className="modal-content modal-content-full">
                {AdManager.getAdsPanel(_this)}
                <div className="modal-body">
                    {content}
                </div>
            </div>
        </div>;
        _this.setState({popUpWindow: popUp}, () => {
            if (callBack !== null) {
                callBack();
            }
            return (popUp);
        });
    },

    closePopUpWindow: (_this) => {
        return closePopUpWindow(_this);
    },

    setMessage: (_this, msg, wait = 5000, autoDismiss = true) => {
        _this.setState({actionMsg: msg}, () => {
            // clear after a wait
            if (autoDismiss === true) {
                setTimeout(() => {
                    _this.setState({actionMsg: null});
                }, wait)
            }
        });
    },
    clearMessage: (_this) => {
        _this.setState({actionMsg: null});
    },

    renderDismiss:null,
    renderDomElement: (content, elementId, wait = 5000, autoDismiss = false) => {
        const el = document.getElementById(elementId);
        ReactDOM.render(content, el);

        if(this.renderDismiss!==null)
            clearTimeout(this.renderDismiss);

        if (autoDismiss === true) {
            this.renderDismiss=setTimeout(() => {
                document.getElementById(elementId).innerHTML = null;
            }, wait)
        }
    },

    suggestDropdown:(content, id,  successCallBack = null, autoDismiss=false, wait=5000) => {

        let el = document.getElementById(id);
        let dropDown = document.getElementById(id + "-dropdown");

        if (dropDown === null) {

            // create new
            let parentEl = el.parentNode;
            dropDown = document.createElement("div");
            dropDown.setAttribute("id", id + "-dropdown");
            parentEl.appendChild(dropDown);
        }

        let suggestedList = content;

        let list = [];
        if(dropDown.getAttribute("class")!==null && dropDown.getAttribute("class").indexOf("visible") !==-1) {
           return dropDown.setAttribute("class", "hidden");
        }

        if (suggestedList && suggestedList.length > 0) {
            suggestedList.map((listValue, k) => {
                const listItemId=`list-item-id-${id}-${k}`;
                if(listValue!==null)
                    list = list.concat(<div key={listItemId} id={listItemId} className='card dropdown-list'>{listValue}</div>);
            });
            //dropDown.setAttribute("class", "visible dropdown dropdown-menu .dropdown-cont-video");
            dropDown.setAttribute("class", "visible dropdown dropdown-menu dropdown-cont-video");
            const dropDownList=<fragment style={{width:"100%"}}>
                {list}
            </fragment>;
            ReactDOM.render(dropDownList, dropDown);
            //console.log(dropDownList, "drop down list");
        }

        if (successCallBack !== null) {
            successCallBack();
        }

        if(autoDismiss===true) {
            setTimeout(()=>{
                dropDown.setAttribute("class", "hidden");
            }, wait)
        }
    },

}

/*
    private functions
 */

const previousPage = (_this) = {};

const closePopUpWindow = (_this) => {
    _this.setState({popUpWindow: null});
};