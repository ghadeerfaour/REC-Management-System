// ======================================================
// SUPABASE CONFIGURATION
// ======================================================

const SUPABASE_URL =
    "https://cssgxadpnujqhqrblrgt.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_y-bHC3N9EwNHyb7MOu1_YQ_7pkmzY-R";


// ======================================================
// SUPABASE HEADERS
// ======================================================

function getSupabaseHeaders() {
    return {
        "apikey": SUPABASE_KEY
    };
}

// ======================================================
// LOGIN
// ======================================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const usernameInput =
            document.getElementById("username");

        const passwordInput =
            document.getElementById("password");

        const loginMessage =
            document.getElementById("loginMessage");


        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value;


        // Check empty fields

        if (username === "" || password === "") {

            loginMessage.textContent =
                "⚠ Please enter your username and password.";

            loginMessage.style.color = "red";

            return;
        }


        loginMessage.textContent =
            "Logging in...";

        loginMessage.style.color =
            "#555";


        try {

            const url =
                SUPABASE_URL +
                "/rest/v1/users" +
                "?username=eq." +
                encodeURIComponent(username) +
                "&select=*";


            console.log("Connecting to:", url);


            const response =
                await fetch(
                    url,
                    {
                        method: "GET",

                        headers:
                            getSupabaseHeaders()
                    }
                );


            console.log(
                "Supabase response:",
                response.status
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Supabase error:",
                    errorText
                );

                throw new Error(
                    errorText
                );
            }


            const users =
                await response.json();


            console.log(
                "Users found:",
                users
            );


            // No user found

            if (users.length === 0) {

                loginMessage.textContent =
                    "❌ Invalid username or password.";

                loginMessage.style.color =
                    "red";

                return;
            }


            const user =
                users[0];


            // Check active status

            if (user.is_active === false) {

                loginMessage.textContent =
                    "❌ This account is inactive.";

                loginMessage.style.color =
                    "red";

                return;
            }


            // Check password

            if (
                String(user.password) !==
                String(password)
            ) {

                loginMessage.textContent =
                    "❌ Invalid username or password.";

                loginMessage.style.color =
                    "red";

                return;
            }


            // ==================================================
            // LOGIN SUCCESS
            // ==================================================

            const loggedInUser = {

                user_id:
                    user.user_id,

                full_name:
                    user.full_name,

                username:
                    user.username,

                role:
                    user.role

            };


            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(
                    loggedInUser
                )
            );


            loginMessage.textContent =
                "✓ Login successful!";

            loginMessage.style.color =
                "green";


            // Go to employee home

           setTimeout(function () {

    const userRole =
        String(user.role)
            .trim()
            .toLowerCase();

    console.log("User role:", userRole);

    if (userRole === "owner") {

        window.location.href =
            "owner-home.html";

    } else {

        window.location.href =
            "employee-home.html";

    }

}, 500);

        }


        catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );


            loginMessage.textContent =
                "❌ Could not connect to the database.";

            loginMessage.style.color =
                "red";

        }

    });

}
// ======================================================
// GO TO CORRECT HOME PAGE
// ======================================================

function goToCorrectHome() {

    const savedUser =
        localStorage.getItem("loggedInUser");


    if (!savedUser) {

        window.location.href =
            "index.html";

        return;

    }


    const loggedInUser =
        JSON.parse(savedUser);


    const userRole =
        String(
            loggedInUser.role || ""
        )
        .trim()
        .toLowerCase();


    if (userRole === "owner") {

        window.location.href =
            "owner-home.html";

    } else {

        window.location.href =
            "employee-home.html";

    }

}


// ======================================================
// EMPLOYEE HOME
// ======================================================

if (
    window.location.pathname
        .toLowerCase()
        .includes("employee-home")
) {

    const loggedInUser =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );


    // Not logged in

    if (!loggedInUser) {

        window.location.href =
            "index.html";

    }


    else {

        const employeeName =
            document.getElementById(
                "employeeName"
            );


        if (employeeName) {

            employeeName.textContent =
                loggedInUser.full_name;

        }


        const employeeUsername =
            document.getElementById(
                "employeeUsername"
            );


        if (employeeUsername) {

            employeeUsername.textContent =
                loggedInUser.username;

        }

    }

}


// ======================================================
// OPEN NEW RECEIPT
// ======================================================

function openNewReceipt() {

    window.location.href =
        "new-receipt.html";

}


// ======================================================
// OPEN VIEW RECEIPTS
// ======================================================

function openReceipts() {

    window.location.href =
        "receipts.html";

}
function openBiocareReceipts() {

    window.location.href =
        "bioclare-receipts.html";

}
// ======================================================
// OPEN OWNER GREENLAB RECEIPTS
// ======================================================

function openOwnerGreenlabReceipts() {

    window.location.href =
        "receipts.html";

}


// ======================================================
// OPEN OWNER BIOCLARE RECEIPTS
// ======================================================

function openOwnerBiocareReceipts() {

    window.location.href =
        "bioclare-receipts.html";

}


// ======================================================
// NEW RECEIPT
// ======================================================

const receiptForm =
    document.getElementById(
        "receiptForm"
    );


if (receiptForm) {

    receiptForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const customerName =
                document.getElementById(
                    "customerName"
                ).value.trim();


            const paymentDescription =
                document.getElementById(
                    "paymentDescription"
                ).value.trim();


            const amount =
                document.getElementById(
                    "amount"
                ).value;


            const paymentDate =
                document.getElementById(
                    "paymentDate"
                ).value;
                const receiptType =
    document.querySelector(
        'input[name="receiptType"]:checked'
    )?.value || "actual";
    const company =
    document.querySelector(
        'input[name="company"]:checked'
    )?.value || "GreenLab";


            const receiptMessage =
                document.getElementById(
                    "receiptMessage"
                );


            // Check fields

            if (
                customerName === "" ||
                paymentDescription === "" ||
                amount === "" ||
                paymentDate === ""
            ) {

                receiptMessage.textContent =
                    "⚠ Please complete all fields.";

                receiptMessage.style.color =
                    "red";

                receiptMessage.style.display =
                    "block";

                return;
            }


            // Get logged-in employee

            const loggedInUser =
                JSON.parse(
                    localStorage.getItem(
                        "loggedInUser"
                    )
                );


            if (!loggedInUser) {

                receiptMessage.textContent =
                    "❌ Please login again.";

                receiptMessage.style.color =
                    "red";

                receiptMessage.style.display =
                    "block";

                return;
            }


            receiptMessage.textContent =
                "Saving receipt...";

            receiptMessage.style.color =
                "#555";

            receiptMessage.style.display =
                "block";


            try {

                const response =
                    await fetch(
                        SUPABASE_URL +
                        "/rest/v1/payment_receipts",
                        {
                            method: "POST",

                            headers: {
                                ...getSupabaseHeaders(),

                                "Content-Type":
                                    "application/json",

                                "Prefer":
                                    "return=representation"
                            },

                            body:
                                JSON.stringify({

                                    customer_name:
                                        customerName,

                                    payment_description:
                                        paymentDescription,

                                    amount:
                                        parseFloat(
                                            amount
                                        ),

                                    payment_date:
                                        paymentDate,
                                          receipt_type:
        receiptType,

company:
    company,


                                    created_by:
                                        loggedInUser.user_id

                                })
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    console.error(
                        "SAVE RECEIPT ERROR:",
                        errorText
                    );

                    throw new Error(
                        errorText
                    );
                }


                const savedReceipt =
                    await response.json();


                console.log(
                    "Saved receipt:",
                    savedReceipt
                );


                // SUCCESS MESSAGE

                receiptMessage.innerHTML =
                    "✓ Receipt saved successfully!";

                receiptMessage.style.color =
                    "#218838";

                receiptMessage.style.display =
                    "block";


                // Clear form

                receiptForm.reset();

            }


            catch (error) {

                console.error(
                    "RECEIPT ERROR:",
                    error
                );


                receiptMessage.textContent =
                    "❌ Could not save receipt.";

                receiptMessage.style.color =
                    "red";

                receiptMessage.style.display =
                    "block";

            }

        }
    );

}


// ======================================================
// VIEW RECEIPTS
// ======================================================

const receiptsTableBody =
    document.getElementById(
        "receiptsTableBody"
    );


if (receiptsTableBody) {

    loadReceipts();


    async function loadReceipts() {

        try {

          const url =
    SUPABASE_URL +
    "/rest/v1/payment_receipts" +
    "?select=receipt_id,greenlab_receipt_id,official_receipt_id,customer_name,payment_description,amount,payment_date,receipt_type,company,created_by,created_at" +
    "&company=eq.GreenLab" +
    "&order=receipt_id.desc";

            console.log(
                "Loading receipts..."
            );


            const response =
                await fetch(
                    url,
                    {
                        method: "GET",

                        headers:
                            getSupabaseHeaders()
                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "LOAD RECEIPTS ERROR:",
                    errorText
                );

                throw new Error(
                    errorText
                );
            }


            const receipts =
                await response.json();


            console.log(
                "Receipts:",
                receipts
            );


            displayReceipts(
                receipts
            );

        }


        catch (error) {

            console.error(
                "RECEIPTS ERROR:",
                error
            );


            receiptsTableBody.innerHTML = `

                <tr>

                    <td colspan="7">

                        ❌ Could not load receipts.

                    </td>

                </tr>

            `;

        }

    }


    // ==================================================
    // DISPLAY RECEIPTS
    // ==================================================

    function displayReceipts(
        receipts
    ) {

        receiptsTableBody.innerHTML =
            "";


        if (receipts.length === 0) {

            receiptsTableBody.innerHTML = `

                <tr>

                    <td colspan="7">

                        No receipts found.

                    </td>

                </tr>

            `;

            return;
        }


        receipts.forEach(
            function (receipt) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
    ${
        receipt.receipt_type === "official"
            ? receipt.official_receipt_id
            : receipt.greenlab_receipt_id
    }
</td>
                    <td>
                        ${escapeHTML(
                            receipt.customer_name
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            receipt.payment_description
                        )}
                    </td>

                    <td>
                        ${Number(
                            receipt.amount
                        ).toFixed(2)}
                    </td>

                    <td>
                        ${receipt.payment_date}
                    </td>

                    <td>
                        ${receipt.created_by ?? ""}
                    </td>

                    <td>
                        ${formatDate(
                            receipt.created_at
                        )}
                    </td>
                    <td>
    <span class="receipt-type-badge">
        ${
            receipt.receipt_type === "official"
                ? "Official"
                : "Actual"
        }
    </span>
</td>
                    <td>
                    
     <td>
        <button
            type="button"
            class="pdf-btn"
            onclick="printReceipt(${receipt.receipt_id})">

            🖨 PDF

        </button>
    </td>
      `;


                receiptsTableBody.appendChild(
                    row
                );

            }
        );

    }


    // ==================================================
    // SEARCH RECEIPTS
    // ==================================================

    const receiptSearch =
        document.getElementById(
            "receiptSearch"
        );


    if (receiptSearch) {

        receiptSearch.addEventListener(
            "input",
            async function () {

                const search =
                    receiptSearch.value.trim();


                try {

                    let url =
    SUPABASE_URL +
    "/rest/v1/payment_receipts" +
    "?select=receipt_id,greenlab_receipt_id,official_receipt_id,customer_name,payment_description,amount,payment_date,receipt_type,company,created_by,created_at" +
    "&company=eq.GreenLab" +
    "&order=receipt_id.desc";

                    if (search !== "") {

                        url +=
                            "&customer_name=ilike.*" +
                            encodeURIComponent(
                                search
                            ) +
                            "*";

                    }


                    const response =
                        await fetch(
                            url,
                            {
                                method: "GET",

                                headers:
                                    getSupabaseHeaders()
                            }
                        );


                    if (!response.ok) {

                        const errorText =
                            await response.text();

                        console.error(
                            "SEARCH ERROR:",
                            errorText
                        );

                        throw new Error(
                            errorText
                        );

                    }


                    const receipts =
                        await response.json();


                    displayReceipts(
                        receipts
                    );

                }


                catch (error) {

                    console.error(
                        "SEARCH ERROR:",
                        error
                    );

                }

            }
        );

    }

}


// ======================================================
// BACK TO EMPLOYEE HOME
// ======================================================

function goBack() {

    window.location.href =
        "employee-home.html";

}
function printReceipt(receiptId) {

    const receiptWindow =
        window.open(
            "",
            "_blank",
            "width=800,height=900"
        );


    if (!receiptWindow) {

        alert(
            "Please allow pop-ups for this website."
        );

        return;
    }


    receiptWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>Payment Receipt #${receiptId}</title>

            <style>

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    padding: 40px;

                    font-family:
                        Arial,
                        Helvetica,
                        sans-serif;

                    color: #26364a;

                    background: white;
                }

                .receipt {
                    max-width: 750px;
                    margin: auto;
                    padding: 40px;

                    border: 1px solid #ddd;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;

                    padding-bottom: 20px;

                    border-bottom:
                        2px solid #26364a;
                }

                h1 {
                    margin: 0;

                    font-size: 28px;
                }

                .subtitle {
                    margin-top: 8px;

                    color: #687580;
                }

                .receipt-number {
                    text-align: right;
                }

                .receipt-number strong {
                    display: block;

                    margin-top: 5px;

                    font-size: 22px;

                    color: #2b60a0;
                }

                .section {
                    margin-top: 30px;
                }

                .section-title {
                    margin-bottom: 12px;

                    font-size: 15px;

                    font-weight: bold;

                    color: #26364a;
                }

                .info-box {
                    padding: 18px;

                    background: #f5f7f9;

                    border-radius: 8px;
                }

                .row {
                    display: flex;

                    justify-content:
                        space-between;

                    gap: 20px;

                    padding: 15px 0;

                    border-bottom:
                        1px solid #e5e8eb;
                }

                .row:last-child {
                    border-bottom: none;
                }

                .label {
                    color: #687580;
                }

                .value {
                    font-weight: bold;

                    text-align: right;
                }

                .amount {
                    margin-top: 25px;

                    padding: 20px;

                    background: #f5f7f9;

                    text-align: center;

                    border-radius: 8px;
                }

                .amount-label {
                    color: #687580;

                    font-size: 14px;
                }

                .amount-value {
                    margin-top: 8px;

                    font-size: 30px;

                    font-weight: bold;

                    color: #2b60a0;
                }

                .footer {
                    margin-top: 40px;

                    padding-top: 20px;

                    border-top:
                        1px solid #ddd;

                    text-align: center;

                    color: #687580;
                }

                .success {
                    color: #2c825d;

                    font-weight: bold;
                }

                @media print {

                    body {
                        padding: 0;
                    }

                    .receipt {
                        border: none;
                        padding: 20px;
                    }

                }

            </style>

        </head>


        <body>

            <div class="receipt">

                <div class="header">

                    <div>

                        <h1>
                            PAYMENT RECEIPT
                        </h1>

                        <div class="subtitle">
                            Payment Receipt Management System
                        </div>

                    </div>


                    <div class="receipt-number">

                        Receipt No.

                        <strong>
                            ${receiptId}
                        </strong>

                    </div>

                </div>


                <div class="section">

                    <div class="section-title">
                        Customer Information
                    </div>

                    <div class="info-box">

                        <div class="row">

                            <span class="label">
                                Customer Name
                            </span>

                            <span
                                class="value"
                                id="printCustomer">
                                Loading...
                            </span>

                        </div>

                    </div>

                </div>


                <div class="section">

                    <div class="section-title">
                        Payment Information
                    </div>

                    <div class="info-box">

                        <div class="row">

                            <span class="label">
                                Description
                            </span>

                            <span
                                class="value"
                                id="printDescription">
                                Loading...
                            </span>

                        </div>


                        <div class="row">

                            <span class="label">
                                Payment Date
                            </span>

                            <span
                                class="value"
                                id="printDate">
                                Loading...
                            </span>

                        </div>


                        <div class="row">

                            <span class="label">
                                Created By
                            </span>

                            <span
                                class="value"
                                id="printEmployee">
                                Loading...
                            </span>

                        </div>

                    </div>

                </div>


                <div class="amount">

                    <div class="amount-label">
                        AMOUNT PAID
                    </div>

                    <div
                        class="amount-value"
                        id="printAmount">

                        Loading...

                    </div>

                </div>


                <div class="footer">

                    <div class="success">
                        ✓ Payment received successfully
                    </div>

                    <p>
                        Thank you for your payment.
                    </p>

                    <small>
                        This receipt was generated electronically.
                    </small>

                </div>

            </div>


            <script>

                const SUPABASE_URL =
                    "${SUPABASE_URL}";

                const SUPABASE_KEY =
                    "${SUPABASE_KEY}";


                fetch(
                    SUPABASE_URL +
                    "/rest/v1/payment_receipts" +
                    "?receipt_id=eq.${receiptId}" +
                    "&select=*",
                    {
                        headers: {
                            "apikey":
                                SUPABASE_KEY
                        }
                    }
                )

                .then(
                    response =>
                        response.json()
                )

                .then(
                    data => {

                        if (
                            !data ||
                            data.length === 0
                        ) {

                            document.body.innerHTML =
                                "<h2>Receipt not found.</h2>";

                            return;
                        }


                        const receipt =
                            data[0];


                        document.getElementById(
                            "printCustomer"
                        ).textContent =
                            receipt.customer_name || "";


                        document.getElementById(
                            "printDescription"
                        ).textContent =
                            receipt.payment_description || "";


                        document.getElementById(
                            "printDate"
                        ).textContent =
                            receipt.payment_date || "";


                        document.getElementById(
                            "printEmployee"
                        ).textContent =
                            receipt.created_by || "";


                        document.getElementById(
                            "printAmount"
                        ).textContent =
                            "$" +
                            Number(
                                receipt.amount || 0
                            ).toFixed(2);


                        setTimeout(
                            function() {

                                window.print();

                            },
                            500
                        );

                    }
                )

                .catch(
                    error => {

                        console.error(
                            error
                        );

                        document.body.innerHTML =
                            "<h2>Could not load receipt.</h2>";

                    }
                );

            <\/script>

        </body>

        </html>

    `);


    receiptWindow.document.close();

}


// ======================================================
// LOGOUT
// ======================================================

function logout() {

    localStorage.removeItem(
        "loggedInUser"
    );


    window.location.href =
        "index.html";

}


// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(
    dateString
) {

    if (!dateString) {

        return "";

    }


    const date =
        new Date(
            dateString
        );


    return date.toLocaleString();

}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}
// ======================================================
// BIOCARE RECEIPTS
// ======================================================

const biocareReceiptsTableBody =
    document.getElementById(
        "biocareReceiptsTableBody"
    );


if (biocareReceiptsTableBody) {

    loadBiocareReceipts();


    async function loadBiocareReceipts() {

        try {

            const url =
                SUPABASE_URL +
                "/rest/v1/payment_receipts" +
                "?select=receipt_id,biocare_receipt_id,biocare_official_receipt_id,customer_name,payment_description,amount,payment_date,receipt_type,company,created_by,created_at" +
                "&company=eq.Biocare" +
                "&order=receipt_id.desc";


            const response =
                await fetch(
                    url,
                    {
                        method: "GET",

                        headers:
                            getSupabaseHeaders()
                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "LOAD BIOCARE RECEIPTS ERROR:",
                    errorText
                );

                throw new Error(
                    errorText
                );
            }


            const receipts =
                await response.json();


            console.log(
                "Biocare Receipts:",
                receipts
            );


            displayBiocareReceipts(
                receipts
            );

        }


        catch (error) {

            console.error(
                "BIOCARE RECEIPTS ERROR:",
                error
            );


            biocareReceiptsTableBody.innerHTML = `

                <tr>

                    <td colspan="9">

                        ❌ Could not load Biocare receipts.

                    </td>

                </tr>

            `;

        }

    }


    // ==================================================
    // DISPLAY BIOCARE RECEIPTS
    // ==================================================

    function displayBiocareReceipts(
        receipts
    ) {

        biocareReceiptsTableBody.innerHTML =
            "";


        if (receipts.length === 0) {

            biocareReceiptsTableBody.innerHTML = `

                <tr>

                    <td colspan="9">

                        No Biocare receipts found.

                    </td>

                </tr>

            `;

            return;
        }


        receipts.forEach(
            function (receipt) {

                const row =
                    document.createElement(
                        "tr"
                    );


                const displayReceiptNumber =
                    receipt.receipt_type === "official"
                        ? receipt.biocare_official_receipt_id
                        : receipt.biocare_receipt_id;


                row.innerHTML = `

                    <td>
                        ${displayReceiptNumber}
                    </td>

                    <td>
                        ${escapeHTML(
                            receipt.customer_name
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            receipt.payment_description
                        )}
                    </td>

                    <td>
                        ${Number(
                            receipt.amount
                        ).toFixed(2)}
                    </td>

                    <td>
                        ${receipt.payment_date}
                    </td>

                    <td>
                        ${receipt.created_by ?? ""}
                    </td>

                    <td>
                        ${formatDate(
                            receipt.created_at
                        )}
                    </td>

                    <td>
                        <span class="receipt-type-badge">
                            ${
                                receipt.receipt_type === "official"
                                    ? "Official"
                                    : "Actual"
                            }
                        </span>
                    </td>

                    <td>

                        <button
                            type="button"
                            class="pdf-btn"
                            onclick="printReceipt(${receipt.receipt_id})">

                            🖨 PDF

                        </button>

                    </td>

                `;


                biocareReceiptsTableBody.appendChild(
                    row
                );

            }
        );

    }


    // ==================================================
    // SEARCH BIOCARE RECEIPTS
    // ==================================================

    const biocareReceiptSearch =
        document.getElementById(
            "biocareReceiptSearch"
        );


    if (biocareReceiptSearch) {

        biocareReceiptSearch.addEventListener(
            "input",
            async function () {

                const search =
                    biocareReceiptSearch.value.trim();


                try {

                    let url =
                        SUPABASE_URL +
                        "/rest/v1/payment_receipts" +
                        "?select=receipt_id,biocare_receipt_id,biocare_official_receipt_id,customer_name,payment_description,amount,payment_date,receipt_type,company,created_by,created_at" +
                        "&company=eq.Biocare" +
                        "&order=receipt_id.desc";


                    if (search !== "") {

                        url +=
                            "&customer_name=ilike.*" +
                            encodeURIComponent(
                                search
                            ) +
                            "*";

                    }


                    const response =
                        await fetch(
                            url,
                            {
                                method: "GET",

                                headers:
                                    getSupabaseHeaders()
                            }
                        );


                    if (!response.ok) {

                        const errorText =
                            await response.text();

                        console.error(
                            "BIOCARE SEARCH ERROR:",
                            errorText
                        );

                        throw new Error(
                            errorText
                        );

                    }


                    const receipts =
                        await response.json();


                    displayBiocareReceipts(
                        receipts
                    );

                }


                catch (error) {

                    console.error(
                        "BIOCARE SEARCH ERROR:",
                        error
                    );

                }

            }
        );

    }

}
// ======================================================
// OWNER DASHBOARD
// ======================================================

if (
    window.location.pathname
        .toLowerCase()
        .includes("owner-home")
) {

    const loggedInUser =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );


    // Make sure user is logged in

    if (!loggedInUser) {

        window.location.href =
            "index.html";

    }


    // Make sure user is actually an owner

    else if (
        String(loggedInUser.role).toLowerCase() !==
        "owner"
    ) {

        window.location.href =
            "employee-home.html";

    }


    else {

        // Show owner name

        const ownerName =
            document.getElementById(
                "ownerName"
            );


        if (ownerName) {

            ownerName.textContent =
                loggedInUser.full_name;

        }


        // Load dashboard

        loadOwnerDashboard();

        loadOwnerReceipts();
        

    }

}


// ======================================================
// OWNER DASHBOARD STATISTICS
// ======================================================

async function loadOwnerDashboard() {

    try {

        const url =
            SUPABASE_URL +
            "/rest/v1/payment_receipts" +
            "?select=amount,company";


        const response =
            await fetch(
                url,
                {
                    method: "GET",

                    headers:
                        getSupabaseHeaders()
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "OWNER DASHBOARD ERROR:",
                errorText
            );

            throw new Error(
                errorText
            );

        }


        const receipts =
            await response.json();


        // Total receipts

        const totalReceipts =
            receipts.length;


        // Total amount

        const totalAmount =
            receipts.reduce(
                function (
                    total,
                    receipt
                ) {

                    return (
                        total +
                        Number(
                            receipt.amount || 0
                        )
                    );

                },
                0
            );


        // GreenLab count

        const greenlabTotal =
            receipts.filter(
                function (receipt) {

                    return (
                        receipt.company ===
                        "GreenLab"
                    );

                }
            ).length;


        // Bioclare count

        const biocareTotal =
            receipts.filter(
                function (receipt) {

                    return (
                        receipt.company ===
                        "Biocare"
                    );

                }
            ).length;


        // Display values

        document.getElementById(
            "totalReceipts"
        ).textContent =
            totalReceipts;


        document.getElementById(
            "totalAmount"
        ).textContent =
            "$" +
            totalAmount.toFixed(2);


        document.getElementById(
            "greenlabTotal"
        ).textContent =
            greenlabTotal;


        document.getElementById(
            "biocareTotal"
        ).textContent =
            biocareTotal;


    }


    catch (error) {

        console.error(
            "OWNER DASHBOARD ERROR:",
            error
        );

    }

}
// ======================================================
// OWNER DASHBOARD
// ======================================================

if (
    window.location.pathname
        .toLowerCase()
        .includes("owner-home")
) {

    // dashboard code...

}



// ======================================================
// OWNER - ALL RECEIPTS
// ======================================================

async function loadOwnerReceipts() {

    const tableBody =
        document.getElementById(
            "ownerReceiptsTableBody"
        );

    if (!tableBody) {
        return;
    }


    try {

        const url =
            SUPABASE_URL +
            "/rest/v1/payment_receipts" +
            "?select=*" +
            "&order=receipt_id.desc";


        const response =
            await fetch(
                url,
                {
                    method: "GET",

                    headers:
                        getSupabaseHeaders()
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "OWNER RECEIPTS ERROR:",
                errorText
            );

            throw new Error(
                errorText
            );

        }


        const receipts =
            await response.json();


        console.log(
            "OWNER RECEIPTS:",
            receipts
        );


        displayOwnerReceipts(
            receipts
        );

    }


    catch (error) {

        console.error(
            "OWNER RECEIPTS ERROR:",
            error
        );


        tableBody.innerHTML = `

            <tr>

                <td colspan="9">

                    ❌ Could not load receipts.

                </td>

            </tr>

        `;

    }

}


// ======================================================
// DISPLAY OWNER RECEIPTS
// ======================================================

function displayOwnerReceipts(
    receipts
) {

    const tableBody =
        document.getElementById(
            "ownerReceiptsTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (
        !receipts ||
        receipts.length === 0
    ) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="9">

                    No receipts found.

                </td>

            </tr>

        `;

        return;

    }


    receipts.forEach(
        function (receipt) {
            console.log(
    "EDIT RECEIPT DATABASE ID:",
    receipt.receipt_id,
    receipt
);

            const row =
                document.createElement(
                    "tr"
                );


            let displayReceiptNumber =
                receipt.receipt_id;


            // GreenLab

            if (
                receipt.company ===
                "GreenLab"
            ) {

                if (
                    receipt.receipt_type ===
                    "official"
                ) {

                    displayReceiptNumber =
                        receipt.official_receipt_id;

                }

                else if (
                    receipt.greenlab_receipt_id
                    !== undefined
                ) {

                    displayReceiptNumber =
                        receipt.greenlab_receipt_id;

                }

            }


            // Bioclare

            if (
                receipt.company ===
                "Biocare"
                ||
                receipt.company ===
                "Bioclare"
            ) {

                if (
                    receipt.receipt_type ===
                    "official"
                ) {

                    displayReceiptNumber =
                        receipt.biocare_official_receipt_id;

                }

                else if (
                    receipt.biocare_receipt_id
                    !== undefined
                ) {

                    displayReceiptNumber =
                        receipt.biocare_receipt_id;

                }

            }


            row.innerHTML = `

                <td>
                    ${displayReceiptNumber ?? ""}
                </td>

                <td>
                    ${escapeHTML(
                        receipt.company || ""
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        receipt.customer_name || ""
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        receipt.payment_description || ""
                    )}
                </td>

                <td>
                    $${Number(
                        receipt.amount || 0
                    ).toFixed(2)}
                </td>

                <td>
                    ${receipt.payment_date || ""}
                </td>

                <td>

                    <span class="receipt-type-badge">

                        ${
                            receipt.receipt_type ===
                            "official"
                                ? "Official"
                                : "Actual"
                        }

                    </span>

                </td>

                <td>
                    ${receipt.created_by ?? ""}
                </td>

                <td>

                    <button
                        type="button"
                        class="edit-receipt-btn"
                        onclick="editReceipt(${receipt.receipt_id})">

                        Edit

                    </button>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}


// ======================================================
// START OWNER RECEIPTS
// ======================================================

if (
    window.location.pathname
        .toLowerCase()
        .includes("owner-home")
) {

    loadOwnerReceipts();
    


}
// ======================================================
// OWNER RECEIPTS SEARCH
// ======================================================

const ownerReceiptSearch =
    document.getElementById(
        "ownerReceiptSearch"
    );


if (ownerReceiptSearch) {

    ownerReceiptSearch.addEventListener(
        "input",
        async function () {

            const search =
                ownerReceiptSearch.value.trim();


            try {

                let url =
                    SUPABASE_URL +
                    "/rest/v1/payment_receipts" +
                    "?select=*" +
                    "&order=receipt_id.desc";


                // Search by customer name

                if (search !== "") {

                    url +=
                        "&customer_name=ilike.*" +
                        encodeURIComponent(
                            search
                        ) +
                        "*";

                }


                const response =
                    await fetch(
                        url,
                        {
                            method: "GET",

                            headers:
                                getSupabaseHeaders()
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    console.error(
                        "OWNER SEARCH ERROR:",
                        errorText
                    );

                    throw new Error(
                        errorText
                    );

                }


                const receipts =
                    await response.json();


                displayOwnerReceipts(
                    receipts
                );

            }


            catch (error) {

                console.error(
                    "OWNER SEARCH ERROR:",
                    error
                );

            }

        }
    );

}
// ======================================================
// OWNER - EDIT RECEIPT
// ======================================================

// ======================================================
// OWNER - EDIT RECEIPT MODAL
// ======================================================

async function editReceipt(receiptId) {

    try {

        const response = await fetch(
            SUPABASE_URL +
            "/rest/v1/payment_receipts" +
            "?receipt_id=eq." +
            encodeURIComponent(receiptId) +
            "&select=*",
            {
                method: "GET",
                headers: getSupabaseHeaders()
            }
        );

        if (!response.ok) {
            throw new Error(
                await response.text()
            );
        }

        const receipts = await response.json();

        if (!receipts.length) {
            alert("Receipt not found.");
            return;
        }

        const receipt = receipts[0];


        // ==================================================
        // CREATE MODAL
        // ==================================================

        const modal = document.createElement("div");

        modal.className = "edit-receipt-modal";

        modal.innerHTML = `

            <div class="edit-receipt-box">

                <div class="edit-receipt-header">

                    <div>
                        <h2>Edit Receipt</h2>
                        <p>
                            Receipt #${receipt.receipt_id}
                        </p>
                    </div>

                    <button
                        type="button"
                        class="edit-close-btn"
                        id="closeEditModal">
                        ×
                    </button>

                </div>


                <div class="edit-receipt-body">

                    <div class="edit-field">

                        <label>
                            Customer Name
                        </label>

                        <input
                            type="text"
                            id="editCustomerName"
                            value="${escapeHTML(
                                receipt.customer_name || ""
                            )}"
                        >

                    </div>


                    <div class="edit-field">

                        <label>
                            Payment Description
                        </label>

                        <input
                            type="text"
                            id="editPaymentDescription"
                            value="${escapeHTML(
                                receipt.payment_description || ""
                            )}"
                        >

                    </div>


                    <div class="edit-field">

                        <label>
                            Amount
                        </label>

                        <input
                            type="number"
                            step="0.01"
                            id="editAmount"
                            value="${receipt.amount ?? ""}"
                        >

                    </div>


                    <div class="edit-field">

                        <label>
                            Payment Date
                        </label>

                        <input
                            type="date"
                            id="editPaymentDate"
                            value="${receipt.payment_date || ""}"
                        >

                    </div>


                    <div class="edit-readonly">

                        <div>
                            <span>Receipt ID</span>
                            <strong>
                                ${receipt.receipt_id}
                            </strong>
                        </div>

                        <div>
                            <span>Receipt Type</span>
                            <strong>
                                ${
                                    receipt.receipt_type ===
                                    "official"
                                        ? "Official"
                                        : "Actual"
                                }
                            </strong>
                        </div>

                    </div>

                </div>


                <div class="edit-receipt-footer">

                    <button
                        type="button"
                        class="edit-cancel-btn"
                        id="cancelEditReceipt">
                        Cancel
                    </button>

                    <button
                        type="button"
                        class="edit-save-btn"
                        id="saveEditReceipt">
                        Save Changes
                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(modal);


        // ==================================================
        // CLOSE
        // ==================================================

        document
            .getElementById("closeEditModal")
            .onclick = () => modal.remove();


        document
            .getElementById("cancelEditReceipt")
            .onclick = () => modal.remove();


        // ==================================================
        // SAVE
        // ==================================================

        document
            .getElementById("saveEditReceipt")
            .onclick = async function () {

                const customerName =
                    document
                        .getElementById(
                            "editCustomerName"
                        )
                        .value.trim();


                const paymentDescription =
                    document
                        .getElementById(
                            "editPaymentDescription"
                        )
                        .value.trim();


                const amount =
                    Number(
                        document
                            .getElementById(
                                "editAmount"
                            )
                            .value
                    );


                const paymentDate =
                    document
                        .getElementById(
                            "editPaymentDate"
                        )
                        .value;


                if (!customerName) {

                    alert(
                        "Please enter the customer name."
                    );

                    return;

                }


                if (
                    !Number.isFinite(amount) ||
                    amount < 0
                ) {

                    alert(
                        "Please enter a valid amount."
                    );

                    return;

                }


                if (!paymentDate) {

                    alert(
                        "Please select the payment date."
                    );

                    return;

                }


                const updateResponse =
                    await fetch(
                        SUPABASE_URL +
                        "/rest/v1/payment_receipts" +
                        "?receipt_id=eq." +
                        encodeURIComponent(
                            receiptId
                        ),
                        {
                            method: "PATCH",

                            headers: {
                                ...getSupabaseHeaders(),

                                "Content-Type":
                                    "application/json",

                                "Prefer":
                                    "return=representation"
                            },

                            body:
                                JSON.stringify({

                                    customer_name:
                                        customerName,

                                    payment_description:
                                        paymentDescription,

                                    amount:
                                        amount,

                                    payment_date:
                                        paymentDate

                                })
                        }
                    );


                if (!updateResponse.ok) {

                    const error =
                        await updateResponse.text();

                    console.error(
                        "EDIT ERROR:",
                        error
                    );

                    alert(
                        "Could not update receipt."
                    );

                    return;

                }


                modal.remove();


                alert(
                    "✓ Receipt updated successfully!"
                );


                loadOwnerReceipts();
                loadUserCollections();



                if (
                    typeof loadOwnerDashboard ===
                    "function"
                ) {

                    loadOwnerDashboard();

                }

            };


    }

    catch (error) {

        console.error(
            "EDIT RECEIPT ERROR:",
            error
        );

        alert(
            "Could not open the edit receipt."
        );

    }

}
// ======================================================
// OWNER - TOTAL COLLECTED BY USER
// ======================================================

async function loadUserCollections() {

    try {

        // Get users
        const usersResponse =
            await fetch(
                SUPABASE_URL +
                "/rest/v1/users" +
                "?select=user_id,full_name,username",
                {
                    method: "GET",
                    headers: getSupabaseHeaders()
                }
            );


        if (!usersResponse.ok) {

            throw new Error(
                await usersResponse.text()
            );

        }


        const users =
            await usersResponse.json();


        // Get receipts
        const receiptsResponse =
            await fetch(
                SUPABASE_URL +
                "/rest/v1/payment_receipts" +
                "?select=receipt_id,amount,created_by",
                {
                    method: "GET",
                    headers: getSupabaseHeaders()
                }
            );


        if (!receiptsResponse.ok) {

            throw new Error(
                await receiptsResponse.text()
            );

        }


        const receipts =
            await receiptsResponse.json();


        // ==================================================
        // CALCULATE TOTALS
        // ==================================================

        const totals = {};


        users.forEach(function (user) {

            totals[user.user_id] = 0;

        });


        receipts.forEach(function (receipt) {

            const userId =
                receipt.created_by;

            const amount =
                Number(receipt.amount) || 0;


            if (
                totals[userId] !== undefined
            ) {

                totals[userId] += amount;

            }

        });


        // ==================================================
        // DISPLAY
        // ==================================================

        const tbody =
            document.getElementById(
                "userCollectionsTableBody"
            );


        if (!tbody) {
            return;
        }


        tbody.innerHTML = "";


        let grandTotal = 0;


        users.forEach(function (user) {

            const total =
                totals[user.user_id] || 0;


            grandTotal += total;


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${user.user_id}
                </td>

                <td>
                    ${escapeHTML(
                        user.full_name ||
                        user.username ||
                        "Unknown"
                    )}
                </td>

                <td>
                    $${total.toLocaleString(
                        "en-US",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    )}
                </td>

            `;


            tbody.appendChild(row);

        });


        // ==================================================
        // GRAND TOTAL
        // ==================================================

        const grandTotalElement =
            document.getElementById(
                "usersGrandTotal"
            );


        if (grandTotalElement) {

            grandTotalElement.textContent =
                "$" +
                grandTotal.toLocaleString(
                    "en-US",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                );

        }

    }


    catch (error) {

        console.error(
            "USER COLLECTIONS ERROR:",
            error
        );

    }

}


// ======================================================
// OWNER - OPEN USER COLLECTIONS PAGE
// ======================================================

function openUserCollections() {

    window.location.href =
        "user-collections.html";

}
// ======================================================
// USER COLLECTIONS - BACK TO OWNER
// ======================================================

function goBackToOwner() {

    window.location.href =
        "owner-home.html";

}
// ======================================================
// USER COLLECTIONS PAGE
// ======================================================

if (
    window.location.pathname
        .toLowerCase()
        .includes("user-collections.html")
) {

    loadUserCollections();

}


// ======================================================
// BACK TO OWNER HOME
// ======================================================

function goBackToOwner() {

    window.location.href =
        "owner-home.html";

}