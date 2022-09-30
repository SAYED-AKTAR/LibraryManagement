const myapp = require("./appconfig");
const mydb = require("./mydb");
const mypath = require("./mypath");
const middleware = require("./middleware");

const app = myapp.app;

app.get("/", (req, res)=>{
    res.redirect("login");
})

app.get("/home", (req, res)=>{
    res.render("home");
})

app.get("/about", (req, res)=>{
    res.render("about");
})

app.get("/login", (req, res)=>{
    res.render("login");
})

app.post("/login", middleware.loginAuthManagerVisitor, async(req, res)=>{
    res.send("Unauthorized access...")
})

app.get("/managerDashboard", async(req, res)=>{
    if(req.session.managerLoggedIn === true){
        const libData = await mydb.Library.findOne({manager: req.session.email});
        if(libData === null){
            res.send("You're authenticate manager, but you're not assigned to any library yet !!!");
        }else{
            res.render("manager/dashboard");
        }
    }else{
        res.redirect("login");
    }
})
app.get("/managerLibraryOverview", async(req, res)=>{
    if(req.session.managerLoggedIn === true){
        const libData = await mydb.Library.findOne({manager: req.session.email});
        if(libData === null){
            res.send("You're authenticate manager, but you're not assigned to any library yet !!!");
        }else{
            res.render("manager/libraryOverview", {"libData": libData});
        }
    }else{
        res.redirect("login");
    }
})
app.get("/managerBookList", async(req, res)=>{
    if(req.session.managerLoggedIn === true){
        const libData = await mydb.Library.findOne({manager: req.session.email});
        if(libData === null){
            res.send("You're authenticate manager, but you're not assigned to any library yet !!!");
        }else{
            res.render("manager/bookList", {"bookData": libData.book_id});
        }
    }else{
        res.redirect("login");
    }
})

app.get("/register", (req, res)=>{
    res.render("register", {"msg": "Join With Us"});
})

app.post("/register", async (req, res)=>{
    const role = req.body.role;
    let dbExistData = null;
    if(role === "visitor"){
        dbExistData = await mydb.Visitor.findOne({ email: req.body.email });
    }else{
        dbExistData = await mydb.Manager.findOne({ email: req.body.email })
    }
    if(dbExistData === null){
        const reqData = req.body;
        if (role === "visitor"){
            const visitor = new mydb.Visitor({
                name: reqData['name'],
                email: reqData['email'],
                address: reqData['address'],
                password: reqData['password'],
                isDelete: false,
            });
            visitor.save((err, data)=>{
                if(err){
                    res.send("Something went wrong, try again later !!!");
                }
                else{
                    res.render("register", {"msg": `Welcome, ${reqData['name']} !`, "show": true});
                }
            });
        }else{
            const manager = new mydb.Manager({
                name: reqData['name'],
                email: reqData['email'],
                address: reqData['address'],
                password: reqData['password'],
                isActive: false,
            });
            manager.save((err, data)=>{
                if(err){
                    res.send("Something went wrong, try again later !!!");
                }
                else{
                    res.render("register", {"msg": `Welcome, ${reqData['name']} !`, "show": true});
                }
            });
        }
    }else{
        res.render("register", {"showEmailExistError": true, "msg": "Join With Us"});
    }
})

app.get("/admin", (req, res)=>{
    if(req.session.adminLoggedIn === true){
        res.redirect("adminDashboard");
    }else{
        res.render("adminLogin");
    }
})

app.get("/adminDashboard", (req, res)=>{
    if(req.session.adminLoggedIn === true){
        res.render("adminDashboard");
    }else{
        res.redirect("login");
    }
})
app.get("/adminManagersList", async (req, res)=>{
    if(req.session.adminLoggedIn === true){
        const dbManagerData = await mydb.Manager.find();
        res.render("adminManagersList", {"dbManagerData": dbManagerData});
    }else{
        res.redirect("login");
    }
})

app.post("/managerStatusChange", (req, res)=>{
    const reqData = req.body;
    const filter = { email: reqData.email };
    const update = { isActive: reqData.isActive };

    mydb.Manager.findOneAndUpdate(filter, update, function(err, data){
        if(err){
            console.log(`Error Occured: ${err}`);
            res.send({"status":"error"});
        }else{
            res.send({"status":"success"});
        }
    });
})

app.get("/adminVisitorsList", async(req, res)=>{
    if(req.session.adminLoggedIn === true){
        const dbVisitorData = await mydb.Visitor.find();
        res.render("adminVisitorsList", {"dbVisitorData": dbVisitorData});
    }else{
        res.redirect("login");
    }
})

app.post("/visitorStatusChange", (req, res)=>{
    const reqData = req.body;
    const filter = { email: reqData.email };
    const update = { isDelete: reqData.isDelete };

    mydb.Visitor.findOneAndUpdate(filter, update, function(err, data){
        if(err){
            console.log(`Error Occured: ${err}`);
            res.send({"status":"error"});
        }else{
            res.send({"status":"success"});
        }
    });
})

app.get("/adminAddLibrary", async(req, res)=>{
    if(req.session.adminLoggedIn === true){
        const dbLibraryData = await mydb.Library.find();
        const dbBookData = await mydb.Book.find();
        res.render("adminAddLibrary", {"dbLibraryData": dbLibraryData, "dbBookData": dbBookData});
    }else{
        res.redirect("login");
    }
})
app.get("/adminAddLibForm", async(req, res)=>{
    if(req.session.adminLoggedIn === true){
        const dbVisitorData = await mydb.Visitor.find();
        res.render("adminAddLibForm", {"dbVisitorData": dbVisitorData});
    }else{
        res.redirect("login");
    }
})
app.post("/adminAddLibForm", async(req, res)=>{
    if(req.session.adminLoggedIn === true){
        const reqData = req.body;
        let dbExistData = null;
        dbExistData = await mydb.Library.findOne({ unique_id: reqData['uid'] });
        if(dbExistData === null){
            const library = new mydb.Library({
                name: reqData['name'],
                unique_id: reqData['uid'],
                address: reqData['address'],
                manager: reqData['manager'],
                book_id: []
            });
            library.save((err, data)=>{
                if(err){
                    res.send("Something went wrong, try again later !!!");
                }
                else{
                    res.redirect("adminAddLibrary");
                }
            });
        }else{
            res.send("Unique Id Already Exist !!!");
        }
    }else{
        res.redirect("login");
    }
})

app.get("/adminAddBook", async(req, res)=>{
    if(req.session.adminLoggedIn === true){
        res.render("adminAddBook");
    }else{
        res.redirect("login");
    }
})
app.post("/adminAddBook", async(req, res)=>{
    if(req.session.adminLoggedIn === true){
        const reqData = req.body;
        let dbExistData = null;
        dbExistData = await mydb.Book.findOne({ unique_id: reqData['uid'] });
        if(dbExistData === null){
            const file = req.files.book;
            const fileName = file.name;
            const book = new mydb.Book({
                name: reqData['name'],
                unique_id: reqData['uid'],
                stock: reqData['stock'],
                photo: fileName,
            });
            file.mv(mypath.staticPath+"static\\book_images\\"+fileName, (err)=>{
                if(err){
                    res.send("Something went wrong, please try again...")
                }
            })
            book.save((err, data)=>{
                if(err){
                    res.send("Something went wrong, try again later !!!");
                }
                else{
                    res.redirect("adminAddLibrary");
                }
            });
        }else{
            res.send("Unique Id Already Exist !!!");
        }
    }else{
        res.redirect("login");
    }
})

app.get("/adminBookList", async(req, res)=>{
    if(req.session.adminLoggedIn === true){
        const adminBookList = await mydb.Book.find();
        res.render("adminBookList", {"adminBookList": adminBookList});
    }else{
        res.redirect("login");
    }
})
app.post("/adminBookList", async(req, res)=>{
    if(req.session.adminLoggedIn === true){
        const reqData = req.body;
        const filter = { unique_id: reqData.uid };
        const update = { stock: reqData.stock_update };
        mydb.Book.findOneAndUpdate(filter, update, function(err, data){
            if(err){
                console.log(`Error Occured: ${err}`);
                res.send({"status":"error"});
            }else{
                res.redirect("adminBookList");
            }
        });
    }else{
        res.redirect("login");
    }
})

app.post("/adminUpdateBookStock", async(req, res)=>{
    if(req.session.adminLoggedIn === true){
        const reqData = req.body;
        const bookDetailArr = reqData.bookName;
        const arr = bookDetailArr.split("|||");
        const onlyBookName = arr[0].trim();
        const onlyBookUID = arr[1].trim();
        const onlyBookCurrentStock = parseInt(arr[2].trim());
        
        let wishStock = reqData.itemNo;
        wishStock = parseInt(wishStock);

        if(onlyBookCurrentStock > wishStock){
            const lib_uid = reqData.uid;
            const filter = { unique_id: lib_uid };
            mydb.Library.findOne(filter, 
            function(err, data) {
                if(err){
                    console.log("Error",err); //Not working....
                }
                else{
                    if(data === null){
                        res.send("Unauthorized user");
                    }else{
                        let existingBooks = data.book_id;
                        existingBooks.push({"bookName": onlyBookName, "stock": wishStock});
                        const update = { book_id: existingBooks };
                        mydb.Library.findOneAndUpdate(filter, update, function(err, data){
                            if(err){
                                console.log(`Error Occured: ${err}`);
                                res.send({"status":"Error !!! Something went wrong..."});
                            }else{
                                // If Success do this...
                                const filter2 = { unique_id: onlyBookUID };
                                const update2 = { stock: onlyBookCurrentStock - wishStock };
                                mydb.Book.findOneAndUpdate(filter2, update2, function(err, data){
                                    if(err){
                                        console.log(`Error Occured: ${err}`);
                                        res.send({"status":"Error !!! Something went wrong..."});
                                    }else{
                                        res.redirect("adminAddLibrary");
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }else{
            console.log(currentStock, wishStock)
            console.log(currentStock > wishStock)
            res.send("Don't have sufficient items, out of stock.");
        }
    }else{
        res.redirect("login");
    }
})

app.post("/admin", (req, res)=>{
    const reqData = req.body;
    mydb.Admin.findOne({email: reqData['email'], password: reqData['password']}, 
    function(err, data) {
        if(err){
            console.log("Error",err); //Not working....
        }
        else{
            if(data === null){
                res.send("Unauthorized user");
            }else{
                const sess = req.session;
                sess.email = reqData['email'];
                sess.adminLoggedIn = true;
                res.redirect("adminDashboard");
            }
        }
    });
})

app.get("/logout", (req, res)=>{
    req.session.destroy();
    res.redirect("login");
})



app.get("*", (req, res)=>{
    res.render("404");
})


app.listen(8000, "localhost", ()=>{
    console.log("Listening on http://localhost:8000");
})