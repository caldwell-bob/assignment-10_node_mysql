var mysql = require("mysql");
var inquirer = require("inquirer");

var isAddToInventory = false;

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
//   console.log("connected as id " + connection.threadId + "\n");
});

function addNewProduct() {

  var questions = [
    {
      type: "input",
      name: "newProduct",
      message: "What is the name of the product you wish to add:",
    },
    {
      type: "input",
      name: "newProductDept",
      message: "Which dept does the new product belong to:",
    },
    {
      type: "input",
      name: "newProductPrice",
      message: "How much does the new product sell for:",
    },
    {
      type: "input",
      name: "newProductInv",
      message: "How many of the new product do you have in stock:",
    },

  ];

  inquirer.prompt(questions).then(answers => { 
    var newProduct = answers.newProduct;
    var newProductDept = answers.newProductDept;
    var newProductPrice = answers.newProductPrice;
    var newProductInv = answers.newProductInv;

    console.log("\nYou are adding the following new product: " + newProduct);
    console.log(newProduct + " belongs to the  " + newProductDept + " department");
    console.log("A " + newProduct + " retails for " + newProductPrice);
    console.log("You know have " + newProductInv + " in stock");

    let sql = "INSERT INTO products (product_name, department_name, price, stock_quantity) values ('" + newProduct + "', '" + newProductDept + "', '" + newProductPrice + "', '" + newProductInv + "');";
    // console.log(sql);

    connection.query(sql, function(err, res) {
      if (err) throw err;
     
      readProducts();
    })


  })
}

function updateProduct(qty, selection) {
    // console.log("in updateProduct()");
    var query = connection.query(
      "UPDATE products SET ?, ? WHERE ?",
      [
        {
          stock_quantity: qty
        },
        {
          product_sales: 0
        },
        {
          item_id: selection
        }
      ],
      function(err, res) {
        if (err) throw err;
        mainMenu();
      }
    );
  
    // logs the actual query being run
    // console.log(query.sql);
  }

function addToInventory(res) {
    //   console.log("in promptUser");
    console.log("\n");
    // isAddToInventory = true;

    // readProducts();
   
    var questions = [
      {
        type: "input",
        name: "selection",
        message: "Select id of product you wish to add to:",
        // TODO add valdiation back to Select ID question
        // validate: function validateSelection(selection) {
           
        //   var idArray = [];
         
        //   for (let index = 0; index < res.length; index++) {
        //       idArray.push(res[index].item_id);
        //   }
  
        //   // ? Why does idArray end up an object here and not an array
        //   // * set inArray to false as default
        //   var inArray = false;
        //   for (var i=0; i < idArray.length; i++) {
        //       if (idArray[i] == selection) {
        //           // * console.log("found in array");
        //           inArray = true;
        //       }
        //   }
        //   return inArray;
        // }
      },
      {
        type: "input",
        name: "qty",
        message: "How many would you like to add:",
        validate: function validateQty(qty) {
          return qty !== "";
        }
      }
    ];
    // itemsArray = Object.values(res);
  
    inquirer.prompt(questions).then(answers => {
    //   console.log(JSON.stringify(answers, null, "  "));
      var order = 0;
      qty = parseInt(answers.qty);
      // console.log(typeof qty + " qty");
      selection = answers.selection;
      
  
      for (let index = 0; index < res.length; index++) {
        if (selection == res[index].item_id) {
            // console.log(res[index].stock_quantity + qty);
          updateProduct(res[index].stock_quantity + qty, selection);
          
        }
      }
  
  
      // TODO validation on id and qty being entered
    });
}

function displayProducts(res) {
    // console.log("In displayProducts\n");
    //   console.log(res.length);
    var item_id = "";
    var product_name = "";
    var department_name = "";
    console.log("\n");
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
          " : " +
          product_name.padEnd(35) +
          dept.padEnd(20) +
          price +
          stock.padStart(4)
      );
    }
    console.log("\n");
    if (!isAddToInventory) {
        mainMenu();
    } else {
      addToInventory(res);
    }
    
   
}
  
function readProducts() {
    //   console.log("In readProducts\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      //   console.log(res);
      displayProducts(res);
    });
}

function checkLowInventory() {
    //   console.log("In readProducts\n");
    connection.query("SELECT * FROM products where stock_quantity < 5;", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      //   console.log(res);
      displayProducts(res);
    });
}

function mainMenu() {
  //   console.log("in promptUser");
  console.log("\n");


  inquirer
    .prompt({
      type: "list",
      name: "selection",
      message: "Select option:",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",

      ]
    })
    .then(answers => {
        switch (answers.selection) {
            case 'View Products for Sale':
              // console.log('View Products for Sale');
              readProducts();
              break;
            
            case 'View Low Inventory':
                // console.log('View Low Inventory');
                checkLowInventory();
                break;
            
            case 'Add to Inventory':
                isAddToInventory = true;
                readProducts();
                // addToInventory();

                break;
            
            case 'Add New Product':
                addNewProduct();

                // console.log('Add New Product');
                break;
          }
    });
}

mainMenu();




