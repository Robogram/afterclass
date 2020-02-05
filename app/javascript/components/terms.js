import React, { Component } from 'react'
import 'stylesheets/terms.scss'
import { decrypt_id } from 'infos.js'

import Header from './partials/header'
import StudentSidebar from './partials/student_sidebar'
import InstructorSidebar from './partials/instructor_sidebar'

export default class terms extends Component {
    constructor(props) {
        super(props)

        var { userid, account_type } = localStorage

        this.state = {
            userid: userid,
            account_type: account_type,
        }
    }
    render() {
        var { userid, account_type } = this.state

        return (
            <div className="terms">
                <Header/>
                {userid ? <div className="main-sidebar">{ account_type === 'Student' ? <StudentSidebar/> : <InstructorSidebar/> }</div> : null}
                <div className={ userid ? "main-body" : "unloggedin-main-body" }>
                    <div className="main-terms-header">Terms</div>

                    <div className="main-terms">
                        <p className="terms-item">Please read these Terms carefully before accessing or using the platform. 
                        By accessing or using any part of the service, you agree to be bound by these Terms. If you do not agree 
                        to all the terms of this agreement, then you may not access the service or use any services. If these 
                        Terms are considered an offer, acceptance is expressly limited to these Terms.</p>

                        <p className="terms-item">Our Platform is hosted on DigitalOcean. They provide us all the tools we 
                        need to keep you and your information secure at all times.</p>

                        <div className="terms-itemheader">General Conditions</div>
                        <p className="terms-item">We reserve the right to refuse service to anyone for any reason at any 
                        time. You agree not to copy, sell any portion of the Service, use of the Service, or access to the 
                        Service or any contact on the service through which the service is provided, without express written 
                        permission by us. The headings used in this agreement are included for convenience only and will 
                        not limit or otherwise affect these Terms.</p>
                        
                        <div className="terms-itemheader">Accuracy, Completeness and Timeliness or Information</div>
                        <p className="terms-item">We are not responsible if information made available for the service 
                        is not accurate, complete or current. The material for the service is provided for general 
                        information only and should not be relied upon or used as the sole basis for making decisions 
                        without consulting primary, more accurate, more complete or more timely sources of information. 
                        Any reliance on the material for the service is at your own risfor the service may contain certain 
                        historical information. Historical information, necessarily, is not current and is provided 
                        for your reference only. We reserve the right to modify the contents for the service at any time, 
                        but we have no obligation to update any information for the service. You agree that it is your 
                        responsibility to monitor changes for the service.</p>

                        <div className="terms-itemheader">Personal Information</div>
                        <p className="terms-item">The use of personal information through the service is stated by our Policy.</p>

                        <div className="terms-itemheader">Disclaimer of Warranties; Limitation of Liability</div>
                        <p className="terms-item">We do not guarantee, represent or warrant that your use of our service 
                        will be uninterrupted, timely, secure or error-free. We do not warrant that the results that may 
                        be obtained from the use of the service will be accurate or reliable. You agree that from time to 
                        time we may remove the service for indefinite periods of time or cancel the service at any time, 
                        without notice to you.</p>

                        <div className="terms-itemheader">Indemnification</div>
                        <p className="terms-item">You agree to indemnify, defend and hold harmless AfterClass and our parent, 
                        subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, 
                        subcontractors, suppliers, interns and employees, harmless from any claim or demand, including reasonable 
                        attorneys’ fees, made by any third-party due to or arising out of your breach of these Terms or the 
                        documents they incorporate by reference, or your violation of any law or the rights of a third-party.</p>

                        <div className="terms-itemheader">Severability</div>
                        <p className="terms-item">In the event that any provision of these Terms is determined to be unlawful, 
                        void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted 
                        by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms, such 
                        determination shall not affect the validity and enforceability of any other remaining provisions.</p>

                        <div className="terms-itemheader">Entire Agreement</div>
                        <p className="terms-item">The failure of us to exercise or enforce any right or provision of these Terms 
                        shall not constitute a waiver of such right or provision. These Terms and any policies or operating 
                        rules posted by us for the service or in respect to The Service constitutes the entire agreement and understanding 
                        between you and us and govern your use of the Service, superseding any prior or contemporaneous agreements, 
                        communications and proposals, whether oral or written, between you and us (including, but not limited to, 
                        any prior versions of the Terms). Any ambiguities in the interpretation of these Terms shall not be 
                        construed against the drafting party.</p>

                        <div className="terms-itemheader">Changes to Terms of Use</div>
                        <p className="terms-item">You can review the most current version of the Terms at any time. We reserve the right, 
                        at our sole discretion, to update, change or replace any part of these Terms by posting updates and changes 
                        for the service. It is your responsibility to chefor the service periodically for changes. Your continued use of or 
                        access for the service or the Service following the posting of any changes to these Terms constitutes acceptance 
                        of those changes.</p>

                        <div className="terms-question-header">Questions about the Terms can be asked at</div>
                        <a href="mailto:admin@geottuse.com">admin@geottuse.com</a>
                    </div>
                </div>
            </div>
        )
    }
}
