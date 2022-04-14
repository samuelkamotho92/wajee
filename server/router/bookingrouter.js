const express = require("express");
const roomsbooked = require("../controller/bookings");
const bookrouter = express.Router();
bookrouter.route('/')
.get(roomsbooked.getRoomsbooked)
.post(roomsbooked.postRoom);

bookrouter.route('/:id')
.get(roomsbooked.getaRoom)
.patch(roomsbooked.updateRoom)
.delete(roomsbooked.deleteRoom)
module.exports = bookrouter;
