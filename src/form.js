import axios from 'axios'

export default function Form() {
    let phone = document.querySelector('.phone')
    const detailsForm = document.getElementById('detailsForm')
    const detailScreen = document.querySelector('.details-screen')
    const otpScreen = document.querySelector('.otp-screen')

    detailScreen.style.display = 'flex'
    detailsForm.addEventListener('submit', showOTPWindow)
    
    function showOTPWindow(e) {
      e.preventDefault()

      axios.post('/verify', {
        phone: `+91${phone.value.trim()}`
      }).then(response => {
        if(response.data.status == 'Success') {
            detailScreen.style.display = 'none'
            let otp = prompt("Please enter the OTP.")
            axios.post('/verify-otp', {
                details: response.data.details,
                userOTP: otp
            }).then((response) => {
                console.log(response.data)
                if(response.data == 'Success') {
                    alert('OTP Matched')
                    window.location.href = "/ar"
                }
            })
        }
      }).catch(error => {
        console.log('Error sending data:', error)
      })
    }
}