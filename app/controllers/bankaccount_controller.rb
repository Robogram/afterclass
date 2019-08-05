require_relative './algos.rb'

class BankaccountController < ApplicationController
	protect_from_forgery with: :null_session

	def index
	end

	def update
		label_info = ['account_holder_name', 'account_number']
		label = {'account_holder_name'=>'Account holder name', 'account_number'=>'Account number'}

		bankaccount = JSON.parse(params[:bankaccount])
		timestamp = params[:timestamp]
		token = params[:token]
		empty_value = false
		errormsg = ''

		label_info.each do |info|
			if bankaccount['country'] == 'CA' and $test_key = false
				if bankaccount['institution_number'] == '' && empty_value == false
					empty_value = true
					errormsg = 'Institution number cannot be empty'
				end

				if bankaccount['transit_number'] == '' && empty_value == false
					empty_value = true
					errormsg = 'Transit number cannot be empty'
				end
			end

			if bankaccount[info] == '' && empty_value == false
				empty_value = true
				errormsg = label[info].to_s + ' cannot be empty'
			end
		end

		if token != '' && !empty_value
			user = User.find_by_userid(decrypt_id(params[:id]))
			firstname = user.firstname
			lastname = user.lastname
			email = user.email
			accountid = user.identity
			requested_capabilities = bankaccount['address_country'] == 'US' ? ["card_payments"] : []

			if accountid == ''
				date = Time.new
				transfertime = date.to_i

				day = date.day.to_i
				month = date.month.to_i

				account = Stripe::Account.create({
					type: 'custom',
					country: bankaccount['country'],
					email: email,
					requested_capabilities: requested_capabilities,
					business_type: 'individual',
					external_account: token,
					individual: {
						'address': {
							'line1': 'address_line1',
							'city': 'address_city',
							'state': 'ON',
							'postal_code': 'M4M4M4'
						},
						'dob': {
							'day': day,
							'month': month,
							'year': 1990
						},
						'first_name': 'AfterClass: ',
						'last_name': firstname + ' ' + lastname
					},
					tos_acceptance: {
						'date': timestamp,
						'ip': '165.227.41.73'
					}
				})

				user.identity = account.id
				user.transfertime = transfertime.to_s
				user.save
			else
				Stripe::Account.update(
					accountid,
					{
						external_account: token,
					}
				)
			end

			render json: { 'error': false, 'identity': user.identity }
		else
			if empty_value == true
				render json: { 'error': true, 'errormsg': errormsg }
			else
				render json: { 'error': true, 'errormsg': 'Bank account is invalid. Please check again' }
			end
		end
	end

	def get_bankaccount_info
		user = User.find_by_userid(decrypt_id(params[:userid]))

		accountid = user.identity

		bank_info = [
			'country', 'currency', 'account_holder_type', 'account_holder_name', 
			'last4', 'routing_number'
		]

		payment = {}

		bank_info.each do |info|
			payment[info] = ''
		end

		if accountid != ''
			account = Stripe::Account.retrieve(accountid)
			account_info = account.external_accounts.data[0]

			bank_info.each do |info|
				payment[info] = account_info[info]
			end

			if payment['country'] == 'CA'
				routing_number = payment['routing_number'][1..(payment['routing_number'].length - 1)].split('-')

				payment['institution_number'] = routing_number[0]
				payment['transit_number'] = routing_number[1]
			end
		else
			payment['account_holder_type'] = 'individual'
			payment['currency'] = 'cad'
			payment['country'] = 'CA'
		end

		render json: { 'error': false, 'payment': payment }
	end

	def transfer
		user = User.find_by_userid(decrypt_id(params[:userid]))

		earnings = user.earnings.to_i * 100
		identity = user.identity

		balance = Stripe::Balance.retrieve()

		amount = balance.available[0].amount.to_i

		if (earnings > 0) && (amount > earnings) && (identity != '')
			Stripe::Transfer.create({
				amount: earnings,
				currency: 'cad',
				destination: identity,
			})

			user.identity = '0'
			user.save

			return render json: { 'error': false, 'payouts': true }
		else
			return render json: { 'error': false }
		end
	end

	def pay_instructors
		time = Time.new.to_i

		sql = "select userid, classes, earnings, transfertime from users where (" + time.to_s + " - transfertime) > 2627999"

		users = User.find_by_sql(sql)
		numanswered = 0

		users.each do |user|
			numanswered = 0
			userid = user.userid
			transfertime = user.transfertime.to_i + 2628000
			earnings = user.earnings.to_i
			classes = JSON.parse(user.classes)

			classes.each do |class_info|
				questions = class_info['questions']

				questions.each do |question|
					answers = question['answers']

					answers.each do |answer|
						if (time - answer['timeanswered'].to_i) < 2628000
							numanswered += 1
						end
					end
				end
			end

			if numanswered > 0
				earnings += 1
			end

			user.transfertime = transfertime.to_s
			user.earnings = earnings.to_s
			user.save
		end

		return render json: { 'error': false }
	end
end
