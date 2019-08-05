import React, { Component } from 'react'
import 'stylesheets/bankaccount.css'
import 'javascripts/key.js'

import Header from './partials/header'
import InstructorSidebar from './partials/instructor_sidebar'

var stripe = Stripe(key)

export default class bankaccount extends Component {
    constructor(props) {
        super(props)

        var { userid } = localStorage

        if (!userid) {
            window.location = '/users'
        }

        this.state = {
            userid: userid,

            //test
            currency: '',
            country: '',
            account_holder_type: '',
            account_holder_name: '',
            institution_number: '',
            transit_number: '',
            account_number: '',
            routing_number: '',
            last4: '',

            showCurrencyList: false,
            showCountryList: false,
            showHolderTypeList: false,

            errormsg: ''
        }

        this.getBankAccountInfo()
    }
    getBankAccountInfo = () => {
        var { userid } = this.state
        var csrf_token = document.getElementsByName("csrf-token")[0].content
        
        fetch('/bankaccount/get_bankaccount_info', {
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
            var payment

            if (!error) {
                payment = response.payment

                if (!test_key) {
                    this.setState({
                        'currency': payment.currency ? payment.currency : 'cad',
                        'country': payment.country ? payment.country : 'CA',
                        'account_holder_type': payment.account_holder_type ? payment.account_holder_type : 'individual',
                        'account_holder_name': payment.account_holder_name,
                        'institution_number': payment.institution_number,
                        'transit_number': payment.transit_number,
                        'routing_number': payment.routing_number,
                        'last4': payment.last4
                    })
                } else {
                    this.setState({
                        'currency': 'cad',
                        'country': 'CA',
                        'account_holder_type': 'individual',
                        'account_holder_name': 'Kevin Mai',
                        'institution_number': '',
                        'transit_number': '',
                        'account_number': '000123456789',
                        'routing_number': '11000000',
                        'last4': '',
                    })
                } 
            }
        })
        .catch((error) => {

        })
    }
    save = async() => {
        var {
            userid, 
            country, currency, account_holder_type, account_holder_name, 
            institution_number, transit_number, routing_number, account_number
        } = this.state
        var bank_account = {
            country: country, account_holder_type: account_holder_type, account_holder_name: account_holder_name, 
            account_number: account_number, routing_number: routing_number, currency: currency
        }, self = this
        var csrf_token = document.getElementsByName("csrf-token")[0].content
        var timestamp = Math.floor(Date.now() / 1000)

        if (country === 'CA') {
            if (key === 'live') {
                bank_account['routing_number'] = '0' + institution_number + '' + transit_number
            } else {
                bank_account['routing_number'] = '11000000'
            }
        }

        stripe.createToken('bank_account', bank_account).then(function(result) {
            result = result.token ? result.token.id : ''

            bank_account['institution_number'] = institution_number
            bank_account['transit_number'] = transit_number

            fetch('/bankaccount/' + userid, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-Token': csrf_token
                },
                body: JSON.stringify({
                    bankaccount: JSON.stringify(bank_account),
                    timestamp: timestamp,
                    token: result
                })
            })
            .then((response) => response.json())
            .then((response) => {
                var error = response.error
                var errormsg

                if (!error) {
                    window.location = '/instructors/' + userid
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
            country, currency, account_holder_type, account_holder_name, last4, 
            institution_number, transit_number, routing_number, account_number, 
            showCurrencyList, showCountryList, showHolderTypeList, 
            errormsg
        } = this.state

        return (
            <div className="bankaccount">
                <Header/>
                <div className="main-sidebar">
                    <InstructorSidebar/>
                </div>
                <div className="main-body">
                    <div className="main-bankaccount-header">Your Bank Account Information</div>

                    <div className="main-bankaccount">
                        <div className="bankaccount-select-box">
                            <div className="bankaccount-header">Currency:</div>
                            <div className="bankaccount-select" onClick={() => this.setState({ 'showCurrencyList': !showCurrencyList })}>
                                <div className="bankaccount-select-header">{currency}</div>
                                <div className="bankaccount-indicator">
                                    <div className="arrowup"></div>
                                    <div className="arrowdown"></div>
                                </div>
                            </div>
                            {showCurrencyList ? 
                                <div className="bankaccount-selectbox">
                                    <div className="selectbox-item" onClick={() => this.setState({ 'currency': 'CAD', 'showCurrencyList': false })}>CAD</div>
                                    <div className="selectbox-item" onClick={() => this.setState({ 'currency': 'USD', 'showCurrencyList': false })}>USD</div>
                                </div>
                            : null }
                        </div>

                        <div className="bankaccount-select-box">
                            <div className="bankaccount-header">Bank Country:</div>
                            <div className="bankaccount-select" onClick={() => this.setState({ 'showCountryList': !showCountryList })}>
                                <div className="bankaccount-select-header">{country}</div>
                                <div className="bankaccount-indicator">
                                    <div className="arrowup"></div>
                                    <div className="arrowdown"></div>
                                </div>
                            </div>
                            {showCountryList ? 
                                <div className="bankaccount-selectbox">
                                    <div className="selectbox-item" onClick={() => this.setState({ 'country': 'CA', 'showCountryList': false })}>Canada</div>
                                    <div className="selectbox-item" onClick={() => this.setState({ 'country': 'US', 'showCountryList': false })}>United States</div>
                                </div>
                            : null }
                        </div>

                        <div className="bankaccount-select-box">
                            <div className="bankaccount-header">Account Holder Type:</div>
                            <div className="bankaccount-select" onClick={() => this.setState({ 'showHolderTypeList': !showHolderTypeList })}>
                                <div className="bankaccount-select-header">{account_holder_type}</div>
                                <div className="bankaccount-indicator">
                                    <div className="arrowup"></div>
                                    <div className="arrowdown"></div>
                                </div>
                            </div>
                            {showHolderTypeList ? 
                                <div className="bankaccount-selectbox">
                                    <div className="selectbox-item" onClick={() => this.setState({ 'account_holder_type': 'individual', 'showHolderTypeList': false })}>Individual</div>
                                    <div className="selectbox-item" onClick={() => this.setState({ 'account_holder_type': 'company', 'showHolderTypeList': false })}>Company</div>
                                </div>
                            : null }
                        </div>

                        <div className="bankaccount-input-box">
                            <div className="bankaccount-header">Account Holder Name</div>
                            <input className="bankaccount-input" placeholder="Enter the account holder name" onChange={(account_holder_name) => this.setState({ 'account_holder_name': account_holder_name.target.value })} value={account_holder_name}/>
                        </div>

                        { country === 'CA' ? 
                            <div>
                                <div className="bankaccount-input-box">
                                    <div className="bankaccount-header">Institution Number:</div>
                                    <input className="bankaccount-input" onChange={(institution_number) => this.setState({ 'institution_number': institution_number.target.value })} value={institution_number}/>
                                </div>

                                <div className="bankaccount-input-box">
                                    <div className="bankaccount-header">Transit Number:</div>
                                    <input className="bankaccount-input" onChange={(transit_number) => this.setState({ 'transit_number': transit_number.target.value })} value={transit_number}/>
                                </div>
                            </div>
                            :
                            <div className="bankaccount-input-box">
                                <div className="bankaccount-header">Routing Number:</div>
                                <input className="bankaccount-input" placeholder="Enter the routing number" onChange={(routing_number) => this.setState({ 'routing_number': routing_number.target.value })} value={routing_number}/>
                            </div>
                        }

                        <div className="bankaccount-input-box">
                            <div className="bankaccount-header">Account Number</div>
                            <input className="bankaccount-input" placeholder={last4 ? "****" + last4 : 'Enter the account number'} onChange={(account_number) => this.setState({ 'account_number': account_number.target.value })} value={account_number}/>
                        </div>

                        <div className="main-error">{errormsg}</div>

                        <div className="payment-checkbox">You will receive payments daily for answering at least one question a month</div>

                        <div className="bankaccount-options">
                            <button className="bankaccount-options-button" onClick={() => this.save()}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
