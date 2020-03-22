function getRoundData() {
	
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

let deck = [];

fetch('/initialize_deck').then((response) => {
	return response.json();
}).then((data) => {
	let cards = data.cards;
	const app = document.getElementById('app');
	
	for(let i = 0; i < cards.length; i++) {
		let element = document.createElement('p');
		element.innerHTML = cards[i];
		app.appendChild(element);
	}
});

let socket = io.connect('/');

console.log(socket);

socket.on('connection', (a) => console.log('a'));

socket.on('news', (data) => console.log(data));
socket.on('auth', (data) => {
	socket.emit('auth', {"name": getCookie("name")})
	console.log(data);
});

socket.on('new-round', (data) => {
	console.log(data);
});
