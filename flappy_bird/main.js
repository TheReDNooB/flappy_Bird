//tablero
let tablero;
let ancho_tablero = 360;
let altura_tablero = 640;
let context;

//caracteristicas pajarito
let pajarito_ancho = 34;
let pajarito_altura = 24;
let pajaritox = ancho_tablero/8;
let pajaritoy = altura_tablero/2;
let pajarito_img;

let pajarito = {
	x : pajaritox,
	y : pajaritoy,
	width: pajarito_ancho,
	height: pajarito_altura,
}

//tuberias
let tuboarray = [];
let tubowidth = 64;
let tuboheight = 512;
let tubox = ancho_tablero;
let tuboy = 0;

let toptuboImg;
let bottomtuboImg;

//fisicas
let velocidadx = -2; //velocidad con la que se mueven los tubos
let velocidady = 0; //salto
let gravedad = 0.4;


let gameover = false;
let score = 0;

window.onload = function() {
	
	tablero = document.getElementById("tablero");
	tablero.height = altura_tablero;
	tablero.width = ancho_tablero;
	context = tablero.getContext("2d")


	//dibujo del pajarito
	//context.fillStyle = "yellow";
	//context.fillRect(pajarito.x, pajarito.y , pajarito.width, pajarito.height);


	//imagen del pajarito
	pajarito_img = new Image();
	pajarito_img.src = "./img/flappyBird.png";
	pajarito_img.onload = function() {
		context.drawImage(pajarito_img,pajarito.x, pajarito.y , pajarito.width, pajarito.height);		
	}


	toptuboImg = new Image();
	toptuboImg.src = "./img/tuberia.png";

	bottomtuboImg = new Image();
	bottomtuboImg.src = "./img/tuberia_abajo.png";

	
	requestAnimationFrame(update);
	setInterval(placetubo, 1500);
	document.addEventListener("keydown", movePajaro);
}

function update() {
	
	requestAnimationFrame(update);

	if (gameover) {
		return;
	}
	context.clearRect(0, 0, tablero.width, tablero.height);

	//pajarito update
	//pajarito.y = velocidady;
	velocidady += gravedad;
	pajarito.y = Math.max(pajarito.y + velocidady, 0);
	context.drawImage(pajarito_img, pajarito.x, pajarito.y , pajarito.width, pajarito.height);		

	if (pajarito.y > tablero.height) {
		gameover = true;
	}

	//spawn de los tubos 
	for (let i = 0; i < tuboarray.length; i++){
		let tubo = tuboarray[i];
		tubo.x += velocidadx;
		context.drawImage(tubo.img, tubo.x, tubo.y, tubo.width, tubo.height);		
	
		if (!tubo.passed && pajarito.x > tubo.x + tubo.width) {
			score += 0.5;
			tubo.passed = true;
		}

		if (colision(pajarito, tubo)){
			gameover = true;
		}

	}

	
	//limpiar tubos
	while (tuboarray.length > 0 && tuboarray[0].x < -tubowidth){
		tuboarray.shift();
	}

	//score
	context.fillStyle = "white";
	context.font = "45px sans-serif";
	context.fillText(score,5, 45);

	if (gameover) {
		context.fillText("Game Over", 5, 90);
	}
}

function placetubo(argument) {

	if (gameover) {
		return;
	}
	
	let randomtuboy = tuboy - tuboheight/4 - Math.random()*(tuboheight/2);
	let espaciomedia = tablero.height/4;

	let toptubo = {
		img : toptuboImg,
		x : tubox,
		y : randomtuboy,
		width : tubowidth,
		height : tuboheight,
		pasado : false

	}

	tuboarray.push(toptubo);

	let bottomtubo ={
		img : bottomtuboImg,
		x : tubox,
		y : randomtuboy + tuboheight + espaciomedia,
		width : tubowidth,
		height : tuboheight,
		pasado : false
	}

	tuboarray.push(bottomtubo);
}


function movePajaro(e) {
	if (e.code == "Space" || e.code == "ArrrowUp" || e.code == "KeyX") { //salto
		velocidady = -6;
	}

	if (gameover) {
		pajarito.y = pajaritoy;
		tuboarray = [];
		score = 0;
		gameover = false;
	}
}

//colision
function colision(a, b) {
	return  a.x < b.x + b.width &&
			a.x + a.width > b.x &&
			a.y < b.y + b.height &&
			a.y + a.height > b.y;
}