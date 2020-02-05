import React, { Component } from 'react';
import 'stylesheets/instructor_profile.scss';

import Header from './partials/header'
import InstructorSidebar from './partials/instructor_sidebar'

export default class instructor_profile extends Component {
    constructor(props) {
        super(props)

        var { user_info } = this.props
        var { userid, account_type } = localStorage

        this.state = {
            userid: userid,
            user_info: user_info,
            account_type: account_type,
        }
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

        return <img alt="" src={'/photos/' + photo} style={{ height: photo_height, margin: '0 auto', width: photo_width }}/>;
    }
    render() {
        var { user_info, userid, account_type } = this.state
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
            </div>
        )
    }
}
