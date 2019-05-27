
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

// Prompt user with manager options
function managerPrompt() {

    inquirer.prompt([
        {
            type: "list",
            message: "Please choose one of the following options:".white,
            name: "options",
            choices: [
                "View Products for Sale", 
                "View Low Inventory", 
                "Add to Inventory", 
                "Add New Products"
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
                    addInventory();
                    break;
            case "Add New Products":
                    newProducts();
                    break;
        }
    });
}

// List every available item with ID, name, price and quantity
function displayProducts() {
        
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
                        {hAlign: "center", content: colors.green("$" + res[i].price)}, 
                        {hAlign: "center", content: colors.magenta(res[i].stock_quantity)}
                    ]
                );
            }
            // Log intro banner
            console.log("\n\n                      $ $ $ $ ".green + " Bamazon Manager | Current Inventory ".white +  " $ $ $ $\n".green);
            console.log(table.toString() + "\n");
            connection.end();
        });
}

// List all items with an inventory count lower than 5
function lowInventory() {

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
        console.log("\n\n                      $ $ $ $ ".green + " Bamazon Manager | Low Inventory ".white +  " $ $ $ $\n".green);
        console.log(table.toString() + "\n");
        connection.end();
    });
}

// Display a prompt that will let manager "add more" of any item currently in the store
function addInventory() {

}

// Allow manager to add a completely new product to the store
function newProducts() {

}

managerPrompt();