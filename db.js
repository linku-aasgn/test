import mongoose from "mongoose";
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://ashiskusrivastav123:O2dK7KZYiIBNANZh@cluster0.cp2me.mongodb.net/test')
        console.log("MongoDB connected successfully");
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}
export default connectDB;