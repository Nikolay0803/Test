class SlotMachine {
  constructor() {
    this.canvas = document.getElementById("slotCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.reels = [[], [], [], [], []];
    this.symbols = [
      "4fish",
      "9",
      "10",
      "a",
      "crab",
      "dolphin",
      "fish",
      "j",
      "k",
      "medusa",
      "pearl",
      "q",
      "seahorse",
    ];
    this.symbolSize = 200;
    this.animationDuration = 2000;
    this.spinButton = document.getElementById("spinButton");
    this.spinButton.addEventListener("click", () => this.spin());
    this.loadImages();
  }

  loadImages() {
    this.images = {};
    const promises = this.symbols.map((symbol) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = `img/${symbol}.jpg`;
        img.onload = () => {
          this.images[symbol] = img;
          resolve();
        };
        img.onerror = reject;
      });
    });
    Promise.all(promises).then(() => this.draw());
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.reels.forEach((reel, index) => {
      reel.forEach((symbol, row) => {
        const img = this.images[symbol];
        this.ctx.drawImage(
          img,
          index * this.symbolSize,
          row * this.symbolSize,
          this.symbolSize,
          this.symbolSize
        );
      });
    });
  }

  spin() {
    const frames = 60;
    this.reels.forEach((reel, index) => {
      let currentFrame = 0;
      const interval = setInterval(() => {
        currentFrame++;
        if (currentFrame <= frames) {
          this.ctx.clearRect(
            index * this.symbolSize,
            0,
            this.symbolSize,
            this.canvas.height
          );
          reel.forEach((symbol, row) => {
            const img = this.images[symbol];
            const distance = (currentFrame / frames) * this.symbolSize * 5;
            this.ctx.drawImage(
              img,
              index * this.symbolSize,
              (row - 5 + distance / this.symbolSize) * this.symbolSize,
              this.symbolSize,
              this.symbolSize
            );
          });
        } else {
          clearInterval(interval);
          for (let i = 0; i < 5; i++) {
            reel.unshift(this.getRandomSymbol());
          }
          this.draw();
        }
      }, (index + 1) * (this.animationDuration / frames));
    });
  }

  getRandomSymbol() {
    return this.symbols[Math.floor(Math.random() * this.symbols.length)];
  }
}

const slotMachine = new SlotMachine();
