function preload() {
	setupSound();
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

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);
	background(0, 100, 200);
	serial = new p5.SerialPort('138.251.255.67'); // make a new instance of the serialport library
	serial.on("list", printList); // set a callback function for the serialport list event
	serial.on("connected", serverConnected); // callback for connecting to the server
	serial.on("open", portOpen); // callback for the port opening
	serial.on("data", serialEvent); // callback for when new data arrives
	serial.on("error", serialError); // callback for errors
	serial.on("close", portClose); // callback for the port closing
	serial.list(); // list the serial ports
	serial.open(portName, ({baudRate: 115200})); // open a serial port
	// serial.list(); // list the serial ports
	playSound();
	setupUI();
}

function draw() {
	//background(0);
	//fill(255);
	//text("sensor value: " + inData, 30, 30);
	
}

// get the list of ports:
function printList(portList) {
	// portList is an array of serial port names
	for (var i = 0; i < portList.length; i++) {
		// Display the list the console:
		console.log(i + " " + portList[i]);
	}
}

function serverConnected() {
	console.log("connected to server.");
}

function portOpen() {
	console.log("the serial port opened.");
}

function serialEvent() {
	console.log("serial event")
	// read a string from the serial port:
	var inString = serial.readLine();
	console.log(inString)
	// check to see that there's actually a string there:
	let inarr = inString.split(":")
	if (inarr.length != 3) return

	if (updateOption(...inarr)) updateSound(...inarr)

}

let updateOption = (type, num, val) => limits[type].min <= val && limits[type].max >= val // check limits
										? options[type][num] = val || true // update and return true
										: false // don't update, return false

function serialError(err) {
	console.log("Something went wrong with the serial port. " + err);
}

function portClose() {
	console.log("The serial port closed.");
}

