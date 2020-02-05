require_relative './algos.rb'

class AccountsetupController < ApplicationController
    def show
		user = User.find_by_userid(decrypt_id(params[:id]))

		@user_info = {}

		@user_info['profilepicture'] = JSON.parse(user.profilepicture)
		@user_info['schools'] = JSON.parse(user.schools)
		@user_info['classes'] = JSON.parse(user.classes)
	end

	def update
		user = User.find_by_userid(decrypt_id(params[:id]))
		profilepicture = JSON.parse(params[:profilepicture])
		uri = profilepicture['uri'].split(',')
		photoname = profilepicture['photo']
		jpg = Base64.decode64(uri[1])

		File.open('public/photos/' + photoname, 'wb') { |f| f.write(jpg) }

		render json: { 'error': false }
	end
end
