var plug_boards = {
    "1":{
        'A':'7', 'C':'3', 'E':'0', 'D':'6', 'G':'8', 'F':'J', 'I':'1', 'K':'U', 'M':'H', 'L':'5', 'O':'4', 'Q':'P', '2':'Y', 'T':'N', 'V':'W', '9':'S', 'R':'X', 'Z':'B',
        'B':'Z', 'Y':'2', 'W':'V', 'P':'Q', 'H':'M', 'J':'F', 'S':'9', 'N':'T', '1':'I', '0':'E', '3':'C', 'U':'K', '4':'O', '7':'A', '6':'D', 'X':'R', '8':'G', '5':'L'
    },
    "2":{
        'A':'R', 'C':'O', 'E':'7', 'F':'J', 'I':'T', 'H':'2', 'K':'G', 'L':'5', 'N':'8', 'Q':'1', 'Y':'M', 'S':'Z', 'U':'6', '4':'0', 'W':'3', 'V':'P', '9':'B', 'X':'D',
        'B':'9', 'D':'X', 'G':'K', '0':'4', 'J':'F', 'M':'Y', 'O':'C', '1':'Q', 'P':'V', '3':'W', '2':'H', '5':'L', 'T':'I', '7':'E', '6':'U', '8':'N', 'R':'A', 'Z':'S'
    },
    "3":{
        'G':'O', 'D':'R', 'P':'4', 'F':'7', 'I':'K', 'J':'B', 'M':'X', 'L':'H', 'N':'V', '1':'6', '0':'A', 'S':'Q', 'U':'2', 'T':'Y', 'W':'9', '8':'Z', '5':'E', '3':'C',
        '2':'U', 'A':'0', 'C':'3', 'B':'J', 'E':'5', 'H':'L', 'K':'I', '6':'1', 'O':'G', 'Q':'S', '9':'W', 'R':'D', '4':'P', '7':'F', 'V':'N', 'Y':'T', 'X':'M', 'Z':'8'
    },
    "4":{
        'Z':'8', 'A':'I', 'C':'9', 'B':'P', 'E':'4', 'K':'G', '6':'J', 'M':'N', 'S':'T', 'O':'F', '3':'0', '2':'D', 'U':'7', 'W':'1', 'V':'L', 'Y':'H', 'X':'Q', '5':'R',
        'Q':'X', 'D':'2', 'G':'K', 'F':'O', 'I':'A', 'H':'Y', 'J':'6', '0':'3', 'L':'V', 'N':'M', '1':'W', 'P':'B', 'R':'5', '4':'E', '7':'U', '9':'C', '8':'Z', 'T':'S'
    },
    "5":{
        'A':'7', 'C':'H', 'B':'X', 'F':'1', 'K':'Z', 'J':'V', 'M':'P', 'O':'N', 'Q':'L', 'Y':'D', 'R':'G', 'U':'3', 'T':'0', 'W':'I', '6':'E', '9':'4', '8':'2', '5':'S',
        'S':'5', 'E':'6', 'D':'Y', 'G':'R', '0':'T', 'I':'W', 'H':'C', 'L':'Q', 'N':'O', '1':'F', 'P':'M', '3':'U', '2':'8', '4':'9', '7':'A', 'V':'J', 'X':'B', 'Z':'K'
    },
    "6":{
        'A':'F', 'C':'G', 'J':'B', '7':'5', 'I':'O', 'H':'Z', 'K':'2', 'V':'1', 'M':'3', '4':'E', 'Q':'X', '0':'P', 'R':'8', 'T':'Y', 'W':'U', '6':'S', '9':'L', 'D':'N',
        'B':'J', 'E':'4', 'G':'C', 'F':'A', '5':'7', 'S':'6', 'O':'I', 'N':'D', '1':'V', 'P':'0', '3':'M', '2':'K', 'U':'W', '8':'R', 'Y':'T', 'X':'Q', 'Z':'H', 'L':'9'
    }
}

var rotors = {
    "1":{
        'A':'Q', 'D':'U', 'G':'E', 'P':'I', 'H':'R', 'S':'M', 'L':'V', '1':'C', '0':'F', '3':'Z', '2':'W', '5':'O', '4':'N', '7':'B', '6':'X', '9':'J', '8':'K', 'T':'Y',
        'C':'1', 'B':'7', 'E':'G', 'F':'0', 'I':'P', 'K':'8', 'J':'9', 'M':'S', 'O':'5', 'N':'4', 'Q':'A', 'R':'H', 'U':'D', 'W':'2', 'V':'L', 'Y':'T', 'X':'6', 'Z':'3'
    },
    "2":{
        'D':'O', '4':'V', 'I':'C', 'H':'A', 'L':'K', 'N':'F', '1':'J', 'P':'9', '3':'G', '2':'Z', '5':'S', 'T':'Y', 'W':'Q', '6':'0', '7':'M', 'X':'R', 'U':'E', '8':'B',
        'A':'H', 'C':'I', 'B':'8', 'E':'U', '0':'6', 'G':'3', 'F':'N', 'K':'L', 'J':'1', 'M':'7', 'O':'D', 'Q':'W', 'Y':'T', 'S':'5', 'R':'X', 'V':'4', '9':'P', 'Z':'2'
    },
    "3":{
        'A':'Q', 'G':'U', 'I':'E', 'H':'B', 'K':'Z', 'V':'W', 'M':'0', 'L':'2', 'N':'F', '3':'6', 'R':'C', 'T':'5', '7':'9', '8':'P', 'Y':'D', 'X':'1', 'S':'O', '4':'J',
        '1':'X', 'C':'R', 'B':'H', 'E':'I', 'D':'Y', 'P':'8', 'F':'N', 'J':'4', 'O':'S', 'Q':'A', '0':'M', '2':'L', 'U':'G', 'W':'V', '6':'3', '9':'7', '5':'T', 'Z':'K'
    },
    "4":{
        'A':'5', 'B':'O', 'E':'2', 'D':'7', 'H':'I', 'K':'8', 'J':'Z', 'M':'Q', '3':'G', 'N':'R', '1':'V', 'P':'W', 'S':'0', 'U':'X', '4':'C', '9':'F', 'L':'6', 'T':'Y',
        'C':'4', 'W':'P', 'G':'3', 'F':'9', 'I':'H', 'V':'1', 'O':'B', 'X':'U', 'Q':'M', '0':'S', '2':'E', '5':'A', '7':'D', '6':'L', 'Y':'T', '8':'K', 'R':'N', 'Z':'J'
    },
    "5":{
        'A':'3', 'E':'5', 'G':'J', 'F':'N', 'I':'B', 'H':'D', 'K':'X', 'L':'C', 'O':'2', '1':'Q', '0':'6', 'S':'9', 'R':'W', 'U':'P', '4':'T', '7':'Y', '8':'M', 'Z':'V',
        '6':'0', 'C':'L', 'B':'I', 'Y':'7', 'D':'H', 'J':'G', 'M':'8', 'N':'F', 'Q':'1', 'P':'U', '3':'A', '2':'O', '5':'E', 'T':'4', 'W':'R', 'V':'Z', '9':'S', 'X':'K'
    },
    "6":{
        'E':'1', 'F':'0', 'H':'A', 'J':'V', 'M':'N', 'L':'7', 'O':'Z', 'Q':'6', 'P':'D', '3':'S', '2':'B', '5':'G', 'W':'U', '8':'C', '9':'4', 'X':'K', 'R':'T', 'Y':'I',
        'A':'H', 'C':'8', 'B':'2', 'D':'P', 'G':'5', 'I':'Y', 'K':'X', '6':'Q', 'N':'M', '1':'E', '0':'F', 'S':'3', 'U':'W', 'T':'R', '7':'L', 'V':'J', 'Z':'O', '4':'9'
    }
}

function encrypt_id(userid) {
	var pb_index = String(Math.floor((Math.random() * 6) + 1))
	var rotor_one_index = String(Math.floor((Math.random() * 6) + 1))
	var rotor_two_index = String(Math.floor((Math.random() * 6) + 1))

	while (rotor_one_index == rotor_two_index) {
		rotor_one_index = String(Math.floor((Math.random() * 6) + 1))
		rotor_two_index = String(Math.floor((Math.random() * 6) + 1))
	}

	var plug_board = plug_boards[pb_index]
	var rotor_one = rotors[rotor_one_index]
	var rotor_two = rotors[rotor_two_index]

	userid = userid.split('')

	userid.forEach(function (char, index) {
		userid[index] = plug_board[userid[index]]

		userid[index] = rotor_one[userid[index]]
        userid[index] = rotor_two[userid[index]]
        userid[index] = rotor_one[userid[index]]

        userid[index] = plug_board[userid[index]]
	})

	userid = userid.join('')

	return userid + pb_index + rotor_one_index + rotor_two_index
}

function decrypt_id(userid) {
	var pb_index = String(userid[userid.length - 3])
	var rotor_one_index = String(userid[userid.length - 2])
	var rotor_two_index = String(userid[userid.length - 1])

	var plug_board = plug_boards[pb_index]
	var rotor_one = rotors[rotor_one_index]
	var rotor_two = rotors[rotor_two_index]

	userid = userid.split('')

	userid.splice(userid.length - 1, 1)
	userid.splice(userid.length - 1, 1)
	userid.splice(userid.length - 1, 1)

	userid.forEach(function (char, index) {
		userid[index] = plug_board[userid[index]]

        userid[index] = rotor_one[userid[index]]
        userid[index] = rotor_two[userid[index]]
        userid[index] = rotor_one[userid[index]]

        userid[index] = plug_board[userid[index]]
	})

	userid = userid.join('')

	return userid
}

var test = true
var user_infos = {}

user_infos['firstname'] = test ? 'Kevin' : ''
user_infos['lastname'] = test ? 'Mai' : ''
user_infos['email'] = test ? 'kevin.mai.730@gmail.com' : ''
user_infos['password'] = test ? 'password' : ''
user_infos['confirmpassword'] = test ? 'confirmpassword' : ''

export { test, encrypt_id, decrypt_id, user_infos }
