const roomsbooked = require("../model/booking");

const getRoomsbooked = async (req,resp)=>{
try{
    const booked = await roomsbooked.find();
    resp.status(200).json({
        status:"success",
        message:booked
    });
}catch(err){
resp.status(400).json({
    status:"fail",
    message:err.message
})
}
}

const postRoom = async (req,resp)=>{
    try{
const {name,rating,price} = req.body;
const booked = await roomsbooked.create(req.body);
resp.status(201).json({
    status:"success",
    message:booked
}) 
console.log(req.body);
}catch(err){
        resp.status(404).json({
            status:"fail",
            message:err.message
        }) 
        console.log(err.message);
    }
}

const getaRoom = async (req,resp)=>{
    try{
    const id = req.params.id;
    console.log(id);
    const oneroom = await roomsbooked.findById(id);
    console.log(oneroom)
    resp.status(200).json({
        status:"success",
        message:oneroom
    })
    }catch(err){
console.log("room cannot be found")
  }
    }
  

  const updateRoom = async (req,resp)=>{
    try{
const id = req.params.id;
const updated = await roomsbooked.findByIdAndUpdate(id,req.body,{
    new:true,
    runValidators:true
});
resp.status(200).json({
    status:"successfully updated",
    message:updated
})
console.log(updated)
    }catch(err){
      resp.status(404).json({
        status:"error",
        err
             })
    }
  }
  
  const deleteRoom = async (req,resp)=>{
      try{
        const id = req.params.id;
        await roomsbooked.findByIdAndDelete(id)
        resp.status(200).json({
        status:"deleted succfully",
        data:null
        })
      }catch(err){
        resp.status(404).json({
            status:" not deleted try again",
           err:err.message
            })
      }

}

module.exports = {
    getRoomsbooked,
    postRoom,
    getaRoom,
    updateRoom,
    deleteRoom
};