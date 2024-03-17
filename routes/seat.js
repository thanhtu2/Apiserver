
var express = require('express');
var router = express.Router();
var mysql = require('mysql2');
var db = mysql.createConnection({
    host: 'localhost', user : 'root' , password : '' , database : 'movie_film'
})
db.connect(()=>{console.log("KẾT NỐI THÀNH CÔNG DATABASE CỦA SEAT !")})
module.exports = router;

// lấy dữ liệu
router.get('/seats/',(req,res)=>{
    let sql = `SELECT * FROM seats`;
    db.query(sql,(err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi hiện ghế ngồi", err})
        else res.json(data);
    })
    })
module.exports = router;
// lấy dữ liệu theo id
router.get('/seats/:id',(req,res)=>{
    let seatId = req.params.id;
    let sql = `SELECT * FROM seats WHERE seat_id = ?`;
    db.query(sql,seatId,(err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi hiện ghế ngồi", err})
        else res.json(data[0]);
    })
    })

// them du lieu
router.post('/seats/',(req,res)=>{
    let data = req.body;
    let sql = `INSERT INTO seats SET ?`;
    db.query(sql,data,(err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi thêm ",err})
        else res.json({"Thông báo":"Thêm thành công","id":data.insertId});
    })
})

// sua du lieu
router.put('/seats/:id',(req,res)=>{
    let data = req.body;
    let seatId = req.params.id;
    let sql = `UPDATE seats SET ? WHERE seat_id =?`;
    db.query(sql,[data,seatId],(err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi xửa ",err})
        else res.json({"Thông báo":"Xửa thành công","id":data.insertId});
    })
})

// xóa dữ liêu
router.delete('/seats/:id', (req, res) => { // Sử dụng phương thức DELETE thay vì POST
    let seatId = req.params.id;
    let sql = `DELETE FROM seats WHERE seat_id = ?`; // Sử dụng câu lệnh DELETE FROM để xóa dữ liệu
    db.query(sql, [seatId], (err, data) => { // Truyền giá trị của seatId dưới dạng mảng để tránh SQL Injection
        if (err) {
            res.status(500).json({"Thông báo": "Lỗi xóa seat", "err": err}); // Thông báo lỗi nếu có lỗi xảy ra
        } else {
            res.status(200).json({"thông báo": "Xóa thành công"}); // Thông báo thành công nếu không có lỗi
        }
    });
});


module.exports = router;
