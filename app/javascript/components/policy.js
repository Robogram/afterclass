import React, { Component } from 'react'
import 'stylesheets/policy.css'

import Header from './partials/header'
import StudentSidebar from './partials/student_sidebar'
import InstructorSidebar from './partials/instructor_sidebar'

export default class policy extends Component {
    constructor(props) {
        super(props)

        var { userid, account_type } = localStorage

        this.state = {
            userid: userid,
            account_type: account_type,
            subscription: ''
        }

        if (account_type === 'Student') {
            this.getSubscriptionInfo()
        }
    }
    getSubscriptionInfo = () => {
        var { userid } = this.state
        var csrf_token = document.getElementsByName("csrf-token")[0].content
        
        fetch('/payment/get_subscription_info', {
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
            var subscription

            if (!error) {
                subscription = response.subscription

                this.setState({ 'subscription': subscription })
            }
        })
    }
    toggleSubscription = () => {
        var { userid, subscription } = this.state
        var csrf_token = document.getElementsByName("csrf-token")[0].content

        this.setState({ 'subscription': 'await' })

        if (subscription !== 'await') {
            fetch('/payment/toggle_subscription', {
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
                var subscription = response.subscription

                if (!error) {
                    if (subscription === 'non') {
                        window.location = '/payment'
                    }
                    
                    this.setState({ 'subscription': subscription })
                }
            })
        }
    }
    render() {
        var { userid, account_type, subscription } = this.state

        return (
            <div className="policy">
                {subscription === '' || subscription ? 
                    <div>
                        {account_type === 'Student' ? 
                            <Header onClick={() => this.toggleSubscription()} subscription={subscription} key={subscription}/>
                            :
                            <Header/>
                        }
                        {userid ? <div className="main-sidebar">{ account_type === 'Student' ? <StudentSidebar/> : <InstructorSidebar/> }</div> : null }
                        <div className={ userid ? "main-body" : "unloggedin-main-body" }>
                            <div className="main-policy-header">Policy</div>

                            <div className="main-policy">
                                <div className="policy-itemheader">What personal information do we collect from users ?</div>
                                <div className="policy-list">
                                    <li className="policy-listitem">Username</li>
                                    <li className="policy-listitem">First Name</li>
                                    <li className="policy-listitem">Last Name</li>
                                    <li className="policy-listitem">E-mail</li>
                                    <li className="policy-listitem">Profile Picture (Staff only)</li>
                                    <li className="policy-listitem">Password</li>
                                    <li className="policy-listitem">Credit Card</li>
                                </div>

                                <div className="policy-itemheader">When do we collect information ?</div>
                                <div className="policy-item">We collect the username, first name, last name and e-mail when user signs up.</div>

                                <div className="policy-itemheader">How do we use your information ?</div>
                                <div className="policy-item">We use the e-mail to verify that the user is real. Users will only need their account 
                                type, username and password to login everytime. Students will be asked for their credit card info before any action 
                                to automatically be charged $2.99/month</div>

                                <div className="policy-itemheader">How do we protect your information ?</div>
                                <div className="policy-item">We promise that we are not connected with any services out there and we will never share your information with any other users.</div>

                                <div className="policy-question-header">Questions about the Policy can be asked at</div>
                                <a href="mailto:admin@geottuse.com">admin@geottuse.com</a>
                            </div>
                        </div>
                    </div>
                : null }
            </div>
        )
    }
}
