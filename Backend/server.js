const express = require('express')
const mariadb = require('mariadb');
var bodyParser =require('body-parser');
var cors = require('cors')
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const pool = mariadb.createPool({  
    host     : 'localhost',
    user     : 'root',
    password : 'chermaraja',
     database : 'new_app',    
    port    :4000});
 
app.get('/',  function(req, res) {
  pool.getConnection()
    .then(conn => {
    
      conn.query("SELECT * FROM category")
        .then(rows => {
         res.send(rows)
         return conn.end();
        })
    
      .catch(err => {
          conn.release(); // release to pool
        })
        
    }).catch(err => {
      //not connected
    });
 
})
app.post('/searchlist',  function(req, res) {
  
  pool.getConnection()
    .then(conn => {
    var name=req.body.name; 
      conn.query(`SELECT * FROM foods WHERE food_name =('${name}') `)
        .then(rows => { // rows: [ {val: 1}, meta: ... ]
         res.send(rows)
         return conn.end();
        })
    
      .catch(err => {     
          conn.release(); // release to pool
        })
        
    }).catch(err => {
      //not connected
    });
 
})
app.post('/app/filter',  function(req, res) {
    var query = 'select * from foods where id IS NOT NULL';

    if(parseInt(req.body.category_id)){    
      query+= ` AND category_id= '${parseInt(req.body.category_id)}'` ;     
     
      }
      if(parseInt(req.body.cost)){     
      query+=` AND cost >= '${parseInt(req.body.cost)}'`     
      }
      
      if( Array.isArray(req.body.city) && req.body.city.length){  

        var new_arr=req.body.city
      
      query+=` AND city in ('${new_arr[0]} ','${new_arr[1]}')`;       
      } 
      pool.getConnection()
      .then(conn => {      
        conn.query(query)
          .then(rows => { // rows: [ {val: 1}, meta: ... ]
           res.send(rows)
           return conn.end();
          })
      
        .catch(err => {
            conn.release(); 
          })
        })
 
})

app.post('/range/filter',  function(req, res) {
  
  pool.getConnection()
  .then(conn => {
  var name=req.body.name; 
    conn.query(` SELECT * FROM foods WHERE cost >= ${parseInt(req.body.min)} and cost<=${parseInt(req.body.max)}`)
      .then(rows => { // rows: [ {val: 1}, meta: ... ]
       res.send(rows)
       return conn.end();
      })
  
    .catch(err => {    
        conn.release(); 
      })
      
  }).catch(err => {
    
  });

})
app.post('/search/filter',  function(req, res) {
  pool.getConnection()
  .then(conn => {
  var name=req.body.name; 
    conn.query(` SELECT * FROM foods WHERE food_name LIKE "%${(name)}%" `)
      .then(rows => {
       res.send(rows)
       return conn.end();
      })
  
    .catch(err => {     
        conn.release(); 
      })
      
  }).catch(err => {
    //not connected
  });

})
app.listen(8081, function () {
console.log("working")
})