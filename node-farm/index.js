const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require(`${__dirname}/modules/replaceTemplate`);

////////////////////////////////////////////
//FILE

// Đồng bộ
// Blocking synchronous way

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');

// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}. \nPham Le Khanh Duy ${Date.now()}`;

// fs.writeFileSync('./txt/output.txt', textOut);

// console.log('Write done!')

// Bất đồng bộ
// No-Blocking, asynchronous way

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if(err) return console.log("ERROR 😥");
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             fs.writeFile('./txt/final.txt', `${data2} \n${data3}`, 'utf-8', err => {
//                 console.log('you file has been written 😊');
//             })
//         })
//     });
// })

// console.log('Will read file!');

////////////////////////////////////////////
//SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHtml = dataObj
      .map((element) => replaceTemplate(tempCard, element))
      .join('');
    const output = tempOverview.replace('{%productCards%}', cardsHtml);

    res.end(output);
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const product = dataObj[query.id];

    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  } else if (pathname === '/api') {
    const productData = JSON.parse(data);
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'Hello world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, 'localhost', () => console.log('Server running !!!'));
