const path = require('path');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/static', express.static(__dirname + '/public'))

let admin = null;
let players = [];
let gameRunning = false;

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
		res.send('התחיל!');
	}
});

app.listen(port, console.log(`Listening on port ${port}!`));


