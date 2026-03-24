// REGISTER
function registerUser() {
    let userId = document.getElementById("userid").value;
    let password = document.getElementById("password").value;
    let owner = document.getElementById("owner").value;

    const userData = {
        userId,
        password,
        owner,
        paymentDone: false
    };

    localStorage.setItem(userId, JSON.stringify(userData));
    alert("Registration Successful!");
}

// VERIFY PAYMENT
function verifyPayment() {
    let userId = document.getElementById("paymentUserId").value;

    let userData = JSON.parse(localStorage.getItem(userId));

    if (!userData) {
        alert("User not found!");
        return;
    }

    userData.paymentDone = true;
    localStorage.setItem(userId, JSON.stringify(userData));

    alert("Payment Verified!");
    window.location.href = "tms-login.html";
}

// LOGIN
function login() {
    let user = document.getElementById("userid").value;
    let pass = document.getElementById("password").value;

    let userData = JSON.parse(localStorage.getItem(user));

    if (!userData || userData.password !== pass) {
        alert("Invalid login");
        return;
    }

    if (!userData.paymentDone) {
        alert("Complete payment first");
        return;
    }

    localStorage.setItem("loggedInUser", user);
    window.location.href = "dashboard.html";
}

// CHECK LOGIN
function checkLogin() {
    if (!localStorage.getItem("loggedInUser")) {
        window.location.href = "tms-login.html";
    }
}

// LOAD DASHBOARD
function loadDashboard() {
    let user = localStorage.getItem("loggedInUser");
    let data = JSON.parse(localStorage.getItem(user));

    document.getElementById("welcomeUser").innerText =
        "Welcome, " + data.owner;
}

// LOGOUT
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "tms-login.html";
}

// SAVE / UPDATE DISPATCH
function saveDispatch() {
    let dispatch = {
        party1: document.getElementById("party1").value,
        party2: document.getElementById("party2").value,
        from: document.getElementById("from").value,
        to: document.getElementById("to").value,
        vehicleNo: document.getElementById("vehicleNo").value,
        driverName: document.getElementById("driverName").value,
        driverMobile: document.getElementById("driverMobile").value,
        vehicleType: document.getElementById("vehicleType").value,
        wheels: document.getElementById("wheels").value,
        purchaseAmount: document.getElementById("purchaseAmount").value,
        saleAmount: document.getElementById("saleAmount").value,
        lrNumber: document.getElementById("lrNumber").value
    };

    let data = JSON.parse(localStorage.getItem("dispatchData")) || [];

    let editIndex = localStorage.getItem("editIndex");

    if (editIndex !== null) {
        data[editIndex] = dispatch;
        localStorage.removeItem("editIndex");
        alert("Updated!");
    } else {
        data.push(dispatch);
        alert("Saved!");
    }

    localStorage.setItem("dispatchData", JSON.stringify(data));

    location.reload();
}

// LOAD DISPATCH LIST
function loadDispatchList() {
    let data = JSON.parse(localStorage.getItem("dispatchData")) || [];

    let table = document.querySelector("#dispatchTable tbody");
    table.innerHTML = "";

    data.forEach((d, i) => {
        let profit = d.saleAmount - d.purchaseAmount;

        table.innerHTML += `
        <tr>
          <td>${d.vehicleNo}</td>
          <td>${d.from} → ${d.to}</td>
          <td>${d.party1}</td>
          <td>${d.party2}</td>
          <td>${d.purchaseAmount}</td>
          <td>${d.saleAmount}</td>
          <td>${profit}</td>
          <td><button onclick="editDispatch(${i})">Edit</button></td>
        </tr>
        `;
    });
}

// EDIT DISPATCH
function editDispatch(index) {
    let data = JSON.parse(localStorage.getItem("dispatchData"));
    let d = data[index];

    document.getElementById("party1").value = d.party1;
    document.getElementById("party2").value = d.party2;
    document.getElementById("from").value = d.from;
    document.getElementById("to").value = d.to;
    document.getElementById("vehicleNo").value = d.vehicleNo;
    document.getElementById("driverName").value = d.driverName;
    document.getElementById("driverMobile").value = d.driverMobile;
    document.getElementById("vehicleType").value = d.vehicleType;
    document.getElementById("wheels").value = d.wheels;
    document.getElementById("purchaseAmount").value = d.purchaseAmount;
    document.getElementById("saleAmount").value = d.saleAmount;
    document.getElementById("lrNumber").value = d.lrNumber;

    localStorage.setItem("editIndex", index);
}
