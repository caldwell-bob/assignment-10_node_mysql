DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;


CREATE TABLE products(
  item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100),
  department_name VARCHAR(100),
  price INTEGER(11),
  stock_quantity INTEGER(11),
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Current Designs - Prana', 'kayaks', 3500, 6);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Wenonah - Wilderness', 'canoes', 2500, 4);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Wenonah - Prisim', 'canoes', 2600, 4);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Wenonah - Solitude', 'canoes', 2500, 3);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Bell - Magic', 'canoes', 3500, 2);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Mad River Canoe - Explorer', 'canoes', 1800, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Current Designs - Slip', 'kayaks', 3500, 6);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Riot - Hammer', 'kayaks', 1200, 6);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Pacific Water Sports - Sea Otter', 'kayaks', 3500, 6);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Dagger - RPM', 'kayaks', 1200, 6);