require_relative './algos.rb'

class PaymentController < ApplicationController
	protect_from_forgery with: :null_session

	def index
	end

	def update
		label_info = ['name', 'number', 'exp_month', 'exp_year', 'cvc']
		label = {
			'name'=>'Name', 'number'=>'Number', 'exp_month'=>'Expiry month', 
			'exp_year'=>'Expiry year', 'cvc'=>'Security code'
		}

		userid = decrypt_id(params[:id])
		user = User.find_by_userid(userid)
		customerid = user.identity
		payment = JSON.parse(params[:payment])
		token = params[:token]
		invite_code = params[:invite_code]
		empty_card_value = false
		errormsg = ''

		label_info.each do |info|
			if payment[info] == '' && empty_card_value == false
				empty_card_value = true
				errormsg = label[info].to_s + ' cannot be empty'
			end
		end

		if empty_card_value == false
			if customerid == ''
				customer = Stripe::Customer.create({
					description: 'AfterClass Customer for ' + user.email,
					name: user.firstname + ' ' + user.lastname,
					email: user.email,
					source: token
				})

				Stripe::Subscription.create({
					customer: customer.id,
					items: [
						{
							plan: get_plan()
						}
					]
				})

				user.identity = customer.id
				user.save
			else
				Stripe::Customer.update(
					customerid,
					{
						source: token
					}
				)
			end

			# join questions if invite code is not null
			if !invite_code.nil?
				instructors = User.find_by_sql("SELECT * FROM users WHERE classes LIKE '%\"" + invite_code + "\"%'")

				if instructors.length > 0
					classes = JSON.parse(instructors[0].classes)

					classes.each do |class_info|
						if class_info['invite_code'] == invite_code
							class_info['joined_students'].push(userid)
						end
					end

					instructors[0].classes = classes.to_json
					instructors[0].save
				end
			end

			render json: { 'error': false, 'invite_code': invite_code }
		else
			render json: { 'error': true, 'errormsg': errormsg }
		end
	end

	def get_creditcard
		student = User.find_by_userid(decrypt_id(params[:userid]))

		customerid = student.identity
		payment_info = [
			'name', 'exp_month', 'exp_year', 'last4'
		]

		payment = {}

		payment_info.each do |info|
			payment[info] = ''
		end

		if customerid != ''
			customer = Stripe::Customer.retrieve(customerid)
			card = customer.sources.data[0]

			payment['currency'] = customer.currency

			payment_info.each do |info|
				payment[info] = card[info]
			end
		else
			payment['currency'] = 'cad'
		end

		render json: { 'error': false, 'payment': payment }
	end

	def toggle_subscription
		userid = decrypt_id(params[:userid])

		student = User.find_by_userid(userid)

		if !student.nil?
			instructors = User.find_by_sql("select classes from users where classes like '%" + userid + "%'")
		
			customerid = student.identity

			if customerid != ""
				customer = Stripe::Customer.retrieve(customerid)
				subscription_id = get_subscription_id(customer)

				if subscription_id != ""
					find = '"creatorid":"' + userid + '"'
					instructors = User.find_by_sql("select classes from users where classes like '%" + find + "%'")
					involved = false

					instructors.each do |instructor|
						classes = JSON.parse(instructor.classes)

						classes.each do |class_info|
							questions = class_info['questions']

							questions.each do |question|
								if question['creatorid'] == userid
									involved = true
								end
							end
						end
					end

					if involved == false
						Stripe::Subscription.delete(subscription_id)

						subscription = 'inactive'
					else
						subscription = 'involved'
					end
				else
					Stripe::Subscription.create({
						customer: customerid,
						items: [
							{
								plan: get_plan()
							}
						]
					})

					subscription = 'active'
				end
			else
				subscription = 'non'
			end

			render json: { 'error': false, 'subscription': subscription }
		else
			render json: { 'error': true }
		end	
	end

	def get_subscription_info
		user = User.find_by_userid(decrypt_id(params[:userid]))

		customerid = user.identity

		if customerid != ''
			customer = Stripe::Customer.retrieve(customerid)
			subscription_id = get_subscription_id(customer)

			user.identity = customer.id
		else
			subscription_id = ''
		end

		if customerid != ''
			if subscription_id != ''
				subscription = 'active'
			else
				subscription = 'inactive'
			end
		else
			subscription = 'non'
		end

		render json: { 'error': false, 'subscription': subscription }
	end

	def reset_everything
		Stripe.api_key = 'sk_test_lft1B76yZfF2oEtD5rI3y8dz'

		users = User.all

		users.each do |user|
			identity = user.identity

			if identity.include? "acct"
				Stripe::Account.delete(identity)
			end

			if identity.include? "cus"
				Stripe::Customer.delete(identity)
			end

			user.destroy
		end

		photos = Dir["public/profilepictures/*"]

		photos.each_with_index do |photo, index|
			photo_name = photo.sub! 'default.png', ''

			if photo_name != photo
				File.delete(photo)
			end
		end

		photos = Dir["public/profilepictures/*"]

		customers = Stripe::Customer.list(limit: 3)
		accounts = Stripe::Account.list(limit: 3)

		render json: { 'error': false, 'customers': customers, 'accounts': accounts, 'photos': photos }
	end
end
