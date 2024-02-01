var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost', user : 'root' , password : '' , database : 'movie_film'
})
db.connect(()=>{console.log("KẾT NỐI THÀNH CÔNG DATABASE CỦA ROOM !")})
module.exports = router;

router.get('/rooms/',(req,res)=>{
    let sql = `SELECT * FROM rooms`;
    db.query(sql,(err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi hiện ", err})
        else res.json(data);
    })
    })
module.exports = router;
// lấy dữ liệu theo id
router.get('/rooms/:id',(req,res)=>{
    let roomId = req.params.id;
    let sql = `SELECT * FROM rooms WHERE room_id = ?`;
    db.query(sql,roomId,(err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi hiện", err})
        else res.json(data[0]);
    })
    })
// them du lieu
router.post('/rooms/',(req,res)=>{
    let data = req.body;
    let sql = `INSERT INTO rooms SET ?`;
    db.query(sql,data,(err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi thêm ",err})
        else res.json({"Thông báo":"Thêm thành công","id":data.insertId});
    })
})

// sua du lieu
router.put('/rooms/:id',(req,res)=>{
    let data = req.body;
    let roomId = req.params.id;
    let sql = `UPDATE rooms SET ? WHERE room_id =?`;
    db.query(sql,[data,roomId],(err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi xửa ",err})
        else res.json({"Thông báo":"Xửa thành công","id":data.insertId});
    })
})
// xóa dữ liêu
router.delete('/rooms/:id', (req, res) => { // Sử dụng phương thức DELETE thay vì POST
    let data = req.body;
    let roomId = req.params.id;
    let sql = `DELETE FROM rooms WHERE room_id = ?`; // Sử dụng câu lệnh DELETE FROM để xóa dữ liệu
    db.query(sql, [roomId], (err, data) => { // Truyền giá trị của seatId dưới dạng mảng để tránh SQL Injection
        if (err) {
            res.status(500).json({"Thông báo": "Lỗi xóa seat", "err": err}); // Thông báo lỗi nếu có lỗi xảy ra
        } else {
            res.status(200).json({"thông báo": "Xóa thành công","id":data.insertId}); // Thông báo thành công nếu không có lỗi
        }
    });
});

module.exports = router;
