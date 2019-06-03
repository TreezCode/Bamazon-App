
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

// Prompt user for purchase details
function supervisorPrompt() {
    
    inquirer.prompt([
        {
            type: "list",
            message: "Please choose one of the following options.\n".white,
            name: "options",
            choices: [
                "View Product Sales by Department",
                "Create New Department",
                "Remove Department",
                "Quit"
            ]
        }
    ])
    .then(answers => {

        // Determine which function to run based on user input
        switch (answers.options) {
            case "View Product Sales by Department":
                    viewProductSales();
                    break;
            case "Create New Department":
                    promptAdd();
                    break;
            case "Remove Department":
                    promptRemove();
                    break;
            case "Quit":
                    connection.end();
                    break;
            }
    });
}

// Display a table of sales data with department_id, department_name, over_head_costs, product_sales, total_profit
function viewProductSales() {

    // Create alias for total sales and total profit then join the products and the departments tables
    let query = `
                SELECT departments.department_id, departments.department_name, departments.over_head_costs, 
                IFNULL(SUM(products.product_sales), 0) AS total_sales,
                IFNULL(SUM(products.product_sales) - over_head_costs, over_head_costs * -1) AS total_profit
                FROM bamazon.departments 
                LEFT JOIN bamazon.products 
                ON departments.department_name=products.department_name 
                GROUP BY departments.department_id
                `

    connection.query(query, function(err, res) {
        if (err) throw err;
        
        // Create and style table constructor for "cli-table3"
        let table = new Table({
            head: [
                {hAlign: "center", content: "Id:".grey},
                {hAlign: "center", content: "Department Name:".grey}, 
                {hAlign: "center", content: "Overhead Costs:".grey}, 
                {hAlign: "center", content: "Total Sales".grey},
                {hAlign: "center", content: "Total Profit:".grey}            
            ],
            colWidths: [10, 30, 20, 20, 20],
        });

        // Iterate through response and push each item to the table with style     
        for (let i = 0; i < res.length; i ++) {
            
            table.push(
                [
                    {hAlign: "center", content: colors.white(res[i].department_id)}, 
                    {hAlign: "left", content: colors.yellow(res[i].department_name)}, 
                    {hAlign: "center", content: colors.green(res[i].over_head_costs)}, 
                    {hAlign: "center", content: colors.magenta(res[i].total_sales)},
                    {hAlign: "center", content: colors.magenta(res[i].total_profit)}
                ]
            );
        }
        // Log intro banner
        console.log("\n\n                      $ $ $ $ ".green + " Bamazon Supervisor | Department Sales ".white +  " $ $ $ $\n\n".green);
        console.log(table.toString() + "\n");
        supervisorPrompt();
    });
}

// Allow supervisor to create a brand new department in the database
function promptAdd() {

    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the name of the department you would like to add?",
            name: "name",
        },
        {
            type: "input",
            message: "What are the overhead costs of this department?",
            name: "cost",
            filter: Number
        }
    ])
    .then(answers => {
        
        // Store user input as variables to pass as arguments
        let depName = answers.name;
        let depCost = answers.cost;

        // Pass department data thru addDepartment
        addDepartment(depName, depCost);
    });
}

function addDepartment(name, cost) {

    // Update database
    let query = "INSERT INTO departments SET ? ";

    connection.query(query, [{
        department_name: name,
        over_head_costs: cost,
    }], function(err, res) {
        if (err) throw err;
        console.log("\n\n                        $ $ $ $ ".green + " Bamazon Supervisor | ".white + colors.yellow(name) +" Department Added ".white +  " $ $ $ $\n\n".green);
        supervisorPrompt();
    });
}

// Allow supervisor to remove any existing department
function promptRemove() {

    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the Department ID that you would like to remove.\n".white,
            name: "id",
            filter: Number  
        }
    ])
    .then(answers => {
        
        // Store user input as variable to pass as argument
        let depId = answers.id;

        // Pass product data thru removeProduct
        removeDepartment(depId);
    });
}

function removeDepartment(removeId) {

     // Update database
    let query = "DELETE FROM departments WHERE department_id = " + removeId;

    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log("\n\n                    $ $ $ $ ".green + " Bamazon Supervisor | Department Removed ".white +  " $ $ $ $\n\n".green);
        supervisorPrompt();
    });
}
supervisorPrompt();