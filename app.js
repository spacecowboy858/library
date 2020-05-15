const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000;

const config = {
  user: 'admin-library',
  password: 'Forte_1234',
  server: 'pslibrary-01.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
  database: 'PSLibrary',

  // options: {
  //   encrypt: true
  // }
};
sql.connect(config).catch((err) => debug(err));
app.use(morgan('tiny'));
app.use((req, res, next) => {
  debug('my middleware');
  next();
});
app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [
  { link: '/books', title: 'Books' },
  { link: '/authors', title: 'Authors' }
];

const bookRouter = require('./src/routes/bookRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.get('/', (req, res) => {
  res.render(
    'index',
    {
      nav: [
        { link: '/books', title: 'Book' },
        { link: '/authors', title: 'Author' }
      ],
      title: 'Library',
    },
  );
});

app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});
