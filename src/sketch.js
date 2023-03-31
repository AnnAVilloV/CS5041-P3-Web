var bgImage;
var jellyfish = {
	1:null,
	2:null,
	3:null,
	4:null,
}

function preload() {
	setupSound();
	bgImage = loadImage("../imgs/pexels-irina-iriser-1086584.jpg")
	for (let i = 1; i <= 4; i++)
		jellyfish[i] = loadImage("../imgs/jellyfish-" + i + ".png")
}

let serial // variable to hold an instance of the serialport library
let portName = "COM9"
let inData // for incoming serial data
let options = {
	d : {
		1 : 0,
		2 : 0,
		3 : 0,
		4 : 0
	},
	a : {
		1 : 5000,
		2 : 5000,
		3 : 5000
	}
}

let optionChanged = {
	d: {
		1: false,
		2: false,
		3: false,
		4: false
	},
	a: {
		1: false,
		2: false,
		3: false
	}
}

var inPort;
var outPort
var reader;
var inputDone;
var outputDone;
var inputStream;
var outputStream;

window.addEventListener("DOMContentLoaded", (event) => {
	// CODELAB: Add feature detection here.
	// const notSupported = document.getElementById('notSupported');
	// notSupported.classList.toggle('hidden', 'serial' in navigator);
	console.log("Serial is " + ('serial' in navigator ? '' : 'NOT ') + "supported")
});

let connectIn = async () => {
	inPort = await navigator.serial.requestPort()
	await inPort.open({baudRate: 115200})
	let decoder = new TextDecoderStream();
	inputDone = inPort.readable.pipeTo(decoder.writable);
	inputStream = decoder.readable
	  .pipeThrough(new TransformStream(new LineBreakTransformer()));
	readLoop()
}

let connectOut = async () => {
	outPort = await navigator.serial.requestPort()
	await outPort.open({baudRate: 9600})
	const encoder = new TextEncoderStream();
	outputDone = encoder.readable.pipeTo(outPort.writable);
	outputStream = encoder.writable;
	// writeToStream('\x03', 'echo(false);')
}

class LineBreakTransformer {
	constructor() {
	  // A container for holding stream data until a new line.
	  this.container = '';
	}

	transform(chunk, controller) {
		this.container += chunk;
		const lines = this.container.split('\r\n');
		this.container = lines.pop();
		lines.forEach(line => controller.enqueue(line));
	}

	flush(controller) {
		controller.enqueue(this.container);	
	}
}

async function readLoop() {
	// let decoder = new TextDecoderStream();
	// inputDone = port.readable.pipeTo(decoder.writable);
	// inputStream = decoder.readable;


	let reader = inputStream.getReader();
	
	while (true) {
		const { value, done } = await reader.read();
		if (value) {
			console.log(value)
			serialEvent(value)
			// if (outputStream) writeToStream(value)
		}
		if (done) {
		  console.log('[readLoop] DONE', done);
		  reader.releaseLock();
		  break;
		}
	}
}

async function writeToStream(...lines) {
	const writer = outputStream.getWriter();
	lines.forEach((line) => {
	console.log('[SEND]', line);
	writer.write(line + '\n');
	});
	writer.releaseLock();
}

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);
	background(0, 100, 200);
	// serial = new p5.SerialPort('138.251.255.67'); // make a new instance of the serialport library
	// serial.on("list", printList); // set a callback function for the serialport list event
	// serial.on("connected", serverConnected); // callback for connecting to the server
	// serial.on("open", portOpen); // callback for the port opening
	// serial.on("data", serialEvent); // callback for when new data arrives
	// serial.on("error", serialError); // callback for errors
	// serial.on("close", portClose); // callback for the port closing
	// serial.list(); // list the serial ports
	// serial.open(portName, ({baudRate: 115200})); // open a serial port
	// serial.list(); // list the serial ports
	playSound();
	setupUI();
}


let setFramesPerWrite = f => console.log("Set frames per write to " + (framesPerWrite = f))

let framesPerWrite = 5
var i = 0
function draw() {
	//background(0);
	//fill(255);
	//text("sensor value: " + inData, 30, 30);
	if (setupDone) {
		image(bgImage, 0, 0, window.innerWidth, window.innerHeight)
		noStroke()
		for (let i = 1; i <= 4; i++) {
			// fill(options.d[i] == 1 ? color('magenta') : color('blue'))
			// square(i % 2 * 50 + 100, i / 2 * 50 + 100, 50)
			if (options.d[i] == 1) image(jellyfish[i], 0, 0, window.innerWidth, window.innerHeight)
		}
	}

	if (i < framesPerWrite) i++
	else {
		i = 0
		if (outputStream) {
			lines = []
			Object.keys(options).forEach(key => {
				Object.keys(options[key]).forEach(num => {
					if (optionChanged[key][num]) lines.push(key + ":" + num + ":" + options[num][key])
					optionChanged[key][num] = false
				})
			})
			writeToStream(lines)
		}
	}
}

// // get the list of ports:
// function printList(portList) {
// 	// portList is an array of serial port names
// 	for (var i = 0; i < portList.length; i++) {
// 		// Display the list the console:
// 		console.log(i + " " + portList[i]);
// 	}
// }

// function serverConnected() {
// 	console.log("connected to server.");
// }

// function portOpen() {
// 	console.log("the serial port opened.");
// }

function serialEvent(message) {
	// console.log("serial event")
	// read a string from the serial port:
	// var inString = serial.readLine();
	// console.log(inString)
	// check to see that there's actually a string there:
	let inarr = message.split(":")
	if (inarr.length != 3) return

	if (checkInput(...inarr)) {
		updateSound[inarr[0]](inarr[1], inarr[2])
		options[inarr[0]][inarr[1]] = inarr[2]
		console.log(options[inarr[0]][inarr[1]])
		optionChanged[inarr[0]][inarr[1]] = true
	}
}

let checkInput = (type, num, val) => checkType(type) && checkNum(type, num) && checkVal(type, val)

let checkType = type => type == 'a' || type == 'd'

let checkNum = (type, num) => num >= nums[type].min && num <= nums[type].max

let checkVal = (type, val) => val >= limits[type].min && val <= limits[type].max

// function serialError(err) {
// 	console.log("Something went wrong with the serial port. " + err);
// }

// function portClose() {
// 	console.log("The serial port closed.");
// }

