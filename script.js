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

                window.location.href =
                    "employee-home.html";

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
                "?select=receipt_id,customer_name,payment_description,amount,payment_date,created_by,created_at" +
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
                        ${receipt.receipt_id}
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
                        "?select=receipt_id,customer_name,payment_description,amount,payment_date,created_by,created_at" +
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