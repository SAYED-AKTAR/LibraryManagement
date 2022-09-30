const mongoose = require('mongoose');

// Connect to the database
mongoose.connect("mongodb://localhost:27017/DigitalLibrary");

// Create the visitor schema
const visitorSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: String,
    password: String,
    isDelete: Boolean,
});
const Visitor = mongoose.model("visitors", visitorSchema);

// Create the manager schema
const manageSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: String,
    password: String,
    isActive: Boolean,
});
const Manager = mongoose.model("managers", manageSchema);

// Create the admin schema
const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: String,
    password: String,
});
const Admin = mongoose.model("admins", adminSchema);

// Create the book schema
const bookSchema = new mongoose.Schema({
    name: String,
    photo: String,
    stock: Number,
    unique_id: String
})
const Book = mongoose.model("books", bookSchema);

// Create the Library Details Schema
const librarySchema = new mongoose.Schema({
    name: String,
    unique_id: String,
    address: String, 
    manager: String,
    book_id: Array,
})
const Library = mongoose.model("library", librarySchema);

module.exports = {
    "Visitor": Visitor,
    "Manager": Manager,
    "Admin": Admin,
    "Book": Book,
    "Library": Library,
}