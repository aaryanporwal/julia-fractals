// The HTML elements we are using
const header = document.querySelector('h2')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// The size of our canvas
const width = 400
const height = 400

// Set the size of our canvas
canvas.width = width
canvas.height = height

// The point we use for C in our Julia Set equation
let constant = math.complex(0.28, 0.01)

// The maximum number of times we iterate a point to see if it escapes
const maxIterations = 64

// Whether we have clicked yet
let clicked = false

// How much we want the image to move
let pan = math.complex(0, 0)

// Apply the Julia Set formula to see if point z "escapes"
function julia(z, i = 0) {
  // Apply the Julia Set formula: z*z+constant
  z = z.mul(z)
  z = z.add(constant)

  // Has our point escaped, or hit the iteration limit?
  if (math.norm(z) > 2 || i == maxIterations)
    // If so, return number of iterations
    return i
  else
    // If not, iterate again!
    return julia(z, i+1)
}

// Turn a point on the complex plane into a color
function pointToColor(point) {
  // How many iterations on this point before it escapes?
  let iterations = julia(point)

  // What percentage of our limit is that?
  const percentage = iterations/maxIterations

  const red = percentage*255
  const green = percentage*255
  const blue = percentage*255

  // Create a color from that percentage
  return `rgb(${red}, ${green}, ${blue})`
}

// Turn XY pixel coodinates into a point on the complex plane
function pixelToPoint(x, y) {
  // Map percentage of total width/height to a value from -1 to +1
  const zx = (x/width)*2-1
  const zy = 1-(y/height)*2

  // Create a complex number based on our new XY values
  let z = math.complex(zx, zy)

  // Pan the camera
  z = z.add(pan)

  return z
}

// Draw a single pixel on our canvas
function drawPixel(x, y, color) {
  ctx.fillStyle = color
  ctx.fillRect(x, y, 1, 1)
}

// Redraw our canvas
function draw() {
  // Loop over every column of pixels
  for (let y = 0; y < height; y++) {
    // Loop over every row of pixels
    for (let x = 0; x < width; x++) {
      // Turn this pixel into a point in the complex plane
      const point = pixelToPoint(x, y)

      // Turn that point into a color
      const color = pointToColor(point)

      // Draw over this pixel with that color
      drawPixel(x, y, color)
    }
  }
}

// Update the elements that need to change
function update() {
  header.innerHTML = constant.toString()
  draw()
}

function click(event) {
  // Ignore the first click
  if (!clicked) {
    clicked = true
    return
  }

  // Get the mouse's XY coordinates on canvas
  mouseX = event.clientX-canvas.offsetLeft
  mouseY = event.clientY-canvas.offsetTop

  // Turn mouse coordinates into a point on the complex plane
  pan = pixelToPoint(mouseX, mouseY)

  // Update everything!
  update()
}

// What to do when the mouse moves over the canvas
function move(event) {
  // Don't move after first click
  if (clicked) {
    return
  }

  // Get the mouse's XY coordinates on canvas
  mouseX = event.clientX-canvas.offsetLeft
  mouseY = event.clientY-canvas.offsetTop

  // Turn mouse coordinates into a point on the complex plane
  constant = pixelToPoint(mouseX, mouseY)

  // Round that point off to the nearest 0.01
  constant.re = math.round(constant.re*100)/100
  constant.im = math.round(constant.im*100)/100

  // Update everything!
  update()
}

// Trigger click every time the canvas is clicked
canvas.addEventListener('click', click)

// Trigger move every time the mouse moves over canvas
canvas.addEventListener('pointermove', move)

// Update everything!
update()

