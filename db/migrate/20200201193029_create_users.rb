class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :userid
      t.string :firstname
      t.string :lastname
      t.string :email, limit: 40
      t.string :accounttype, limit: 7
      t.string :password, limit: 60
      t.string :profilepicture, limit: 60
      t.text :subjects
      t.text :classes
      t.text :schools

      t.timestamps
    end
  end
end
