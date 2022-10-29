let rgbDarkness = 1;

const changeSketchpadSizeLabelText = event => {
  const value = event.target.value;
  const text = `${value} X ${value}`;

  const textContainer = document.querySelector(`label[for="sketchpad-size"]`);
  textContainer.innerText = text;
}

const initializeGrid = (size = 16) => {
  const sketchpad = document.getElementById("sketchpad");
  sketchpad.innerHTML = "";
  sketchpad.style.gridTemplate = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`;

  const totalPixelCount = size * size;
  for (let i = 0; i < totalPixelCount; i++) {
    const pixel = document.createElement("div");
    pixel.setAttribute("class", "pixel");

    sketchpad.appendChild(pixel);
  }
};

const setSketchpadSize = event => {
  toggleTools();
  const rangeInput = document.querySelector("input#sketchpad-size");
  const size = Number(rangeInput.value);
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
  if (rgbDarkness < 0) rgbDarkness = 1;

  const rgb1 = Math.floor(getRandomRGBValue() * rgbDarkness);
  const rgb2 = Math.floor(getRandomRGBValue() * rgbDarkness);
  const rgb3 = Math.floor(getRandomRGBValue() * rgbDarkness);
  const colorValue = `rgb(${rgb1}, ${rgb2}, ${rgb3})`;

  rgbDarkness = Number((rgbDarkness - 0.1).toFixed(1));

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
}

const removePreviousToggledButton = () => {
  const toggledButton = document.querySelector(".toggled");
  toggledButton.classList.remove("toggled");
}

const toggleButton = event => {
  toggleTools();
  removePreviousToggledButton();
  const button = event.currentTarget;
  button.classList.add("toggled");
};

const resetSketchpad = () => {
  toggleTools();

  const sketchpad = document.getElementById("sketchpad");
  const pixels = sketchpad.children;

  for (let i = 0; i < pixels.length; i++) {
    const pixel = pixels[i];
    pixel.style.backgroundColor = eraseMode();
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

const setHamburgerForSmallerScreen = (shouldShow) => {
  if (!shouldShow) {
    const sideBar = document.getElementById("side-bar");
    sideBar.style.visibility = "visible";
    return;
  };

  const hamburgerButton = document.querySelector("button#hamburger");
  hamburgerButton.classList.remove("hidden");
};

const toggleHamburgerButton = event => {
  const hamburgerButton = document.querySelector("button#hamburger");
  
  event.target.matches === true 
    ? hamburgerButton.classList.remove("hidden")
    : hamburgerButton.classList.add("hidden");
}

const toggleTools = () => {
  const mediaQuery = matchMedia('(max-width: 985px)');
  const isSmallScreen = mediaQuery.matches;
  if (!isSmallScreen) return;

  const sideBar = document.getElementById("side-bar");
  sideBar.style.visibility === "hidden" 
    ? sideBar.style.visibility = "visible"
    : sideBar.style.visibility = "hidden";
};

window.addEventListener("DOMContentLoaded", event => {
  const mediaQuery = matchMedia('(max-width: 985px)');

  initializeGrid();
  setHamburgerForSmallerScreen(mediaQuery.matches);

  mediaQuery.addEventListener("change", toggleHamburgerButton);

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

  const hamburgerButton = document.querySelector("button#hamburger");
  hamburgerButton.addEventListener("click", toggleTools);
});