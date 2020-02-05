Rails.application.routes.draw do
	get 'users/index'
	get 'users/policy'
	get 'users/terms'
	post 'questions/ask_instructor'
	post 'questions/get_question_info'
	post 'questions/delete_question'
	post 'questions/scale_vote'
	post 'questions/answer'
	post 'questions/remove_all_questions'
	get 'instructors/get_instructors'
	post 'instructors/search_instructors'
	post 'instructors/get_classes'
	post 'instructors/get_subjects'
	post 'instructors/join_qa'
	post 'instructors/get_earnings'

	resources :users, :verify, :instructors, :session, :accountsetup, :questions

	root 'users#index'
end
