var express = require('express');
var router = express.Router();
var mysql = require('mysql2');
const app = express();

var db = mysql.createConnection({
    host:'localhost', user:'root', password:'', database:'datn-booking'
});
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Admin Connected to the database');
    }
});
//mục quản lý phim
//
router.get('/quanlyphim', function(req,res){
    let sql = ' SELECT * FROM moviess';
    db.query(sql,(err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi ",err});
        else res.json(data);
    });
});
//them
router.post('/themphim', function(req, res) {
    let data = req.body;
    console.log(data);
    let sql = 'INSERT INTO moviess SET ?';
    db.query(sql, data, (err,data)=>{
        if(err) res.json({"thông báo":"Lỗi thêm", err});
        else res.json({"Thông báo":"Thêm thành công","id":data.insertId});
    });
});
//sua
router.put('/suaphim/:id', function(req, res){
    let id = req.params.id;
    let data = req.body;
    let sql = 'UPDATE moviess SET ? WHERE id_phim = ?';
    db.query(sql, [data,id],(err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi cập nhật", err});
        else res.json({"Thông báo":"Đã cập nhật sản phẩm"});
    });
});
//xoa 
router.delete('/xoaphim/:id', function(req, res){
    let id = req.params.id;
    let sql = 'DELETE FROM moviess WHERE id_phim = ?';
    db.query(sql, id, (err, result)=>{
        if(err) res.json({"Thông báo":"Không thể xóa", err});
        else res.json({"Thông báo":"Xóa thành công"});
    });
});
// mục quản lý người dùng
//
router.get('/quanlynguoidung', function(req,res){
    let sql = ' SELECT * FROM users WHERE id_role = 1';
    db.query(sql,(err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi ",err});
        else res.json(data);
    });
});
//
// router.put('/suathongtin/:user_id', function(req,res){
//     let data = req.body;
//     let id = req.params.user_id;
//     let sql = 'UPDATE users SET ? WHERE user_id = ?';
//     db.query(sql, [data,id],(err,data)=>{
//         if(err) res.json({"Thông báo":"Lỗi", err});
//         else res.json({"Thông báo":"Cập nhật thành công"});
//     });
// });
//
router.delete('/xoanguoidung/:user_id', function(req,res){
    let id = req.params.user_id;
    let sql = ' DELETE FROM users WHERE user_id = ?';
    db.query(sql, id,(err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi", err});
        else res.json({"Thông báo":"xóa thành công"});
    });
});
// mục quản lý rạp
//dsach rạp
router.get('/rap', function(req, res){
    let sql = `SELECT * FROM cinemas`;
    db.query(sql, (err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi", err});
        else res.json(data);
    });
});
//
router.post('/rap/add', function(req,res){
    let data = req.body;
    let sql = 'INSERT INTO cinemas SET ?';
    db.query(sql, data, (err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi",err})
        else res.json({"Thông báo":"Thêm thành công", "id": data.insertId});
    })
})
//
router.put('/rap/suarap/:id_rap', function(req,res){
    let id = req.params.id_rap;
    let data = req.body;
    let sql = 'UPDATE cinemas SET ? WHERE id_rap = ?';
    db.query(sql, [data,id],(err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi",err})
        else res.json({"Thông báo":"Cập Nhật thành công"});
    });
});
router.delete('/rap/xoarap/:id_rap', function(req,res){
    let id = req.params.id_rap;
    let sql = 'DELETE FROM cinemas WHERE id_rap=?';
    db.query(id,sql,(err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi",err});
        else res.json({"Thông báo":"Xóa thành công"});
    });
});
//doanhso
// router.get('/doanhthuphim', function(req,res){
//     let sql = `SELECT m.TenPhim AS TenPhim, IFNULL(FORMAT(SUM(b.TongGia), 0), 0) AS DoanhThu
//     FROM moviess m
//     LEFT JOIN booking b ON b.id_phim = m.id_phim
//     GROUP BY m.id_phim;
//     `;
//     db.query(sql, (err,data)=>{
//         if(err) res.json({"Thông báo":"Lỗi",err})
//         else res.json(data)
//     });
// });

router.get('/doanhthungay', function(req, res){
    let sql = `
        SELECT m.TenPhim AS TenPhim, DATE_FORMAT(b.NgayDatVe, '%Y-%m-%d') AS Ngay, IFNULL(FORMAT(SUM(b.TongGia), 0), 0) AS DoanhThu
        FROM moviess m
        LEFT JOIN booking b ON b.id_phim = m.id_phim
        GROUP BY m.id_phim, DATE_FORMAT(b.NgayDatVe, '%Y-%m-%d');
    `;
    db.query(sql, (err, data) => {
        if (err) {
            res.json({"Thông báo": "Lỗi", err});
        } else {
            res.json(data);
        }
    });
});

router.get('/doanhthuthang', function(req, res) {
    let sql = `
        SELECT 
            m.TenPhim AS TenPhim, 
            DATE_FORMAT(b.NgayDatVe, '%Y-%m') AS Thang, 
            IFNULL(FORMAT(SUM(b.TongGia), 0), 0) AS DoanhThu
        FROM 
            moviess m
        LEFT JOIN 
            booking b ON b.id_phim = m.id_phim
        GROUP BY 
            m.id_phim, Thang;
    `;
    db.query(sql, (err, data) => {
        if (err) {
            res.json({ "Thông báo": "Lỗi", err });
        } else {
            res.json(data);
        }
    });
});

module.exports = router;