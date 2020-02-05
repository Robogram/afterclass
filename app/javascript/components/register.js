import React, { Component } from 'react';
import 'stylesheets/register.scss';
import { user_infos } from 'infos.js'

export default class register extends Component {
    constructor(props) {
        super(props)

        var { userid, account_type } = localStorage

        if (userid) {
            if (account_type === 'Staff') {
                window.location = '/instructors/' + userid
            } else {
                window.location = '/instructors'
            }
        }

        this.state = {
            firstname: user_infos['firstname'],
            lastname: user_infos['lastname'],
            email: user_infos['email'],
            account_type: "Student",
            password: user_infos['password'],
            confirmpassword: user_infos['confirmpassword'],
            errormsg: "",
            disable_button: false
        }
    }
    register = () => {
        var { firstname, lastname, email, account_type, password, confirmpassword } = this.state
        var token = document.getElementsByName("csrf-token")[0].content

        this.setState({ 'disable_button': true })

        fetch('/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-Token': token
            },
            body: JSON.stringify({
                firstname: firstname,
                lastname: lastname,
                email: email,
                accounttype: account_type,
                password: password,
                confirmpassword: confirmpassword
            })
        })
        .then((response) => response.json())
        .then((response) => {
            var error = response.error
            var verifycode, user_info = {}

            if (!error) {
                verifycode = response.verifycode

                user_info['firstname'] = firstname
                user_info['lastname'] = lastname
                user_info['email'] = email
                user_info['account_type'] = account_type
                user_info['password'] = password
                user_info['verifycode'] = verifycode

                localStorage.setItem("user_info", JSON.stringify(user_info))

                window.location = '/verify/new'
            } else {
                this.setState({ 'errormsg': response.errormsg, 'disable_button': false })
            }
        })
        .catch((error) => {
            this.setState({ 'disable_button': false })
        })
    }
    render() {
        var { firstname, lastname, email, account_type, password, confirmpassword, disable_button } = this.state

        return (
            <div className="register-main">
                <div className="register-main-header">
                    <img alt="" className="register-main-logo" src="/logo.png"/>
                </div>

                <div className="register-body">
                    <div className="options">
                        <div className="option-button" onClick={() => window.location.assign('/')}>Sign-In</div>
                        <div className="option-button" onClick={() => window.location.assign('/users/policy')}>Policy</div>
                        <div className="option-button" onClick={() => window.location.assign('/users/terms')}>Terms</div>
                    </div>
                    <div className="register-form">
                        <div className="form-header-box">
                            <img alt="" className="form-logo" src="/icon.png"/>
                            <div className="form-header">Register</div>
                        </div>

                        <div className="form-row">
                            <div className="form-item">
                                <div className="input-header">First Name:</div>
                                <input className="input-text" placeholder="First Name" type="text" onChange={(firstname) => this.setState({ 'firstname': firstname.target.value })} value={firstname}/>
                            </div>

                            <div className="form-item">
                                <div className="input-header">Last Name:</div>
                                <input className="input-text" placeholder="Last Name" type="text" onChange={(lastname) => this.setState({ 'lastname': lastname.target.value })} value={lastname}/>
                            </div>
                        </div>

                        <div>
                            <div className="input-header">{account_type} E-mail:</div>
                            <input className="input-text" placeholder={account_type + " E-mail"} type="email" onChange={(email) => {
                                var account_type = (email.target.value.replace('tdsb', '') != email.target.value) ? 'Staff' : 'Student'

                                this.setState({ 'email': email.target.value, 'account_type': account_type })
                            }} value={email}/>
                        </div>

                        <div className="form-item">
                            <div className="input-header">Password:</div>
                            <input className="input-text" placeholder="Password" type="password" onChange={(password) => this.setState({ 'password': password.target.value })} value={password}/>
                        </div>

                        <div className="form-item">
                            <div className="input-header">Confirm Password:</div>
                            <input className="input-text" placeholder="Confirm Password" type="password" onChange={(confirmpassword) => this.setState({ 'confirmpassword': confirmpassword.target.value })} value={confirmpassword}/>
                        </div>

                        <div className="form-error">{this.state.errormsg}</div>

                        <button className="form-submit" onClick={this.register} disabled={disable_button}>Register</button>
                    </div>
                </div>
            </div>
        )
    }
}
