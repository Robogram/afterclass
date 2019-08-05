import React, { Component } from 'react';

export default class instructor_sidebar extends Component {
    constructor(props) {
        super(props)

        var { userid, account_type, new_user } = localStorage

        this.state = {
            userid: userid,
            new_user: new_user,
            account_type: account_type,
            profilepicture: { photo: '', width: 0, height: 0 },
            classes: [],
            earnings: 0
        }

        this.getClasses()
        this.getEarnings()
    }
    getClasses = () => {
        var { userid } = this.state
        var token = document.getElementsByName("csrf-token")[0].content

        fetch('/instructors/get_classes', {
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
            var profilepicture, classes

            if (!error) {
                profilepicture = response.profilepicture
                classes = response.classes

                this.setState({ 'profilepicture': profilepicture, 'classes': classes })
            }
        })
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
            photo_width = 40
            photo_height = 40
        } else {
            if (width > height) {
                photo_width = 40
                photo_height = (height * photo_width) / width
            } else {
                photo_height = 40
                photo_width = (width * photo_height) / height
            }
        }

        return <img alt="" src={'/profilepictures/' + photo} style={{ height: photo_height, margin: '0 auto', width: photo_width }}/>;
    }
    getEarnings = () => {
        var { userid } = this.state
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
            var earnings

            if (!error) {
                earnings = response.earnings

                this.setState({ 'earnings': earnings })
            }
        })
    }
    render() {
        var { userid, new_user, account_type, profilepicture, classes, earnings } = this.state

        return (
            <div>
                { new_user === "false" ? 
                    <div className="sidebar-view_profile" onClick={() => window.location.assign('/instructors/' + userid)}>View Profile</div>
                    :
                    <div className="sidebar-view_profile-disabled" onClick={() => {}}>View Profile</div>
                }
            
                <div className="sidebar-header">Your Class(es)</div>

                <div className="class-list">
                    {classes.map((class_info, index) => (
                        new_user === "false" ? 
                            <div className="listed-class" onClick={() => window.location.assign('/questions/' + class_info.invite_code)} key={index}>
                                <div className="class-top-info">
                                    <div className="prof-profile-holder">{this.displayProfile(profilepicture)}</div>
                                    <div className="class-name">{class_info.class_name}</div>
                                </div>
                                <div className="prof-name">{class_info.class_code}</div>
                            </div>
                            :
                            <div className="listed-class-disabled" onClick={() => {}} key={index}>
                                <div className="class-top-info">
                                    <div className="prof-profile-holder">{this.displayProfile(profilepicture)}</div>
                                    <div className="class-name">{class_info.class_name}</div>
                                </div>
                                <div className="prof-name">{class_info.class_code}</div>
                            </div>
                    ))}
                </div>

                {new_user === "false" ? 
                    <div className="sidebar-tabs">
                        <div className="earnings-header">Your earning(s): $ {earnings}</div>
                        <div className="sidebar-tab" onClick={() => window.location.assign('/bankaccount')}>Bank Account</div>
                        <div className="sidebar-tab" onClick={() => window.location.assign('/users/terms')}>Terms</div>
                        <div className="sidebar-tab" onClick={() => window.location.assign('/users/policy')}>Policy</div>
                    </div>
                : null }
            </div>
        )
    }
}
