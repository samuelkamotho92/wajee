const express = require("express");
const roomsbooked = require("../controller/bookings");
const authcontroler = require("../controller/authcontroler")
const bookrouter = express.Router();

bookrouter.route('/cheaprooms')
.get(roomsbooked.gettopRooms,roomsbooked.getRoomsbooked)

bookrouter.route('/room-stats')
.get(roomsbooked.getRoomsStat)

bookrouter.route('/')
.get(authcontroler.protectRoutes,roomsbooked.getRoomsbooked)
.post(roomsbooked.postRoom);

bookrouter.route('/:roomid')
.get(roomsbooked.getaRoom)
.patch(roomsbooked.updateRoom)
.delete(
    authcontroler.protectRoutes,
    authcontroler.restrict('admin'),
     roomsbooked.deleteRoom)



module.exports = bookrouter;

