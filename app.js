var context;
var shape = new Object();
var ghost1 = new Object();
var ghost2 = new Object();
var ghost3 = new Object();
var ghost4 = new Object();
var bonus = new Object();
var ghost1LastPosition = 0;
var ghost2LastPosition = 0;
var ghost3LastPosition = 0;
var ghost4LastPosition = 0;
var bonusLastPosition = 0;
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var rememberPositionX = 0.15;
var rememberPositionY = 1.85;
var life = 5;
var userName;
var BonusExist = true;
var takeMedicine = false;
var takeClock = false;
var timeOfGame;
var audio = new Audio('audio/background.mpeg');
var realNumOfBalls=0;
$(document).ready(function () {
	context = canvas.getContext("2d");
	init();


	jQuery.validator.addMethod("lettersonly", function (value, element) {
		return this.optional(element) || /^[a-z]+$/i.test(value);
	}, "Letters only please");

	jQuery.validator.addMethod("lettersAndNumbers", function (value, element) {
		return this.optional(element) || /[a-z].[0-9]|[0-9].[a-z]/i.test(value);
	}, "password must contain both numbers and letters please");

	$('#registerForm').validate({
		rules: {
			fullName: {
				required: true,
				lettersonly: true
			},
			regPassword: {
				required: true,
				minlength: 6,
				lettersAndNumbers: true
			},
			regUserName: {
				required: true,
			},
			Email: {
				required: true,
				email: true
			},
			date: {
				required: true,
			},

		},
		messages: {
			fullName: {
				required: "Please enter your name",
			},
			regPassword: {
				required: "please enter a valid password",
				minlength: "Your password most consist at least 6 characters"
			},
			regUserName: {
				required: "Please enter your user name",
			},
			Email: {
				required: "please enter a valid email",
			},
			date: {
				required: "Please enter your birthdate",
			}
		}
	})
	$('#btn').click(function () {
		if ($("#registerForm").valid()) {
			changeView(settings);
		}
	});
	$('#submitSettings').click(function () {
		(initGame());

	});
	$('#startNewGame').click(function () {
		window.clearInterval(interval);
		initGame();

	});

});

function Start(numOfBalls, timeOfGame, numOfMonsters, firstColor, secondColor, thirdColor, up,down, left, right) {
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = numOfBalls;
	var firstBall = Math.floor(food_remain * 0.6);
	var secondBall = Math.floor(food_remain * 0.3);
	var thirdBall = food_remain - firstBall - secondBall;
	var medicine;
	var clock;
	var finalScore = firstBall * 5 + secondBall * 15 + thirdBall * 25;
	var pacman_remain = 1;
	start_time = new Date();
	timeOfGame = timeOfGame;
	audio.play();

	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {

			if (
				(i == 1 && j == 1) ||
				(i == 7 && j == 0) ||
				(i == 7 && j == 1) ||
				(i == 2 && j == 8) ||
				(i == 2 && j == 9) ||
				(i == 7 && j == 8) ||
				(i == 8 && j == 8)
			) {
				board[i][j] = 4;
			}
			else if ((i == 4 && j == 2)) {
				board[i][j] = 3;
			}
			else if ((i == 8 && j == 9)) {
				board[i][j] = 12;
			}

			else {

				var randomNum = Math.random();
				if (randomNum <= (1.0 * firstBall) / cnt) {
					firstBall--;

					board[i][j] = 5;
				}
				else if (randomNum <= (1.0 * secondBall) / cnt) {
					secondBall--;
					board[i][j] = 6;
				}
				else if (randomNum <= (1.0 * thirdBall) / cnt) {
					thirdBall--;
					board[i][j] = 7;
				}
				else if (((i != 0 && j != 0) || (i != 9 && j != 9) || (i != 0 && j != 9) || (i != 9 && j != 0)) && randomNum < (1.0 * (pacman_remain * (firstBall + secondBall + thirdBall))) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				}
				else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	placeGhosts(numOfMonsters);
	board[5][5] = 1;
	bonus.i = 5;
	bonus.j = 5;


	while (firstBall > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 5;
		firstBall--;
	}
	while (secondBall > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 6;
		secondBall--;
	}
	while (thirdBall > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 7;
		thirdBall--;
	}
	keysDown = {};
	addEventListener(
		"keydown",
		function (e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function (e) {
			keysDown[e.keyCode] = false;
		},
		false
	);

	for(let i=0; i<10; i++){
		for(let j=0; j<10; j++){
			if(board[i][j]==5 ||board[i][j]==6||board[i][j]==7){
				realNumOfBalls++;
			}
		}
	}
	interval = setInterval(function () { UpdatePosition(timeOfGame, firstColor, secondColor, thirdColor, numOfMonsters, up, down, left, right); }, 150);

}

function placeGhosts(numOfMonsters) {

	if (numOfMonsters == 1) {
		board[0][0] = 8;
		ghost1.i = 0;
		ghost1.j = 0;

	}
	else if (numOfMonsters == 2) {
		board[0][0] = 8;
		board[9][9] = 9;
		ghost1.i = 0;
		ghost1.j = 0;
		ghost2.i = 9;
		ghost2.j = 9;
	}
	else if (numOfMonsters == 3) {
		board[0][0] = 8;
		board[9][9] = 9;
		board[0][9] = 10;
		ghost1.i = 0;
		ghost1.j = 0;
		ghost2.i = 9;
		ghost2.j = 9;
		ghost3.i = 0;
		ghost3.j = 9;
	}
	else {
		board[0][0] = 8;
		board[9][9] = 9;
		board[0][9] = 10;
		board[9][0] = 11;
		ghost1.i = 0;
		ghost1.j = 0;
		ghost2.i = 9;
		ghost2.j = 9;
		ghost3.i = 0;
		ghost3.j = 9;
		ghost4.i = 9;
		ghost4.j = 0;
	}
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function GetKeyPressed(up, down, left, right) {
	if (keysDown[up]) {
		return 1;
	}
	if (keysDown[down]) {
		return 2;
	}
	if (keysDown[left]) {
		return 3;
	}
	if (keysDown[right]) {
		return 4;
	}
}

function Draw(firstColor, secondColor, thirdColor, x) {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblLife.value = life;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) {
				context.beginPath();
				if (x == 1) {
					rememberPositionX = 1.75;
					rememberPositionY = 1.35;
					context.arc(center.x, center.y, 30, rememberPositionX * Math.PI, rememberPositionY * Math.PI); // half circle
				}
				else if (x == 2) {
					rememberPositionX = 0.65;
					rememberPositionY = 0.35;
					context.arc(center.x, center.y, 30, rememberPositionX * Math.PI, rememberPositionY * Math.PI); // half circle
				}
				else if (x == 3) {
					rememberPositionX = 1.25;
					rememberPositionY = 0.85;
					context.arc(center.x, center.y, 30, rememberPositionX * Math.PI, rememberPositionY * Math.PI); // half circle
				}
				else if (x == 4) {
					rememberPositionX = 0.15;
					rememberPositionY = 1.85;
					context.arc(center.x, center.y, 30, rememberPositionX * Math.PI, rememberPositionY * Math.PI); // half circle
				}
				else {
					context.arc(center.x, center.y, 30, rememberPositionX * Math.PI, rememberPositionY * Math.PI);
				}
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				if (rememberPositionX == 1.75) {
					context.arc(center.x - 10, center.y + 15, 5, 0, 2 * Math.PI); // circle
				} else {
					context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				}
				context.fillStyle = "black"; //color
				context.fill();
				/*
				if(x==1){
					context.rotate(20 * Math.PI / 180);
				}*/


			} else if (board[i][j] == 5) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = firstColor; //color
				context.fill();
			}
			else if (board[i][j] == 6) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = secondColor; //color
				context.fill();
			}
			else if (board[i][j] == 7) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = thirdColor; //color
				context.fill();
			} else if (board[i][j] == 4) {
				let image = new Image();
				image.src = "imgs/wall.png";
				context.drawImage(image, center.x - 30, center.y - 30, 60, 60);
			}
			else if (board[i][j] == 8) {
				let image = new Image();
				image.src = "imgs/red.png";
				context.drawImage(image, center.x - 25, center.y - 25, 50, 50);
			}
			else if (board[i][j] == 9) {
				let image = new Image();
				image.src = "imgs/blue.png";
				context.drawImage(image, center.x - 25, center.y - 25, 50, 50);
			}
			else if (board[i][j] == 10) {
				let image = new Image();
				image.src = "imgs/pink.png";
				context.drawImage(image, center.x - 25, center.y - 25, 50, 50);
			}
			else if (board[i][j] == 11) {
				let image = new Image();
				image.src = "imgs/orange.png";
				context.drawImage(image, center.x - 25, center.y - 25, 50, 50);
			}
			else if (board[i][j] == 1) {
				let image = new Image();
				image.src = "imgs/bonus.png";
				context.drawImage(image, center.x - 25, center.y - 25, 50, 50);
			}
			else if (board[i][j] == 3) {
				let image = new Image();
				image.src = "imgs/life.png";
				context.drawImage(image, center.x - 25, center.y - 25, 50, 50);
			}
			else if (board[i][j] == 12) {
				let image = new Image();
				image.src = "imgs/clock.png";
				context.drawImage(image, center.x - 25, center.y - 25, 50, 50);
			}
		}
	}
}

function UpdatePosition(timeOfGame, firstColor, secondColor, thirdColor, numOfMonsters, up, down, left, right) {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed(up, down, left, right);
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	checkGhostsColission(numOfMonsters);
	if (BonusExist == true) {
		checkBonusColission();
	}
	checkColission();

	if (Math.random() > 0.7 && BonusExist == true) {
		board[bonus.i][bonus.j] = bonusLastPosition;
		updateBonusPosition();
		bonusLastPosition = board[bonus.i][bonus.j];
		board[bonus.i][bonus.j] = 1;

	}


	if (numOfMonsters == 1) {
		if (Math.random() > 0.7) {
			board[ghost1.i][ghost1.j] = ghost1LastPosition;
			updateGhostPosition(ghost1);
			ghost1LastPosition = board[ghost1.i][ghost1.j];
			board[ghost1.i][ghost1.j] = 8;

		}
	}
	else if (numOfMonsters == 2) {
		if (Math.random() > 0.7) {
			board[ghost1.i][ghost1.j] = ghost1LastPosition;
			updateGhostPosition(ghost1);
			ghost1LastPosition = board[ghost1.i][ghost1.j];
			board[ghost1.i][ghost1.j] = 8;
			board[ghost2.i][ghost2.j] = ghost2LastPosition;
			updateGhostPosition(ghost2);
			ghost2LastPosition = board[ghost2.i][ghost2.j];
			board[ghost2.i][ghost2.j] = 9;
		}
	}
	else if (numOfMonsters == 3) {
		if (Math.random() > 0.7) {
			board[ghost1.i][ghost1.j] = ghost1LastPosition;
			updateGhostPosition(ghost1);
			ghost1LastPosition = board[ghost1.i][ghost1.j];
			board[ghost1.i][ghost1.j] = 8;
			board[ghost2.i][ghost2.j] = ghost2LastPosition;
			updateGhostPosition(ghost2);
			ghost2LastPosition = board[ghost2.i][ghost2.j];
			board[ghost2.i][ghost2.j] = 9;
			board[ghost3.i][ghost3.j] = ghost3LastPosition;
			updateGhostPosition(ghost3);
			ghost3LastPosition = board[ghost3.i][ghost3.j];
			board[ghost3.i][ghost3.j] = 10;
		}
	}
	else if (numOfMonsters == 4) {
		if (Math.random() > 0.7) {
			board[ghost1.i][ghost1.j] = ghost1LastPosition;
			updateGhostPosition(ghost1);
			ghost1LastPosition = board[ghost1.i][ghost1.j];
			board[ghost1.i][ghost1.j] = 8;
			board[ghost2.i][ghost2.j] = ghost2LastPosition;
			updateGhostPosition(ghost2);
			ghost2LastPosition = board[ghost2.i][ghost2.j];
			board[ghost2.i][ghost2.j] = 9;
			board[ghost3.i][ghost3.j] = ghost3LastPosition;
			updateGhostPosition(ghost3);
			ghost3LastPosition = board[ghost3.i][ghost3.j];
			board[ghost3.i][ghost3.j] = 10;
			board[ghost4.i][ghost4.j] = ghost4LastPosition;
			updateGhostPosition(ghost4);
			ghost4LastPosition = board[ghost4.i][ghost4.j];
			board[ghost4.i][ghost4.j] = 11;
		}
	}
	if (board[shape.i][shape.j] == 5) {
		score += 5;
		realNumOfBalls--;
	}
	if (board[shape.i][shape.j] == 6) {
		score += 15;
		realNumOfBalls--;
	}
	if (board[shape.i][shape.j] == 7) {
		score += 25;
		realNumOfBalls--;
	}


	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (takeClock) {

		if (time_elapsed > timeOfGame + 30) {
			window.clearInterval(interval);
			if (score < 100) {
				alert("You are better than " + score + " points!");
			}
			else {
				alert("Winner!!!");
				audio.pause();
				window.clearInterval(interval);
			}
		}
	}
	else {
		if (time_elapsed > timeOfGame) {
			window.clearInterval(interval);
			if (score < 100) {
				alert("You are better than " + score + " points!");
			}
			else {
				alert("Winner!!!");
				audio.pause();
				window.clearInterval(interval);
			}
		}
	}

	if (realNumOfBalls<=0) {
		window.clearInterval(interval);
		window.alert("Winner!!!");
	} else {
		Draw(firstColor, secondColor, thirdColor, x);
	}
}

function checkColission() {
	if (shape.i == 4 && shape.j == 2 && takeMedicine == false) {
		life++;
		takeMedicine = true;
	}
	if (shape.i == 8 && shape.j == 9 && takeClock == false) {
		timeOfGame += 30;
		lblTime.value = timeOfGame;
		document.getElementById('lblFullTime').innerHTML = "Time Of Game: " + timeOfGame;
		takeClock = true;
	}
}
function checkBonusColission() {
	if (board[shape.i][shape.j] == board[bonus.i][bonus.j]) {
		board[bonus.i][bonus.j] = 0;
		score += 50;
		BonusExist = false;
	}
}
function checkGhostsColission(numOfMonsters) {
	let ans = false;
	if (numOfMonsters == 1) {
		if (board[shape.i][shape.j] == board[ghost1.i][ghost1.j]) {
			board[ghost1.i][ghost1.j] = 0;
			ans = true;
		}
	}
	else if (numOfMonsters == 2) {
		if (board[shape.i][shape.j] == board[ghost1.i][ghost1.j] ||
			board[shape.i][shape.j] == board[ghost2.i][ghost2.j]) {
			board[ghost1.i][ghost1.j] = 0;
			board[ghost2.i][ghost2.j] = 0;
			ans = true;
		}
	}
	else if (numOfMonsters == 3) {
		if (board[shape.i][shape.j] == board[ghost1.i][ghost1.j] ||
			board[shape.i][shape.j] == board[ghost2.i][ghost2.j] ||
			board[shape.i][shape.j] == board[ghost3.i][ghost3.j]) {
			board[ghost1.i][ghost1.j] = 0;
			board[ghost2.i][ghost2.j] = 0;
			board[ghost3.i][ghost3.j] = 0;
			ans = true;
		}
	}
	else if (numOfMonsters == 4) {
		if (board[shape.i][shape.j] == board[ghost1.i][ghost1.j] ||
			board[shape.i][shape.j] == board[ghost2.i][ghost2.j] ||
			board[shape.i][shape.j] == board[ghost3.i][ghost3.j] ||
			board[shape.i][shape.j] == board[ghost4.i][ghost4.j]) {
			board[ghost1.i][ghost1.j] = 0;
			board[ghost2.i][ghost2.j] = 0;
			board[ghost3.i][ghost3.j] = 0;
			board[ghost4.i][ghost4.j] = 0;

			ans = true;
		}
	}
	if (ans == true) {
		life--;
		score -= 10;
		if (life == 0) {
			alert("Loser!");
			audio.pause();
			window.clearInterval(interval);
		}
		placePacman();
		placeGhosts(numOfMonsters);

	}
	return ans;
}

function placePacman() {
	var x = Math.floor(Math.random() * 10);
	var y = Math.floor(Math.random() * 10);
	while ((x == 0 && y == 0) || (x == 9 && y == 9) || (x == 0 && y == 9) || (x == 9 && y == 0) || (board[x][y] == 4)) {
		x = Math.floor(Math.random() * 10);
		y = Math.floor(Math.random() * 10);
	}
	shape.i = x;
	shape.j = y;
	board[x][y] = 2;

}

function updateBonusPosition() {
	var x = Math.floor(Math.random() * 4);
	if (x == 0 && bonus.i + 1 < 10 && (board[bonus.i + 1][bonus.j] == 0 || (board[bonus.i + 1][bonus.j] == 5) ||
		(board[bonus.i + 1][bonus.j] == 6) || (board[bonus.i + 1][bonus.j] == 7))) {
		bonus.i++;
	}
	else if (x == 1 && bonus.i - 1 >= 0 && (board[bonus.i - 1][bonus.j] == 0 ||
		(board[bonus.i - 1][bonus.j] == 5) || (board[bonus.i - 1][bonus.j] == 6) ||
		(board[bonus.i - 1][bonus.j] == 7))) {
		bonus.i--;
	}
	else if (x == 2 && bonus.j + 1 < 10 && (board[bonus.i][bonus.j + 1] == 0 ||
		(board[bonus.i][bonus.j + 1] == 5) || (board[bonus.i][bonus.j + 1] == 6) ||
		(board[bonus.i][bonus.j + 1] == 7))) {
		bonus.j++;
	}
	else if (x == 3 && bonus.j - 1 >= 0 && (board[bonus.i][bonus.j - 1] == 0 ||
		(board[bonus.i][bonus.j - 1] == 5) || (board[bonus.i][bonus.j - 1] == 6) ||
		(board[bonus.i][bonus.j - 1] == 7))) {
		bonus.j--;
	}
}

function updateGhostPosition(ghost) {
	let minDistance = 20;
	let move = null;
	if (ghost.i - 1 >= 0 && (board[ghost.i - 1][ghost.j] == 0 ||
		board[ghost.i - 1][ghost.j] == 5 || board[ghost.i - 1][ghost.j] == 6 || board[ghost.i - 1][ghost.j] == 7)) {
		if (minDistance > (Math.abs(shape.i - (ghost.i - 1)) + Math.abs(shape.j - ghost.j))) {
			minDistance = Math.abs(shape.i - (ghost.i - 1)) + Math.abs(shape.j - ghost.j);
			move = "up";
		}
	}
	if (ghost.i + 1 < 10 && (board[ghost.i + 1][ghost.j] == 0 ||
		board[ghost.i + 1][ghost.j] == 5 || board[ghost.i + 1][ghost.j] == 6 || board[ghost.i + 1][ghost.j] == 7)) {
		if (minDistance > (Math.abs(shape.i - (ghost.i + 1)) + Math.abs(shape.j - ghost.j))) {
			minDistance = Math.abs(shape.i - (ghost.i + 1)) + Math.abs(shape.j - ghost.j);
			move = "down";
		}
	}
	if (ghost.j - 1 >= 0 && (board[ghost.i][ghost.j - 1] == 0 ||
		board[ghost.i][ghost.j - 1] == 5 || board[ghost.i][ghost.j - 1] == 6 || board[ghost.i][ghost.j - 1] == 7)) {
		if (minDistance > (Math.abs(shape.i - ghost.i) + Math.abs(shape.j - (ghost.j - 1)))) {
			minDistance = Math.abs(shape.i - ghost.i) + Math.abs(shape.j - (ghost.j - 1));
			move = "left";
		}
	}
	if (ghost.j + 1 < 10 && (board[ghost.i][ghost.j + 1] == 0 ||
		board[ghost.i][ghost.j + 1] == 5 || board[ghost.i][ghost.j + 1] == 6 || board[ghost.i][ghost.j + 1] == 7)) {
		if (minDistance > (Math.abs(shape.i - ghost.i) + Math.abs(shape.j - (ghost.j + 1)))) {
			minDistance = Math.abs(shape.i - ghost.i) + Math.abs(shape.j - (ghost.j + 1));
			move = "right";
		}
	}
	if (move == "up") {
		ghost.i--;
	}
	else if (move == "down") {
		ghost.i++;
	}
	else if (move == "left") {
		ghost.j--;
	}
	else if (move == "right") {
		ghost.j++;
	}


}
/********************logIn***************************/

var userName = document.getElementById('userName');
var password = document.getElementById('password');

// storing input from register-form
/*
function checkReg(){
	var userName = document.getElementById('userName');
	var userPw = document.getElementById('password');
	var storedPw = localStorage.getItem(userName.value);

	// check if stored data from register-form is equal to data from login form
	if (storedPw.value==null) {
		store();
		alert('registration sseccesful!');
	} 
	else {
		alert('there is already same user name in the system, choose diffrent user name');
	}
}
*/

function store() {
	validate1();
	userName = $("#regUserName").val();
	var userPw = $("#regPassword").val();
	localStorage.setItem(userName, userPw);///maybe value???
	alert('registration seccesful!');
	//changeView(settings);

}



// check if stored data from register-form is equal to entered data in the   login-form
function check() {

	// entered data from the login-form
	userName = document.getElementById('userName');
	var userPw = document.getElementById('password');
	var storedPw = localStorage.getItem(userName.value);

	// check if stored data from register-form is equal to data from login form
	if (userPw.value == storedPw) {
		alert('You are loged in!');
		return true;
		//Game();
	} else {
		alert('user name not exist!');
		return false;
	}
}

function init() {
	localStorage.setItem("p", "p");
}

function changeView(pageName) {
	if (pageName == login) {
		$("#welcome").hide();
		$("#login").show();
		$("#register").hide();
		$("#about").hide();
		$("#settings").hide();
		$("#Game").hide();


	}
	else if (pageName == welcome) {
		$("#welcome").show();
		$("#login").hide();
		$("#register").hide();
		$("#about").hide();
		$("#settings").hide();
		$("#Game").hide();


	}
	else if (pageName == register) {
		$("#welcome").hide();
		$("#login").hide();
		$("#register").show();
		$("#about").hide();
		$("#settings").hide();
		$("#Game").hide();

	}
	else if (pageName == settings) {
		$("#welcome").hide();
		$("#login").hide();
		$("#register").hide();
		$("#about").hide();
		$("#settings").show();
		$("#Game").hide();

	}
	else if (pageName == Game) {
		$("#welcome").hide();
		$("#login").hide();
		$("#register").hide();
		$("#about").hide();
		$("#settings").hide();
		$("#Game").show();

	}
}

function checkHTML() {
	var answer = check();
	if (answer == true) {
		changeView(settings);
	}
}

function randomSettings() {
	var numOfBalls = Math.floor(Math.random() * 41) + 50;
	$("#numberOfBalls").val(numOfBalls);
	var timeOfGame = Math.floor(Math.random() * 61) + 60;
	$("#timeOfGame").val(timeOfGame);
	var numOfMonsters = Math.floor(Math.random() * 4) + 1;
	$("#numberOfMonsters").val(numOfMonsters);
	var firstColor = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
	$("#firstBallColor").val(firstColor);
	var secondColor = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
	$("#secondBallColor").val(secondColor);
	var thirdColor = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
	$("#thirdBallColor").val(thirdColor);
}


function uniKeyCode(event) {
	var up = event.keyCode;
	$("#upBotton").val(up);
}

function initGame() {
	//await new Promise(r => setTimeout(r,2000));
	life = 5;
	changeView(Game);
	let up = $("#upBotton").val();
	if (up == "") {
		up = "38";
	} else {
		up = up.toUpperCase().charCodeAt(0);
	}
	let down = $("#downBotton").val();
	if (down == "") {
		down = "40";
	} else {
		down = down.toUpperCase().charCodeAt(0);
	}
	let left = $("#leftBotton").val();
	if (left == "") {
		left = "37";
	} else {
		left = left.toUpperCase().charCodeAt(0);
	}
	let right = $("#rightBotton").val();
	if (right == "") {
		right = "39";
	} else {
		right = right.toUpperCase().charCodeAt(0);
	}

	var upChar = $("#upBotton").val();
	if(upChar==""){
		upChar="UP arrow"
	}
	else{
		lblUp.value = upChar;
	}
	document.getElementById('lblUp').innerHTML = "Up Key: " + upChar;
	
	var downChar = $("#downBotton").val();
	if(downChar==""){
		downChar="DOWN arrow"
	}
	else{
		lblDown.value = downChar;
	}
	document.getElementById('lblDown').innerHTML = "Down Key: " + downChar;

	var leftChar = $("#leftBotton").val();
	if(leftChar==""){
		leftChar="LEFT arrow"
	}
	else{
		lblLeft.value = leftChar;
	}
	document.getElementById('lblLeft').innerHTML = "Left Key: " + leftChar;

	var rightChar = $("#rightBotton").val();
	if(rightChar==""){
		rightChar="RIGHT arrow"
	}
	else{
		lblRight.value = rightChar;
	}
	document.getElementById('lblRight').innerHTML = "Right Key: " + rightChar;

	var numOfBalls = $("#numberOfBalls").val();
	lblNumOfBalls.value = numOfBalls;
	document.getElementById('lblNumOfBalls').innerHTML = "Number Of Balls: " + numOfBalls;
	timeOfGame = parseInt($("#timeOfGame").val());
	lblTime.value = timeOfGame;
	document.getElementById('lblFullTime').innerHTML = "Time Of Game: " + timeOfGame;
	var numOfMonsters = $("#numberOfMonsters").val();
	lblMonsters.value = numOfMonsters;
	document.getElementById('lblMonsters').innerHTML = "Number Of Ghosts: " + numOfMonsters;
	var firstColor = $("#firstBallColor").val();
	lblFirstBallColor.value = firstColor;
	document.getElementById('lblFirstBallColor').innerHTML = "Low Score Ball Color: " + firstColor;
	var secondColor = $("#secondBallColor").val();
	lblSecondBallColor.value = secondColor;
	document.getElementById('lblSecondBallColor').innerHTML = "Medium Score Ball Color: " + secondColor;
	var thirdColor = $("#thirdBallColor").val();
	lblThirdBallColor.value = thirdColor;
	document.getElementById('lblThirdBallColor').innerHTML = "High Score Ball Color: " + thirdColor;
	lblUserName.value = userName;
	document.getElementById('lblUserName').innerHTML = "User Name: " + userName.value;
	Start(numOfBalls, timeOfGame, numOfMonsters, firstColor, secondColor, thirdColor,up,down,left,right);

}



