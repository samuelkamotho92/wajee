const mongoose = require("mongoose");
const dotenv = require("dotenv");
//create a path
dotenv.config({ path: './.env' });
const app = require("./app.js");
const port = 5000;
const dburl = process.env.DBURL;
mongoose.connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(process.env.PORT || 5000,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
}).catch(err => console.log(err));

process.on('unhandledRejection',(err)=>{
console.log(err.name,err.message)
server.close(()=>{
    console.log('SERVER CLOSING')
    process.exit(1)
})
});

process.on('uncaughtException',(err)=>{
    console.log(err.name,err.message)
    server.close(()=>{
        console.log('SERVER CLOSING')
        process.exit(1)
    })
    });