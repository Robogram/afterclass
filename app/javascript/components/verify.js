import React, { Component } from 'react';
import 'stylesheets/verify.css';

export default class verify extends Component {
    constructor(props) {
        super(props)

        var { userid, account_type, user_info } = localStorage

        if (userid) {
            if (account_type === 'Staff') {
                window.location = '/instructors/' + userid
            } else {
                window.location = '/instructors'
            }
        }

        this.state = {
            verifycode: "",
            user_info: JSON.parse(user_info),
            errormsg: "",
            disable_button: false
        }
    }
    verify = () => {
        var { verifycode, user_info } = this.state

        if (verifycode !== user_info['verifycode']) {
            var token = document.getElementsByName("csrf-token")[0].content

            this.setState({ 'disable_button': true })

            fetch('/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-Token': token
                },
                body: JSON.stringify({
                    firstname: user_info['firstname'],
                    lastname: user_info['lastname'],
                    email: user_info['email'],
                    accounttype: user_info['account_type'],
                    password: user_info['password']
                })
            })
            .then((response) => response.json())
            .then((response) => {
                var error = response.error
                var userid, account_type

                if (!error) {
                    userid = response.userid
                    account_type = response.account_type

                    localStorage.clear()
                    localStorage.setItem("userid", userid)
                    localStorage.setItem("account_type", account_type)

                    if (account_type === 'Staff') {
                        localStorage.setItem("new_user", "true")

                        window.location = '/accountsetup/' + userid
                    } else {
                        window.location = '/instructors'
                    }
                } else {
                    this.setState({ 'errormsg': response.errormsg, 'disable_button': false })
                }
            })
            .catch((error) => {
                this.setState({ 'disable_button': false })
            })
        } else {
            this.setState({ 'errormsg': 'Code is incorrect' })
        }
    }
    render() {
        var { verifycode, disable_button } = this.state

        return (
            <div className="verify-main">
                <div className="verify-main-header">
                    <img alt="" className="verify-main-logo" src="/logo.png"/>
                </div>

                <div className="verify-body">
                    <div className="options">
                        <div className="option-button" onClick={() => window.location.assign('/')}>Sign-In</div>
                        <div className="option-button" onClick={() => window.location.assign('/users/new')}>Register</div>
                        <div className="option-button" onClick={() => window.location.assign('/users/policy')}>Policy</div>
                        <div className="option-button" onClick={() => window.location.assign('/users/terms')}>Terms</div>
                    </div>
                    <div className="verify-form">
                        <div className="form-header-box">
                            <img alt="" className="form-logo" src="/icon.png"/>
                            <div className="form-header">Verify</div>
                        </div>
                        <div className="verify-form-header">
                            An e-mail has been sent to you with a 8 digits verification code. <br/>
                            Please enter it below to continue
                        </div>
                        <div className="form-item">
                            <div className="input-header">Verify Code:</div>
                            <input className="input-text" placeholder="Enter 8 characters code" type="text" onChange={(verifycode) => this.setState({ 'verifycode': verifycode.target.value })} value={verifycode}/>
                        </div>

                        <div className="form-error">{this.state.errormsg}</div>

                        <button className="form-submit" onClick={this.verify} disabled={disable_button}>Verify</button>
                    </div>
                </div>
            </div>
        )
    }
}
