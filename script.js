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

window.addEventListener("DOMContentLoaded", event => {
  initializeGrid();

  const rangeInput = document.querySelector("input#sketchpad-size");
  rangeInput.addEventListener("input", changeSketchpadSizeLabelText);

  const confirmSketchpadSizeButton = document.querySelector("button#apply-sketchpad-size");
  confirmSketchpadSizeButton.addEventListener("click", setSketchpadSize);
});