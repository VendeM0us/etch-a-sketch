/*-------LOCAL STORAGE HANDLING------------*/
const initializeState = () => {
  let sketchpadSize = localStorage.getItem("sketchpadSize");

  if (sketchpadSize) {
    sketchpadSize = Number(sketchpadSize);
    initializeGrid(sketchpadSize);
  } else {
    initializeGrid();
  }
}

const removeAllPixelData = size => {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const coordinate = `${i}-${j}`;
      localStorage.removeItem(`pixel-coordinate-${coordinate}`);
    }
  }
}
/*-----------------------------------------*/

const changeSketchpadSizeLabelText = event => {
  const value = event.target.value;
  const text = `${value} X ${value}`;

  const textContainer = document.querySelector(`label[for="sketchpad-size"]`);
  textContainer.innerText = text;
}

const initializeGrid = (size = 16) => {
  localStorage.setItem("sketchpadSize", size.toString());

  const sketchpad = document.getElementById("sketchpad");
  sketchpad.innerHTML = "";
  sketchpad.style.gridTemplate = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const coordinate = `${i}-${j}`;

      const pixel = document.createElement("div");
      pixel.setAttribute("class", "pixel");
      pixel.setAttribute("data-pixel-coordinate", coordinate);

      const color = localStorage.getItem(`pixel-coordinate-${coordinate}`);
      if (color) pixel.style.backgroundColor = color;
  
      sketchpad.appendChild(pixel);
    }
  }
};

const setSketchpadSize = event => {
  hideToolPanel();
  const rangeInput = document.querySelector("input#sketchpad-size");
  const size = Number(rangeInput.value);
  removeAllPixelData(size);
  initializeGrid(size);
};

const drawMode = () => {
  const colorPalette = document.querySelector("input#choose-color");
  const colorValue = colorPalette.value;
  return colorValue;
}

const eraseMode = () => {
  const colorValue = "transparent";
  return colorValue;
};

const getRandomRGBValue = () => {
  const min = 0, max = 255;
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const rainbowMode = () => {
  const rgb1 = getRandomRGBValue();
  const rgb2 = getRandomRGBValue();
  const rgb3 = getRandomRGBValue();
  const colorValue = `rgb(${rgb1}, ${rgb2}, ${rgb3})`;

  return colorValue;
};

const getColor = () => {
  const toggledButton = document.querySelector(".toggled");

  switch (toggledButton.getAttribute("id")) {
    case 'draw':
      return drawMode();
    case 'eraser':
      return eraseMode();
    case 'rainbow':
      return rainbowMode();
  }
};

const handleMousedown = event => {
  event.preventDefault();
  const sketchpad = event.currentTarget;
  const pixel = event.target;
  pixel.style.backgroundColor = getColor();

  const coordinate = pixel.dataset.pixelCoordinate;
  localStorage.setItem(`pixel-coordinate-${coordinate}`, pixel.style.backgroundColor);

  sketchpad.addEventListener("mouseover", colorPixel);
}

const handleMouseup = event => {
  event.preventDefault();
  const sketchpad = event.currentTarget;
  sketchpad.removeEventListener("mouseover", colorPixel);
}

const colorPixel = event => {
  event.preventDefault();
  const pixel = event.target;
  pixel.style.backgroundColor = getColor();

  const coordinate = pixel.dataset.pixelCoordinate;
  if (pixel.style.backgroundColor === "transparent") {
    localStorage.removeItem(`pixel-coordinate-${coordinate}`);
  } else {
    localStorage.setItem(`pixel-coordinate-${coordinate}`, pixel.style.backgroundColor);
  }
}

const removePreviousToggledButton = () => {
  const toggledButton = document.querySelector(".toggled");
  toggledButton.classList.remove("toggled");
}

const toggleButton = event => {
  hideToolPanel();
  removePreviousToggledButton();
  const button = event.currentTarget;
  button.classList.add("toggled");
};

const resetSketchpad = () => {
  hideToolPanel();

  const sketchpad = document.getElementById("sketchpad");
  const pixels = sketchpad.children;

  for (let i = 0; i < pixels.length; i++) {
    const pixel = pixels[i];
    pixel.style.backgroundColor = eraseMode();
    const coordinate = pixel.dataset.pixelCoordinate;
    localStorage.removeItem(`pixel-coordinate-${coordinate}`);
  }
};

const shortcutKeys = event => {
  let button;

  switch(event.key) {
    case 'd':
      removePreviousToggledButton();
      button = document.getElementById("draw");
      break;
    case 'e':
      removePreviousToggledButton();
      button = document.getElementById("eraser");
      break;
    case 'r':
      removePreviousToggledButton();
      button = document.getElementById("rainbow");
      break;
    case 'z':
      resetSketchpad();
      break;
  }

  if (button) button.classList.add("toggled");
};

const isSmallScreen = () => {
  const mediaQuery = matchMedia('(max-width: 985px)');
  return mediaQuery.matches;
};

const hideToolPanel = () => {
  if (!isSmallScreen()) return;

  const sideBar = document.getElementById("side-bar");
  sideBar.style.visibility ="hidden";
};

const toggleToolPanel = event => {
  event.stopPropagation();
  if (!isSmallScreen()) return;

  const sideBar = document.getElementById("side-bar");
  sideBar.style.visibility === "hidden"
    ? sideBar.style.visibility = "visible"
    : sideBar.style.visibility = "hidden";
};

window.addEventListener("DOMContentLoaded", event => {
  initializeState();

  const rangeInput = document.querySelector("input#sketchpad-size");
  rangeInput.addEventListener("input", changeSketchpadSizeLabelText);

  const confirmSketchpadSizeButton = document.querySelector("button#apply-sketchpad-size");
  confirmSketchpadSizeButton.addEventListener("click", setSketchpadSize);

  const sketchpad = document.getElementById("sketchpad");
  sketchpad.addEventListener("mousedown", handleMousedown);
  sketchpad.addEventListener("mouseup", handleMouseup);

  const sideBarButtons = document.querySelectorAll("#side-bar > button");
  sideBarButtons.forEach(button => {
    if (button.getAttribute("id") === "reset") return;
    button.addEventListener("click", toggleButton);
  });

  const resetButton = document.querySelector("button#reset");
  resetButton.addEventListener("click", resetSketchpad);

  window.addEventListener("keydown", shortcutKeys);
  window.addEventListener("click", hideToolPanel);

  const hamburgerButton = document.querySelector("button#hamburger");
  hamburgerButton.addEventListener("click", toggleToolPanel);
});