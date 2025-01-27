function validatePhoneNumber(input) {
  let value = input.value;
  // Remove any non-numeric characters (optional, if you want only numbers)
  value = value.replace(/\D/g, "");

  // Set the value back to the input field, limiting to 10 digits
  if (value.length > 10) {
    value = value.substring(0, 10);
  }

  input.value = value; // Set the updated value back to input
}

const form = document.querySelector("#otp");
const inputs = document.querySelectorAll(".otp-input");
const verifyBtn = document.querySelector("#verifyBtn");

const toggleFilledClass = (field) => {
  if (field.value) {
    field.classList.add("filled");
  } else {
    field.classList.remove("filled");
  }
};

const isAllInputFilled = () => {
  return Array.from(inputs).every((input) => input.value);
};

const toggleVerifyButton = () => {
  if (isAllInputFilled()) {
    verifyBtn.removeAttribute("disabled");
  } else {
    verifyBtn.setAttribute("disabled", "true");
  }
};

form.addEventListener("input", (e) => {
  const target = e.target;
  const value = target.value;
  console.log({ target, value });
  toggleFilledClass(target);
  if (target.nextElementSibling) {
    target.nextElementSibling.focus();
  }
  toggleVerifyButton();
});

inputs.forEach((input, currentIndex) => {
  // fill check
  toggleFilledClass(input);

  // paste event
  input.addEventListener("paste", (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    console.log(text);
    inputs.forEach((item, index) => {
      if (index >= currentIndex && text[index - currentIndex]) {
        item.focus();
        item.value = text[index - currentIndex] || "";
        toggleFilledClass(item);
        toggleVerifyButton(); // Check after pasting
      }
    });
  });

  // backspace event
  input.addEventListener("keydown", (e) => {
    if (e.keyCode === 8) {
      e.preventDefault();
      input.value = "";
      toggleFilledClass(input);
      if (input.previousElementSibling) {
        input.previousElementSibling.focus();
      }
    } else {
      if (input.value && input.nextElementSibling) {
        input.nextElementSibling.focus();
      }
    }
    toggleVerifyButton();
  });
});

window.addEventListener("load", () => {
  inputs[0].focus();
});

verifyBtn.addEventListener("click", () => {
  verifyOTP();
  toggleVerifyButton();
});
