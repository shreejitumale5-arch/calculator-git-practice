/* =================================
   BUTTON SOUND + ANIMATIONS
================================= */

let audioContext;

function playKeySound() {
  if (!audioContext) {
    audioContext = new (
      window.AudioContext ||
      window.webkitAudioContext
    )();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sine";

  // Short calculator-style click
  oscillator.frequency.setValueAtTime(
    650,
    audioContext.currentTime
  );

  oscillator.frequency.exponentialRampToValueAtTime(
    420,
    audioContext.currentTime + 0.06
  );

  gainNode.gain.setValueAtTime(
    0.08,
    audioContext.currentTime
  );

  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.07
  );

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.07);
}


/* Button click animation */

document.querySelectorAll("button").forEach(button => {

  button.addEventListener("click", () => {

    // Sound
    playKeySound();

    // Ripple
    button.classList.remove("ripple");

    // Force browser to restart animation
    void button.offsetWidth;

    button.classList.add("ripple");


    // Display animation
    const display =
      document.querySelector("#display") ||
      document.querySelector(".display");

    if (display) {

      display.classList.remove("display-active");

      void display.offsetWidth;

      display.classList.add("display-active");
    }
  });

});


/* =================================
   KEYBOARD SUPPORT SOUND
================================= */

document.addEventListener("keydown", event => {

  const key = event.key;

  const allowedKeys =
    "0123456789+-*/.=EnterBackspaceEscape";

  if (
    allowedKeys.includes(key) ||
    key === "Enter" ||
    key === "Backspace" ||
    key === "Escape"
  ) {

    playKeySound();

    // Find matching calculator button
    const buttons =
      document.querySelectorAll("button");

    buttons.forEach(button => {

      if (
        button.textContent.trim() === key ||
        (key === "Enter" &&
          button.textContent.trim() === "=")
      ) {

        button.classList.add("keyboard-active");

        setTimeout(() => {
          button.classList.remove("keyboard-active");
        }, 120);

      }

    });

  }

});