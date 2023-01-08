import io from "socket.io-client";

const socket = io("ws://localhost:3001");
const gameSettings = {
	fps: 60,
	timePerTick: 0, //calculated in init
	backgroundColor: "#444444",
}

const canvas: HTMLCanvasElement = document.getElementById(
    "app"
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

canvas.width = window.document.documentElement.clientWidth - 4;
canvas.height = window.document.documentElement.clientHeight - 4;

socket.emit("init", {
	message:"Hello World! From the frontend!"
});
socket.on("welcome", (messageFromServer) => {
	console.log(messageFromServer.message);
});

function draw() {
	ctx.fillStyle = gameSettings.backgroundColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function init(){
	gameSettings.timePerTick = 1000 / gameSettings.fps;

	console.log("Game is ready 😊");
	setInterval(draw, gameSettings.timePerTick);
}

if (canvas.getContext("2d")) {
	init();
}