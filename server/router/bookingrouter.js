const express = require("express");
const roomsbooked = require("../controller/bookings");
const bookrouter = express.Router();

bookrouter.route('/cheaprooms')
.get(roomsbooked.gettopRooms,roomsbooked.getRoomsbooked)

bookrouter.route('/room-stats')
.get(roomsbooked.getRoomsStat)

bookrouter.route('/')
.get(roomsbooked.getRoomsbooked)
.post(roomsbooked.postRoom);

bookrouter.route('/:roomid')
.get(roomsbooked.getaRoom)
.patch(roomsbooked.updateRoom)
.delete(roomsbooked.deleteRoom)
module.exports = bookrouter;

