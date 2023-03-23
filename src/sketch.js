function preload() {}

let serial // variable to hold an instance of the serialport library
let portName
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

let limits = {
	d : {
		min : 0,
		max : 1,
		range : limits.d.max - limits.d.min
	},
	a : {
		min : 0,
		max : 9999,
		range : limits.a.max - limits.a.min
	}
}

function setup() {
	createCanvas(400, 400);
	background(0, 100, 200);
	serial = new p5.SerialPort(); // make a new instance of the serialport library
	serial.on("list", printList); // set a callback function for the serialport list event
	serial.on("connected", serverConnected); // callback for connecting to the server
	serial.on("open", portOpen); // callback for the port opening
	serial.on("data", serialEvent); // callback for when new data arrives
	serial.on("error", serialError); // callback for errors
	serial.on("close", portClose); // callback for the port closing
	serial.list(); // list the serial ports
	serial.open(portName); // open a serial port
	// serial.list(); // list the serial ports
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
	// read a string from the serial port:
	var inString = serial.readLine();
	// check to see that there's actually a string there:
	let inarr = inString.split(":")
	if (inarr.length() != 3) return

	if (updateOptions(...inarr)) updateSound(...inarr)

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

