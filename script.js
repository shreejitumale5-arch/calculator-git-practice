const display = document.getElementById("display");
let expression = "";

document.querySelector(".buttons").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const value = button.dataset.value;
  const action = button.dataset.action;

  if (action === "clear") {
    expression = "";
    display.value = "0";
    return;
  }

  if (action === "backspace") {
    expression = expression.slice(0, -1);
    display.value = expression || "0";
    return;
  }

  if (action === "equals") {
    try {
      // Practice project only: do not use this pattern with untrusted input.
      expression = String(Function(`"use strict"; return (${expression})`)());
      display.value = expression;
    } catch {
      expression = "";
      display.value = "Error";
    }
    return;
  }

  if (value) {
    expression += value;
    display.value = expression;
  }
});
