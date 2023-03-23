
const analogueKeys = {
    BPM : 1,
    pitch : 2,
    effect : 3
}

let phraseNames = {
    1 : "phrase1",
    2 : "phrase2",
    3 : "phrase3",
    4 : "phrase4",
}

let phrases = {
    "phrase1" : null,
    "phrase2" : null,
    "phrase3" : null,
    "phrase4" : null
}

var score
var effect
let pitchMul = 1
var score
var part

let updateSound = {
    a : (num, val) => updateAnalogue[num](val),
    d : (num, val) => val == 1 ? part.addPhrase(phrases[phraseNames[num]]) : part.removePhrase(phraseNames[num])
}

let updateAnalogue = {

}

function setupSound() {
    updateAnalogue[analogueKeys.BPM] = (val) => score.setBPM(rescale(val, 60, 180))
    updateAnalogue[analogueKeys.pitch] = (val) => pitchMul = rescale(val, 0.5, 2)
    updateAnalogue[analogueKeys.effect] = (val) => effect.drywet(rescale(val, 0, 1.0))
}

let rescale = (value, newMin, newMax, newRange = newRange || newMax - newMin) => (value - limits.a.nim) / limits.a.range * newRange + newMin

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