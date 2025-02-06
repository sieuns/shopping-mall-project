const fs = require('fs');
const main_view = fs.readFileSync('./main.html', 'utf-8');
const orderlist_view = fs.readFileSync('./orderlist.html', 'utf-8');

const mariadb = require('./database/connect/mariadb');

function main(response){
    console.log('main');

    mariadb.query("SELECT * FROM product", function(err, rows) {
        console.log(rows);
    })

    response.writeHead(200, {'Content-Type' : 'text/html'});
    response.write(main_view);
    response.end();
}

function redRacket(response) {
  fs.readFile('./img/redRacket.png', function(err,data) {
    response.writeHead(200, {'Content-Type' : 'text/html'});
    response.write(data);
    response.end();
  })
}

function blueRacket(response) {
  fs.readFile('./img/blueRacket.png', function(err,data) {
    response.writeHead(200, {'Content-Type' : 'text/html'});
    response.write(data);
    response.end();
  })
}

function blackRacket(response) {
  fs.readFile('./img/blackRacket.png', function(err,data) {
    response.writeHead(200, {'Content-Type' : 'text/html'});
    response.write(data);
    response.end();
  })
}

function order(response, productId) {
  console.log('Received productId: ', productId);
  response.writeHead(200, {'Content-Type' : 'text/html'});

  let currentDate = new Date().toLocaleDateString('en-CA');

  mariadb.query("INSERT INTO orderlist (product_id, order_date) VALUES (" + productId + ", '" + currentDate + "');", function(err, rows) {
    if (err) {
      console.error('Error executing query:', err);
    } else {
      console.log('Query success, rows:', rows);
    }
  });

  response.write('order page');
  response.end();
}

function orderlist(response) {
  console.log('orderlist');
  response.writeHead(200, {'Content-Type' : 'text/html'});

  mariadb.query("SELECT * FROM orderlist", function(err, rows) {
    if (err) {
      console.error('Error fetching orderlist:', err);
      response.write('Error occurred while fetching order list.');
    } else {
      let htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Order List</title>
          <style>
            h1 {
              text-align: center;
            }

            table {
              margin-left: auto;
              margin-right: auto;
              border-collapse: collapse;
              width: 80%;
            }

            th, td {
              padding: 10px;
              text-align: center;
              border: 1px solid black;
            }

            div {
              text-align: center;
              margin-bottom: 50px;
            }
          </style>
        </head>
        <body>
          <h1>Order List</h1>
          <div>
            <a href="/">Go Home</a>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>`;

      rows.forEach(element => {
        htmlContent += `
          <tr>
            <td>${element.product_id}</td>
            <td>${element.order_date}</td>
          </tr>`;
      });

      htmlContent += `
            </tbody>
          </table>
        </body>
      </html>`;

      response.write(htmlContent);
      response.end();
    }
  });
}

//key:value로 이루어진 상자 
let handle = {};
handle['/'] = main;
handle['/order'] = order;
handle['/orderlist'] = orderlist;

/** image directory */
handle['/img/redRacket.png'] = redRacket;
handle['/img/blueRacket.png'] = blueRacket;
handle['/img/blackRacket.png'] = blackRacket;

exports.handle = handle;
