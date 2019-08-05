import React, { Component } from 'react';

export default class student_sidebar extends Component {
    constructor(props) {
        super(props)

        var { userid, account_type } = localStorage

        this.state = {
            userid: userid,
            account_type: account_type,
            profilepicture: { photo: '', width: 0, height: 0 },
            subjects: []
        }

        this.getSubjects()
    }
    getSubjects = () => {
        var { userid } = this.state
        var token = document.getElementsByName("csrf-token")[0].content

        fetch('/instructors/get_subjects', {
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
            var subjects

            if (!error) {
                subjects = response.subjects

                this.setState({ 'subjects': subjects })
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
    render() {
        var { userid, account_type, profilepicture, subjects } = this.state

        return (
            <div>
                <div className="sidebar-find_instructor" onClick={() => window.location.assign('/instructors')}>Find Staff</div>

                <div className="sidebar-header">Joined Q & A(s)</div>

                <div className="class-list">
                    {subjects.map((subject, index) => (
                        <div className="listed-class" onClick={() => window.location.assign('/questions/' + subject.invite_code)} key={index}>
                            <div className="class-top-info">
                                <div className="prof-profile-holder">{this.displayProfile(subject.profilepicture)}</div>
                                <div className="class-name">{subject.class_name}</div>
                            </div>
                            <div className="prof-classcode">{subject.class_code}</div>
                            <div className="prof-name">{subject.name}</div>
                        </div>
                    ))}
                </div>

                <div className="sidebar-tabs">
                    <div className="sidebar-tab" onClick={() => window.location.assign('/payment')}>Payment</div>
                    <div className="sidebar-tab" onClick={() => window.location.assign('/users/terms')}>Terms</div>
                    <div className="sidebar-tab" onClick={() => window.location.assign('/users/policy')}>Policy</div>
                </div>
            </div>
        )
    }
}
