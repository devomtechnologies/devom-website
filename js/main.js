// Header & Footer Include
fetch('header.html')
.then(res => res.text())
.then(data => document.getElementById('header').innerHTML = data);

fetch('footer.html')
.then(res => res.text())
.then(data => document.getElementById('footer').innerHTML = data);

// Button Test
document.addEventListener('DOMContentLoaded', () => {
    const registerBtn = document.querySelector('.primary-btn');
    if(registerBtn){
        registerBtn.addEventListener('click', () => {
            console.log('Register button clicked');
        });
    }
    const loginBtn = document.querySelector('.secondary-btn');
    if(loginBtn){
        loginBtn.addEventListener('click', () => {
            console.log('Login button clicked');
        });
    }
});

// Placeholder for QR Payment Verification
function verifyQRPayment(paymentId){
    // Future implementation for automatic QR verification
    console.log('QR Payment Verified for ID:', paymentId);
}
