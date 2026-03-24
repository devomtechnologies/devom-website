// ================= LOGIN SYSTEM =================

function checkLogin() {
    if (!localStorage.getItem("loggedInUser")) {
        window.location.href = "tms-login.html";
    }
}

function loadDashboard() {
    let user = localStorage.getItem("loggedInUser");
    document.getElementById("welcomeUser").innerText = "Welcome " + user;
}

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "tms-login.html";
}

// ================= SAVE DISPATCH =================

function saveDispatch() {

    let dispatch = {
        party1: party1.value,
        party2: party2.value,
        from: from.value,
        to: to.value,
        vehicleNo: vehicleNo.value,
        driverName: driverName.value,
        driverMobile: driverMobile.value,
        vehicleType: vehicleType.value,
        wheels: wheels.value,
        purchaseAmount: Number(purchaseAmount.value),
        saleAmount: Number(saleAmount.value),
        lrNumber: lrNumber.value,
        date: new Date().toLocaleDateString()
    };

    let data = JSON.parse(localStorage.getItem("dispatchData")) || [];
    let editIndex = localStorage.getItem("editIndex");

    if (editIndex !== null) {

        let oldData = data[editIndex];

        // 🔥 AUDIT LOG SAVE
        saveAuditLog(oldData, dispatch);

        data[editIndex] = dispatch;
        localStorage.removeItem("editIndex");

        alert("Updated Successfully!");

    } else {

        data.push(dispatch);
        alert("Saved Successfully!");
    }

    localStorage.setItem("dispatchData", JSON.stringify(data));

    location.reload();
}

// ================= LOAD DISPATCH =================

function loadDispatchList() {
    let data = JSON.parse(localStorage.getItem("dispatchData")) || [];
    let table = document.querySelector("#dispatchTable tbody");

    if (!table) return;

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
        </tr>`;
    });

    loadPartyDropdown(data);
}

// ================= EDIT =================

function editDispatch(i) {
    let d = JSON.parse(localStorage.getItem("dispatchData"))[i];

    party1.value = d.party1;
    party2.value = d.party2;
    from.value = d.from;
    to.value = d.to;
    vehicleNo.value = d.vehicleNo;
    driverName.value = d.driverName;
    driverMobile.value = d.driverMobile;
    vehicleType.value = d.vehicleType;
    wheels.value = d.wheels;
    purchaseAmount.value = d.purchaseAmount;
    saleAmount.value = d.saleAmount;
    lrNumber.value = d.lrNumber;

    localStorage.setItem("editIndex", i);
}

// ================= PARTY DROPDOWN =================

function loadPartyDropdown(data) {
    let select = document.getElementById("partyFilter");
    if (!select) return;

    let parties = new Set();

    data.forEach(d => {
        if (d.party1) parties.add(d.party1);
        if (d.party2) parties.add(d.party2);
    });

    select.innerHTML = `<option value="">Select Party</option>`;

    parties.forEach(p => {
        select.innerHTML += `<option value="${p}">${p}</option>`;
    });
}

// ================= LEDGER =================

function loadLedger() {
    let data = JSON.parse(localStorage.getItem("dispatchData")) || [];
    let party = document.getElementById("partyFilter")?.value;

    let table = document.querySelector("#ledgerTable tbody");
    if (!table) return;

    table.innerHTML = "";

    let totalPurchase = 0, totalSale = 0;

    data.forEach(d => {
        if (!party || d.party1 === party || d.party2 === party) {

            let profit = d.saleAmount - d.purchaseAmount;

            totalPurchase += d.purchaseAmount;
            totalSale += d.saleAmount;

            table.innerHTML += `
            <tr>
            <td>${d.date}</td>
            <td>${d.vehicleNo}</td>
            <td>${d.from} → ${d.to}</td>
            <td>${d.purchaseAmount}</td>
            <td>${d.saleAmount}</td>
            <td>${profit}</td>
            </tr>`;
        }
    });

    let summary = document.getElementById("ledgerSummary");
    if (summary) {
        summary.innerText =
            "Total Purchase: " + totalPurchase +
            " | Total Sale: " + totalSale +
            " | Profit: " + (totalSale - totalPurchase);
    }
}

// ================= AUDIT =================

function saveAuditLog(oldData, newData) {
    let logs = JSON.parse(localStorage.getItem("auditLogs")) || [];
    let time = new Date().toLocaleString();

    for (let key in oldData) {
        if (oldData[key] != newData[key]) {
            logs.push({
                time,
                vehicle: oldData.vehicleNo,
                field: key,
                oldValue: oldData[key],
                newValue: newData[key]
            });
        }
    }

    localStorage.setItem("auditLogs", JSON.stringify(logs));
}

function loadAuditLog() {
    let logs = JSON.parse(localStorage.getItem("auditLogs")) || [];
    let table = document.querySelector("#auditTable tbody");

    if (!table) return;

    table.innerHTML = "";

    logs.reverse().forEach(l => {
        table.innerHTML += `
        <tr>
        <td>${l.time}</td>
        <td>${l.vehicle}</td>
        <td>${l.field}</td>
        <td>${l.oldValue}</td>
        <td>${l.newValue}</td>
        </tr>`;
    });
}

// ================= INVOICE =================

function generateInvoice() {
    let party = document.getElementById("partyFilter").value;
    let data = JSON.parse(localStorage.getItem("dispatchData")) || [];

    let html = `
    <h2 style="text-align:center;">DEVOM TRANSPORT</h2>
    <h3>Invoice - ${party}</h3>
    <table border="1" width="100%" style="border-collapse:collapse;">
    <tr>
    <th>Date</th>
    <th>Vehicle</th>
    <th>Route</th>
    <th>Amount</th>
    </tr>`;

    let total = 0;

    data.forEach(d => {
        if (d.party1 === party || d.party2 === party) {

            let amount = d.saleAmount;

            total += amount;

            html += `
            <tr>
            <td>${d.date}</td>
            <td>${d.vehicleNo}</td>
            <td>${d.from} → ${d.to}</td>
            <td>${amount}</td>
            </tr>`;
        }
    });

    html += `
    <tr>
    <td colspan="3"><b>Total</b></td>
    <td><b>${total}</b></td>
    </tr>
    </table>`;

    document.getElementById("printArea").innerHTML = html;
}

// ================= PRINT =================

function printInvoice() {
    window.print();
}
