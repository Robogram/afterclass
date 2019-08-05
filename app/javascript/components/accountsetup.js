import React, { Component } from 'react';
import 'stylesheets/accountsetup.css';

import Header from './partials/header'
import InstructorSidebar from './partials/instructor_sidebar'

export default class accountsetup extends Component {
    constructor(props) {
        super(props)

        var { profilepicture, schools, classes } = this.props.user_info
        var { userid, new_user } = localStorage

        if (!userid) {
            window.location = '/users'
        }

        profilepicture.uri = ""

        this.state = {
            userid: userid,
            new_user: new_user,
            profilepicture: profilepicture,
            schools: schools,
            classes: classes,
            errormsg: ""
        }
    }
    browseProfilePicture(photo) {
        var letters = [
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", 
            "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
        ];
        var { userid, profilepicture } = this.state
        var file_reader = new FileReader(), file_image = new Image()
        var file = photo.target.files[0], k, photo_name = ""
        var photo_name_length = Math.floor(Math.random() * (15 - 10)) + 10
        var token = document.getElementsByName("csrf-token")[0].content

        file_reader.onload = () => {
            file_image.onload = () => {
                var { width, height } = file_image
                var photo_width, photo_height

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

                profilepicture.width = photo_width
                profilepicture.height = photo_height

                for (k = 0; k <= photo_name_length - 1; k++) {
                    if (k % 2 === 0) {
                        photo_name += "" + letters[Math.floor(Math.random() * letters.length)].toUpperCase();
                    } else {
                        photo_name += "" + (Math.floor(Math.random() * 9) + 0);
                    }
                }

                profilepicture.photo = photo_name + ".jpg"
                profilepicture.width = parseInt(profilepicture.width)
                profilepicture.height = parseInt(profilepicture.height)
                profilepicture.uri = file_reader.result
                
                document.getElementsByClassName("profilepicture-photo")[0].value = null

                fetch('/accountsetup/' + userid, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-Token': token
                    },
                    body: JSON.stringify({
                        profilepicture: JSON.stringify(profilepicture)
                    })
                })
                .then((response) => response.json())
                .then((response) => {
                    var error = response.error

                    if (!error) {
                        this.setState({ 'profilepicture': profilepicture })
                    }
                })
                .catch((error) => {

                })
            }

            file_image.src = file_reader.result
        }

        file_reader.readAsDataURL(file)
    }
    toggleLists = (school_index) => {
        var { schools } = this.state

        schools.forEach(function (school, index) {
            if (school_index === index) {
                school.show_lists = !school.show_lists
            }
        })

        this.setState({ 'schools': schools })
    }
    selectSchool = (school_index, school_name) => {
        var { schools } = this.state

        schools.forEach(function (school, index) {
            if (index === school_index) {
                school.school_name = school_name
                school.show_lists = false
            }
        })

        this.setState({ 'schools': schools })
    }
    schoolInput = (subject_index, input_type, input_text) => {
        var { classes } = this.state

        classes.forEach(function (class_info, index) {
            if (index === subject_index) {
                if (input_type === 'subject') {
                    class_info.class_name = input_text
                } else {
                    class_info.class_code = input_text
                }
            }
        })

        this.setState({ 'classes': classes })
    }
    addItem = (item_type) => {
        var items = this.state[item_type]
        var item

        if (item_type === 'schools') {
            item = { "school_name": "", "show_lists": false }
        } else {
            item = { "class_name": "", "class_code": "", "invite_code": "", "questions": [], "joined_students": [] }
        }

        items.push(item)

        if (item_type === 'schools') {
            this.setState({ 'schools': items })
        } else {
            this.setState({ 'classes': items })
        }
    }
    deleteItem = (item_type, item_index) => {
        var items = this.state[item_type]

        items.forEach(function (item, index) {
            if (item_index === index) {
                items.splice(index, 1)
            }
        })

        if (item_type === 'schools') {
            this.setState({ 'schools': items })
        } else {
            this.setState({ 'classes': items })
        }
    }
    save = () => {
        var { userid, new_user, profilepicture, schools, classes } = this.state
        var token = document.getElementsByName("csrf-token")[0].content
        var invite_code, k, interval, num, letter

        delete profilepicture['uri']

        schools.forEach(function (school) {
            delete school['show_lists']
        })

        classes.forEach(function (class_info) {
            if (class_info.invite_code === '') {
                class_info.invite_code = ""

                for (k = 1; k <= 8; k++) {
                    interval = Math.floor(Math.random() * 9) + 0
                    num = Math.floor(Math.random() * 9) + 0
                    letter = String.fromCharCode(Math.floor(Math.random() * 26) + 65)

                    class_info.invite_code += interval % 2 === 0 ? num : letter
                }
            }
        })

        fetch('/users/' + userid, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-Token': token
            },
            body: JSON.stringify({
                profilepicture: JSON.stringify(profilepicture),
                schools: JSON.stringify(schools),
                classes: JSON.stringify(classes)
            })
        })
        .then((response) => response.json())
        .then((response) => {
            var error = response.error

            if (!error) {
                localStorage.setItem("new_user", "false")
                
                window.location = '/instructors/' + userid
            }
        })
    }
    render() {
        var { userid, new_user, profilepicture, schools, classes } = this.state
        var { photo, uri, width, height } = profilepicture

        return (
            <div className="main">
                <Header/>
                <div className="main-sidebar">
                    <InstructorSidebar/>
                </div>
                <div className="main-body">
                    <div className="profilepicture-box">
                        <div className="profilepicture-header">Profile Picture (Optional)</div>
                        <div className="profilepicture-holder">
                            {uri !== '' || photo !== '' ? 
                                uri ? 
                                    <img alt="" src={uri} style={{ height: height, width: width }} className="profilepicture-photo"/>
                                    :
                                    <img alt="" src={'/profilepictures/' + photo} style={{ height: height, width: width }} className="profilepicture-photo"/>
                                :
                                <img alt="" src="/profilepictures/default.png" className="profilepicture-photo" style={{ height: 200, width: 200 }}/>
                            }
                        </div>
                        <div className="profilepicture-button" onClick={() => {
                            var profilepicture_button = document.getElementsByClassName("profilepicture-browse")[0]

                            if (photo !== '') {
                                profilepicture_button.value = null
                                
                                profilepicture.photo = ''
                                profilepicture.width = 0
                                profilepicture.height = 0

                                this.setState({ 'profilepicture': profilepicture })
                            } else {
                                profilepicture_button.click()
                            }
                        }}>{profilepicture.photo !== '' ? 'Cancel' : 'Browse'}</div>
                        <input className="profilepicture-browse" type="file" onChange={(photo) => this.browseProfilePicture(photo)} style={{ display: 'none' }}/>
                    </div>

                    <div className="school-box">
                        <div className="add_school-header">List School(s) you teach at</div>
                        <div className="add_school-button" onClick={() => this.addItem('schools')}>+</div>

                        <div className="school-lists">
                            {schools.map((school, index) => (
                                <div key={index} className="school">
                                    <div className="school-index">{index + 1}.</div>
                                    <div className="school-selection-header" onClick={() => this.toggleLists(index)}>{ school.school_name != '' ? school.school_name : 'Select a school' }</div>
                                    { school.show_lists ? <div className="schools-list">
                                        <div className="school-listitem" onClick={() => this.selectSchool(index, 'Riverdale Collegiate Institute')}>Riverdale Collegiate Institute</div>
                                    </div> : null }
                                    <div className="school-delete" onClick={() => this.deleteItem('schools', index)}>-</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="class_list-box">
                        <div className="add_class-header">List Class(s)</div>
                        <div className="add_class-button" onClick={() => this.addItem('classes')}>+</div>

                        <div className="class-lists">
                            {classes.map((class_info, index) => (
                                <div key={index} className="class">
                                    <div className="class-index">{index + 1}.</div>
                                    <div className="class-info">
                                        <div>
                                            <div className="class-subject-header">Subject:</div>
                                            <input className="class-subject" type="text" placeholder="Subject" onChange={(subject) => this.schoolInput(index, 'subject', subject.target.value)} value={class_info.class_name}/>
                                        </div>
                                        <div>
                                            <div className="class-code-header">Subject Code:</div>
                                            <input className="class-code" type="text" placeholder="Optional: Subject Code" onChange={(code) => this.schoolInput(index, 'code', code.target.value)} value={class_info.class_code}/>
                                        </div>
                                    </div>
                                    <div className="class-delete" onClick={() => this.deleteItem('classes', index)}>-</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="accountsetup-error">{this.state.errormsg}</div>
                    <div className="accountsetup-save" onClick={this.save}>Save</div>
                </div>
            </div>
        )
    }
}
