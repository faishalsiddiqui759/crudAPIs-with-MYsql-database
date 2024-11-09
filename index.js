//crud operation with database. creating data, read data, update data, delete data with MYSQL database;
const {faker} = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { send } = require("process");



const connection  = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "crudDatabase",
    password: "mysql*@*9506"
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.listen("8080", ()=>{
    console.log("app is listening on port 8080");
});

app.get("/", (req, res)=>{
  let query = 'select count(*) from data3';
  try{
    connection.query(query, (err, result)=>{
        if(err) throw err;
        let count = result[0]['count(*)'];
        res.render("home.ejs", {count});        
    });
  } catch(err){
    res.send("some error occured in database");
  }
});

app.get("/user", (req, res)=>{
  let q = 'select *from data3';
  try{
    connection.query(q, (err, result)=>{
      if(err) throw err;
      let dataAll = result;
      res.render("showsUsers.ejs", {dataAll});
    });
  } catch(err){
    res.send("some occured in database");
  }
});  

app.get("/user/:id/edit", (req, res)=>{
   let {id} = req.params;
   let query = `select *from data3 where id = '${id}'`;
   try{
    connection.query(query, (err, result)=>{
      if(err) throw err;
      let userData = result[0];
      res.render("edit.ejs", {userData});
    });
   } catch(err){
    res.send("some error in database");
   }
});

app.patch("/user/:id", (req, res)=>{
   let {id} = req.params;
   let {password: formPass, username: newusername} = req.body;
   let q1 = `select *from data3 where id = "${id}"`;
   try{
    connection.query(q1, (err, result)=>{
      if(err) throw err;
      if(formPass != result[0].password){
        res.send("wrong password");
      }else{
        let q2 = `update data3 set username = "${newusername}" where id = "${id}"`;
        try{
          connection.query(q2, (err, result)=>{
            if(err) throw err;
            res.redirect("/user");
          });
        }catch(err){
          res.send("wrong password");
        }
      }
    });
   } catch(err){
    res.send("some error in database");
   }
});

app.get("/user/add",(req, res)=>{
  res.render("Add.ejs");
});

app.post("/user", (req, res)=>{
  let {id, username, email, password} = req.body;
 
  let q4 = "insert into data3 (id, username, email, password) values (?,?,?,?)";
  let dataAdd = [id, username, email, password];
  try{
    connection.query(q4, dataAdd, (err, result)=>{
      if(err) throw err;
      res.redirect("/user");
    })
  } catch(err){
    res.send("error occured");
  }
});

app.get("/user/delete/:id", (req,res)=>{
  let {id} = req.params;
  let q6 = `select *from data3 where id ="${id}"`;
  try{
    connection.query(q6, (err, result)=>{
      if(err) throw err;
      let data = result[0];
      res.render("delAsk.ejs", {data});
    });
  }catch(err){
    res.send("error oin database");
  }
});

app.delete("/user/:id", (req, res)=>{
  let {id} = req.params;
  let {password: formPass1} = req.body;
  let q7 = `select *from data3 where id = "${id}"`;
  try{
    connection.query(q7, (err, result)=>{
      if(err) throw err;
      if(formPass1 != result[0].password){
        res.send("wrong password");
      }else{
        let q8 = `delete from data3 where id = "${id}"`;
          connection.query(q8, (err, result)=>{
           if(err) throw err;
           res.redirect("/user");
          });
      }
    });
  } catch(err){
      res.send("database error")
  } 
});