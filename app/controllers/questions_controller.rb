require_relative './algos.rb'

def arrange_questions(questions)
	num_unanswered = 0

    for k in 0..(questions.length - 1)
        students_answer = questions[k]['students_answer']
        num_unanswered += questions[k]['answers'].length > 0 ? 1 : 0

        for m in 0..(students_answer.length - 1)
            for n in 0..(students_answer.length - 1)
                valid_switch = false

                vote_one_upvotes = students_answer[m]['upvotes'].length
                vote_one_downvotes = students_answer[m]['downvotes'].length

                vote_two_upvotes = students_answer[n]['upvotes'].length
                vote_two_downvotes = students_answer[n]['downvotes'].length

                vote_one = vote_one_upvotes - vote_one_downvotes
                vote_two = vote_two_upvotes - vote_two_downvotes

                if vote_one > vote_two
                    valid_switch = true
                elsif vote_one == vote_two
                    if vote_one_upvotes > vote_two_upvotes
                        valid_switch = true
                    end
                end

                if valid_switch == true
                    hold_answer = students_answer[m]
                    students_answer[m] = students_answer[n]
                    students_answer[n] = hold_answer
                end
            end
        end

        for i in 0..(questions.length - 1)
            valid_switch = false

            vote_one_upvotes = questions[k]['upvotes'].length
            vote_one_downvotes = questions[k]['downvotes'].length

            vote_two_upvotes = questions[i]['upvotes'].length
            vote_two_downvotes = questions[i]['downvotes'].length

            vote_one = vote_one_upvotes - vote_one_downvotes
            vote_two = vote_two_upvotes - vote_two_downvotes

            if vote_one > vote_two
                valid_switch = true
            elsif vote_one == vote_two
                if vote_one_upvotes > vote_two_upvotes
                    valid_switch = true
                end
            end

            if valid_switch == true
                hold_answer = questions[k]
                questions[k] = questions[i]
                questions[i] = hold_answer
            end
        end
    end

    info = {}
    info['questions'] = questions
    info['num_unanswered'] = num_unanswered

    return info
end

class QuestionsController < ApplicationController
	protect_from_forgery with: :null_session
	
	def show
		account_type = params[:account_type]
		invite_code = decrypt_id(params[:id])

		if account_type == 'Staff'
			user = User.find_by_userid(decrypt_id(params[:userid]))
		else
			user = User.where("classes LIKE ?", "%" + invite_code + "%").first()
		end

		@user_info = {}
		@user_info['user_id'] = user.userid
		@user_info['name'] = user.firstname[0] + ", " + user.lastname
		@user_info['profilepicture'] = JSON.parse(user.profilepicture)

		classes = JSON.parse(user.classes)
		
		classes.each do |class_info|
			if class_info['invite_code'] == invite_code
				info = arrange_questions(class_info['questions'])

				@user_info['questions'] = info['questions']
				@user_info['num_unanswered'] = info['num_unanswered']
				@user_info['invite_code'] = class_info['invite_code']
			end
		end
	end

	def ask_instructor
		userid = decrypt_id(params[:userid])

		user = User.find_by_userid(userid)
		invite_code = params[:invitecode]
		student_question = params[:studentquestion]
		customerid = user.identity

		customer = Stripe::Customer.retrieve(customerid)
		subscription_id = get_subscription_id(customer)

		if subscription_id != ''
			if student_question != ''
				student = User.find_by_userid(userid)
				datas = User.where("classes LIKE ?", "%" + invite_code + "%")
				questionid = ''
				questionid_length = rand(10..20)

				for k in 1..questionid_length
					questionid += rand(0..9) % 2 == 0 ? rand(65..90).chr : rand(0..9).to_s
				end

				question = {
					'creatorid': userid,
					'questionid': questionid,
					'studentname': student.firstname + " " + student.lastname,
					'question': student_question,
					'upvotes': [],
					'downvotes': [],
					'answers': [],
					'students_answer': []
				}

				datas.each do |data|
					classes = JSON.parse(data.classes)

					classes.each do |class_info|
						if class_info['invite_code'] == invite_code
							class_info['questions'].unshift(question)
						end
					end

					data.classes = classes.to_json
					data.save
				end

				render json: { 'error': false, 'question': question }
			else
				render json: { 'error': true, 'errormsg': 'Your question is blank' }
			end
		else
			render json: { 'error': true, 'errormsg': 'inactive' }
		end
	end

	def get_question_info
		questionid = params[:questionid]

		instructor = User.where("classes LIKE ?", "%" + questionid + "%").first()

		classes = JSON.parse(instructor.classes)
		question_info = {}

		classes.each do |class_info|
			questions = class_info['questions']

			questions.each do |question|
				if question['questionid'] == questionid
					question_info = question
				end
			end
		end

		question = question_info['question']
		upvotes = question_info['upvotes'].length
		downvotes = question_info['downvotes'].length
		answers = question_info['answers'].length
		students_answer = question_info['students_answer'].length

		question_info = { 'questionid': questionid, 'question': question, 'upvotes': upvotes, 'downvotes': downvotes, 'answers': answers, 'students_answer': students_answer }

		render json: { 'error': false, 'question_info': question_info }
	end

	def delete_question
		userid = decrypt_id(params[:userid])

		user = User.find_by_userid(userid)
		questionid = params[:questionid]

		instructor = User.where("classes LIKE ?", "%" + questionid + "%").first()

		classes = JSON.parse(instructor.classes)
		questions = []
		num_unanswered = 0

		classes.each do |class_info|
			questions = class_info['questions']

			questions.each do |question|
				if question['questionid'] == questionid
					questions.delete(question)
				end
			end

			class_info['questions'] = questions
		end

		instructor.classes = classes.to_json
		instructor.save

		num_unanswered = 0

		classes.each do |class_info|
			questions = class_info['questions']

			questions.each do |question|
				if question['questionid'] == questionid
					info = arrange_questions(class_info['questions'])
					
					num_unanswered = info['num_unanswered']
				end
			end
		end

		render json: { 'error': false, 'questions': questions, 'num_unanswered': num_unanswered }
	end

	def scale_vote
		userid = decrypt_id(params[:userid])

		id = params[:id]
		type = params[:type]
		direction = params[:direction]

		user = User.find_by_userid(userid)

		instructor = User.where("classes LIKE ?", "%" + id + "%").first()

		classes = JSON.parse(instructor.classes)
		upvotes = []
		downvotes = []

		classes.each do |class_info|
			questions = class_info['questions']

			questions.each do |question|
				if type == ''
					if question['questionid'] == id
						if question[direction + 'votes'].include? userid
							question[direction + 'votes'].delete(userid)
						else
							question[direction + 'votes'].push(userid)

							if direction == 'up'
								oppos_direction = 'down'
							else
								oppos_direction = 'up'
							end

							if question[oppos_direction + 'votes'].include? userid
								question[oppos_direction + 'votes'].delete(userid)
							end
						end

						upvotes = question['upvotes']
						downvotes = question['downvotes']
					end
				else
					students_answer = question['students_answer']

					students_answer.each do |answer|
						if answer['answerid'] == id
							if answer[direction + 'votes'].include? userid
								answer[direction + 'votes'].delete(userid)
							else
								answer[direction + 'votes'].push(userid)

								if direction == 'up'
									oppos_direction = 'down'
								else
									oppos_direction = 'up'
								end

								if answer[oppos_direction + 'votes'].include? userid
									answer[oppos_direction + 'votes'].delete(userid)
								end
							end

							upvotes = answer['upvotes']
							downvotes = answer['downvotes']
						end
					end
				end
			end
		end

		instructor.classes = classes.to_json
		instructor.save

		render json: { 'error': false, 'upvotes': upvotes, 'downvotes': downvotes }
	end

	def answer
		userid = decrypt_id(params[:userid])

		answer = params[:answer]
		questionid = params[:questionid]
		answerer = params[:answerer]

		user = User.find_by_userid(userid)
		account_type = user.accounttype

		if answer != ''
			user = User.find_by_userid(decrypt_id(params[:userid]))
			instructor = User.where("classes LIKE ?", "%" + questionid + "%").first()
			time = Time.new.to_i

			classes = JSON.parse(instructor.classes)
			num_unanswered = 0

			if answerer == 'classmate'
				answerid = ''
				answerid_length = rand(10..20)

				for k in 1..answerid_length
					answerid += rand(0..9) % 2 == 0 ? rand(65..90).chr : rand(0..9).to_s
				end

				answer = {
					'creatorid': userid,
					'answerid': answerid,
					'studentname': user.firstname + " " + user.lastname,
					'answer': answer,
					'upvotes': [],
					'downvotes': [],
					'timeanswered': time.to_s
				}
			else
				answer = {
					'answer': answer,
					'timeanswered': time.to_s
				}
			end

			classes.each do |class_info|
				questions = class_info['questions']

				questions.each do |question|
					if question['questionid'] == questionid
						if answerer == 'classmate'
							question['students_answer'].unshift(answer)
						else
							question['answers'].unshift(answer)
						end
					end
				end

				class_info['questions'] = questions
			end

			instructor.classes = classes.to_json
			instructor.save

			num_unanswered = 0

			classes.each do |class_info|
				questions = class_info['questions']

				questions.each do |question|
					if question['questionid'] == questionid
						info = arrange_questions(class_info['questions'])

						num_unanswered = info['num_unanswered']
					end
				end
			end

			render json: { 'error': false, 'answer': answer, 'num_unanswered': num_unanswered }
		else
			render json: { 'error': true, 'errormsg': 'Your answer is blank' }
		end
	end

	def remove_all_questions
		userid = decrypt_id(params[:userid])
		student = User.find_by_userid(userid)

		find = '"creatorid":"' + userid + '"'
		instructors = User.find_by_sql("select id, classes from users where classes like '%" + find + "%'")
		customerid = student.identity

		customer = Stripe::Customer.retrieve(customerid)
		subscription_id = get_subscription_id(customer)

		instructors.each do |instructor|
			classes = JSON.parse(instructor.classes)

			classes.each do |class_info|
				while (class_info['questions'].to_json.include? find) do
					questions = class_info['questions']

					questions.each_with_index do |question, index|
						if question['creatorid'] == userid
							questions.delete_at(index)
						end
					end

					class_info['questions'] = questions
				end

				if !class_info.to_json.include? userid
					class_info['joined_students'].delete(userid)
				end
			end

			instructor.classes = classes.to_json
			instructor.save
		end

		Stripe::Subscription.delete(subscription_id)

		if !params[:invite_code].nil?
			invite_code = params[:invite_code]
			user = User.where("classes LIKE ?", "%" + invite_code + "%").first()
			classes = JSON.parse(user.classes)
			num_unanswered = 0
			questions = []

			classes.each do |class_info|
				if class_info['invite_code'] == invite_code
					info = arrange_questions(class_info['questions'])

					questions = info['questions']
				end
			end

			render json: { 'error': false, 'questions': questions }
		else
			render json: { 'error': false }
		end
	end
end
