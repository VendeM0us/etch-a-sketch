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
  const rangeInput = document.querySelector("input#sketchpad-size");
  const size = Number(rangeInput.value);
  initializeGrid(size);
};

const handleMousedown = event => {
  event.preventDefault();
  const sketchpad = event.currentTarget;
  const pixel = event.target;
  pixel.style.backgroundColor = "#000000";

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
  pixel.style.backgroundColor = "#000000";
}

const removePreviousToggledButton = () => {
  const toggledButton = document.querySelector(".toggled");
  toggledButton.classList.remove("toggled");
}

const toggleButton = event => {
  removePreviousToggledButton();
  const button = event.currentTarget;
  button.classList.add("toggled");
};

window.addEventListener("DOMContentLoaded", event => {
  initializeGrid();

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
});