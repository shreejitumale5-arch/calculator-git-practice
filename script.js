// =========================================
// ANIMATED GIT PRACTICE CALCULATOR
// =========================================

const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let currentInput = "";
let previousInput = "";
let operator = null;
let shouldResetDisplay = false;


// =========================================
// SOUND SYSTEM
// =========================================

let audioContext = null;

function playKeySound(type = "normal") {

  // Browser requires audio to start after user interaction
  if (!audioContext) {
    audioContext = new (
      window.AudioContext ||
      window.webkitAudioContext
    )();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  if (type === "operator") {
    oscillator.frequency.value = 520;
  } else if (type === "equal") {
    oscillator.frequency.value = 700;
  } else if (type === "clear") {
    oscillator.frequency.value = 300;
  } else {
    oscillator.frequency.value = 420;
  }

  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(
    0.0001,
    audioContext.currentTime
  );

  gainNode.gain.exponentialRampToValueAtTime(
    0.08,
    audioContext.currentTime + 0.01
  );

  gainNode.gain.exponentialRampToValueAtTime(
    0.0001,
    audioContext.currentTime + 0.08
  );

  oscillator.start();

  oscillator.stop(
    audioContext.currentTime + 0.08
  );
}


// =========================================
// DISPLAY
// =========================================

function updateDisplay(value) {

  display.value = value || "0";

  display.classList.remove("display-active");

  // Restart animation
  void display.offsetWidth;

  display.classList.add("display-active");
}


// =========================================
// NUMBER INPUT
// =========================================

function inputNumber(number) {

  if (shouldResetDisplay) {
    currentInput = "";
    shouldResetDisplay = false;
  }

  // Prevent multiple decimal points
  if (number === "." && currentInput.includes(".")) {
    return;
  }

  // Prevent unnecessary leading zeros
  if (currentInput === "0" && number !== ".") {
    currentInput = number;
  } else {
    currentInput += number;
  }

  updateDisplay(currentInput);
}


// =========================================
// OPERATOR
// =========================================

function chooseOperator(selectedOperator) {

  if (currentInput === "" && previousInput === "") {
    return;
  }

  if (previousInput !== "" && currentInput !== "") {
    calculate();
  }

  previousInput = currentInput || previousInput;
  operator = selectedOperator;

  shouldResetDisplay = true;
}


// =========================================
// CALCULATE
// =========================================

function calculate() {

  if (
    previousInput === "" ||
    currentInput === "" ||
    operator === null
  ) {
    return;
  }

  const firstNumber = parseFloat(previousInput);
  const secondNumber = parseFloat(currentInput);

  let result;

  switch (operator) {

    case "+":
      result = firstNumber + secondNumber;
      break;

    case "-":
      result = firstNumber - secondNumber;
      break;

    case "*":
      result = firstNumber * secondNumber;
      break;

    case "/":

      if (secondNumber === 0) {
        updateDisplay("Error");
        currentInput = "";
        previousInput = "";
        operator = null;
        shouldResetDisplay = true;
        return;
      }

      result = firstNumber / secondNumber;
      break;

    default:
      return;
  }

  // Remove floating point errors
  result = Number(
    result.toFixed(10)
  );

  currentInput = String(result);
  previousInput = "";
  operator = null;
  shouldResetDisplay = true;

  updateDisplay(currentInput);
}


// =========================================
// CLEAR
// =========================================

function clearCalculator() {

  currentInput = "";
  previousInput = "";
  operator = null;
  shouldResetDisplay = false;

  updateDisplay("0");
}


// =========================================
// BACKSPACE
// =========================================

function backspace() {

  if (
    shouldResetDisplay ||
    currentInput === ""
  ) {
    return;
  }

  currentInput = currentInput.slice(0, -1);

  updateDisplay(currentInput || "0");
}


// =========================================
// BUTTON ANIMATION
// =========================================

function animateButton(button) {

  button.classList.remove("ripple");

  // Restart ripple animation
  void button.offsetWidth;

  button.classList.add("ripple");

  setTimeout(() => {
    button.classList.remove("ripple");
  }, 500);
}


// =========================================
// BUTTON CLICK
// =========================================

buttons.forEach(button => {

  button.addEventListener("click", () => {

    animateButton(button);

    const value = button.dataset.value;
    const action = button.dataset.action;

    // Clear
    if (action === "clear") {

      playKeySound("clear");

      clearCalculator();

      return;
    }

    // Backspace
    if (action === "backspace") {

      playKeySound();

      backspace();

      return;
    }

    // Calculate
    if (action === "calculate") {

      playKeySound("equal");

      calculate();

      return;
    }

    // Number / decimal
    if (
      value !== undefined &&
      !["+", "-", "*", "/"].includes(value)
    ) {

      playKeySound();

      inputNumber(value);

      return;
    }

    // Operator
    if (
      value !== undefined &&
      ["+", "-", "*", "/"].includes(value)
    ) {

      playKeySound("operator");

      chooseOperator(value);

    }

  });

});


// =========================================
// KEYBOARD SUPPORT
// =========================================

document.addEventListener("keydown", event => {

  const key = event.key;

  // Numbers
  if (
    (key >= "0" && key <= "9") ||
    key === "."
  ) {

    inputNumber(key);

    playKeySound();

    highlightKeyboardButton(key);

    return;
  }


  // Operators
  if (
    key === "+" ||
    key === "-" ||
    key === "*" ||
    key === "/"
  ) {

    chooseOperator(key);

    playKeySound("operator");

    highlightKeyboardButton(key);

    return;
  }


  // Enter / =
  if (
    key === "Enter" ||
    key === "="
  ) {

    calculate();

    playKeySound("equal");

    highlightKeyboardButton("=");

    return;
  }


  // Backspace
  if (key === "Backspace") {

    backspace();

    playKeySound();

    highlightKeyboardButton("⌫");

    return;
  }


  // Escape / Delete
  if (
    key === "Escape" ||
    key === "Delete"
  ) {

    clearCalculator();

    playKeySound("clear");

    highlightKeyboardButton("C");

  }

});


// =========================================
// KEYBOARD BUTTON HIGHLIGHT
// =========================================

function highlightKeyboardButton(key) {

  let button = null;

  buttons.forEach(btn => {

    const value = btn.dataset.value;
    const action = btn.dataset.action;

    if (value === key) {
      button = btn;
    }

    if (
      key === "=" &&
      action === "calculate"
    ) {
      button = btn;
    }

    if (
      key === "C" &&
      action === "clear"
    ) {
      button = btn;
    }

    if (
      key === "⌫" &&
      action === "backspace"
    ) {
      button = btn;
    }

  });

  if (!button) {
    return;
  }

  button.classList.add("keyboard-active");

  setTimeout(() => {
    button.classList.remove("keyboard-active");
  }, 120);
}


// =========================================
// STARTUP ANIMATION
// =========================================

window.addEventListener("load", () => {

  updateDisplay("0");

});