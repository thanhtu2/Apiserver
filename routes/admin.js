var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const app = express();

var db = mysql.createConnection({
    host:'localhost', user:'root', password:'', database:'book_movie'
});
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Admin Connected to the database');
    }
});
//them sp
router.post('/', function(req, res) {
    let data = req.body;
    console.log(data);
    let sql = 'INSERT INTO moviess SET ?';
    db.query(sql, data, (err,data)=>{
        if(err) res.json({"thông báo":"Lỗi thêm", err});
        else res.json({"Thông báo":"Thêm thành công","id":data.insertId});
    });
});
//sua sp
router.put('/:movie_id', function(req, res){
    let data = req.body;
    let id = req.params.movie_id;
    let sql = 'UPDATE moviess SET ? WHERE movie_id = ?';
    db.query(sql, [data, id], (err, d)=> {
        if(err) res.json({"Thông báo":"Lỗi cập nhật", err});
        else res.json({"Thông báo":"Đã cập nhật sản phẩm"});
    });
});
//xoa 
router.delete('/:movie_id', function(req, res){
    let id = req.params.movie_id;
    let sql = 'DELETE FROM moviess WHERE movie_id = ?';
    db.query(sql, id, (err, d)=>{
        if(err) res.json({"Thông báo":"Không thể xóa", err});
        else res.json({"Thông báo":"Xóa thành công"});
    });
});
//
router.get('/quanlynguoidung', function(req,res){
    let sql = ' SELECT * FROM userss';
    db.query(sql,(err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi ",err});
        else res.json(data);
    });
});
//
router.put('/suathongtin/:user_id', function(req,res){
    let data = req.body;
    let id = req.params.user_id;
    let sql = 'UPDATE userss SET ? WHERE user_id = ?';
    db.query(sql, [data,id],(err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi", err});
        else res.json({"Thông báo":"Cập nhật thành công"});
    });
});
//
router.delete('/xoanguoidung/:user_id', function(req,res){
    let id = req.params.user_id;
    let sql = ' DELETE FROM userss WHERE user_id = ?';
    db.query(sql, id,(err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi", err});
        else res.json({"Thông báo":"xóa thành công"});
    });
});
module.exports = router;