-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th1 30, 2024 lúc 04:54 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `movie_film`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `showtime_id` int(11) DEFAULT NULL,
  `seat_number` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cinemas`
--

CREATE TABLE `cinemas` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `moviess`
--

CREATE TABLE `moviess` (
  `movie_id` int(11) NOT NULL,
  `movie_name` varchar(255) NOT NULL,
  `movie_description` varchar(255) NOT NULL,
  `movie_trailer` varchar(255) NOT NULL,
  `movie_cens` varchar(10) NOT NULL,
  `movie_genres` varchar(255) NOT NULL,
  `movie_release` date NOT NULL,
  `movie_length` int(11) NOT NULL,
  `movie_format` varchar(255) NOT NULL,
  `movie_poster` varchar(255) NOT NULL,
  `dienvien_id` varchar(20) NOT NULL,
  `daodien_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `moviess`
--

INSERT INTO `moviess` (`movie_id`, `movie_name`, `movie_description`, `movie_trailer`, `movie_cens`, `movie_genres`, `movie_release`, `movie_length`, `movie_format`, `movie_poster`, `dienvien_id`, `daodien_id`) VALUES
(1, 'APE VS. MECHA APE', 'Quân đội tạo ra đội quân Khỉ AI dựa trên sức mạnh của Khỉ khổng lồ nhưng thất bại ở thử nghiệm đầu tiên khiến họ phải thả Khỉ khổng lồ đang bị giam cầm ra để ngăn chặn đội quân Khỉ Robot trước khi nó phá hủy Chicago.', 'https://www.youtube.com/embed/j8loj_symMY?feature=oembed', 'P', 'Action', '2024-01-18', 86, '2D', 'https://www.bhdstar.vn/wp-content/uploads/2024/01/…adOfficeallowPlaceHoldertrueheight700ldapp-22.jpg', '', ''),
(2, 'APE VS. MECHA APE', 'Quân đội tạo ra đội quân Khỉ AI dựa trên sức mạnh của Khỉ khổng lồ nhưng thất bại ở thử nghiệm đầu tiên khiến họ phải thả Khỉ khổng lồ đang bị giam cầm ra để ngăn chặn đội quân Khỉ Robot trước khi nó phá hủy Chicago.', 'https://www.youtube.com/embed/j8loj_symMY?feature=oembed', 'P', 'Action', '2024-01-24', 86, '2D', 'https://www.bhdstar.vn/wp-content/uploads/2024/01/…adOfficeallowPlaceHoldertrueheight700ldapp-22.jpg', 'Tom Arnold, Anna Tel', ' Marc Gottlieb'),
(3, 'Đất rừng phương nam', 'phim như nhặc', '', 'C', 'Action', '0000-00-00', 0, '', 'https://images2.thanhnien.vn/528068263637045248/2023/5/9/first-lookposter-1683642029191984245773.jpg', '', '');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `movie_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `rating` decimal(3,1) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `review_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rooms`
--

CREATE TABLE `rooms` (
  `room_id` int(11) NOT NULL,
  `cinema_id` int(11) DEFAULT NULL,
  `room_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `rooms`
--

INSERT INTO `rooms` (`room_id`, `cinema_id`, `room_name`) VALUES
(3, 5, 'ROOM5'),
(9, 1, 'room1'),
(10, 2, 'room2'),
(11, 3, 'room3'),
(12, 4, 'room4');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `seats`
--

CREATE TABLE `seats` (
  `seat_id` int(11) NOT NULL,
  `seat_type` varchar(255) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `seat_row` int(11) DEFAULT NULL,
  `seat_number` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `seats`
--

INSERT INTO `seats` (`seat_id`, `seat_type`, `room_id`, `seat_row`, `seat_number`) VALUES
(1, 'thường ', 1, 3, 2),
(2, 'thường ', 2, 1, 2),
(3, 'vip', 3, 3, 2),
(5, 'vip', 4, 4, 2),
(17, 'thường ', 1, 1, 1),
(18, 'vip', 5, 6, 2),
(19, 'vip', 4, 4, 2),
(20, 'vip', 4, 4, 2),
(21, 'vip', 4, 4, 2),
(22, 'vip', 4, 4, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `showtimes`
--

CREATE TABLE `showtimes` (
  `id` int(11) NOT NULL,
  `cinema_id` int(11) DEFAULT NULL,
  `movie_id` int(11) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `userss`
--

CREATE TABLE `userss` (
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_avatar` varchar(255) DEFAULT NULL,
  `user_fullname` varchar(255) DEFAULT NULL,
  `user_gender` varchar(255) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `user_city` varchar(255) DEFAULT NULL,
  `user_phone` varchar(255) DEFAULT NULL,
  `user_point` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `showtime_id` (`showtime_id`);

--
-- Chỉ mục cho bảng `cinemas`
--
ALTER TABLE `cinemas`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `moviess`
--
ALTER TABLE `moviess`
  ADD PRIMARY KEY (`movie_id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `movie_id` (`movie_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`room_id`);

--
-- Chỉ mục cho bảng `seats`
--
ALTER TABLE `seats`
  ADD PRIMARY KEY (`seat_id`);

--
-- Chỉ mục cho bảng `showtimes`
--
ALTER TABLE `showtimes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cinema_id` (`cinema_id`),
  ADD KEY `movie_id` (`movie_id`);

--
-- Chỉ mục cho bảng `userss`
--
ALTER TABLE `userss`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `cinemas`
--
ALTER TABLE `cinemas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `rooms`
--
ALTER TABLE `rooms`
  MODIFY `room_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `seats`
--
ALTER TABLE `seats`
  MODIFY `seat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT cho bảng `showtimes`
--
ALTER TABLE `showtimes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `userss`
--
ALTER TABLE `userss`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
