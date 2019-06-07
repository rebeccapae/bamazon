var inquirer = require("inquirer");
var mysql = require("mysql");

//Global Variables
var product = "";
var quantity = 0;
var user_product = "";
var user_quantity = 0;
var availableItems;


// create connection info for mysql
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});

// connect to mysql server and database
connection.connect(function(err) {
    if(err) throw err;
    showItems();
});

//To list all items available. Then run the prompt function
function showItems(){
    console.log ("Showing All Items");
    connection.query("SELECT * FROM products", function(err, res) {
        availableItems = res;
        for (var i = 0; i <res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price)
        }
        console.log("-----------------------------------");
        prompt();
    })
}

//To ask the user 2 questions
function prompt() {
    inquirer
        .prompt([
        {
            name: "id",
            type: "list",
            message: "Choose the product's ID that you want to buy",
            choices: ["1000", "2000", "3000", "4000", "5000", "6000", "7000", "8000", "9000", "10000"]
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to buy?"
        }
        ])
        .then(function(answer) {
            //To capture user choices
            console.log(answer);
            user_product = answer.id;
            user_quantity = answer.quantity;
            console.log("user chose: " + user_product + " user wants: " + user_quantity);
            var quantity = 0;
            // To check inventory
            for (i = 0; i < availableItems.length; i++){
                if (user_product == availableItems[i].item_id){
                    quantity = availableItems[i].stock_quantity;
                }
            };
            //if enough quantity, then update database
            console.log("Available Quantity: " + quantity);
            if(user_quantity < quantity){
                console.log("Yay, there is enough in stock for you to buy")
                var newInventory = quantity - user_quantity;
                var stringInv = newInventory.toString();
                console.log("the new inventory is: " + newInventory)
                var query = connection.query(
                "UPDATE products SET stock_quantity = " + stringInv + " WHERE item_id = "+ user_product, function(err, response) {
                    console.log("Database Updated Quantity");
                    priceCalculator();
                });
            }
            else{
                console.log("Sorry, there is not enough stock");
            }
        }
        );
};

//to calculate total price
function priceCalculator(){
    var query = connection.query("SELECT * FROM products", function(err, results) {
        console.log("user chose: " + user_product);
        for (i = 0; i < results.length; i++) {
            if (user_product == results[i].item_id) {
                var cost = results[i].price * user_quantity;
                var displayCost = cost.toFixed(2);
                console.log("It will cost you: " + displayCost);
            }
        }
    })
};

