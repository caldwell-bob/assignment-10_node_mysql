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

function viewSalesByDept() {
  console.log("View Product Sales by Department\n");

  sql =
    "SELECT d.department_id, d.department_name, d.over_head_costs, sum(p.product_sales) AS product_sales" +
    ", (product_sales - d.over_head_costs) AS total_profit" +
    " FROM departments AS d" +
    " LEFT JOIN products AS p" +
    " ON d.department_name = p.department_name" +
    " GROUP BY d.department_id, p.department_name, d.over_head_costs, total_profit;";
 
  connection.query(sql, function(err, res) {
    if (err) throw err;

    console.log(
      "department_id    department_name              over_head_costs        product_sales     profit\n"
    );
    for (let index = 0; index < res.length; index++) {
      id = res[index].department_id.toString();
      name = res[index].department_name;
      costs = res[index].over_head_costs.toString();
      sales = res[index].product_sales.toString();
      profit = res[index].total_profit.toString();

      // console.log(id.padStart(15) + " " + name.padStart(35) + " " + costs + " " + sales + " " + profit);
      console.log(
        id.padStart(4) + "              " +
          name.padEnd(35) +
          costs.padEnd(20) +
          sales.padEnd(8) + "       " +
          profit.padEnd(30)
      );
    }
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
      choices: ["View Product Sales by Department", "Create New Department"]
    })
    .then(answers => {
      switch (answers.selection) {
        case "View Product Sales by Department":
          viewSalesByDept();
          break;

        case "Create New Departmen":
          console.log("Create New Departmen");

          break;
      }
    });
}

mainMenu();
