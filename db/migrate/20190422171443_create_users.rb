class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :userid, limit: 20
      t.string :firstname, limit: 20
      t.string :lastname, limit: 20
      t.string :email, limit: 40
      t.string :accounttype, limit: 7
      t.string :password, limit: 60
      t.string :profilepicture, limit: 60
      t.text :subjects
      t.text :classes
      t.text :schools
      t.string :identity, limit: 25
      t.string :earnings, limit: 5
      t.string :transfertime, limit: 15

      t.timestamps
    end
  end
end
