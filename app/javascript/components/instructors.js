import React, { Component } from 'react';
import 'stylesheets/instructors.css';
import 'javascripts/encryption.js'

import Header from './partials/header'
import StudentSidebar from './partials/student_sidebar'

export default class instructors extends Component {
    constructor(props) {
        super(props)

        var { userid, account_type } = localStorage

        if (!userid || !account_type) {
            window.location = '/users'
        }

        this.state = {
            userid: userid,
            account_type: account_type,
            instructors: [],
            search_instructor: "",
            visibleCodeBox: false,
            errormsg: '',
            invite_code: '',
            subscription: '',
            non_payment_box: false
        }

        this.getSubscriptionInfo()
        this.getInstructors()
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
    getInstructors = () => {
        fetch('/instructors/get_instructors', {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((response) => {
            var error = response.error
            var instructors

            if (!error) {
                instructors = response.instructors

                this.setState({ 'instructors': instructors })
            }
        })
    }
    searchInstructors = () => {
        var { search_instructor } = this.state

        fetch('/instructors/search_instructors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-Token': csrf_token
            },
            body: JSON.stringify({ search: search_instructor })
        })
        .then((response) => response.json())
        .then((response) => {
            var error = response.error
            var instructors

            if (!error) {
                instructors = response.instructors

                this.setState({ 'instructors': instructors })
            }
        })
    }
    displayInstructor(instructors) {
        var instructors_list = []
        var each_list = []

        instructors.forEach(function (instructor, index) {
            each_list.push(instructor)

            if ((index + 1) % 3 === 0) {
                instructors_list.push({ key: String(index), list: each_list })

                each_list = []
            }
        })

        if (each_list.length > 0) {
            instructors_list.push({ key: String(instructors.length), list: each_list })
        }

        return instructors_list
    }
    displayProfile(profilepicture) {
        var { photo, width, height } = profilepicture
        var photo_width, photo_height

        if (!photo) {
            photo = 'default.png'
            width = 600
            height = 600
        }

        if (width === height) {
            photo_width = 170
            photo_height = 170
        } else {
            if (width > height) {
                photo_width = 170
                photo_height = (height * photo_width) / width
            } else {
                photo_height = 170
                photo_width = (width * photo_height) / height
            }
        }

        return <img alt="" src={'/profilepictures/' + photo} style={{ height: photo_height, margin: '0 auto', width: photo_width }}/>;
    }
    isAllJoined = (classes) => {
        var { userid } = this.state
        var num_joined = 0

        classes.forEach(function (class_info) {
            if (class_info['joined_students'].indexOf(decrypt_id(userid)) > -1) {
                num_joined++
            }
        })

        if (classes.length === num_joined) {
            return true
        } else {
            return false
        }
    }
    joinQA = () => {
        var { userid, invite_code } = this.state
        var token = document.getElementsByName("csrf-token")[0].content

        fetch('/instructors/join_qa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-Token': token
            },
            body: JSON.stringify({
                userid: userid,
                invitecode: invite_code
            })
        })
        .then((response) => response.json())
        .then((response) => {
            var error = response.error
            var errormsg

            if (!error) {
                window.location = '/questions/' + encrypt_id(invite_code)
            } else {
                errormsg = response.errormsg

                if (errormsg === 'nonpayment') {
                    localStorage.setItem("invite_code", invite_code)

                    this.setState({ 'visibleCodeBox': false, 'non_payment_box': true })
                } else {
                    this.setState({ 'errormsg': errormsg })
                }
            }
        })
    }
    render() {
        var { userid, account_type, instructors, visibleCodeBox, errormsg, subscription, non_payment_box } = this.state
        var instructors_list = this.displayInstructor(instructors)

        userid = decrypt_id(userid)

        return (
            <div className="main">
                {subscription ? 
                    <div>
                        <Header onClick={() => this.toggleSubscription()} subscription={subscription} key={subscription}/>
                        <div className="main-sidebar">
                            <StudentSidebar/>
                        </div>
                        <div className="main-body">
                            <div className="find_instructor-header">Find your instructor by their name or code</div>
                            <div style={{ textAlign: 'center' }}><input className="instructor_name-input" placeholder="Enter name" onChange={(search_instructor) => {
                                this.setState({ 'search_instructor': search_instructor.target.value })
                                this.searchInstructors()
                            }}/></div>

                            {instructors.length > 0 ? 
                                <div className="instructors">
                                    {instructors_list.map((each_list, index) => (
                                        <div className="instructor-list" key={index}>
                                            {each_list.list.map((instructor, index) => (
                                                <div className={this.isAllJoined(instructor.classes) ? 'instructor-disable' : 'instructor'} onClick={() => {
                                                    this.isAllJoined(instructor.classes) ? 
                                                        null
                                                        :
                                                        this.setState({ 'visibleCodeBox': true })
                                                }} key={index}>
                                                    <div className="instructor-name">{instructor.name}</div>
                                                    <div className="instructor-profilepicture-holder">{this.displayProfile(instructor.profilepicture)}</div>
                                                    <div className="instructor-classes">
                                                        {instructor.classes.map((class_info, index) => (
                                                            <div className="instructor-class" key={index}>{class_info.class_name}</div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                :
                                <div className="instructors-no_results"><div>No Result(s)</div></div>
                            }
                        </div>
                        {visibleCodeBox || non_payment_box ? 
                            <div className="hidden_box" style={{ display: 'flex' }}>
                                {visibleCodeBox ? 
                                    <div className="code_box">
                                        <div className="code-header">Enter the 8 characters invite code</div>
                                        <input className="code-input" type="text" onChange={(invite_code) => this.setState({ 'invite_code': invite_code.target.value })}/>

                                        <div className="code-error">{errormsg}</div>

                                        <div className="code-options">
                                            <div className="code-button" onClick={() => this.setState({ 'visibleCodeBox': false })}>Cancel</div>
                                            <div className="code-button" onClick={this.joinQA}>Done</div>
                                        </div>
                                    </div>
                                : null }
                                {non_payment_box ? 
                                    <div className="error-payment-box">
                                        <div className="error-payment-header">You need to be subscribed to our plan of $2.99/month to continue</div>

                                        <div className="error-payment-header">Click <strong onClick={() => window.location.assign('/payment')}>here</strong> to enter your billing information</div>
                                    </div>
                                : null }
                            </div>
                        : null }
                    </div>
                : null }
            </div>
        )
    }
}
