
let limits = {
	d : {
		min : 0,
		max : 1,
	},
	a : {
		min : 0,
		max : 9999,
	}
}
let nums = {
    d : {
        min : 1,
        max : 4
    },
    a : {
        min : 1,
        max : 3
    }
}
limits.d.range = limits.d.max - limits.d.min
limits.a.range = limits.a.max - limits.a.min

const analogueKeys = {
    BPM : 3,
    pitch : 2,
    effect : 1
}

let phraseNames = {
    1 : "percussion",
    2 : "bass",
    3 : "melody",
    4 : "harmony",
}

let phrases = {
    1 : [],
    2 : [],
    3 : [],
    4 : []
}

var score
var effect
let pitchMul = 1
const soundList = ["clap01.ogg", "snaph01.ogg", "dong01.ogg", "dong03.ogg", "bass_punch01.ogg", "flute01.ogg", "kick01.ogg", "kick01.ogg", "violin_fingered01.ogg", "violin_pizzicato01.ogg"]
let sounds = {}
var parts= []
var score
let arrangement = [0, 1, 0, 1]
let perpat  =  [[0,0,3,0,0,0,3,0,0,0,3,0,0,15,0,0,3,0],
                [0,0,3,0,0,0,3,0,0,0,5,0,0,3,0,0,3,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
let basspat =  [[0,0,10,0,10,0,13,0,10,0,10,0,13,0,18,0,17,0],
                [0,0,10,0,10,0,10,0,17,0,10,0,13,0,17,0,18,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
let melpat  =  [[0,0,{p:10,d:2},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,{p:10, d:1},0,0,0,{p:17,d:0.5},0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
let harmpat =  [[0,0,8,0,0,0,15,0,0,0,8,0,0,0,15,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
let backpat =  [[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
                [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
                [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
                [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
                [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0]]
const pitchRatio = 1.0594630943592952645618252949463

let updateSound = {
    a : (num, val) => updateAnalogue[num](val),
    d : (num, val) => val == 1 ? phrases[num].forEach((ph, i) => parts[i].addPhrase(ph)) 
                               : parts.forEach(part => part.removePhrase(phraseNames[num]))
}

let updateAnalogue = {

}

function setupSound() {
    updateAnalogue[analogueKeys.BPM] = (val) => changeBPM(rescale(val, 80, 140))
    updateAnalogue[analogueKeys.pitch] = (val) => pitchMul = rescale(val, 0.667, 1.5)
    updateAnalogue[analogueKeys.effect] = (val) => effect.set(rescale(val, -5, 5), 3, 3)
    effect = new p5.Panner3D()
    effect.set(0, 3, 3)
    // effect.orient(10, 10, 10)
    // effect.delayTime(0.2)
    // effect.amp(3)
    soundList.forEach(name => sounds[name] = loadSound("../sounds/" + name, (sound => sound.connect(effect))))
    for (i = 0; i < perpat.length; i++) {
        parts[i] = new p5.Part()
        parts[i].addPhrase(new p5.Phrase("backing", playBacking, backpat[i]))
        phrases[1][i] = new p5.Phrase(phraseNames[1], playPercussion, perpat[i])
        phrases[2][i] = new p5.Phrase(phraseNames[2], playBass, basspat[i])
        phrases[3][i] = new p5.Phrase(phraseNames[3], playMelody, melpat[i])
        phrases[4][i] = new p5.Phrase(phraseNames[4], playHarmony, harmpat[i])
    }
    
    score = new p5.Score(...arrangement.map(el => parts[el]))
    console.log(score)
    changeBPM(100)

}

var scoreBPM = 100;
function changeBPM(BPM) {
    score.setBPM(BPM)
    // score.parts[0].forEach(part => part.setBPM(BPM))
    scoreBPM = BPM
}

const KICK = 3;
const CLAP = 5;
function playPercussion(time, val) {
    if (val % KICK == 0) playUntuned("kick01.ogg", time)
    if (val % CLAP == 0) playUntuned("clap01.ogg", time)
}

function playBacking(time, val) {
    playUntuned("snaph01.ogg", time)
}

function playBass(time, val) {
    playTuned("bass_punch01.ogg", val, time)
}

function playMelody(time, val) {
    playTuned("flute01.ogg", val.p, time, val.d)
}

function playHarmony(time, val) {
    playTuned("dong01.ogg", val, time)
}

// @pitch - number from 1 to 24, with 13 representing the base sound
function playTuned(sound, pitch, time, dur) {
    let sf = sounds[sound]
    if (!sf || !sf.isLoaded()) return
    if (dur) sf.play(time, pitchToRate(pitch) * pitchMul, 1, 0, dur * (60 / scoreBPM))
    else sf.play(time, pitchToRate(pitch) * pitchMul)
}

let pitchToRate = pitch => pitchRatio ** (pitch - 13)

function playUntuned(sound, time) {
    if (sounds[sound]) sounds[sound].play(time)
}

function playSound() {
    userStartAudio()
    score.loop()
}

let rescale = (value, newMin, newMax, newRange = newMax - newMin) => (value - limits.a.min) / limits.a.range * newRange + newMin

/**
 * soundfile:
 * -playback can start at a specific time and have a set duration
 * -can change "playback rate", affecting speed and pitch - negative values reverse buffer
 * -can be panned
 * -can connect to an effect
 * -can set events to trigger on playback time cues
 * 
 * effect:
 * -distortion
 * -reverb
 * -compression
 * -filter - could be used to make it a learning tool on how filters work?
 * -delay
 * 
 * polysynth:
 * -manager for monosynths
 * -can play synth notes with an envelope
 * 
 * oscillator:
 * -basic oscillators
 * -can use Envelope to make better notes
 * 
 * score:
 * -manager for parts
 * -can modify BPM
 * -start, stop, loop, pause all parts
 * 
 * part:
 * -manager for phrases
 * -can add and remove phrases on the fly
 * -has a changeable BPM
 * 
 * phrase:
 * -has a name, a callback function, and an array of values or objects to give the callback function
 * -callback takes a time value to give to "play" or "start", and an item from the array
 * -should be used with soundfile samples, or an oscillator
 * -playback rate can be used to modify sample pitch
 */