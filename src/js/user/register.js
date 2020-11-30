/*
 @ This file will handle the joning a meeting
 @ Author: Adeniyi Anthony
 @ email: mlisoftinc@gmail.com
 */
'use strict';

/*
 define style to handle our select field
 */


class Meet extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
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

    };

    disableButton = (state) => {
        this.setState({disabledButton: state});
    };

    setMessage = (msg) => {
        this.setState({actionMsg: msg});
    };

    createAccount = () => {
        /*
         disable the button first
         */
        this.disableButton(true);
        /*
         * once this is completed, show the pop up indicating that we are logging in
         *
         */
        this.setPopUp('visible');
        /*
         * process the login
         */
        let err = false;

        const user = document.getElementById('user').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('confirm-password').value;

        const rnd = Math.random();

        if (password == "") {
            this.setMessage("Password cannot be empty");
            err = true;
        }
        if (password !== passwordConfirm) {
            this.setMessage("Confirm password not matching");
            err = true;
        }
        if (email == "" || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
            this.setMessage("Email empty or not valid");
            err = true;
        }
        if (user == "") {
            this.setMessage("Username cannot be empty");
            err = true;
        }


        if (err == true) {
            this.setPopUp('hidden', 2000);
            this.disableButton(false);
            return false;
        }

        this.setMessage(this.state.actionMsg)
        const postUrl = `${this.state.actionUrl}?user=${user}&password=${password}&password-confirm=${passwordConfirm}&email=${email}&rnd=${rnd}`;

        fetch(postUrl)
            .then((response) => {
               return (response.json());
                //return (response.text());
            })
            .then((responseJson) => {
                console.log(responseJson);
                const status = responseJson['status'];
                const msg = responseJson['msg'];

                if (status === true) {
                    this.setMessage(msg);
                    /* create the socket incase we don't alreay have it running 
					*/
                    //meetSubmit.click();
                    document.location = this.state.indexPath;

                } else {
                    // notify user of the login failure
                    //alert(msg);
                    this.setMessage(msg);
                    // hide popup screen after 5 seconds
                    this.setPopUp('hidden', 2000);
                    // re-enable login  button
                    this.disableButton(false);
                }
            });
    };

    formHtml = () => {
        const html = <div className="row">
            <div className="form-holder">
                <div className="form-content" >
                    <div className="form-items" id="register-form-cont">
                        <div className="website-logo-inside">
                            <a href="join.php">
                                <div className="logo">
                                    <img className="logo-size" src="images/pet.svg" alt=""/>
                                </div>
                            </a>
                        </div>
                        <h3>Create an account</h3>
                        <p>Please fill out form</p>
                        <div className="page-links">
                            <a href={this.state.indexPath} id="link-account-join">Login</a>
                            <a className="active" href={this.state.phpSelf}>Register</a>
                        </div>
                        <form id='login-form' method='post' action={this.state.indexPath} onSubmit={(e)=>{
                            e.preventDefault();
                            return false
                        }}>
                            <div className="modal-backdrop" style={{visibility: this.state.popUp}}>
                                <div className="modal-content modal_content">
                                    <div className="modal-body">
                                        <div className="loader06">
                                        </div>
                                        <div className="text-primary">{this.state.actionMsg}</div>
                                    </div>
                                    <div className="modal-footer">
                                        <button className="ibtn" type="button" onClick={() => {
                                            this.setPopUp('hidden');
                                            this.disableButton(false)
                                        }}>
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <input className={this.state.styles.formControl} type="text" name="user" id="user"
                                   placeholder="Choose a username" required/>
                            <input className={this.state.styles.formControl} type="text" name="email" id="email"
                                   placeholder="sample@mail.com"/>
                            <input className={this.state.styles.formControl} type="password" name="password"
                                   id="password" placeholder="Enter password"/>
                            <input className={this.state.styles.formControl} type="password" name="confirm-password"
                                   id="confirm-password" placeholder="Confirm password" onKeyUp={(e)=>{
                                if(parseInt(e.keyCode)===13)
                                    this.createAccount();
                            }}/>

                            <div className={this.state.styles.formButton}>
                                <button id="submit" type="button" className={this.state.styles.formIbtn}
                                        disabled={this.state.disabledButton}
                                        onClick={() => this.createAccount()}>Create Account
                                </button>
                                <button className="ibtn" type="BUTTON" id="meet-submit"
                                        style={{visibility: 'hidden'}}> Submit
                                </button>
                                <button id="meet-submit" type="submit" style={{visibility: 'hidden'}}></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>;
        return (html);
    };

    render() {
        //alert(this.formHtml());
        return this.formHtml();
    }
}


let domLayer = document.getElementById('app');

ReactDOM.render(<Meet/>, domLayer);