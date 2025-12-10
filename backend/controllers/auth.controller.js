import User from "../models/User.js"
import jwt from "jsonwebtoken"

export const signup = async (req, res)=>{
    try{
        console.log("BODY:", req.body);
        const { name, email, password, avatar } = req.body

        if(!name || !email || !password){
            return res.status(400).json({message: "All fields required"})
        }

        const exist = await User.findOne({email})

        if(exist){
            return res.status(400).json({message: "user already exist"})
        }

        const user = await User.create({name, email, password, avatar})

        return res.status(201).json(
            {
                message: "User created successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar
                }
            }
        )
    }
    catch (err) {
        console.log(err)
        res.status(500).json(
            {message: "Something went wrong during signup"});
    }
}

export const login = async (req, res)=>{
    try{
        const { email, password } = req.body

        if( !email || !password){
            return res.status(400).json({message: "All fields required"})
        }

        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message: "user not found"})
        }

        const isPasswordCorrect = await user.comparePassword(password)

        if(!isPasswordCorrect){
            return res.status(400).json({message: "email or password incorrect"})
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        )

        return res.status(200).json(
            {
                message: "User found successfully",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar
                }
            }
        )
    }
    catch (err) {
        res.status(500).json(
            {message: "Something went wrong during login"});
    }
}

export const logout = async (req, res)=>{
    try {
            return res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (error) {
            return res.status(500).json({
            message: "Something went wrong"
        });
    }
}