// REGISTER USER
function registerUser() {
    let userId = document.getElementById("userid").value;
    let password = document.getElementById("password").value;

    if (userId === "" || password === "") {
        alert("Please fill all fields");
        return;
    }

    const userData = {
        userId: userId,
        password: password,
        paymentDone: false
    };

    localStorage.setItem(userId, JSON.stringify(userData));

    alert("Registration Successful! Now complete payment below.");
}


// VERIFY PAYMENT
function verifyPayment() {
    let userId = document.getElementById("paymentUserId").value;

    if (userId === "") {
        alert("Enter User ID first");
        return;
    }

    let userData = JSON.parse(localStorage.getItem(userId));

    if (!userData) {
        alert("User not found!");
        return;
    }

    userData.paymentDone = true;

    localStorage.setItem(userId, JSON.stringify(userData));

    alert("Payment Verified Successfully!");

    window.location.href = "tms-login.html";
}


// LOGIN
function login() {
    let user = document.getElementById("userid").value;
    let pass = document.getElementById("password").value;

    if (user === "" || pass === "") {
        alert("Please fill all fields");
        return;
    }

    let userData = JSON.parse(localStorage.getItem(user));

    if (!userData) {
        alert("User not found!");
        return;
    }

    if (userData.password !== pass) {
        alert("Wrong password!");
        return;
    }

    if (!userData.paymentDone) {
        alert("Please complete payment first!");
        return;
    }

    alert("Login Successful!");
    window.location.href = "dashboard.html";
}
