var express = require('express');
var router = express.Router();
var mysql = require('mysql2');
const qr = require('qr-image');

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
// router.post('/phim/:id_phim/showtimes/book', (req, res) => {
//     const { id_phim } = req.params;
//     const { id_rap, ngaychieu, giochieu } = req.body; // Giả sử bạn nhận được thông tin về rạp, ngày chiếu và giờ chiếu từ client

//     // Thực hiện kiểm tra tính hợp lệ của thông tin được cung cấp
//     // (ví dụ: kiểm tra xem rạp, ngày chiếu và giờ chiếu có hợp lệ không)

//     // Sau đó, thực hiện đặt suất chiếu
//     const bookShowtimeQuery = `
//         INSERT INTO showtimes (id_phim, id_rap, ngaychieu, giochieu)
//         VALUES (?, ?, ?, ?)
//     `;

//     db.query(bookShowtimeQuery, [id_phim, id_rap, ngaychieu, giochieu], (err, result) => {
//         if (err) {
//             res.status(500).send('Server error');
//             console.error(err);
//             return;
//         }

//         res.json({ message: 'Đặt suất chiếu thành công.' });
//     });
// });


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
//đặt vé
router.post('/phim/:id_phim/seats/book', (req, res) => {
    const { id_phim } = req.params;
    const { seatId, cinemasId, showtimeId, userId, NgayMua, total } = req.body;

    function generateOrderId() {
        // Generate a random unique orderId
        return Math.floor(Math.random() * 1000000);
    }

    const checkSeatAvailabilityQuery = `
        SELECT id_ghe, id_phong, Gia, status
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

        const orderId = generateOrderId(); // Assuming generateOrderId() generates a unique orderId

        const buyTicketQuery = `
            INSERT INTO tickets (id_ghe, id_phim, id_phong, id_rap, id_user, id_sc, NgayMua, orderId, total)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
        `;

        // Lấy giá của ghế từ kết quả truy vấn
        const seatPrice = seat.Gia;

        db.query(buyTicketQuery, [seatId, id_phim, seat.id_phong, cinemasId, userId, showtimeId, NgayMua, orderId, total], (buyErr, buyResults) => {
            if (buyErr) {
                res.status(500).send('Server error');
                console.error(buyErr);
                return;
            }

            const updateSeatStatusQuery = `
                UPDATE seats
                SET status = 'Đã mua'
                WHERE id_ghe = ?
            `;

            db.query(updateSeatStatusQuery, [seatId], (updateErr, updateResults) => {
                if (updateErr) {
                    res.status(500).send('Server error');
                    console.error(updateErr);
                    return;
                }

                // Tính tổng giá trị thanh toán của ghế đã đặt
                const totalAmount = seatPrice;

                const paymentUrl = `https://payment.com?orderId=${orderId}`;

                res.json({ message: 'Mua vé thành công.', totalAmount, paymentUrl });
            });
        });
    });
});


// router.get('/tickets/:id_ve', (req, res) => {
//     const { id_ve } = req.params;
//     const sql = 'SELECT *, DATE_FORMAT(NgayMua, "%Y-%m-%d") AS NgayMua FROM tickets WHERE id_ve = ?';

//     db.query(sql, id_ve, (err, data) => {
//         if (err) {
//             res.json({ "Thông báo": "Lỗi", err });
//         } else {
//             res.json(data);
//         }
//     });
// });

//Lấy ra thông tin vé dựa trên orderId
router.get('/api/tickets/:orderId', (req, res) => {
    const { orderId } = req.params;

    // Truy vấn cơ sở dữ liệu để lấy thông tin vé dựa trên orderId
    const getTicketInfoQuery = 'SELECT * FROM tickets WHERE orderId = ?';

    // Thực hiện truy vấn SQL với orderId từ yêu cầu HTTP
    db.query(getTicketInfoQuery, [orderId], (err, results) => {
        if (err) {
            res.status(500).send('Server error');
            console.error(err);
            return;
        }

        if (results.length === 0) {
            res.status(404).send('Ticket not found');
            return;
        }

        // Trả về thông tin vé dưới dạng JSON
        const ticketInfo = results[0];
        res.json(ticketInfo);
    });
});

// Route để hiển thị mã QR
router.get('/api/payment-qr/:orderId', (req, res) => {
    const { orderId } = req.params;

    // Truy vấn cơ sở dữ liệu để lấy thông tin đơn hàng
    const getOrderDetailsQuery = 'SELECT * FROM tickets WHERE orderId = ?';

    // Thực hiện truy vấn SQL với orderId từ yêu cầu HTTP
    db.query(getOrderDetailsQuery, [orderId], (err, results) => {
        if (err) {
            res.status(500).send('Server error');
            console.error(err);
            return;
        }
 
        if (results.length === 0) {
            res.status(404).send('Order not found');
            return;
        }

        // Lấy thông tin đơn hàng từ kết quả truy vấn
        const orderDetails = results[0];

        // Tạo đối tượng chứa thông tin thanh toán
        const paymentInfo = {
            orderId: orderDetails.orderId,
            totalPrice: orderDetails.totalPrice, // Thay totalPrice bằng trường dữ liệu chứa giá trị thanh toán trong đơn hàng
            // Thêm các trường thông tin khác nếu cần thiết
        };

        // Dữ liệu thanh toán (URL hoặc thông tin cần chuyển đổi thành QR code)
        const paymentData = JSON.stringify(paymentInfo);

        // Tạo mã QR từ dữ liệu thanh toán
        const qrCode = qr.image(paymentData, { type: 'png' });

        // Trả về mã QR dưới dạng hình ảnh
        res.type('png');
        qrCode.pipe(res);
    });
});


router.post('/api/payment', (req, res) => {
    const { orderId, transactionId } = req.body;

    // Cập nhật thông tin giao dịch vào bảng booking
    const getTicketsQuery = 'SELECT * FROM tickets WHERE orderId = ?';

    db.query(getTicketsQuery, [orderId], (err, tickets) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
            return;
        }

        if (tickets.length === 0) {
            res.status(404).send('No tickets found for the specified order');
            return;
        }

        let successfulBookings = 0;

        tickets.forEach(ticket => {
            const { id_ve, id_phim, id_phong, id_ghe, id_sc, id_user, id_rap } = ticket;
            const insertBookingQuery = `
                INSERT INTO booking (MaDatVe, id_phim, id_phong, id_ghe, id_rap, id_sc, id_user, transaction_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [id_ve, id_phim, id_phong, id_ghe, id_rap, id_sc, id_user, transactionId];

            db.query(insertBookingQuery, values, (insertErr, result) => {
                if (insertErr) {
                    console.error(insertErr);
                    return;
                }
                successfulBookings++;
                console.log(`Booking for ticket ${id_ve} inserted successfully.`);

                if (successfulBookings === tickets.length) {
                    res.status(200).send('Booking information updated successfully');
                }
            });
        });
    });
});


module.exports = router;