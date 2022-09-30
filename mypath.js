const path = require("path");
// Define your path
const viewPath = path.join(__dirname, "sayed_views/views");
const partialsPath = path.join(__dirname, "sayed_views/partials");
const staticPath = path.join(__dirname, "public/");

module.exports={
    "viewPath":viewPath,
    "partialsPath":partialsPath,
    "staticPath":staticPath,
}