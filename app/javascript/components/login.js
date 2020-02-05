import React, { Component } from 'react';
import 'stylesheets/login.scss';
import { user_infos } from 'infos.js'

export default class login extends Component {
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
            email: user_infos['email'],
            password: user_infos['password'],
            errormsg: "",
            disable_button: false
        }
    }
    login = () => {
        var { email, password } = this.state
        var token = document.getElementsByName("csrf-token")[0].content

        this.setState({ 'disable_button': true })

        fetch('/session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-Token': token
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then((response) => response.json())
        .then((response) => {
            var error = response.error
            var userid, account_type, num_classes, id

            if (!error) {
                userid = response.userid
                account_type = response.account_type
                num_classes = response.num_classes
                id = response.id

                localStorage.setItem("userid", userid)
                localStorage.setItem("account_type", account_type)
                localStorage.setItem("non_bank_box", "true")

                if (account_type === 'Staff') {
                    if (num_classes === 0) {
                        localStorage.setItem("new_user", "true")

                        window.location = '/accountsetup/' + userid
                    } else {
                        localStorage.setItem("new_user", "false")

                        window.location = '/instructors/' + userid
                    }
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
    }
    render() {
        var { email, password, disable_button } = this.state

        return (
            <div className="login-main">
                <div className="login-main-header">
                    <img alt="" className="login-main-logo" src="/logo.png"/>
                </div>

                <div className="login-body">
                    <div className="options">
                        <div className="option-button" onClick={() => window.location.assign('/users/new')}>Register</div>
                        <div className="option-button" onClick={() => window.location.assign('/users/policy')}>Policy</div>
                        <div className="option-button" onClick={() => window.location.assign('/users/terms')}>Terms</div>
                    </div>
                    <div className="login-form">
                        <div className="form-header-box">
                            <img alt="" className="form-logo" src="/icon.png"/>
                            <div className="form-header">Log-In</div>
                        </div>

                        <div>
                            <div className="input-header">E-mail:</div>
                            <input className="input-text" placeholder="E-mail" type="email" onChange={(email) => this.setState({ 'email': email.target.value })} value={email}/>
                        </div>

                        <div>
                            <div className="input-header">Password:</div>
                            <input className="input-text" placeholder="Password" type="password" onChange={(password) => this.setState({ 'password': password.target.value })} value={password}/>
                        </div>

                        <div className="form-error">{this.state.errormsg}</div>

                        <button className="form-submit" onClick={this.login} disabled={disable_button}>Log-In</button>
                    </div>
                </div>
            </div>
        )
    }
}
