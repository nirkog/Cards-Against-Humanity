const path = require('path');
const fs = require('fs');

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const express = require('express');
const app = express();
const port = 3000;

const server = app.listen(port);

const socketio = require('socket.io');

const io = socketio(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/static', express.static(__dirname + '/public'))

let playerSockets = [];

io.on('connection', (socket) => { 
	socket.emit('auth');
	
	socket.on('auth', (data) => {
		let socketObject = {"name": data.name, "socket": socket};

		if(players.indexOf(socketObject.name) != -1)
		{
			playerSockets.push(socketObject);
		}
	});
});

let admin = null;
let players = [];
let gameRunning = false;

let round = 0;
const maxRounds = 8;

const answerCardsFile = fs.readFileSync(path.join(__dirname + '/answer_cards.txt')).toString();
const questionCardsFile = fs.readFileSync(path.join(__dirname + '/question_cards.txt')).toString();

const answers = answerCardsFile.split('\n');
const questions = questionCardsFile.split('\n');

let cardCzar = null;
let questionCard = null;
let decks = [];
let free_cards = answers;
let free_question_cards = questions;
let used_question_cards = [];

function newRoundData() {
	let newCardCzar = players[Math.floor(Math.random() * players.length)];

	while(newCardCzar == cardCzar)
	{
		newCardCzar = players[Math.floor(Math.random() * players.length)];
	}

	let newQuestionCardIndex = Math.floor(Math.random() * free_question_cards.length);
	let newQuestionCard = free_question_cards[newQuestionCardIndex];
	free_question_cards.splice(newQuestionCardIndex, 1);
	used_question_cards.push(newQuestionCard);
}

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/join', (req, res) => {
	const name = req.body.name;
	let isAdmin = false;

	if(players.length == 0)
	{
		admin = name;
		isAdmin = true;
	}

	if(players.indexOf(name) != -1)
	{
		res.redirect('/');
		return;
	}

	players.push(name);

	res.cookie('name', name);
	res.cookie('admin', isAdmin);

	res.redirect('/lobby');
});

app.get('/lobby', (req, res) => {
	const name = req.cookies.name;
	const isAdmin = req.cookies.admin == 'true' ? true : false;

	if(isAdmin)
		res.sendFile(path.join(__dirname, '/public/admin_lobby.html'));
	else
		res.sendFile(path.join(__dirname, '/public/lobby.html'));
});

app.get('/game_status', (req, res) => {
	res.json({ running: gameRunning });
});

app.post('/start_game', (req, res) => {
	const name = req.cookies.name;
	const isAdmin = req.cookies.admin == 'true' ? true : false;

	/*
	 * NEEEDS
	 * TO
	 * CHANGE
	 */
	if(isAdmin || true)
	{
		gameRunning = true;
		newRoundData();
		res.redirect('/game');
	}
});

app.get('/game', (req, res) => {
	const name = req.cookies.name;

	if(players.indexOf(name) != -1 && gameRunning)
	{
		res.sendFile(path.join(__dirname, '/public/game.html'));
	}
});

app.get('/initialize_deck', (req, res) => {
	indices = [];
	cards = [];

	for(let i = 0; i < 10; i++)
	{
		let index = Math.floor(Math.random() * free_cards.length);
		while(indices.indexOf(index) != -1)
		{
			index = Math.floor(Math.random() * free_cards.length);
		}
		cards.push(free_cards[index]);
		free_cards.splice(index, 1);
	}

	const name = req.cookies.name;
	let deck = {"name": name, "cards": cards};

	decks.push(deck);

	res.json(deck);
});

//app.listen(port, console.log(`Listening on port ${port}!`));

