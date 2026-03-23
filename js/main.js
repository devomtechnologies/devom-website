function verifyPayment() {
    let userId = document.getElementById("userid").value;

    if (userId === "") {
        alert("Enter User ID first");
        return;
    }

    alert("Payment Verified Successfully!");

    localStorage.setItem(userId, "paid");

    window.location.href = "tms-login.html";
}


function login() {
    let user = document.getElementById("userid").value;
    let pass = document.getElementById("password").value;

    if (user === "" || pass === "") {
        alert("Please fill all fields");
        return;
    }

    let paymentStatus = localStorage.getItem(user);

    if (paymentStatus !== "paid") {
        alert("Please complete payment first!");
        return;
    }

    alert("Login Successful!");
    window.location.href = "dashboard.html";
}
