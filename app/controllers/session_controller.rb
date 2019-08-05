require_relative './algos.rb'

class SessionController < ApplicationController
    protect_from_forgery with: :null_session
    
    def new
    end
    
	def create
		@user = params.require(:session).permit(:email, :password)

		email = @user['email']
		password = @user['password']

		if !email.empty?
			if !password.empty?
				user = User.find_by_email(email)

                if !user.nil?
                    id = user.identity
                    accounttype = user.accounttype

                    if user
                        if BCrypt::Password.new(user.password) == password
                            num_classes = JSON.parse(user.classes).size

                            render json: { 'error': false, 'userid': encrypt_id(user['userid']), 'account_type': accounttype, 'num_classes': num_classes, 'id': id }
                        else
                            render json: { 'error': true, 'errormsg': 'Password is incorrect' }
                        end
                    else
                        render json: { 'error': true, 'errormsg': "E-mail doesn't exist" }
                    end
                else
                    render json: { 'error': true, 'errormsg': 'Username does not exist' }
                end
			else
				render json: { 'error': true, 'errormsg': 'Password is blank' }
			end
		else
			render json: { 'error': true, 'errormsg': 'E-mail is blank' }
		end
	end
end
