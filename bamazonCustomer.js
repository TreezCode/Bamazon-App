
// Import packages
const mysql = require("mysql");
const Table = require("cli-table3");
const inquirer = require("inquirer");
const colors = require("colors");

// Global Variables
let asterisk = "*****************************************************".rainbow;
let tilde = "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~";

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
    console.log("connected as id " + connection.threadId + "\n");
    displayItems();
});

// Display all items currently for sale
function displayItems () {
    
    // Log intro banner
    console.log(
        asterisk + "\n" + "\n" +
        "     $ $ $   Bamazon | Online Shopping   $ $ $\n".white + "\n" +
        asterisk
    );
    
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
            colWidths: [10, 40, 20, 10, 10],
        })

        // Iterate through response and push each item to the table with style     
        for(let i = 0; i < res.length; i++) {
            table.push(
                [
                    {hAlign: "center", content: colors.white(res[i].item_id)}, 
                    {hAlign: "left", content: colors.cyan(res[i].product_name)}, 
                    {hAlign: "center", content: colors.yellow(res[i].department_name)}, 
                    {hAlign: "center", content: colors.green(res[i].price)}, 
                    {hAlign: "center", content: colors.magenta(res[i].stock_quantity)}
                ]
            );
        }
        console.log(table.toString());
        promptBuyer();
    });
}

// Prompt user
function promptBuyer() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the product ID you are interested in?",
            name: "productId",
            filter: Number
        },
        {
            type: "input",
            message: "How many units of the product would you like to buy?",
            name: "quantity" ,
            filter: Number
        }
    ])
    .then(answers => {

        // Store user input as a purchase order
        let item = answers.productId;
        let quantity = answers.quantity;

        purchaseItem(item, quantity);
    });
}

// Check database to confirm purchase availabilty
function purchaseItem(purId, purQuantity) {
    connection.query("SELECT * FROM products WHERE item_id = " + purId, function(err, res) {
        if (err) throw err;
        if(purQuantity <= res[0].stock_quantity) {
            let purCost = res[0].price * purQuantity;
            console.log(
                "\n" + tilde + "\n" +
                "\n" + "Your total cost for", purQuantity, res[0].product_name, "is", purCost, "!" + "\n" +
                "\n" + tilde + "\n"                
                );
            connection.query("UPDATE products SET stock_quantity = stock_quantity - " + purQuantity + " WHERE item_id = " + purId);
            displayItems();         
        } else {
            console.log(
                "\n" + tilde + "\n" +
                "\n" + "Sorry it looks like we have insufficient stock for that order! >.<" + "\n" +
                "\n" + tilde + "\n"
            );
            purchaseItem();
        }
    });
}

function repromptBuyer() {
    
}
