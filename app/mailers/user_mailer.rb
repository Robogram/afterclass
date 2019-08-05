class UserMailer < ApplicationMailer
	default from: 'admin@geottuse.com'

	def verify_user(user, verifycode)
		@user = user

        html = "<div style='background-color: #1169D9; border-radius: 5px; border-width: 0; width: 500px;'>"
		html += "<div style='padding: 10px 0; text-align: center;'><img style='height: 100px; width: 125px;' src='https://afterclass.geottuse.com/icon.png'></div>"
		html += "<div style='font-size: 20; font-weight: bold; padding: 10px 0; text-align: center;'>Welcome to AfterClass</div>"
		html += "<div style='font-weight: bold; padding: 10px 0; text-align: center;'>Hi, " + @user['firstname'] + " " + @user['lastname'] + "</div>"
		html += "<div style='font-size: 15px; font-weight: bold; margin: 0 auto; padding: 10px 0; text-align: center; width: 300px;'>Here is your verification code: " + verifycode + "</div>"
		html += "</div>"

		delivery_option = { address: 'smtp.zoho.com', user_name: 'admin@geottuse.com', password: 'timeandspace96', port: 465, tls: false, ssl: true }

		mail(to: @user['email'], body: html, content_type: "text/html", subject: 'AfterClass Verification E-mail', delivery_method_options: delivery_option)
	end
end
