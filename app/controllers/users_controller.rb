require_relative './algos.rb'

class UsersController < ApplicationController
    def index
    end

    def new
    end

    def policy
    end

    def terms
    end

    def create
        user = User.new(register_params)

        firstname = user.firstname
        lastname = user.lastname
        email = user.email
        accounttype = user.accounttype
        password = user.password

        userid = ''
        userid_length = rand(10..20)

        for k in 1..userid_length
            userid += rand(0..9) % 2 == 0 ? rand(65..90).chr : rand(0..9).to_s
        end

        user.userid = userid
        user.password = BCrypt::Password.create(user.password)
        user.subjects = '[]'
        user.classes = '[]'
        user.profilepicture = '{ "photo": "", "width": 0, "height": 0 }'
        user.schools = '[]'
        user.save

        render json: { 'error': false, 'userid': encrypt_id(userid), 'account_type': accounttype }
    end

    def update
        user = User.find_by_userid(decrypt_id(params[:id]))
        new_info = update_profile

        user.profilepicture = new_info['profilepicture']
        user.schools = new_info['schools']
        user.classes = new_info['classes']

        user.save

        render json: { 'error': false }
    end

    def destroy
        reset_session

        render json: { 'error': false }
    end

    private
        def register_params
            params.require(:user).permit(:firstname, :lastname, :email, :accounttype, :password)
        end

        def update_profile
            params.require(:user).permit(:profilepicture, :schools, :classes)
        end
end
