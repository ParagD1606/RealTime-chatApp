import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: ""
    }
},
{
    timestamps: true
}
)

//hash password
userSchema.pre("save", async function (){                      //arrow functions dont have their own this so use normal function
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    
})

//compare password
userSchema.methods.comparePassword = async function (password) {        //arrow functions dont have their own this so use normal function
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema)
export default User