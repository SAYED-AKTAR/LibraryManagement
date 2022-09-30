const express = require("express");
const hbs = require("hbs");
const mypath = require("./mypath");
const session = require('express-session');
const upload = require("express-fileupload");

app = express();
app.set("view engine", "hbs");
app.set("views", mypath.viewPath);
app.use(session({
    secret: 'mabcdzxyqweasdcf',
    resave: false,
    saveUninitialized: false,
}))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(mypath.staticPath));
app.use(upload());
hbs.registerPartials(mypath.partialsPath);
hbs.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
      case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
          return options.inverse(this);
  }
});

module.exports = {
    "app": app
}