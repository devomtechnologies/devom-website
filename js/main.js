// =======================
// Transporter Registration/Login System
// =======================

// ----- QR Payment Verification Demo -----
function verifyQRPayment(userId){
  // Simulate payment check
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demo, always return paid = true
      resolve({paid: true});
    }, 1000);
  });
}

// ----- Login Form -----
const loginForm = document.getElementById('loginForm');
if(loginForm){
  loginForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const userId = document.getElementById('userId').value.trim();
    const password = document.getElementById('password').value.trim();

    const storedUser = JSON.parse(localStorage.getItem(userId));
    if(storedUser && storedUser.password === password){
      // Check QR Payment
      const payment = await verifyQRPayment(userId);
      if(payment.paid){
        alert('Payment Verified! Login Successful');
        location.href = 'dashboard.html';
      } else {
        alert('Payment Pending! Please complete payment.');
      }
    } else {
      alert('Invalid User ID or Password');
    }
  });
}

// ----- Register Form -----
const registerForm = document.getElementById('registerForm');
if(registerForm){
  registerForm.addEventListener('submit', function(e){
    e.preventDefault();
    const userId = document.getElementById('userId').value.trim();

    if(localStorage.getItem(userId)){
      alert('User ID already exists!');
      return;
    }

    const userData = {
      ownerName: document.getElementById('ownerName').value.trim(),
      firmName: document.getElementById('firmName').value.trim(),
      email: document.getElementById('email').value.trim(),
      mobile: document.getElementById('mobile').value.trim(),
      city: document.getElementById('city').value.trim(),
      state: document.getElementById('state').value.trim(),
      password: document.getElementById('password').value.trim()
    };

    localStorage.setItem(userId, JSON.stringify(userData));
    alert('Registration Successful! Please complete QR Payment');
    location.href = 'tms-login.html';
  });
}

// =======================
// Optional: Dashboard Cards Click
// =======================
const dashboardCards = document.querySelectorAll('.dashboard-card');
dashboardCards.forEach(card => {
  card.addEventListener('click', function(){
    const link = card.getAttribute('data-link');
    if(link) location.href = link;
  });
});
