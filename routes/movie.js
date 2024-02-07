var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const app = express();

var db = mysql.createConnection({
    host: 'localhost', user: 'root', password: '', database:'datn-movie.booking'
});
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the database');
    }
});

//danh sách phim mơi
router.get('/phimmoi', function(req, res) {
    let sophim = parseInt(req.params.sophim) || 5; // Lấy ra 5 bộ phim mới nhất theo NgayPhatHanh
    if (sophim <= 1) sophim = 1;
    let sql = 'SELECT id_phim, TenPhim, Poster, TrailerPhim, NgayPhatHanh  FROM moviess ORDER BY NgayPhatHanh DESC LIMIT 0, ?';
    db.query(sql, sophim, (err, data) => {
        if (err) res.json({"thông báo": "Lỗi", err});
        else res.json(data);
    });
});
// tất cả phim
router.get('/', function(req,res){
    let sql = 'SELECT id_phim, TenPhim, Poster, TrailerPhim FROM moviess';
    db.query(sql, (err,data)=>{
        if(err) res.json({"thông báo":"Lỗi",err});
        else res.json(data);
    });
});
//chi tiết phim
router.get('/phim/:id', function(req,res){
    let id = parseInt(req.params.id);
    if(id<=0){
        res.json({"Thông báo":"Không tìm thấy phim", "id":id});
        return;
    }
    let sql = 'SELECT * FROM moviess WHERE id_phim=?';
    db.query(sql, id, (err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi lấy thông tin phim", err})
        else res.json(data[0]);
    });
});
//danh sách loại
router.get('/theloai', function(req,res){
    let sql = 'SELECT id_theloai, ten_theloai FROM theloai';
    db.query(sql, (err,data)=>{
        if(err) res.json({"thông báo":"Lỗi",err})
        else res.json(data);
    });
});
// phim trong thể loại
router.get('/theloai/:id_theloai', function(req,res){
    let id_theloai= parseInt(req.params.id_theloai);
    if(id_theloai<=0){
        res.json({"Thông báo":"Không tìm được","id_theloai":id_theloai});
        return;
    }
    let sql = 'SELECT moviess.id_phim, moviess.id_theloai, moviess.TenPhim, moviess.NgayPhatHanh, moviess.Poster, theloai.ten_theloai FROM moviess INNER JOIN theloai ON moviess.id_theloai = theloai.id_theloai WHERE moviess.id_theloai = ?';
    db.query(sql, id_theloai,(err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi lấy id",err ,"id_theloai" :id_theloai});
        else res.json(data);
    });
});

module.exports = router;