import React, { Component } from 'react';
import 'stylesheets/instructor_profile.css';

import Header from './partials/header'
import InstructorSidebar from './partials/instructor_sidebar'

export default class instructor_profile extends Component {
    constructor(props) {
        super(props)

        var { user_info } = this.props
        var { userid, account_type, non_bank_box } = localStorage

        this.state = {
            userid: userid,
            user_info: user_info,
            account_type: account_type,
            earnings: 0,
            non_bank_box: non_bank_box
        }

        this.getEarnings()
    }
    displayClasses(classes) {
        var classes_list = []
        var each_list = []

        classes.forEach(function (class_info, index) {
            each_list.push(class_info)

            if ((index + 1) % 2 === 0) {
                classes_list.push({ list: each_list })

                each_list = []
            }
        })

        if (each_list.length > 0) {
            classes_list.push({ list: each_list })
        }

        return classes_list
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
            photo_width = 200
            photo_height = 200
        } else {
            if (width > height) {
                photo_width = 200
                photo_height = (height * photo_width) / width
            } else {
                photo_height = 200
                photo_width = (width * photo_height) / height
            }
        }

        return <img alt="" src={'/profilepictures/' + photo} style={{ height: photo_height, margin: '0 auto', width: photo_width }}/>;
    }
    getEarnings = () => {
        var { userid } = this.state
        var { non_bank_box } = localStorage
        var token = document.getElementsByName("csrf-token")[0].content

        fetch('/instructors/get_earnings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-Token': token
            },
            body: JSON.stringify({ userid: userid })
        })
        .then((response) => response.json())
        .then((response) => {
            var error = response.error
            var earnings, identity, non_bank_box

            if (!error) {
                earnings = response.earnings
                identity = response.identity

                if (earnings > 0 && identity === 'no' && localStorage.getItem("non_bank_box") === "true") {
                    non_bank_box = "true"

                    localStorage.setItem("non_bank_box", "false")
                } else {
                    non_bank_box = "false"
                }

                this.setState({ 'earnings': earnings, 'non_bank_box': non_bank_box })
            }
        })
    }
    render() {
        var { user_info, userid, account_type, earnings, non_bank_box } = this.state
        var { firstname, lastname, profilepicture, classes } = user_info
        var classes_list = this.displayClasses(classes)

        return (
            <div className="main">
                <Header/>
                <div className="main-sidebar">
                    <InstructorSidebar/>
                </div>
                <div className="main-body">
                    <div className="profilepicture-holder">
                        {this.displayProfile(profilepicture)}
                    </div>
                    <div className="classes-box">
                        <div className="classes-header">Your Profile</div>
                        {classes_list.map((each_list, index) => (
                            <div className="classes-list" key={index}>
                                {each_list.list.map((class_info, index) => (
                                    <div className="class" key={index}>
                                        <div className="class-name-header">Class Name: {class_info.class_name}</div>
                                        <div className="class-code-header">Class Code: {class_info.class_code}</div>
                                        <div className="class-invitecode-header">Invite Code: {class_info.invite_code}</div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {account_type === 'Staff' && earnings > 0 && non_bank_box === "true" ? 
                    <div className="hidden-box">
                        <div className="non-box">
                            <div className="non-header">
                                You have an earning of $ {earnings}. Please provide your bank account information
                                to receive them
                            </div>

                            <div className="non-options">
                                <div className="non-options-button" onClick={() => this.setState({ 'non_bank_box': "false" })}>Not Now</div>
                                <div className="non-options-button" onClick={() => window.location.assign('/bankaccount')}>Ok</div>
                            </div>
                        </div>
                    </div>
                : null }
            </div>
        )
    }
}
