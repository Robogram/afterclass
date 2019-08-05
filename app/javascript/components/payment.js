import React, { Component } from 'react'
import 'stylesheets/payment.css'
import 'javascripts/encryption.js'

import Header from './partials/header'
import StudentSidebar from './partials/student_sidebar'

Stripe.setPublishableKey(key)

export default class payment extends Component {
    constructor(props) {
        super(props)

        var { userid, account_type, invite_code } = localStorage

        if (!userid) {
            window.location = '/users'
        }

        this.state = {
            userid: userid,
            account_type: account_type,
            invite_code: invite_code,

            currency: '',
            name: '',
            number: '',
            exp_month: '',
            exp_year: '',
            cvc: '',
            last4: '',

            showCurrencyList: false,
            showCountryList: false,

            errormsg: '',
            subscription: ''
        }

        this.getSubscriptionInfo()
        this.getCreditCard()
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
            .catch((error) => {

            })
        }
    }
    getCreditCard = () => {
        var { userid } = this.state
        var csrf_token = document.getElementsByName("csrf-token")[0].content

        fetch('/payment/get_creditcard', {
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
            var payment, subscription

            if (!error) {
                payment = response.payment

                if (!test_key) {
                    this.setState({
                        'currency': payment.currency ? payment.currency : 'cad',
                        'name': payment.name,
                        'exp_month': payment.exp_month,
                        'exp_year': payment.exp_year,
                        'last4': payment.last4
                    })
                } else {
                    this.setState({
                        'currency': 'cad',
                        'name': 'Kevin',
                        'number': '4000 0000 0000 0077',
                        'exp_month': '09',
                        'exp_year': '2019',
                        'cvc': '234',
                        'last4': '0077',
                    })
                }
            }
        })
        .catch((error) => {

        })
    }
    save = async() => {
        var {
            userid, account_type, invite_code, 
            currency, name, number, exp_month, exp_year, cvc
        } = this.state
        var card = {
            currency: currency, name: name, number: number, exp_month: exp_month, exp_year: exp_year, cvc: cvc
        }, self = this
        var csrf_token = document.getElementsByName("csrf-token")[0].content

        Stripe.createToken(card, function(status, token) {
            token = token.id ? token.id : ''

            fetch('/payment/' + userid, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-Token': csrf_token
                },
                body: JSON.stringify({
                    payment: JSON.stringify(card),
                    token: token,
                    invite_code: invite_code
                })
            })
            .then((response) => response.json())
            .then((response) => {
                var error = response.error
                var errormsg, invite_code

                if (!error) {
                    invite_code = response.invite_code

                    localStorage.clear()
                    localStorage.setItem("userid", userid)
                    localStorage.setItem("account_type", account_type)

                    if (invite_code) {
                        window.location = '/questions/' + encrypt_id(invite_code)
                    } else {
                        window.location = '/instructors'
                    }
                } else {
                    errormsg = response.errormsg

                    self.setState({ 'errormsg': errormsg })
                }
            })
            .catch((error) => {

            })
        });
    }
    render() {
        var {
            currency, name, number, exp_month, exp_year, cvc, 
            showCurrencyList, showCountryList, 
            errormsg, subscription
        } = this.state

        return (
            <div className="payment">
                {subscription ? 
                    <div>
                        <Header onClick={() => this.toggleSubscription()} subscription={subscription} key={subscription}/>
                        <div className="main-sidebar">
                            <StudentSidebar/>
                        </div>
                        <div className="main-body">
                            <div className="main-payment-header">Your Credit Card Information</div>

                            <div className="main-payment">
                                <div className="payment-select-box">
                                    <div className="payment-header">Currency:</div>
                                    <div className="payment-select" onClick={() => this.setState({ 'showCurrencyList': !showCurrencyList })}>
                                        <div className="payment-select-header">{currency}</div>
                                        <div className="payment-indicator">
                                            <div className="arrowup"></div>
                                            <div className="arrowdown"></div>
                                        </div>
                                    </div>
                                    {showCurrencyList ? 
                                        <div className="payment-selectbox">
                                            <div className="selectbox-item" onClick={() => this.setState({ 'currency': 'cad', 'showCurrencyList': false })}>cad</div>
                                            <div className="selectbox-item" onClick={() => this.setState({ 'currency': 'usd', 'showCurrencyList': false })}>usd</div>
                                        </div>
                                    : null }
                                </div>
                                <div className="payment-input-box">
                                    <div className="payment-input-header">Name: (as appears on card)</div>
                                    <input className="payment-input" placeholder="Enter the name on the card" onChange={(name) => this.setState({ 'name': name.target.value })} value={name}/>
                                </div>
                                <div className="payment-input-box">
                                    <div className="payment-input-header">Card number:</div>
                                    <input className="payment-input" placeholder="Enter the long number on the card" onChange={(number) => this.setState({ 'number': number.target.value })} value={number}/>
                                </div>
                                <div className="payment-input-box">
                                    <div className="payment-input-header">Expiry Date:</div>
                                    <div className="payment-row">
                                        <input className="payment-input-short" placeholder="MM" maxLength="2" onChange={(exp_month) => this.setState({ 'exp_month': exp_month.target.value })} value={exp_month}/>
                                        <div className="main-payment-split"> / </div>
                                        <input className="payment-input-short" placeholder="YY" maxLength="4" onChange={(exp_year) => this.setState({ 'exp_year': exp_year.target.value })} value={exp_year}/>
                                    </div>
                                </div>
                                <div className="payment-input-box">
                                    <div className="payment-input-header">Security Code:</div>
                                    <input className="payment-input-short" maxLength="4" placeholder="3 or 4 digits (back/front)" onChange={(cvc) => this.setState({ 'cvc': cvc.target.value })}/>
                                </div>

                                <div className="main-error">{errormsg}</div>

                                <div className="payment-checkbox">You will be charge ($2.99 monthly)</div>

                                <div className="payment-options">
                                    <button className="payment-options-button" onClick={this.save}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                : null }
            </div>
        )
    }
}
