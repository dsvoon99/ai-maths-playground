const BACKGROUND_COLOR = '#000000'
const LINE_COLOR = '#BCFF00'
const LINE_WIDTH = 5

var currentX = 0;
var currentY = 0;
var previousX = 0;
var previousY = 0;
var isPainting = false;
var context, canvas;

function prepareCanvas() {
    console.log("Preparing Canvas.")
    canvas = document.getElementById('my-canvas');
    context = canvas.getContext('2d');
    context.fillStyle = BACKGROUND_COLOR;
    context.strokeStyle = LINE_COLOR;
    context.fillRect(0,0, canvas.clientWidth, canvas.clientHeight);
    context.lineWidth = LINE_WIDTH;
    context.lineJoin = 'round'


    canvas.addEventListener('mousedown', function(event) {
        console.log('X coordinate: ' + event.clientX);
        console.log('Y coordinate: ' + event.clientY);
        isPainting = true
        currentX = event.clientX - canvas.getBoundingClientRect().left;
        currentY = event.clientY -  (canvas.getBoundingClientRect().top);
    })

    canvas.addEventListener('mouseup', function(event) {
        isPainting = false
    })

    canvas.addEventListener('mouseleave', function(event) {
        isPainting = false
    })

    canvas.addEventListener('mousemove', function(event) {
        if(isPainting) {
            previousX = currentX;
            currentX = event.clientX - canvas.offsetLeft;

            previousY = currentY;
            currentY = event.clientY - (canvas.getBoundingClientRect().top);

            context.beginPath();
            context.moveTo(previousX, previousY);
            context.lineTo(currentX, currentY);
            context.closePath();
            context.stroke();
        }
    })
}

function clearCanvas() {
    var currentX = 0;
    var currentY = 0;
    var previousX = 0;
    var previousY = 0;
    context.fillRect(0,0, canvas.clientWidth, canvas.clientHeight);
}