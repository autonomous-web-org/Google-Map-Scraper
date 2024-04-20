let animationCont, canvas, ctx;
let store = [], storeMouse = [], animationID;
let n = 2, distance = 50, inter;

class Particles {
	constructor(x, y, radii) {
		this.x = x;
		this.y = y;
		this.r = radii;
		this.opacity = 1;
		this.spd = 1;
	}
	draw(op) {
		ctx.beginPath();
		ctx.strokeStyle = `rgba(150,150,150,${op})`;
		ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
		ctx.stroke();
		ctx.closePath();
	}
	update() {
		this.r += this.spd;
		this.opacity -= 0.01;

		if(this.opacity < -1) {
			for (var i = store.length - 1; i >= 0; i--) {
				let z = store[i];
				if (z==this) {
					store.splice(i,1);
					if(store.length <= 1) create();
				}
			}
		}
		this.draw(this.opacity);
	}
	updateMouse() {
		this.r += this.spd;
		this.opacity -= 0.04;

		if(this.opacity < -1) {
			for (var i = storeMouse.length - 1; i >= 0; i--) {
				let z = storeMouse[i];
				if (z==this) {
					storeMouse.splice(i,1);
				}
			}
		}
		this.draw(this.opacity);
	}
}


function create(callback) {
	if (inter) clearInterval(inter);
	let i = 0;
	inter = setInterval(()=>{
		let x = canvas.width/2;
		let y = canvas.height/2;
		store.push(new Particles(x, y, i*0.2));
		i++;
		if(i >= 2) clearInterval(inter);
	}, 700);

	if(callback) callback();
}
function createMouse(x, y) {
	storeMouse.push(new Particles(x, y, 2));
}
function animation() {
	ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
	ctx.clearRect(0,0,canvas.width,canvas.height);
	store.forEach(z=> {z.update()});
	storeMouse.forEach(z=> {z.updateMouse()});
	canvas.style.cursor = "none";
	animationID = requestAnimationFrame(animation);
}

function mapAnimationStart() {
	animationCont = document.querySelector(".animation-cont");
	canvas = document.querySelector("#canvas");
	ctx = canvas.getContext("2d");
	store = [], storeMouse = [], animationID;
	n = 2, distance = 50, inter;

	//canvas.height *= 1.5;
	animationCont.style.animationPlayState = "running";

	canvas.addEventListener("mousemove", (e) => {
		const rect = canvas.getBoundingClientRect();
		const elementRelativeX = e.clientX - rect.left;
		const elementRelativeY = e.clientY - rect.top;
		const canvasRelativeX = elementRelativeX * canvas.width / rect.width;
		const canvasRelativeY = elementRelativeY * canvas.height / rect.height;

		createMouse(canvasRelativeX,canvasRelativeY);
	});
	create(animation);
}
function mapAnimationStop() {
	cancelAnimationFrame(animationID);  //stop canvas
	
	store.length = 0;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	animationCont.style.animationPlayState = "paused";
	canvas.style.cursor = "initial";
}
