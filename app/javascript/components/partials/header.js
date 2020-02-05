import React, { Component } from 'react';

export default class header extends Component {
    constructor(props) {
        super(props)

        var { userid, account_type, new_user } = localStorage

        this.state = {
            userid: userid,
            account_type: account_type,
            new_user: new_user
        }
    }
    logout() {
        var { userid } = this.state
        var token = document.getElementsByName("csrf-token")[0].content

        fetch('/users/' + userid, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': token
            }
        })
        .then((response) => {
            var error = response.error

            if (!error) {
                localStorage.clear()

                window.location = '/users'
            }
        })
    }
    render() {
        var { userid, account_type, new_user } = this.state

        return (
            <div className="main-header">
                <img alt="" className="main-logo" src="/logo.png"/>
                {userid ? 
                    <div className="main-options">
                        { new_user === 'false' ? 
                            <div className="main-option" onClick={() => window.location.assign('/accountsetup/' + userid)}>Edit Class(es)</div>
                        : null }
                        <div className="main-option" onClick={() => this.logout()}>Log-Out</div>
                    </div>
                    :
                    <div className="main-options">
                        <div className="unloggedin-main-option" onClick={() => window.location.assign('/users/terms')}>Terms</div>
                        <div className="unloggedin-main-option" onClick={() => window.location.assign('/users/policy')}>Policy</div>
                        <div className="unloggedin-main-option" onClick={() => window.location.assign('/session/new')}>Log-In</div>
                        <div className="unloggedin-main-option" onClick={() => window.location.assign('/users/new')}>Register</div>
                    </div>
                }
            </div>
        )
    }
}
