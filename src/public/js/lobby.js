setInterval(() => {
	fetch('/game_status').then((response) => {
		return response.json();
	}).then((data) => { console.log(data.running); });
}, 250);
