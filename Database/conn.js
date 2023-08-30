const mongoose = require("mongoose");
const MONGODB_URI ="mongodb+srv://lalitkumar6458:LalitKumar6458@cluster0.ex4vobv.mongodb.net/RMDB?retryWrites=true&w=majority";
   const ConnectMongo =async()=>{
       try {
           await mongoose.connect(MONGODB_URI, {
             useNewUrlParser: true,
             useUnifiedTopology: true,
           });
           console.log('Connected to MongoDB Atlas');
       } catch (error) {
           console.error('Error connecting to MongoDB Atlas:', error.message);
       }
}
module.exports = ConnectMongo;
        


