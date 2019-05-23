const mysql = require("mysql");
const inquirer = require("inquirer");

let asterisk = "*****************************************************"
let tilde = "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"

var connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "password",

    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    displayItems();
});

function displayItems () {
    console.log(
        asterisk + "\r\n" + "\r\n" +
        "            Bamazon | Online Shopping \r\n" + "\r\n" +
        asterisk + "\r\n"
    );
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        // Format and log all items of the SELECT statement        
        for(let i = 0; i < res.length; i++) {
            console.log(
                tilde + "\r\n" + "\r\n" +
                "Product Name:   " + res[i].product_name + "\r\n" +
                "Department:     " + res[i].department_name + "\r\n" +
                "Price:          " + res[i].price + "\r\n" +
                "In Stock:       " + res[i].stock_quantity + "\r\n"
            );
        }
        console.log(tilde);
        promptBuyer();
        connection.end();
    });
}

function promptBuyer() {
    
}
