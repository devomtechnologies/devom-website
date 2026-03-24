// REGISTER USER
function registerUser() {
    let userId = document.getElementById("userid").value;
    let password = document.getElementById("password").value;
    let owner = document.getElementById("owner").value;

    if (userId === "" || password === "") {
        alert("Please fill all fields");
        return;
    }

    const userData = {
        userId: userId,
        password: password,
        owner: owner,
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

    // 👉 SESSION SAVE
    localStorage.setItem("loggedInUser", user);

    alert("Login Successful!");
    window.location.href = "dashboard.html";
}


// CHECK LOGIN (Dashboard security)
function checkLogin() {
    let user = localStorage.getItem("loggedInUser");

    if (!user) {
        alert("Please login first!");
        window.location.href = "tms-login.html";
    }
}


// SHOW USER NAME
function loadDashboard() {
    let user = localStorage.getItem("loggedInUser");

    if (!user) return;

    let userData = JSON.parse(localStorage.getItem(user));

    if (userData) {
        document.getElementById("welcomeUser").innerText =
            "Welcome, " + userData.owner;
    }
}


// LOGOUT
function logout() {
    localStorage.removeItem("loggedInUser");
    alert("Logged out successfully");
    window.location.href = "tms-login.html";
}
