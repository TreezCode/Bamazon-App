
// Import packages
const mysql = require("mysql");
const Table = require("cli-table3");
const inquirer = require("inquirer");
const colors = require("colors");

// Store connection with MySQL
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

// Prompt user with manager options
function managerPrompt() {

    inquirer.prompt([
        {
            type: "list",
            message: "Please choose one of the following options:\n".white,
            name: "options",
            choices: [
                "View Products for Sale", 
                "View Low Inventory", 
                "Add to Inventory", 
                "Add New Product",
                "Remove Product",
                "Quit"
            ]
        }
    ])
    .then(answers => {

        // Determine which function to run based on user input
        switch (answers.options) {
            case "View Products for Sale":
                    displayProducts();
                    break;
            case "View Low Inventory":
                    lowInventory();
                    break;
            case "Add to Inventory":
                    addPrompt();
                    break;
            case "Add New Product":
                    newPrompt();
                    break;
            case "Remove Product":
                    removePrompt();
                    break;
            case "Quit":
                    connection.end();
                    break;
            }
    });
}

// List every available item with ID, name, price and quantity
function displayProducts() {
    
        
    // Select all products from db
    let query = "SELECT * FROM products";
    
    connection.query(query, function(err, res) {
        if (err) throw err;
        
        // Create and style table constructor for "cli-table3"
        let table = new Table({
            head: [
                {hAlign: "center", content: "Id:".grey},
                {hAlign: "center", content: "Item:".grey}, 
                {hAlign: "center", content: "Department:".grey}, 
                {hAlign: "center", content: "Price:".grey}, 
                {hAlign: "center", content: "Stock".grey}
            ],
            colWidths: [10, 40, 20, 12, 10],
        })

        // Iterate through response and push each item to the table with style     
        for(let i = 0; i < res.length; i++) {

            table.push(
                [
                    {hAlign: "center", content: colors.white(res[i].item_id)}, 
                    {hAlign: "left", content: colors.cyan(res[i].product_name)}, 
                    {hAlign: "center", content: colors.yellow(res[i].department_name)}, 
                    {hAlign: "center", content: colors.green("$" + res[i].price)}, 
                    {hAlign: "center", content: colors.magenta(res[i].stock_quantity)}
                ]
            );
        }
        // Log intro banner
        console.log("\n\n                      $ $ $ $ ".green + " Bamazon Manager | Current Inventory ".white +  " $ $ $ $\n\n".green);
        console.log(table.toString() + "\n");
        managerPrompt();
    });
}

// List all items with an inventory count lower than 5
function lowInventory() {

    // Select all products from db
    let query = "SELECT * FROM products";

    connection.query(query, function(err, res) {
        if (err) throw err;

        // Create and style table constructor for "cli-table3"
        let table = new Table({
        head: [
                {hAlign: "center", content: "Id:".grey},
                {hAlign: "center", content: "Item:".grey}, 
                {hAlign: "center", content: "Department:".grey}, 
                {hAlign: "center", content: "Price:".grey}, 
                {hAlign: "center", content: "Stock".grey}
            ],
            colWidths: [10, 40, 20, 10, 10],
        })

        // Iterate through products to determine if inventory count is lower than 5
        for (let i = 0; i < res.length; i ++) {
            if (res[i].stock_quantity < 5) {
                table.push(
                    [
                        {hAlign: "center", content: colors.white(res[i].item_id)}, 
                        {hAlign: "left", content: colors.cyan(res[i].product_name)}, 
                        {hAlign: "center", content: colors.yellow(res[i].department_name)}, 
                        {hAlign: "center", content: colors.green("$" + res[i].price)}, 
                        {hAlign: "center", content: colors.magenta(res[i].stock_quantity)}
                    ]
                );
            }
        }
        console.log("\n\n                      $ $ $ $ ".green + " Bamazon Manager | Low Inventory ".white +  " $ $ $ $\n\n".green);
        console.log(table.toString() + "\n");
        managerPrompt();        
    });
}

// Display a prompt that will let manager "add more" of any item currently in the store
function addPrompt() {

    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the Item ID that you would like to restock.\n".white,
            name: "prodId",
            filter: Number  
        },
        {
            type: "input",
            message: "How many units would you like to add?\n".white,
            name: "prodQuantity",
            filter: Number  
        }
    ])
    .then(answers => {

        // Store user input as variables to pass as arguments
        let item = answers.prodId;
        let quantity = answers.prodQuantity;

        // Pass inventory restock data thru addInventory
        addInventory(item, quantity);
    });
}

function addInventory(addId, addQuantity) {

    let query = "SELECT * FROM products WHERE item_id = " + addId;

    connection.query(query, function(err, res) {
        if (err) throw err;

        // Calculate and store total cost of restock
        let item = res[0];
        let cost = item.price * addQuantity;
        
        // Create and style table constructor for "cli-table3"
        let table = new Table({
            head: [
                {hAlign: "center", content: "Id:".grey},
                {hAlign: "center", content: "Item:".grey}, 
                {hAlign: "center", content: "Department:".grey}, 
                {hAlign: "center", content: "Quantity".grey},
                {hAlign: "center", content: "Bill:".grey} 
            ],
            colWidths: [10, 40, 20, 10, 12],
        })

        // Push add inventory data to table to display as bill
        table.push(
            [
                {hAlign: "center", content: colors.white(item.item_id)}, 
                {hAlign: "left", content: colors.cyan(item.product_name)}, 
                {hAlign: "center", content: colors.yellow(item.department_name)}, 
                {hAlign: "center", content: colors.magenta(addQuantity)},
                {hAlign: "center", content: colors.green("$" + cost )}
            ]
        );
        console.log("\n\n                             $ $ $ $ ".green + " Bamazon Manager | Billing ".white +  " $ $ $ $\n\n".green);
        console.log(table.toString() + "\n");

        // Update database with user input
        let query1 = "UPDATE products SET stock_quantity = stock_quantity + " + addQuantity + " WHERE item_id = " + addId;
        connection.query(query1);
        managerPrompt();
    })
}

// Allow manager to add a completely new product to the store
function newPrompt() {

    // Store department names to display as choices
    let depArr = [];

    let query = "SELECT departments.department_name FROM bamazon.departments";

    connection.query(query, function(err, res) {
        if (err) throw err;
        
        for (let i = 0; i < res.length; i++) {
            depArr.push(res[i].department_name);
        }

        inquirer.prompt([
            {
                type: "input",
                message: "Please enter the name of the new product you would like to add.\n".white,
                name: "name",  
            },
            {
                type: "list",
                message: "Please enter the department where the new products will be found.\n".white,
                name: "department",
                choices: depArr
            },
            {
                type: "input",
                message: "Please enter the price of the new product.\n".white,
                name: "price",
                filter: Number  
            },
            {
                type: "input",
                message: "How many units would you like to add?\n".white,
                name: "quantity",
                filter: Number  
            }
        ])
        .then(answers => {
    
            // Store user input as variables to pass as arguments
            let newName = answers.name;
            let newDep = answers.department;
            let newPrice = answers.price;
            let newQuantity = answers.quantity;
    
            // Pass inventory restock data thru newProduct
            newProduct(newName, newDep, newPrice, newQuantity);
        });
    })
}

function newProduct(name, dep, price, quantity) {

    let query = "INSERT INTO products SET ? ";
    connection.query(query, {
         product_name: name, 
         department_name: dep, 
         price: price, 
         stock_quantity: quantity
        }, function(err, res) {
        if (err) throw err;
        
        console.log("\n\n                     $ $ $ $ ".green + " Bamazon Manager | ".white + colors.yellow(name)+ " Added ".white +  " $ $ $ $\n\n".green);
        managerPrompt();
    });
}

// Display a prompt that will let manager "remove" any item currently in the store
function removePrompt() {

    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the Item ID that you would like to remove.\n".white,
            name: "prodId",
            filter: Number  
        }
    ])
    .then(answers => {
        
        // Store user input as variable to pass as argument
        let item = answers.prodId;

        // Pass product data thru removeProduct
        removeProduct(item);
    });
}

function removeProduct(removeId) {

    // Update database
    let query = "DELETE FROM products WHERE item_id = " + removeId;
    connection.query(query, function(err, res) {
        if (err) throw err;

        let item = res[0];
        console.log("\n\n                      $ $ $ $ ".green + " Bamazon Manager | Product Removed ".white +  " $ $ $ $\n\n".green);
        managerPrompt();
    });
}
managerPrompt();