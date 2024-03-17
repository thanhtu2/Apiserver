var express = require('express');
var router = express.Router();
var mysql = require('mysql2');
const app = express();


var db = mysql.createConnection({
    host: 'localhost', user: 'root', password: '', database:'datn-booking'
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
    let sophim = parseInt(req.params.sophim) || 5; // Lấy ra 5 bộ phim mới nhất theo NgayKhoiChieu
    if (sophim <= 1) sophim = 1;
    let sql = 'SELECT id_phim, TenPhim, Poster, TrailerPhim, NgayKhoiChieu  FROM moviess ORDER BY NgayKhoiChieu DESC LIMIT 0, ?';
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
    let sql = 'SELECT moviess.id_phim, moviess.id_theloai, moviess.TenPhim, moviess.NgayKhoiChieu, moviess.Poster, theloai.ten_theloai FROM moviess INNER JOIN theloai ON moviess.id_theloai = theloai.id_theloai WHERE moviess.id_theloai = ?';
    db.query(sql, id_theloai,(err,data)=>{
        if(err) res.json({"Thông báo":"Lỗi lấy id",err ,"id_theloai" :id_theloai});
        else res.json(data);
    });
});
// phim đang chiếu
router.get('/phimdangchieu', function(req,res){
    let sql = 'SELECT * FROM moviess WHERE TrangThai= "Đang Chiếu"';
    db.query(sql, (err,data)=>{
        if(err) res.json({"Thông Báo":"Lỗi",err})
        else res.json(data)
    });
});
router.get('/phimsapchieu', function(req, res) {
    const currentDate = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại
    let sql = `SELECT * FROM moviess WHERE NgayKhoiChieu >= '${currentDate}' AND TrangThai = 'Sắp Chiếu'`;
    db.query(sql, (err, data) => {
        if (err) {
            res.json({"Thông Báo": "Lỗi", err});
        } else {
            // Cập nhật trạng thái của các phim đã bắt đầu chiếu thành 'Đang Chiếu'
            data.forEach(movie => {
                const movieDate = new Date(movie.NgayKhoiChieu).toISOString().split('T')[0];
                if (movieDate <= currentDate) {
                    const updateSql = `UPDATE moviess SET TrangThai = 'Đang Chiếu' WHERE id = ${movie.id_phim}`;
                    db.query(updateSql, (updateErr, updateResult) => {
                        if (updateErr) {
                            console.error("Lỗi khi cập nhật trạng thái phim:", updateErr);
                        }
                    });
                }
            });
            res.json(data);
        }
    });
});

router.get('/phim/:id_phim/showtimes', (req, res) => {
    const { id_phim } = req.params;

    const sql = `
        SELECT st.id_sc, st.id_rap, st.ngaychieu, st.giochieu, c.TenRap, c.DiaChi
        FROM showtimes st
        JOIN cinemas c ON st.id_rap = c.id_rap
        WHERE st.id_phim = ?
        ORDER BY st.giochieu ASC
    `;

    db.query(sql, [id_phim], (err, results) => {
        if (err) {
            res.status(500).send('Server error');
            console.error(err);
            return;
        }
        
        const formattedResults = results.map(showtime => {
            const ngaychieu = showtime.ngaychieu.toISOString().split('T')[0];
            const giochieu = showtime.giochieu;
            // Điều chỉnh ngày giờ theo múi giờ GMT+7
            const dateTime = `${ngaychieu} ${giochieu}`;
            return {
                ...showtime,
                start_time: dateTime, // Trả về ngày giờ đã được điều chỉnh múi giờ
                TenRap: showtime.TenRap,
                DiaChi: showtime.DiaChi
            };
        });

        res.json(formattedResults);
    });
});
router.get('/phim/:id_phim/seats', (req, res) => {
    const { id_phim } = req.params;

    const sql = `
        SELECT id_ghe, id_phong, HangGhe, SoGhe, status
        FROM seats
        WHERE id_phong IN (
            SELECT id_phong
            FROM showtimes
            WHERE id_phim = ?
        )
        ORDER BY id_phong, HangGhe, SoGhe
    `;

    db.query(sql, [id_phim], (err, results) => {
        if (err) {
            res.status(500).send('Server error');
            console.error(err);
            return;
        }
        
        res.json(results);
    });
});
router.post('/phim/:id_phim/seats/book', (req, res) => {
    const { id_phim } = req.params;
    const { seatId } = req.body; // Giả sử seatId là ID của ghế mà người dùng muốn đặt

    // Kiểm tra ghế có sẵn và chưa được đặt
    const checkSeatAvailabilityQuery = `
        SELECT id_ghe, status
        FROM seats
        WHERE id_ghe = ? AND id_phong IN (
            SELECT id_phong
            FROM showtimes
            WHERE id_phim = ?
        )
    `;

    db.query(checkSeatAvailabilityQuery, [seatId, id_phim], (checkErr, checkResults) => {
        if (checkErr) {
            res.status(500).send('Server error');
            console.error(checkErr);
            return;
        }

        if (checkResults.length === 0) {
            res.status(404).json({ message: 'Ghế không tồn tại hoặc không có sẵn cho suất chiếu này.' });
            return;
        }

        const seat = checkResults[0];

        if (seat.status !== 'Trống') {
            res.status(400).json({ message: 'Ghế đã được đặt hoặc không có sẵn.' });
            return;
        }

        // Thực hiện đặt ghế
        const bookSeatQuery = `
            UPDATE seats
            SET status = 'Booked'
            WHERE id_ghe = ?
        `;

        db.query(bookSeatQuery, [seatId], (bookErr, bookResults) => {
            if (bookErr) {
                res.status(500).send('Server error');
                console.error(bookErr);
                return;
            }

            res.json({ message: 'Đặt ghế thành công.', data });
        });
    });
});


module.exports = router;
