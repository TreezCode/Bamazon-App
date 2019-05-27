
// Import packages
const mysql = require("mysql");
const Table = require("cli-table3");
const inquirer = require("inquirer");
const colors = require("colors");

// Global Variables
let asterisk = "*****************************************************".rainbow;
let tilde = "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~".rainbow;

// Store connection with MySQL
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

// Initialize connection
connection.connect(function(err) {
    if (err) throw err;
    displayProducts();
});

// Display all items currently for sale
function displayProducts () {
        
    // Select all products from db
    connection.query("SELECT * FROM products", function(err, res) {
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
        console.log("\n\n                         $ $ $ $ ".green + " Bamazon | Online Shopping ".white +  " $ $ $ $\n".green);
        console.log(table.toString() + "\n");
        promptBuyer();
    });
}

// Prompt user for purchase details
function promptBuyer() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the product ID you are interested in?\n".white,
            name: "productId",
            filter: Number
        },
        {
            type: "input",
            message: "How many units of the product would you like to buy?\n".white,
            name: "quantity" ,
            filter: Number
        }
    ])
    .then(answers => {

        // Store user input as a purchase order
        let item = answers.productId;
        let quantity = answers.quantity;

        // Pass purchase details response thru purchaseItem
        purchaseItem(item, quantity);
    });
}

// Check database to confirm purchase availabilty
function purchaseItem(purId, purQuantity) {
    connection.query("SELECT * FROM products WHERE item_id = " + purId, function(err, res) {
        if (err) throw err;

        let item = res[0]; 
        
        // Check if current inventory count is high enough to fill order
        if(purQuantity <= item.stock_quantity) {

            // Calculate and store total cost of purchase
            let purCost = item.price * purQuantity;

            // Create and style table constructor for "cli-table3"
            let table = new Table({
                head: [
                    {hAlign: "center", content: "Id:".grey},
                    {hAlign: "center", content: "Item:".grey}, 
                    {hAlign: "center", content: "Department:".grey}, 
                    {hAlign: "center", content: "Quantity".grey},
                    {hAlign: "center", content: "Total:".grey} 
                ],
                colWidths: [10, 40, 20, 10, 12],
            })

            // Push purchase order data to table to display as recepit
            table.push(
                [
                    {hAlign: "center", content: colors.white(item.item_id)}, 
                    {hAlign: "left", content: colors.cyan(item.product_name)}, 
                    {hAlign: "center", content: colors.yellow(item.department_name)}, 
                    {hAlign: "center", content: colors.magenta(purQuantity)},
                    {hAlign: "center", content: colors.green("$" + purCost)}, 
                ]
            );
            
            console.log("\n\n                             $ $ $ $ ".green + " Bamazon | Receipt ".white +  " $ $ $ $\n".green);
            console.log(table.toString() + "\n");
            connection.query("UPDATE products SET stock_quantity = stock_quantity - " + purQuantity + " WHERE item_id = " + purId);
            repromptBuyer();        
        } else {

            console.log(
                "\n" + tilde + "\n" +
                "\n" + "Sorry it looks like we have insufficient stock for that order! >.<" + "\n" +
                "\n" + tilde + "\n"
            );
            repromptBuyer();
        }
    });
}

// Reprompt user after purchase to determine if they would like to continue shopping
function repromptBuyer() {

    inquirer.prompt([
        {
            type: "list",
            message: "Would you like to continue shopping?\n".white,
            name: "reprompt",
            choices: ["Yes", "No"]
        }
    ])
    .then(answers => {

        
        if (answers.reprompt === "Yes") {
            displayProducts();
        } else {
            console.log(
                "\n" + tilde + "\n" +
                "\n" + "Thanks for shopping with Bamazon! >.<" + "\n" +
                "\n" + tilde + "\n"
            );
            connection.end();
        }

    });
    
}

