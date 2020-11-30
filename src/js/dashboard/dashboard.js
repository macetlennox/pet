/*
 @ This file will handle the dashboard
 @ Author: Adeniyi Anthony
 @ email: mlisoftinc@gmail.com
 */
'use strict';

/*
 define style to handle our select field
 */


class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
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
            pageLoader: <div className='loader09'></div>,
        };
    }

    setPopUp = (state, wait = null) => {
        if (wait === null) {
            this.setState({popUp: state});
        } else {
            // wait for the stipulated time before taking action
            setTimeout(() => {
                this.setState({popUp: state});
            }, wait)
        }

        if (state == 'hidden') {
            // clear the action msg
            this.setState({actionMsg: null})
        }

    };

    disableButton = (state) => {
        this.setState({disabledButton: state});
    };

    setMessage = (msg, callBack = null) => {
        this.setState({actionMsg: msg}, () => {
            return callBack !== null && typeof callBack === 'function' ? callBack() : null;
        });
    };

    getSubList = () => {

        const rnd = Math.random();

        const postUrl = `${this.state.actionUrlSubList}?rnd=${rnd}`;

        fetch(postUrl)
            //.then((response) => response.json())
            .then((response) => {
                return (response.json());
                //return (response.text());
            })
            .then((responseJson) => {
                console.log(responseJson);
                const status = responseJson['status'];
                const msg = responseJson['msg'];
                const content = responseJson['content'];
                let meetingCount = 0;

                if (status == true) {
                    let curHtml = content.map((sub) => {

                        const list = <div id={sub['id']} key={sub['id']} className="dashboard-list-cont">
                            <div><span className="title">{sub['channel']}</span>
                                <i className='dashboard-list-delete icon-030 ' onClick={() => {
                                    this.deleteSub(sub['user_id'], sub['channel_id']);
                                }}>
                                </i>
                            </div>
                            <div>Channel: {sub['channel']}</div>
                        </div>;
                        return (list);
                    });
                    //alert(curHtml);
                    this.setState({subList: curHtml});
                } else {

                    const list = <div className="dashboard-list-cont">
                        <div>{msg}</div>
                    </div>;
                    this.setState({subList: list});
                }
            });
    }

    getChannelList = () => {

        const rnd = Math.random();

        const postUrl = `${this.state.actionUrlChannelList}?rnd=${rnd}`;

        fetch(postUrl)
            //.then((response) => response.json())
            .then((response) => {
                return (response.json());
                //return (response.text());
            })
            .then((responseJson) => {
                console.log(responseJson);
                const status = responseJson['status'];
                const msg = responseJson['msg'];
                const content = responseJson['content'];

                if (status == true) {
                    let curHtml = content.map((sub) => {

                        const list = <div id={sub['id']} key={sub['id']} className="dashboard-list-cont">
                            <div><span className="title">{sub['channel']}</span>
                                <i className='dashboard-list-delete icon-040' onClick={() => {
                                    this.subscribe(sub['id']);
                                }}>
                                </i>
                            </div>
                            <div>{sub['des']}</div>
                        </div>;
                        return (list);
                    });
                    //alert(curHtml);
                    this.setState({channelList: curHtml});
                } else {

                    const list = <div className="dashboard-list-cont">
                        <div>{msg}</div>
                    </div>;
                    this.setState({channelList: list});
                }
            });
    }

    logoutUser = () => {

        const rnd = Math.random();
        PopUp.setMessage(this, <div className="alert alert-info">Signing out...</div>);
        const postUrl = `${this.state.actionUrlLogout}?rnd=${rnd}`;
        fetch(postUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                const status = responseJson['status'];
                const msg = responseJson['status'];
                // once completed, go to dashboard
                if (status === true) {
                    this.setMessage(msg);
                    /* create the socket incase we don't alreay have it running
                    */
                    this.setPopUp('hidden', 2000);
                    document.location = this.state.indexPath;
                } else {
                    // notify user of the failure
                    //alert(msg);
                    this.setMessage(msg);
                    // hide popup screen after 5 seconds
                    this.setPopUp('hidden', 2000);
                    // re-enable login  button
                    this.disableButton(false);
                }

            });
    };

    deleteSub = (userId, channelId) => {

        const del = confirm(this.state.confirmDeleteMsg);
        if (del == false) {
            return null;
        }

        const rnd = Math.random();
        PopUp.setMessage(this, <div className="alert alert-info">Unsubscribing, please wait...</div>);

        const postUrl = `${this.state.actionUrlDeleteSub}?user-id=${userId}&channel-id=${channelId}&rnd=${rnd}`;

        fetch(postUrl)
            //.then((response) => response.json())
            .then((response) => {
                return (response.json());
                //return (response.text());
            })
            .then((responseJson) => {
                console.log(responseJson);
                const status = responseJson['status'];
                const msg = responseJson['msg'];

                if (status === true) {
                    PopUp.setMessage(this, <div className="alert alert-success">{msg}</div>);
                    this.getSubList();
                    this.getChannelList()

                } else {
                    // notify user of the login failure
                    PopUp.setMessage(this, <div className="alert alert-danger">{msg}</div>);
                }
            });
    }

    subscribe = (channelId) => {
        const rnd = Math.random();
        PopUp.setMessage(this, <div className="alert alert-info">Subscribing, please wait...</div>);

        const postUrl = `${this.state.actionUrlSub}?channel-id=${channelId}&rnd=${rnd}`;
        //alert(postUrl);
        fetch(postUrl)
            //.then((response) => response.json())
            .then((response) => {
                return (response.json());
                //return (response.text());
            })
            .then((responseJson) => {
                console.log(responseJson);
                const status = responseJson['status'];
                const msg = responseJson['msg'];
                if (status === true) {
                    PopUp.setMessage(this, <div className="alert alert-success">{msg}</div>);
                    this.getSubList();
                    this.getChannelList()

                } else {
                    // notify user
                    PopUp.setMessage(this, <div className="alert alert-danger">{msg}</div>);
                }
            });
    }

    formHtml = (locationName = "Dashboard") => {

        const defaultHeader = <aside className="dashboard-header">
            <div style=
                     {
                         {
                             color: "#ffff", fontSize: "18pt", marginRight: "auto"
                         }
                     }
            >{locationName}
            </div>
            <div style=
                     {
                         {
                             color: "#ffff",
                             marginLeft: "auto"
                         }
                     }
                 onClick={() => {
                     this.logoutUser()
                 }}
            >
                <i className=" dashboard-logout icon-086"></i>
            </div>
        </aside>;

        const html = <div className="room">

            <section id="room-header" className="room-header">
                {this.state.actionMsg}
                {this.state.popUpWindow}
                {defaultHeader}
            </section>

            <section className="room-body-dashboard" className="dashboard-content">
                <div className="dashboard-list-cont-no-effect col-sm-6 " id="room-list">
                    <div className="dashboard-list-cont-no-effect dashboard-list-header">Your Channels</div>
                    {this.state.subList}
                </div>
                <div className="dashboard-list-cont-no-effect col-sm-6 " id="subscription-list">
                    <div className="dashboard-list-cont-no-effect dashboard-list-header">Available Channels</div>
                    {this.state.channelList}
                </div>
            </section>
            <section className="room-footer-dashboard"></section>
        </div>
        return (html);
    };

    componentDidMount = () => {
        this.getSubList();
        this.getChannelList();
    }

    render() {
        //alert(this.formHtml());
        return this.formHtml();
    }
}

let domLayer = document.getElementById('app');

ReactDOM.render(<Dashboard/>, domLayer);