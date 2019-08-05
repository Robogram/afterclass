require_relative './algos.rb'

class VerifyController < ApplicationController
    def index
    end

	def new
	end

	def create
        user = verify_params

        firstname = user['firstname']
        lastname = user['lastname']
        email = user['email']
        accounttype = user['accounttype']
        password = user['password']
        confirmpassword = params[:confirmpassword]

        user_info = ['password', 'accounttype', 'email', 'lastname', 'firstname']

        empty_value = false
        errormsg = ''

        user_info.each do | info |
            if user[info].empty?
                empty_value = true
                errormsg = 'One or more of the info is empty'
            end
        end

        if !empty_value
            if email.count('@') == 1
                if password.length >= 8 && password.length <= 20
                    if confirmpassword != ''
                        if password == confirmpassword
                            verifycode = ''

                            for k in 1..8
                                verifycode += rand(0..9) % 2 == 0 ? rand(65..90).chr : rand(0..9).to_s
                            end

                            #UserMailer.verify_user(user, verifycode).deliver_now

                            render json: { 'error': false, 'verifycode': verifycode }
                        else
                            render json: { 'error': true, 'errormsg': 'Password is mismatch' }
                        end
                    else
                        render json: { 'error': true, 'errormsg': 'Please confirm your password' }
                    end
                else
                    render json: { 'error': true, 'errormsg': 'Password should be 8 - 20 characters long' }
                end
            else
                render json: { 'error': true, 'errormsg': 'E-mail is invalid' }
            end
        else
            render json: { 'error': true, 'errormsg': errormsg }
        end
	end

    private
        def verify_params
            params.require(:verify).permit(:firstname, :lastname, :email, :accounttype, :password)
        end
end
