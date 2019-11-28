var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
});

function updateProductStock(qty, selection) {
  // console.log("in updateProduct\n");
  // console.log(qty + " -- " + selection);
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: qty
      },
      {
        item_id: selection
      }
    ],
    function(err, res) {
      if (err) throw err;
      // console.log(res.affectedRows + " products updated!\n");
      // Call deleteProduct AFTER the UPDATE completes
      readProducts();
    }
  );

  // logs the actual query being run
  // console.log(query.sql);
}

function updateProductSales(order, product) {
  // console.log("in updateProduct\n");
  // console.log(qty + " -- " + selection);
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        product_sales: order
      },
      {
        product_name: product
      }
    ],
    function(err, res) {
      if (err) throw err;
      console.log(query);
      readProducts();
    }
  );
}




// TODO export updateProduct so it can be called from other files
// TODO make sure to disconnect from db somewhere in app

function promptUser(res) {
  //   console.log("in promptUser");
  console.log("\n");
 
  var questions = [
    {
      type: "input",
      name: "selection",
      message: "Select id of product you wish to buy:",
      validate: function validateSelection(selection) {
          // * lets build out an array of item ids
        
        var idArray = [];
        // console.log(typeof idArray);
        for (let index = 0; index < res.length; index++) {
            idArray.push(res[index].item_id);
        }

        // ? Why does idArray end up an object here and not an array
        // * set inArray to false as default
        var inArray = false;
        for (var i=0; i < idArray.length; i++) {
            if (idArray[i] == selection) {
                // * console.log("found in array");
                inArray = true;
            }
        }
        return inArray;
      }
    },
    {
      type: "input",
      name: "qty",
      message: "How many would you like ot buy:",
      validate: function validateQty(qty) {
        return qty !== "";
      }
    }
  ];
  itemsArray = Object.values(res);

  inquirer.prompt(questions).then(answers => {
    // console.log(JSON.stringify(answers, null, "  "));
    var order = 0;
    var dept = "";
    qty = answers.qty;
    selection = answers.selection;
    // console.log(itemsArray[selection.item_id]);

    for (let index = 0; index < res.length; index++) {
      if (selection == res[index].item_id) {
        // console.log(res[index].stock_quantity);
        if (res[index].stock_quantity >= qty) {
          // console.log("Enough in stock to complete order")
          order = res[index].price * qty;
          product = res[index].product_name;
          console.log("\nOrder Total: $" + order);
          console.log("New Stock Total: " + (res[index].stock_quantity - qty));
          updateProductStock(res[index].stock_quantity - qty, selection);
          updateProductSales(order, product);
        } else {
          console.log("Not enough product in stock");
          readProducts();
        }
      }      
  }

    // for (let index = 0; index < itemsArray.length; index++) {
    //   if (selection == itemsArray[index].item_id) {
    //     console.log(itemsArray[index]);
    //     order = itemsArray[index].stock_quantity - qty;
    //     if (order => 0) {
    //       updateProduct(order, selection);
    //     } else {
    //       console.log("Not enough in stock to complete order....");
    //       displayProducts(res);
    //     }
    //   }
    // }

    // TODO validation on id and qty being entered
  });
}

function displayProducts(res) {
  // console.log("In displayProducts\n");
  //   console.log(res.length);
  var item_id = "";
  var product_name = "";
  var department_name = "";
  console.log("Welcome to Bamazon!\n");
  console.log("  Id         Product                      Dept                Amt   Stock");
  console.log("  --         -------                      ----                ---   -----\n");
  for (var i = 0; i < res.length; i++) {
    item_id = res[i].item_id.toString();
    // item_id = item_id.toString();

    product_name = res[i].product_name;
    price = res[i].price;
    print = price.toString();
    stock = res[i].stock_quantity;
    stock = stock.toString();
    dept = res[i].department_name;
    // console.log(Object.getOwnPropertyNames(res[i]));
    console.log(
      item_id.padStart(4) +
        "    " +
        product_name.padEnd(35) +
        dept.padEnd(20) +
        price +
        stock.padStart(4)
    );
  }
  promptUser(res);
}

function readProducts() {
  //   console.log("In readProducts\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
      console.log(res);
    displayProducts(res);
  });
}

readProducts();
