import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log('Lien ket CSDL thanh cong!');
    } catch (error) {
        console.log('Loi khi Lien ket CSDL!:', error);
        process.exit(1);
    }
};