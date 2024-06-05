// Inspired by Cyberpunk 2077

const fadeInterval = 1.4;
const symbolSize = 15;
const highlightSpeed = 2; // Increased speed for the highlight effect
const baseColor = '#CA504D'; // Base red color
const highlightColor = '#8DC9F4'; // Blue color for highlighting
const highlightRange = symbolSize * 3; // Range of symbols to highlight

let leftStream, rightStream;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  // Create a single stream on the left edge
  leftStream = new Stream();
  leftStream.generateSymbols(symbolSize, -50);

  // Create a single stream on the right edge
  rightStream = new Stream();
  rightStream.generateSymbols(width - symbolSize * 2, -500);

  textFont('Share Tech Mono');
  textSize(symbolSize);
}

function draw() {
  background(34, 34, 34, 150); // Background with transparency to create trailing effect
  leftStream.render();
  rightStream.render();
}

class MatrixSymbol {
  constructor(x, y, speed, first, opacity) {
    this.x = x;
    this.y = y;
    this.value = '';
    this.speed = speed;
    this.first = first;
    this.opacity = opacity;
    this.color = color(baseColor); // Set color to red
    this.switchInterval = round(random(30, 60));
  }

  setToRandomSymbol() {
    if (frameCount % this.switchInterval === 0) {
      // Use Katakana characters
      this.value = String.fromCharCode(0x30A0 + round(random(0, 96)));
    }
  }

  rain() {
    this.y = (this.y >= height) ? 0 : this.y + this.speed;
  }
}

class Stream {
  constructor() {
    this.symbols = [];
    this.totalSymbols = round(random(5, 35));
    this.speed = random(0.5, 1); // Slowed down rain effect
    this.highlightPosition = 0; // Track the position of the highlight effect
  }

  generateSymbols(x, y) {
    let opacity = 255;
    let first = round(random(0, 4)) === 1;
    for (let i = 0; i <= this.totalSymbols; i++) {
      const symbol = new MatrixSymbol(x, y, this.speed, first, opacity);
      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      opacity -= (255 / this.totalSymbols) / fadeInterval;
      y -= symbolSize;
      first = false;
    }
  }

  render() {
    // Move the highlight effect down the stream
    this.highlightPosition += highlightSpeed; // Increased speed of the highlight movement
    if (this.highlightPosition >= height) {
      this.highlightPosition = 0;
    }

    this.symbols.forEach((symbol, index) => {
      let distanceFromHighlight = abs(symbol.y - this.highlightPosition);

      if (distanceFromHighlight < highlightRange) {
        let blendAmount = map(distanceFromHighlight, 0, highlightRange, 0, 1);
        let blendedColor = lerpColor(color(highlightColor), color(baseColor), blendAmount);
        drawingContext.shadowBlur = map(distanceFromHighlight, 0, highlightRange, 20, 0);
        drawingContext.shadowColor = blendedColor;
        fill(blendedColor); // Highlight and add blend effect to the symbol at the highlight position
      } else {
        drawingContext.shadowBlur = 0;
        fill(red(symbol.color), green(symbol.color), blue(symbol.color), symbol.opacity); // Maintain the red colored stream
      }

      text(symbol.value, symbol.x, symbol.y);
      symbol.rain();
      symbol.setToRandomSymbol();
    });

    // Reset shadow settings after drawing each stream
    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = 'transparent';
  }
}
