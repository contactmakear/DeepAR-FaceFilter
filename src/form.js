import axios from 'axios'
import { hideElement, showElement } from './utils'

export default function Form() {
  let phone = document.querySelector('.phone')
  const age = document.querySelector('.age')
  const detailsForm = document.getElementById('detailsForm')
  const detailScreen = document.querySelector('.details-screen')
  const landingScreen = document.querySelector('.landing-screen')
  const otpScreen = document.querySelector('.otp-screen')

  const allErrorTexts = document.querySelectorAll('.alert-danger')

  allErrorTexts.forEach((error) => {
    setTimeout(() => {
      error.style.display = 'none'
    }, 5000)
  })



  document.addEventListener("DOMContentLoaded", function () {
    hideElement(loading, 300)
    // showElement(containerScene, 0, "flex")
    // showElement(landingScreen, 0, 'flex')

    setTimeout(() => {
      hideElement(landingScreen, 300)
      showElement(detailScreen, 0, 'flex')
    }, 2000)

    // loading.style.display = "none";
    // containerScene.style.display = "flex";
  });

  // detailScreen.style.display = 'flex'
  detailsForm.addEventListener('submit', showOTPWindow)

  function showOTPWindow(e) {
    e.preventDefault()

    const formData = new FormData(detailsForm)



    const formDataObject = Object.fromEntries(formData.entries());


    axios.post('/show-otp-screen', {
      phone: `+91${phone.value.trim()}`
    }).then(response => {

      if (response.data.status == 'Success') {
        detailScreen.style.display = 'none'
        let otp = prompt("Please enter the OTP.")

        axios.post('/verify-otp', {
          details: response.data.details,
          userOTP: otp,
          phone: phone
        }).then((response) => {
          console.log("response console :", response);
          if (response.data == 'Success') {
            alert('OTP Matched')

            axios.post('/register', formDataObject).then((response) => {
              if (response.data.status == "Success") {
                window.location.href = "/ar"
              }
            }).catch((err) => {
              console.log(err);
              alert('Something went wrong. Please try again later.')
              window.location.href = '/'
            })

          } else {
            alert('OTP Mismatch')
            window.location.href = '/'
          }
        }).catch((err) => {
          alert('Error :', `${err}`)
          window.location.href = '/'
        })
      }
    }).catch(error => {
      console.log('Error sending data:', error)
    })
  }


  //! Frontend Detail Form validation 
  // function validateAge(age) {
  //   const ageValue = age.value;
  //   const ageError = document.getElementById('ageError');
  //   if (ageValue < 18 || ageValue > 110) {
  //     ageError.style.visibility = 'visible';
  //     ageError.style.opacity = '1';
  //     age.style.border = '1px solid #8D0000'
  //     return false;
  //   } else {
  //     ageError.style.visibility = 'hidden';
  //     ageError.style.opacity = '0';
  //     age.style.border = '1px solid #F8D640'

  //     return true;
  //   }
  // }

  // // Phone number validation
  // function validatePhoneNumber(phone) {
  //   const phoneValue = phone.value;
  //   const phoneError = document.getElementById('phoneError');
  //   const phoneRegex = /^\d{10}$/;
  //   if (!phoneRegex.test(phoneValue)) {
  //     phoneError.style.visibility = 'visible';
  //     phoneError.style.opacity = '1';
  //     phone.style.border = '1px solid #8D0000'

  //     return false;
  //   } else {
  //     phoneError.style.visibility = 'hidden';
  //     phoneError.style.opacity = '0';
  //     phone.style.border = '1px solid #F8D640'

  //     return true;
  //   }
  // }

  // // Checkbox validation
  // function validateCheckboxes() {
  //   const ageCheckbox = document.getElementById('age-checkbox');
  //   const smokerCheckbox = document.getElementById('smoker-checkbox');
  //   let valid = true;

  //   // const ageCheckboxError = document.getElementById('ageCheckboxError');
  //   // const smokerCheckboxError = document.getElementById('smokerCheckboxError');

  //   if (!ageCheckbox.checked) {
  //     // ageCheckboxError.style.display = 'block';
  //     valid = false;
  //   } else {
  //     // ageCheckboxError.style.display = 'none';
  //   }

  //   if (!smokerCheckbox.checked) {
  //     // smokerCheckboxError.style.display = 'block';
  //     valid = false;
  //   } else {
  //     // smokerCheckboxError.style.display = 'none';
  //   }

  //   return valid;
  // }

  // // Form submission
  // document.getElementById('detailsForm').addEventListener('submit', function (event) {
  //   const age = document.querySelector('[name="age"]');
  //   const phone = document.querySelector('[name="phone"]');

  //   const ageValid = validateAge(age);
  //   const phoneValid = validatePhoneNumber(phone);
  //   const checkboxesValid = validateCheckboxes();

  //   if (!ageValid || !phoneValid || !checkboxesValid) {
  //     event.preventDefault();
  //   }
  // });

  // // Focus out validation (blur event)
  // document.querySelector('[name="age"]').addEventListener('blur', function () {
  //   validateAge(this);
  // });

  // document.querySelector('[name="phone"]').addEventListener('blur', function () {
  //   validatePhoneNumber(this);
  // });

  // document.getElementById('age-checkbox').addEventListener('blur', function () {
  //   validateCheckboxes();
  // });

  // document.getElementById('smoker-checkbox').addEventListener('blur', function () {
  //   validateCheckboxes();
  // });
}
