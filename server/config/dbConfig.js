const mongoose =require("mongoose");

exports.connectedDatabase = async()=>{
    try {
        await mongoose.connect(process.env.mongo_url)
        console.log(`Database Connection Established!`)
    } catch (error) {
        console.log(error.message)
    }
}