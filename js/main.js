// ================= LOGIN SYSTEM =================

function checkLogin() {
    if (!localStorage.getItem("loggedInUser")) {
        window.location.href = "tms-login.html";
    }
}

function loadDashboard() {
    let user = localStorage.getItem("loggedInUser");
    let el = document.getElementById("welcomeUser");
    if (el) el.innerText = "Welcome " + user;
}

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "tms-login.html";
}

// ================= SAVE DISPATCH (CLOUD) =================

async function saveDispatch() {

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
        purchaseAmount: Number(document.getElementById("purchaseAmount").value),
        saleAmount: Number(document.getElementById("saleAmount").value),
        lrNumber: document.getElementById("lrNumber").value,
        date: new Date().toLocaleString()
    };

    let editId = localStorage.getItem("editId");

    if (editId) {
        let oldDoc = await db.collection("dispatch").doc(editId).get();
        let oldData = oldDoc.data();

        await saveAuditLog(oldData, dispatch);

        await db.collection("dispatch").doc(editId).update(dispatch);

        localStorage.removeItem("editId");

        alert("Updated Successfully!");

    } else {
        await db.collection("dispatch").add(dispatch);
        alert("Saved to Cloud!");
    }

    location.reload();
}

// ================= LOAD DISPATCH =================

async function loadDispatchList() {

    let table = document.querySelector("#dispatchTable tbody");
    if (!table) return;

    table.innerHTML = "";

    let snapshot = await db.collection("dispatch").get();

    snapshot.forEach(doc => {

        let d = doc.data();
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
        <td>
            <button onclick="editDispatch('${doc.id}')">Edit</button>
            <button onclick="deleteDispatch('${doc.id}')">Delete</button>
        </td>
        </tr>`;
    });
}

// ================= EDIT =================

async function editDispatch(id) {

    let doc = await db.collection("dispatch").doc(id).get();
    let d = doc.data();

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

    localStorage.setItem("editId", id);
}

// ================= DELETE =================

async function deleteDispatch(id) {

    if (confirm("Delete this record?")) {
        await db.collection("dispatch").doc(id).delete();
        alert("Deleted!");
        location.reload();
    }
}

// ================= AUDIT LOG =================

async function saveAuditLog(oldData, newData) {

    let time = new Date().toLocaleString();

    for (let key in oldData) {
        if (oldData[key] != newData[key]) {

            await db.collection("auditLogs").add({
                time,
                vehicle: oldData.vehicleNo,
                field: key,
                oldValue: oldData[key],
                newValue: newData[key]
            });
        }
    }
}

async function loadAuditLog() {

    let table = document.querySelector("#auditTable tbody");
    if (!table) return;

    table.innerHTML = "";

    let snapshot = await db.collection("auditLogs").get();

    snapshot.forEach(doc => {
        let l = doc.data();

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

// ================= LEDGER =================

async function loadLedger() {

    let table = document.querySelector("#ledgerTable tbody");
    if (!table) return;

    table.innerHTML = "";

    let totalPurchase = 0, totalSale = 0;

    let snapshot = await db.collection("dispatch").get();

    snapshot.forEach(doc => {

        let d = doc.data();
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
    });

    let summary = document.getElementById("ledgerSummary");
    if (summary) {
        summary.innerText =
            "Total Purchase: " + totalPurchase +
            " | Total Sale: " + totalSale +
            " | Profit: " + (totalSale - totalPurchase);
    }
}

// ================= INVOICE =================

async function generateInvoice() {

    let party = document.getElementById("partyFilter").value;
    let snapshot = await db.collection("dispatch").get();

    let html = `
    <h2 style="text-align:center;">DEVOM TRANSPORT</h2>
    <h3>Invoice - ${party}</h3>
    <table border="1" width="100%">
    <tr>
    <th>Date</th>
    <th>Vehicle</th>
    <th>Route</th>
    <th>Amount</th>
    </tr>`;

    let total = 0;

    snapshot.forEach(doc => {

        let d = doc.data();

        if (d.party1 === party || d.party2 === party) {

            total += d.saleAmount;

            html += `
            <tr>
            <td>${d.date}</td>
            <td>${d.vehicleNo}</td>
            <td>${d.from} → ${d.to}</td>
            <td>${d.saleAmount}</td>
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
