const mongoose = require("mongoose");
   const ConnectMongo =async()=>{
// console.log(process.env.MONGODB_URI, "fhfjg");

       try {
           await mongoose.connect(process.env.MONGODB_URI, {
             useNewUrlParser: true,
             useUnifiedTopology: true,
           });
           console.log('Connected to MongoDB Atlas');
       } catch (error) {
           console.error('Error connecting to MongoDB Atlas:', error.message);
       }
}
module.exports = ConnectMongo;
        


