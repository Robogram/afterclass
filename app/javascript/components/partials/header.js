import React, { Component } from 'react';

export default class instructor_sidebar extends Component {
    constructor(props) {
        super(props)

        var { userid, account_type, new_user } = localStorage

        if (this.props.subscription) {
            var { subscription } = this.props
        } else {
            var subscription = ''
        }

        this.state = {
            userid: userid,
            account_type: account_type,
            new_user: new_user,
            subscription: subscription
        }

        this.payouts()
        this.payInstructors()
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
    payouts = () => {
        var { userid } = this.state
        var csrf_token = document.getElementsByName("csrf-token")[0].content

        fetch('/bankaccount/transfer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-Token': csrf_token
            },
            body: JSON.stringify({ userid: userid })
        })
        .then((response) => response.json())
        .then((response) => {
            var error = response.error

            if (!error) {

            }
        })
        .catch((error) => {

        })
    }
    payInstructors = () => {
        var csrf_token = document.getElementsByName("csrf-token")[0].content

        fetch('/bankaccount/pay_instructors', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-Token': csrf_token
            }
        })
        .then((response) => response.json())
        .then((response) => {
            var error = response.error

            if (!error) {

            }
        })
        .catch((error) => {

        })
    }
    render() {
        var { userid, account_type, new_user, subscription } = this.state

        return (
            <div className="main-header">
                <img alt="" className="main-logo" src="/logo.png"/>
                {userid ? 
                    <div className="main-options">
                        {account_type === 'Staff' ? 
                            new_user === 'false' ? 
                                <div className="main-option" onClick={() => window.location.assign('/accountsetup/' + userid)}>Edit Class(es)</div>
                                :
                                null
                            :
                            subscription !== '' ? 
                                <div className={ subscription !== 'await' ? "main-option" : "main-option-await" } onClick={this.props.onClick}>
                                    {
                                        subscription !== 'await' ? 
                                            subscription !== 'non' ? 
                                                subscription === 'active' ? 
                                                    'Cancel Subscription'
                                                    :
                                                    'Re-Subscribe'
                                                :
                                                'Subscribe'
                                            :
                                            'await'
                                    }
                                </div>
                            : null
                        }
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
