// Inspired by: https://generativeartistry.com/tutorials/piet-mondrian/

function splitOnX(squares, square, splitAt) {
  var squareA = {
    x: square.x,
    y: square.y,
    width: square.width - (square.width - splitAt + square.x),
    height: square.height
  };

  var squareB = {
    x: splitAt,
    y: square.y,
    width: square.width - splitAt + square.x,
    height: square.height
  };

  squares.push(squareA);
  squares.push(squareB);
}

function splitOnY(squares, square, splitAt) {
  var squareA = {
    x: square.x,
    y: square.y,
    width: square.width,
    height: square.height - (square.height - splitAt + square.y)
  };

  var squareB = {
    x: square.x,
    y: splitAt,
    width: square.width,
    height: square.height - splitAt + square.y
  };

  squares.push(squareA);
  squares.push(squareB);
}

function splitSquaresWith(squares, coordinates) {
  const { x, y } = coordinates;

  for (var i = squares.length - 1; i >= 0; i--) {
    const square = squares[i];

    if (x && x > square.x && x < square.x + square.width) {
        if(Math.random() > 0.5) {
          squares.splice(i, 1);
          splitOnX(squares, square, x);
        }
    }

    if (y && y > square.y && y < square.y + square.height) {
        if(Math.random() > 0.5) {
          squares.splice(i, 1);
          splitOnY(squares, square, y);
        }
    }
  }
}

function splitSquares(squares, size, step) {
  for (var i = 0; i < size; i += step) {
    splitSquaresWith(squares, { y: i });
    splitSquaresWith(squares, { x: i });
  }
}

function pickColour(base, colours) {
  if (Math.random() > 0.75) {
    return base;
  }

  return colours[Math.floor(Math.random() * colours.length)];
}

function colourSquares(context, squares) {
  const strokeColor = document.documentElement.classList.contains('dark') ? 'white' : '#0f172a';
  const white = document.documentElement.classList.contains('dark') ? '#0f172a' : 'white';
  const colors = ['#84cc16', '#22c55e', '#10b981', '#14b8a6', '#0e7490', '#0ea5e9']

  for (var i = 0; i < squares.length; i++) {
    squares[i].color = pickColour(white, colors);

    context.beginPath();
    context.rect(
      squares[i].x,
      squares[i].y,
      squares[i].width,
      squares[i].height
    );
    if(squares[i].color) {
      context.fillStyle = squares[i].color;
    } else {
      context.fillStyle = white
    }
    context.strokeStyle = strokeColor

    context.fill()
    context.stroke();
  }
}

function draw(canvas, context) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  const size = canvas.width;
  const lineWidth = 10;

  context.lineWidth = lineWidth;

  const step = size / 9;

  var squares = [{
    x: lineWidth,
    y: lineWidth,
    width: size - 2 * lineWidth,
    height: size - 2 * lineWidth
  }];

  splitSquares(squares, size, step);
  colourSquares(context, squares);
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('art-canvas');
  if (canvas == null) {
    return;
  }

  const context = canvas.getContext('2d');

  const dpr = window.devicePixelRatio;
  const size = canvas.width;

  context.scale(dpr, dpr);

  canvas.width = size * dpr;
  canvas.height = size * dpr;

  draw(canvas, context);

  const toggleButton = document.getElementById('toggle-dark-mode-button');
  toggleButton.addEventListener('click', () => {
    draw(canvas, context);
  });

  const tooltip = document.getElementById('art-tooltip');
  const note = document.getElementById('art-note');
  let timeoutId = null;

  tooltip.addEventListener('mouseenter', () => {
    if (timeoutId != null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    note.classList.remove('hidden');
  });

  tooltip.addEventListener('mouseleave', () => {
    timeoutId = setTimeout(() => {
      note.classList.add('hidden');
    }, 1500)
  });

  note.addEventListener('mouseenter', () => {
    if (timeoutId != null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  });

  note.addEventListener('mouseleave', () => {
    note.classList.add('hidden');
  });

  canvas.addEventListener('click', () => {
    note.classList.add('hidden');
    draw(canvas, context);
  });
});
