var lends = [];
var books = [];
var customers = [];

var lendToCreate = {
    customer: {},
    books: []
}

function returnBooks(data) {
    fetch(`http://${window.location.host}/lend/return`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(json => {
            console.log(json)
            newLend = json;
            var replaceIndex = lends.findIndex(lend => lend.id === newLend.id);
            if (newLend.books.length > 0 || newLend.customer.fees > 0) {
                lends[replaceIndex] = newLend;
            } else {
                lends.splice(replaceIndex, 1);
            }
            renderTable();
        })
        .catch(err => console.log(err));
}

function renderTable() {
    var tbody = document.getElementById("table-body");
    tbody.innerHTML = '';
    lends.forEach(lend => {
        var row = document.createElement("tr");
        var lendDate = new Date(lend.lenddate);
        var day = lendDate.getDate();
        var month = lendDate.getMonth() + 1; // January is 0, so we add 1
        var year = lendDate.getFullYear();
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        var formattedDate = day + '/' + month + '/' + year;
        var tdLenddate = document.createElement("td");
        tdLenddate.appendChild(document.createTextNode(formattedDate));
        tdLenddate.classList.add("px-6", "py-4", "whitespace-nowrap"); // Tailwind CSS classes for padding and text alignment
        var tdFirstname = document.createElement("td");
        tdFirstname.appendChild(document.createTextNode(lend.customer.firstname));
        tdFirstname.classList.add("px-6", "py-4", "whitespace-nowrap"); // Tailwind CSS classes for padding and text alignment
        var tdLastname = document.createElement("td");
        tdLastname.classList.add("px-6", "py-4", "whitespace-nowrap"); // Tailwind CSS classes for padding and text alignment
        tdLastname.appendChild(document.createTextNode(lend.customer.lastname));
        var tdFee = document.createElement("td");
        tdFee.classList.add("px-6", "py-4", "whitespace-nowrap"); // Tailwind CSS classes for padding and text alignment
        tdFee.appendChild(document.createTextNode(lend.customer.fees));

        // This field contains mulitple books potentially
        var tdBooks = document.createElement("td");
        var ulBooks = document.createElement("ul");

        // Inside the forEach loop where you create and append li elements
        lend.books.forEach(book => {
            var li = document.createElement("li");
            li.classList.add("flex", "justify-between", "items-center", "py-2"); // Add padding to li for spacing
            var bookInfo = document.createElement("span");
            bookInfo.textContent = `${book.author}: ${book.title}, until: ${new Date(book.returndate).toDateString()}`;
            bookInfo.classList.add("px-6", "py-4", "whitespace-nowrap"); // Adjust width to match header data
            li.appendChild(bookInfo);


            var button = document.createElement("button");
            button.innerText = "Return";
            button.classList.add("px-2", "py-1", "rounded", "bg-secondary", "text-primary", "hover:bg-secondary", "hover:text-primary", "font-bold", "focus:outline-none", "mr-4"); // Add ml-4 class for left margin
            button.addEventListener("click", e => {
                var reqObj = { lendId: lend.id, bookId: book.id };
                returnBooks(reqObj);
            });
            li.appendChild(button);
            ulBooks.appendChild(li);
        });
        tdBooks.appendChild(ulBooks);
        row.append(tdLenddate, tdFirstname, tdLastname, tdFee, tdBooks);
        tbody.appendChild(row);
    });
}
function renderCustomers() {
    var list = document.getElementById("customer-list");
    customers.forEach(customer => {
        var li = document.createElement("li");
        li.classList.add("customer-li", "flex", "justify-between", "items-center", "py-2"); // Add padding to li for spacing
        var button = document.createElement("button");
        button.classList.add("customer-add-button", "bg-tertiary", "text-primary", "hover:bg-secondary", "px-2", "py-1", "rounded-md", "text-sm", "font-bold", "flex", "items-center", "focus:outline-none", "mr-4"); // Add ml-4 class for left margin
        button.innerText = "Add";
        button.addEventListener("click", event => {
            if (button.innerText === "Add") {
                if (!lendToCreate.customer.hasOwnProperty('firstname')) {
                    lendToCreate.customer = {
                        id: customer.id,
                        firstname: customer.firstname,
                        lastname: customer.lastname
                    }
                    li.classList.add("added");
                    button.innerText = "Remove";

                } else {
                    alert("You have already selected a customer");
                }

            } else if (button.innerText === "Remove") {
                lendToCreate.customer = {}
                li.classList.remove("added");
                button.innerText = "Add";
            }
        })

        li.appendChild(document.createTextNode(`${customer.firstname} ${customer.lastname}`));
        li.appendChild(button);
        list.appendChild(li);
    })
}

function renderBooks() {
    var list = document.getElementById("book-list");
    books.forEach((book, index) => {
        var li = document.createElement("li");
        li.classList.add("book-li", "flex", "justify-between", "items-center", "py-2"); // Add padding to li for spacing

        // Create container for book data and datepicker
        var container = document.createElement("div");
        container.classList.add("flex", "items-center", "w-full");

        // Create span for book data
        var span = document.createElement("span");
        span.textContent = `${book.author}, ${book.title}, ISBN: ${book.isbn}`;
        span.classList.add("flex", "items-center", "flex-grow");

        // Create input for datepicker
        var inputContainer = document.createElement("div");
        inputContainer.classList.add("relative", "max-w-sm");
        inputContainer.style.marginRight = "10px"; // Adjust the margin as needed
        var input = document.createElement("input");
        input.classList.add("book-date-input", "datepicker-autohide", "bg-tertiary", "border", "border-primary", "text-gray-900", "text-sm", "rounded-lg", "focus:ring-blue-500", "focus:border-blue-500", "block", "w-full", "ps-10", "p-2.5", "dark:border-gray-500", "dark:placeholder-gray-400", "dark:text-black", "dark:focus:ring-blue-500", "dark:focus:border-blue-500");
        input.setAttribute("placeholder", "Select Date"); // Add placeholder attribute
        input.setAttribute("type", "date");
        input.style.textAlign = "left"; // or "center" for center alignment

        // Create button for adding book
        var button = document.createElement("button");
        button.classList.add("book-add-button", "bg-tertiary", "text-primary", "hover:bg-secondary", "px-2", "py-1", "rounded-md", "text-sm", "font-bold", "flex", "items-center", "focus:outline-none", "mr-4"); // Add ml-4 class for left margin
        button.innerText = "Add";

        // Adding event listener to the button
        button.addEventListener("click", event => {
            if (button.innerText === "Add") {
                if (input.valueAsDate !== null) {
                    lendToCreate.books.push({
                        id: book.id,
                        isbn: book.isbn,
                        title: book.title,
                        author: book.author,
                        returndate: input.valueAsDate.getTime()
                    })
                    li.classList.add("added");
                    button.innerText = "Remove";
                } else {
                    alert("Please set a Returndate.");
                }
            } else if (button.innerText === "Remove") {
                lendToCreate.books = lendToCreate.books.filter(element => element.id !== book.id);
                li.classList.remove("added");
                button.innerText = "Add";
                input.value = '';
            }
        });

        // Appending input to its container
        inputContainer.appendChild(input);

        // Appending elements to the container
        container.appendChild(span);
        container.appendChild(inputContainer);
        container.appendChild(button);

        // Appending container to the li
        li.appendChild(container);

        // Appending li to the list
        list.appendChild(li);
    });
}

function fetchAllLends() {

    fetch(`http://${window.location.host}/lend/getAll`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({})

        })

        .then(res => res.json())

        .then(json => {

            console.log(json)

            lends = json;

            renderTable();

        })

        .catch(err => console.log(err));

}



function getBooks() {

    fetch(`http://${window.location.host}/book/getAll`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({})

        })

        .then(res => res.json())

        .then(json => {

            console.log(json)

            books = json;

            renderBooks();

        })

        .catch(err => console.log(err));

}



function getCustomers() {

    fetch(`http://${window.location.host}/customer/getAll`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({})

        })

        .then(res => res.json())

        .then(json => {

            console.log(json)

            customers = json;

            renderCustomers();

        })

        .catch(err => console.log(err));

}



document.getElementById("create-button").addEventListener("click", event => {
    if (lendToCreate.customer.hasOwnProperty('firstname') && lendToCreate.books.length > 0) {
        lendToCreate['lenddate'] = Date.now();
        fetch(`http://${window.location.host}/lend/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(lendToCreate)
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            lends.push(json);
            
            // Reset selection for customers
            var customerElements = document.querySelectorAll(".customer-li.added");
            customerElements.forEach(element => {
                element.classList.remove("added");
                element.querySelector("button").innerText = "Add";
            });

            // Reset selection for books
            var bookElements = document.querySelectorAll(".book-li.added");
            bookElements.forEach(element => {
                element.classList.remove("added");
                element.querySelector(".book-add-button").innerText = "Add";
                element.querySelector(".book-date-input").value = '';
            });

            lendToCreate = {
                customer: {},
                books: []
            };
            renderTable();
        })
        .catch(err => console.log(err));
    } else {
        alert("Please add a customer and at least one book.");
    }
});

fetchAllLends();
getBooks();
getCustomers();