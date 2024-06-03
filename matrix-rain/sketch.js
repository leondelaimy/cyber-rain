// Inspired by Emily Xie The Coding Train tutorial
// https://www.youtube.com/watch?v=S1TQCi9axzg

let streams = [];
let fadeInterval = 1.4;
let symbolSize = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  var x = 0;
  for (var i = 0; i <= width / symbolSize; i++) {
    var stream = new Stream();
    stream.generateSymbols(x, random(-2000, 0));
    streams.push(stream);
    x += symbolSize
  }

  textFont('Share Tech Mono');
  textSize(symbolSize);
}

function draw() {
  background(34, 34, 34, 150); // Background with transparency to create trailing effect
  streams.forEach(stream => {
    stream.render();
  });
}

class MatrixSymbol {
  constructor(x, y, speed, first, opacity) {
    this.x = x;
    this.y = y;
    this.value = '';
    this.speed = speed;
    this.first = first;
    this.opacity = opacity;
    // Assign a random color to each symbol upon creation
    this.color = random() > 0.5 ? '#CA504D' : '#8DC9F4';
    this.switchInterval = round(random(30, 60)); // Slow down the symbol switch interval
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
    this.speed = random(1, 2); // Slowed down rain effect
  }

  generateSymbols(x, y) {
    let opacity = 255;
    let first = round(random(0, 4)) === 1;
    for (let i = 0; i <= this.totalSymbols; i++) {
      let symbol = new MatrixSymbol(x, y, this.speed, first, opacity);
      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      opacity -= (255 / this.totalSymbols) / fadeInterval;
      y -= symbolSize;
      first = false;
    }
  }

  render() {
    this.symbols.forEach(symbol => {
      // Glowing effect by drawing shadow
      drawingContext.shadowBlur = 10;
      drawingContext.shadowColor = symbol.color;

      fill(color(symbol.color).levels[0], color(symbol.color).levels[1], color(symbol.color).levels[2], symbol.opacity);

      text(symbol.value, symbol.x, symbol.y);
      symbol.rain();
      symbol.setToRandomSymbol();

      // Reset shadow for the next draw
      drawingContext.shadowBlur = 0;
    });
  }
}
