const mydb = require("./mydb");

const loginAuthManagerVisitor = async(req, res, next) => {
    const reqData = req.body;
    let dbExistData = null;
    let role = "";

    dbExistData = await mydb.Visitor.findOne({ email: reqData['email'], password: reqData['password'] });
    if(dbExistData !== null){
        role = "visitor";
    }
    else{
        dbExistData = await mydb.Manager.findOne({ email: reqData['email'], password: reqData['password'] });
        role = "manager";
    }
    if(dbExistData === null){
        role = "";
        next();
    }else{
        if(role == "manager"){
            const sess = req.session;
            sess.email = reqData['email'];
            sess.managerLoggedIn = true;
            res.redirect("managerDashboard");
        }else{
            res.statusCode = 202;
            res.setHeader('Content-Type', 'text/plain');
            res.end("You're a visitor...");
        }
    }
}

module.exports = {
    "loginAuthManagerVisitor": loginAuthManagerVisitor
}