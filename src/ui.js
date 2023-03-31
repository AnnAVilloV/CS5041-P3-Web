
let inputs = {
    a : {
        1 : null,
        2 : null,
        3 : null
    },
    d : {
        1 : null,
        2 : null,
        3 : null,
        4 : null,
    },
    button: {
        in: null,
        out: null,
        done: null,
    }
}

let outSpeedSlider = null

function setupUI() {
    inputs.a[1] = createAnalogueSlider(100, 100, 1)
    inputs.a[2] = createAnalogueSlider(100, 200, 2)
    inputs.a[3] = createAnalogueSlider(100, 300, 3)
    inputs.d[1] = createDigitalToggle(300, 100, 1)
    inputs.d[2] = createDigitalToggle(300, 200, 2)
    inputs.d[3] = createDigitalToggle(300, 300, 3)
    inputs.d[4] = createDigitalToggle(300, 400, 4)
	inputs.button.in = makeButton("Set In Port", 100, connectIn)
	inputs.button.out = makeButton("Set Out Port", 200, connectOut)
	inputs.button.done = makeButton("Finish Setup", 300, switchUI)
    outSpeedSlider = createSlider(0, 60, 5, 1)
    outSpeedSlider.position(500, 50)
    outSpeedSlider.input(() => setFramesPerWrite(outSpeedSlider.value()))
}

function makeButton(label, yPos, callback) {
    let button = createButton(label)
    button.position(500, yPos)
    button.size(100, 50)
    button.mousePressed(callback)
    return button
}

let setupDone = false;
function switchUI() {
    // Object.entries(inputs).forEach(e => Object.entries(e).forEach(x => x.remove()))
    removeElements()
    // add elements representing state, make it look nice
    setupDone = true;
}

function createAnalogueSlider(x, y, num) {
    let el = createSlider(0, 9999, 5000, 1)
    el.position(x, y)
    el.size(100, 100)
    el.input(() => updateSound.a(num, el.value()))
    return el
}

function createDigitalToggle(x, y, num) {
    let el = createCheckbox(num.toString(), false)
    el.position(x, y)
    el.size(100, 100)
    el.changed(() => el.checked() ? updateSound.d(num, 1) : updateSound.d(num, 0))
    return el
}