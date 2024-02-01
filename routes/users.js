// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;

var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost', user : 'root' , password : '' , database : 'movie_film'
})
db.connect(()=>{console.log("KẾT NỐI THÀNH CÔNG DATABASE CỦA USERS !")})
module.exports = router;
//
router.get('/users/',(req,res)=>{
  let sql = `SELECT * FROM userss`;
  db.query(sql,(err,data)=>{
      if(err) res.json({"Thông báo":"Lỗi hiện ", err})
      else res.json(data);
  })
  })
module.exports = router;
// lấy dữ liệu theo id
router.get('/users/:id',(req,res)=>{
  let roomId = req.params.id;
  let sql = `SELECT * FROM userss WHERE user_id = ?`;
  db.query(sql,roomId,(err,data)=>{
      if(err) res.json({"Thông báo":"Lỗi hiện", err})
      else res.json(data[0]);
  })
  })
// them du lieu
router.post('/users/',(req,res)=>{
  let data = req.body;
  let sql = `INSERT INTO userss SET ?`;
  db.query(sql,data,(err,data)=>{
      if(err) res.json({"Thông báo":"Lỗi thêm ",err})
      else res.json({"Thông báo":"Thêm thành công","id":data.insertId});
  })
})
// sua du lieu
router.put('/users/:id',(req,res)=>{
  let data = req.body;
  let roomId = req.params.id;
  let sql = `UPDATE userss SET ? WHERE user_id =?`;
  db.query(sql,[data,roomId],(err,data)=>{
      if(err) res.json({"Thông báo":"Lỗi xửa ",err})
      else res.json({"Thông báo":"Xửa thành công","id":data.insertId});
  })
})
//
// xóa dữ liêu
router.delete('/users/:id', (req, res) => { 
  let data = req.body;
  let roomId = req.params.id;
  let sql = `DELETE FROM userss WHERE user_id = ?`; 
  db.query(sql, [roomId], (err, data) => {
      if (err) {
          res.status(500).json({"Thông báo": "Lỗi xóa seat", "err": err}); 
      } else {
          res.status(200).json({"thông báo": "Xóa thành công","id":data.insertId}); 
      }
  });
});

module.exports = router;
