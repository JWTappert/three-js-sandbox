const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

random.setSeed(random.getRandomSeed());
console.log(random.getSeed());

const settings = {
  suffix: `seed-${random.getSeed()}`,
  // supported: A0, A1, A2, A3, A4, A5, A6
  dimensions: [1024, 1024],
};

const sketch = () => {
  const palette = random.shuffle(random.pick(palettes)).slice(0, 3);
  const createGrid = () => {
    const points = [];
    const count = 200;

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v) * 0.04);
        const rotation = random.noise2D(u, v);
        const characters = ["\\", "|"];
        points.push({
          color: random.pick(palette),
          position: [u, v],
          radius,
          rotation,
          char: random.pick(characters),
        });
      }
    }
    return points;
  };

  // deterministic randomness
  // random.setSeed(1);
  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 75;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    points.forEach((data) => {
      const { position, radius, color, rotation, char } = data;
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.save();
      // context.beginPath();
      // context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      // context.lineWidth = 20;
      // context.fillStyle = color;
      // context.fill();

      context.fillStyle = color;
      context.font = `${radius * width}px "Ariel"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText(char, 0, 0);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
