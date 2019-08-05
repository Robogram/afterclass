require_relative './algos.rb'

class InstructorsController < ApplicationController
	protect_from_forgery with: :null_session

	def index
	end

	def show
		user = User.find_by_userid(decrypt_id(params[:id]))

		@user_info = {}

		@user_info['firstname'] = user.firstname[0]
		@user_info['lastname'] = user.lastname
		@user_info['profilepicture'] = JSON.parse(user.profilepicture)
		@user_info['classes'] = JSON.parse(user.classes)
	end

	def get_instructors
		datas = User.select(:id, :firstname, :lastname, :profilepicture, :classes)
					.where(accounttype: 'Staff')
					.where.not(classes: '[]')
					.all

		instructors = []

		datas.each do |data|
			instructors.push({
				'profilepicture': JSON.parse(data.profilepicture), 
				'name': data.firstname[0] + ", " + data.lastname, 
				'classes': JSON.parse(data.classes)
			})
		end

		return render json: { 'error': false, 'instructors': instructors }
	end

	def search_instructors
		search = params[:search]

		sql = "select * from users where firstname like '%" + search + "%' and lastname like '%" + search + "%'"

		datas = User.find_by_sql(sql)

		instructors = []

		datas.each do |data|
			instructors.push({
				'profilepicture': JSON.parse(data.profilepicture),
				'name': data.firstname[0] + ", " + data.lastname,
				'classes': JSON.parse(data.classes)
			})
		end

		return render json: { 'error': false, 'instructors': instructors }
	end

	def get_classes
        userid = decrypt_id(params[:userid])

		instructor = User.find_by_userid(userid)
		classes = JSON.parse(instructor.classes)

		classes.each do |class_info|
			class_info['invite_code'] = encrypt_id(class_info['invite_code'])

			questions = class_info['questions']

			questions.each do |question|
				question['questionid'] = encrypt_id(question['questionid'])
			end
		end

		return render json: { 'error': false, 'profilepicture': JSON.parse(instructor.profilepicture), 'classes': classes }
	end

	def get_subjects
        userid = decrypt_id(params[:userid])

		instructors = User.find_by_sql("SELECT id, firstname, lastname, profilepicture, classes FROM users WHERE classes LIKE '%" + userid + "%'")

		subjects = []

		instructors.each do |instructor|
			classes = JSON.parse(instructor.classes)

			classes.each do |class_info|
				joined_students = class_info['joined_students']

				if joined_students.include? userid
					class_info['name'] = instructor.firstname[0] + ", " + instructor.lastname
					class_info['profilepicture'] = JSON.parse(instructor.profilepicture)
                    class_info['invite_code'] = encrypt_id(class_info['invite_code'])
					
					class_info.delete('questions')

					subjects.push(class_info)
				end
			end
		end

		return render json: { 'error': false, 'subjects': subjects }
	end

	def join_qa
		userid = decrypt_id(params[:userid])
        invite_code = params[:invitecode]

        user = User.find_by_userid(userid)
        customerid = user.identity
        valid_joining = true

		if invite_code != ''
			instructors = User.find_by_sql("SELECT * FROM users WHERE classes LIKE '%\"" + invite_code + "\"%'")

			if instructors.length > 0
				classes = JSON.parse(instructors[0].classes)

				classes.each do |class_info|
					if class_info['invite_code'] == invite_code
						if customerid == ''
				            errormsg = ''

				            valid_joining = false
				        end

				        if valid_joining == true
							class_info['joined_students'].push(userid)
						else
							return render json: { 'error': true, 'errormsg': 'nonpayment' }
						end
					end
				end

				if valid_joining == true
					instructors[0].classes = classes.to_json
					instructors[0].save

					return render json: { 'error': false }
				end
			else
				return render json: { 'error': true, 'errormsg': 'Found no instructor associated with the invite code' }
			end
		else
			return render json: { 'error': true, 'errormsg': 'Code is empty' }
		end
	end

	def get_earnings
		userid = decrypt_id(params[:userid])

		user = User.find_by_userid(userid)

		earnings = user.earnings.to_f
		identity = user.identity != '' ? 'yes' : 'no'

		return render json: { 'error': false, 'earnings': earnings, 'identity': identity }
	end
end
