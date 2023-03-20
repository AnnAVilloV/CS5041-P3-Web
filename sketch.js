var img

function preload() {
    img = loadImage("./A-Cat.jpg")

}

function setup() {
    createCanvas(1000,1000)
    image(img, 0, 0, 1000, 1000, 0, 0, img.width, img.height)
}

function draw() {
}