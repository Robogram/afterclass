import React, { Component } from 'react';
import 'stylesheets/questions.css';
import 'javascripts/encryption.js';

import Header from './partials/header'
import StudentSidebar from './partials/student_sidebar'
import InstructorSidebar from './partials/instructor_sidebar'

export default class questions extends Component {
    constructor(props) {
        super(props)

        var { userid, account_type } = localStorage

        if (!userid || !account_type) {
            window.location = '/users'
        }

        var { user_id, name, profilepicture, questions, num_unanswered, invite_code } = this.props.user_info

        this.state = {
            userid: userid,
            account_type: account_type,
            profile_infos: {
                user_id: user_id,
                profilepicture: profilepicture,
                profname: name,
                questions: questions,
                num_unanswered: num_unanswered,
                invite_code: invite_code
            },
            question_info: {},
            student_question: "",
            questionid: "",
            student_answer: "",
            instructor_answer: "",
            errormsg: "",
            prof_provide_answer_box: false,
            mate_provide_answer_box: false,
            subscription: "",
            involved: false,
            inactive_payment_box: false,
            errormsg: ""
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
                    switch (subscription) {
                        case "non":
                            window.location = '/payment'

                            break
                        case "involved":
                            this.setState({ 'subscription': 'active', 'involved': true })

                            break
                        default:
                            this.setState({ 'subscription': subscription })
                    }
                }
            })
        }
    }
    removeAllQuestions = () => {
        var { userid, profile_infos } = this.state
        var { invite_code } = profile_infos
        var csrf_token = document.getElementsByName("csrf-token")[0].content

        fetch('/questions/remove_all_questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-Token': csrf_token
            },
            body: JSON.stringify({
                userid: userid,
                invite_code: invite_code
            })
        })
        .then((response) => response.json())
        .then((response) => {
            var error = response.error
            var questions

            if (!error) {
                questions = response.questions

                profile_infos.questions = questions

                this.setState({ 'profile_infos': profile_infos, 'subscription': 'inactive', 'involved': false })
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
    askInstructor = () => {
        var { userid, profile_infos, student_question } = this.state
        var { questions, invite_code } = profile_infos
        var token = document.getElementsByName("csrf-token")[0].content

        fetch('/questions/ask_instructor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-Token': token
            },
            body: JSON.stringify({
                userid: userid,
                invitecode: invite_code,
                studentquestion: student_question
            })
        })
        .then((response) => response.json())
        .then((response) => {
            var error = response.error
            var question, errormsg

            if (!error) {
                question = response.question
                questions.unshift(question)

                profile_infos['questions'] = questions

                this.setState({ 'profile_infos': profile_infos, 'student_question': '', 'errormsg': '' })
            } else {
                errormsg = response.errormsg

                if (errormsg === 'inactive') {
                    this.setState({ 'inactive_payment_box': true })
                } else {
                    this.setState({ 'errormsg': errormsg })
                }
            }
        })
    }
    getQuestionInfo = (questionid) => {
        var token = document.getElementsByName("csrf-token")[0].content

        fetch('/questions/get_question_info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-Token': token
            },
            body: JSON.stringify({ questionid: questionid })
        })
        .then((response) => response.json())
        .then((response) => {
            var error = response.error
            var question_info

            if (!error) {
                question_info = response.question_info

                this.setState({ 'question_info': question_info })
            }
        })
    }
    deleteQuestion = () => {
        var { userid, profile_infos, question_info } = this.state
        var { questions } = profile_infos
        var token = document.getElementsByName("csrf-token")[0].content

        fetch('/questions/delete_question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-Token': token
            },
            body: JSON.stringify({
                userid: userid,
                questionid: question_info['questionid']
            })
        })
        .then((response) => response.json())
        .then((response) => {
            var error = response.error
            var questions, num_unanswered

            if (!error) {
                questions = response.questions
                num_unanswered = response.num_unanswered

                profile_infos['questions'] = questions
                profile_infos['num_unanswered'] = num_unanswered

                this.setState({ 'profile_infos': profile_infos, 'question_info': {} })
            } else {
                errormsg = response.errormsg

                this.setState({ 'errormsg': errormsg })
            }
        })
    }
    scaleVote = (id, direction, type) => {
        var { userid, profile_infos } = this.state
        var { questions } = profile_infos
        var token = document.getElementsByName("csrf-token")[0].content

        fetch('/questions/scale_vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-Token': token
            },
            body: JSON.stringify({
                userid: userid,
                id: id,
                type: type,
                direction: direction
            })
        })
        .then((response) => response.json())
        .then((response) => {
            var error = response.error
            var upvotes, downvotes, errormsg

            if (!error) {
                upvotes = response.upvotes
                downvotes = response.downvotes

                questions.forEach(function (question) {
                    if (type === '') {
                        if (question['questionid'] === id) {
                            question['upvotes'] = upvotes
                            question['downvotes'] = downvotes
                        }
                    } else {
                        question['students_answer'].forEach(function (answer) {
                            if (answer['answerid'] === id) {
                                answer['upvotes'] = upvotes
                                answer['downvotes'] = downvotes
                            }
                        })
                    }
                })

                profile_infos['questions'] = questions

                this.setState({ 'profile_infos': profile_infos })
            } else {
                errormsg = response.errormsg

                this.setState({ 'errormsg': errormsg })
            }
        })
    }
    answer = (answerer) => {
        var { userid, profile_infos, questionid, student_answer, instructor_answer } = this.state
        var { questions, invite_code } = profile_infos
        var token = document.getElementsByName("csrf-token")[0].content
        var answer = answerer === 'student' ? instructor_answer : student_answer

        fetch('/questions/answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-Token': token
            },
            body: JSON.stringify({
                userid: userid,
                answer: answer,
                questionid: questionid,
                answerer: answerer
            })
        })
        .then((response) => response.json())
        .then((response) => {
            var error = response.error
            var errormsg, answer, num_unanswered

            if (!error) {
                answer = response.answer
                num_unanswered = response.num_unanswered

                questions.forEach(function (question) {
                    if (question['questionid'] === questionid) {
                        if (answerer === 'student') {
                            question['answers'].unshift(answer)
                        } else {
                            question['students_answer'].unshift(answer)
                        }
                    }
                })

                profile_infos['questions'] = questions
                profile_infos['num_unanswered'] = num_unanswered

                this.setState({
                    'profile_infos': profile_infos,
                    'prof_provide_answer_box': false,
                    'mate_provide_answer_box': false
                })
            } else {
                errormsg = response.errormsg

                this.setState({ 'errormsg': errormsg })
            }
        })
    }
    render() {
        var { 
            userid, account_type, profile_infos, question_info, student_question, errormsg, 
            prof_provide_answer_box, mate_provide_answer_box, subscription, involved, inactive_payment_box, errormsg
        } = this.state
        var { user_id, profilepicture, profname, questions, num_unanswered } = profile_infos

        userid = decrypt_id(userid)

        return (
            <div className="main">
                {subscription === '' || subscription ? 
                    <div>
                        {account_type === 'Student' ? 
                            <Header onClick={() => this.toggleSubscription()} subscription={subscription} key={subscription}/>
                            :
                            <Header/>
                        }
                        <div className="main-sidebar">{ account_type === 'Student' ? <StudentSidebar/> : <InstructorSidebar/> }</div>
                        <div className="main-body">
                            <div className="profilepicture-holder">{this.displayProfile(profilepicture)}</div>
                            <div className="prof-profile-name">{profname}</div>
                            {userid !== user_id ? 
                                <div>
                                    <div style={{ textAlign: 'center' }}><textarea className="student-ask-question-input" placeholder={"What's your question for " + profname + " ?"} onChange={(student_question) => this.setState({ 'student_question': student_question.target.value, 'errormsg': '' })} value={student_question}></textarea></div>
                                    <div className="student-ask-question-error">{errormsg}</div>
                                    <div className="student-ask-question-button" onClick={this.askInstructor}>Ask</div>
                                </div>
                            : null}
                            <div className="instructor-info">
                                <div className="info-questions">
                                    <div className="info-num-header">{questions.length}</div>
                                    <div className="info-header">Question(s)</div>
                                </div>
                                <div className="info-answers">
                                    <div className="info-num-header">{num_unanswered}</div>
                                    <div className="info-header">Answered</div>
                                </div>
                            </div>
                            <div className="questions-list">
                                { questions.length > 0 ? 
                                    questions.map((question, index) => (
                                        <div className="question" key={index}>
                                            { account_type === 'Staff' || question['creatorid'] === userid ? <div className="question-delete" onClick={() => this.getQuestionInfo(question['questionid'])}>x</div> : null }
                                            <div className="column">
                                                <div className="student-info">
                                                    <div className="student-name"><strong>Student: </strong>{question.studentname}</div>
                                                    <div className="student-question"><strong>Question: </strong>{question.question}</div>
                                                </div>
                                                <div className="question-info">
                                                    <div className="num-upvotes">
                                                        <div className="upvotes-num-header">{question.upvotes.length}</div>
                                                        <div className="upvotes-header">Upvote(s)</div>
                                                        <div className="upvotes-button" onClick={() => this.scaleVote(question.questionid, 'up', '')}>+</div>
                                                    </div>
                                                    <div className="num-downvotes">
                                                        <div className="downvotes-num-header">{question.downvotes.length}</div>
                                                        <div className="downvotes-header">Downvote(s)</div>
                                                        <div className="downvotes-button" onClick={() => this.scaleVote(question.questionid, 'down', '')}>-</div>
                                                    </div>
                                                </div>
                                            </div>
                                            {question.answers.length > 0 ? 
                                                <div>
                                                    {question.answers.map((answer, index) => (
                                                        <div className="prof-answer" key={index}><strong>Prof / Teacher Answer: </strong>{answer['answer']}</div>
                                                    ))}
                                                    {account_type === 'Staff' ? <div className="provide-answer" onClick={() => this.setState({ 'questionid': question['questionid'], 'prof_provide_answer_box': true, 'mate_provide_answer_box': false, 'errormsg': '' })}>Provide another answer</div> : null }
                                                </div>
                                                :
                                                account_type === 'Staff' ? <div className="provide-answer" onClick={() => this.setState({ 'questionid': question['questionid'], 'prof_provide_answer_box': true, 'mate_provide_answer_box': false, 'errormsg': '' })}>Provide an answer</div> : null
                                            }
                                            {question.students_answer.length > 0 ? 
                                                <div>
                                                    <div className="student-answers-header">Student Answer(s)</div>
                                                    {question.students_answer.map((answer, index) => (
                                                        <div className="student-answer" key={index}> 
                                                            <div className="answer"><strong>{answer['creatorid'] === userid ? 'You:' : 'Kevin Mai:'} </strong>{answer.answer}</div>
                                                            <div className="answer-votes">
                                                                <div className="num-upvotes">
                                                                    <div className="upvotes-num-header">{answer.upvotes.length}</div>
                                                                    <div className="upvotes-header">Upvote(s)</div>
                                                                    <div className="student-upvotes-button" onClick={() => this.scaleVote(answer.answerid, 'up', 'student')}>+</div>
                                                                </div>
                                                                <div className="num-downvotes">
                                                                    <div className="downvotes-num-header">{answer.downvotes.length}</div>
                                                                    <div className="downvotes-header">Downvote(s)</div>
                                                                    <div className="student-downvotes-button" onClick={() => this.scaleVote(answer.answerid, 'down', 'student')}>-</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            : null }
                                            { account_type === 'Student' && question.creatorid !== userid ? 
                                                <div className="provide-answer" onClick={() => this.setState({ 'questionid': question['questionid'], 'prof_provide_answer_box': false, 'mate_provide_answer_box': true, 'errormsg': '' })}>
                                                    {
                                                        JSON.stringify(question.students_answer).replace(userid, '') === JSON.stringify(question.students_answer) ? 
                                                            'Provide an answer'
                                                            :
                                                            'Provide another answer'
                                                    }
                                                </div>
                                                :
                                                null
                                            }
                                        </div>
                                    ))
                                : null }
                            </div>
                        </div>

                        { prof_provide_answer_box || mate_provide_answer_box || JSON.stringify(question_info) !== '{}' || involved || inactive_payment_box ? 
                            <div className="hidden-box">
                                { prof_provide_answer_box ? 
                                    <div className="prof-answer-provide-box">
                                        <div className="prof-answer-provide-header">Give your best answer to your student</div>
                                        <textarea className="prof-answer-provide-input" maxLength="220" onChange={(instructor_answer) => this.setState({ 'instructor_answer': instructor_answer.target.value })}></textarea>
                                        <div className="prof-error">{errormsg}</div>
                                        <div className="prof-answer-options">
                                            <div className="prof-answer-cancel-button" onClick={() => this.setState({ 'prof_provide_answer_box': false, 'errormsg': '' })}>Cancel</div>
                                            <div className="prof-answer-provide-button" onClick={() => this.answer('student')}>Post Answer</div>
                                        </div>
                                    </div>
                                : null }
                                { mate_provide_answer_box ? 
                                    <div className="mate-answer-provide-box">
                                        <div className="mate-answer-provide-header">Give your best answer to your classmate</div>
                                        <textarea className="mate-answer-provide-input" maxLength="220" onChange={(student_answer) => this.setState({ 'student_answer': student_answer.target.value })}></textarea>
                                        <div className="mate-error">{errormsg}</div>
                                        <div className="mate-answer-options">
                                            <div className="mate-answer-cancel-button" onClick={() => this.setState({ 'mate_provide_answer_box': false, 'errormsg': '' })}>Cancel</div>
                                            <div className="mate-answer-provide-button" onClick={() => this.answer('classmate')}>Post Answer</div>
                                        </div>
                                    </div>
                                : null }
                                { JSON.stringify(question_info) !== '{}' ? 
                                    <div className="delete-question-confirmation-box">
                                        <div className="delete-question-confirmation-header">
                                            Are you sure you want to delete this question 
                                            with the following information ?

                                            <div className="delete-question-confirmation-question-header">The Question: <strong>{question_info['question']}</strong></div>
                                        </div>

                                        <div className="delete-question-confirmation-vote-info">
                                            <div className="delete-question-confirmation-upvotes">
                                                <div className="delete-question-confirmation-upvotes-num">{question_info['upvotes']}</div>
                                                <div className="delete-question-confirmation-upvotes-num-header">Upvote(s)</div>
                                            </div>
                                            <div className="delete-question-confirmation-downvotes">
                                                <div className="delete-question-confirmation-downvotes-num">{question_info['downvotes']}</div>
                                                <div className="delete-question-confirmation-downvotes-num-header">Downvote(s)</div>
                                            </div>
                                        </div>

                                        <div className="delete-question-confirmation-answered-info">
                                            <div className="delete-question-confirmation-prof-answers">
                                                <div className="delete-question-confirmation-prof-answers-num">{question_info['answers']}</div>
                                                <div className="delete-question-confirmation-prof-answers-num-header">Professor/Teacher Answer(s)</div>
                                            </div>
                                            <div className="delete-question-confirmation-classmate-answers">
                                                <div className="delete-question-confirmation-classmate-answers-num">{question_info['students_answer']}</div>
                                                <div className="delete-question-confirmation-classmate-answers-num-header">Classmate Answer(s)</div>
                                            </div>
                                        </div>

                                        <div className="delete-question-confirmation-options">
                                            <div className="delete-question-confirmation-options-button" onClick={() => this.setState({ 'question_info': {} })}>Cancel</div>
                                            <div className="delete-question-confirmation-options-button" onClick={() => this.deleteQuestion()}>Yes</div>
                                        </div>
                                    </div>
                                : null }
                                { involved ? 
                                    <div className="error-payment-box">
                                        <div className="error-payment-header">You have asked one or more question(s)</div>
                                        <div className="error-payment-header">Would you like to remove all your question(s)</div>

                                        <div className="error-payment-options">
                                            <div className="error-payment-button" onClick={() => this.setState({ 'involved': false })}>No</div>
                                            <div className="error-payment-button" onClick={this.removeAllQuestions}>Yes</div>
                                        </div>
                                    </div>
                                : null }
                                { inactive_payment_box ? 
                                    <div className="error-payment-box">
                                        <div className="error-payment-header">Your subscription is currently inactive.</div>
                                        <div className="error-payment-header">Please click <strong>'Re-Subscribe'</strong> at the top</div>

                                        <div className="error-payment-options">
                                            <div className="error-payment-button" onClick={() => this.setState({ 'inactive_payment_box': false })}>Ok</div>
                                        </div>
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
