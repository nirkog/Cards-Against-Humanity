setInterval(() => {
	fetch('/game_status').then((response) => {
		return response.json();
	}).then((data) => { 
		const running = data.running; 

		if(running)
		{
			window.location.replace('/game');
		}
	});
}, 250);
