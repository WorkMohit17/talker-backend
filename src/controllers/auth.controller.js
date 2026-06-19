const userModel = require('../models/user.model') ;
const bcrypt = require('bcryptjs') ;
const uploadFile = require('../services/storage.service') ;
const jwt = require('jsonwebtoken') ;




async function registerUser(req,res){

    const {username , email , password , propic} = req.body ;

    const userExist = await userModel.findOne({
        $or:[
            {username:username},
            {email:email}
        ]
    })
        

    if(userExist){
        return res.status(400).json({
            message:"User Already Exist"
        })
    }

    const hashPassword = await bcrypt.hash(password, 10) ;
    const result = await uploadFile(req.file.buffer) ;

    const user = new userModel({
        username,
        email,
        password: hashPassword,
        propic: result.url || result // Extract the URL from the ImageKit response
    })

    await user.save(); // Crucial: Save the user to MongoDB

    const token = jwt.sign({
        id:user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token" , token) ;
    res.status(200).json({
        message:"User Registered Successfully",
        user:[
            {
                id:user._id,
                username:user.username,
                email:user.email,
                propic:user.propic
            }
        ]
    })

}



async function loginUser(req, res){

    const {username , email , password} = req.body ;

    const user = await userModel.findOne({
        $or:[
            {username:username},
            {email:email}
        ]
    })

    if(!user){
        return res.status(400).json({
            message:"User Not Found"
        })
    }

    const isPassword = await bcrypt.compare(password, user.password) ;

    if(!isPassword){
        return res.status(400).json({
            message:"Invalid Password"
        })
    }

    const token = jwt.sign({
        id:user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token" , token) ;

    res.status(200).json({
        message:"User Logged In Successfully",
        user:[
            {
                id:user._id,
                username:user.username,
                email:user.email,
                propic:user.propic
            }
        ]
    })
}



async function logout(req,res){

    res.clearCookie("token") ;

    res.status(200).json({
        message:"User Logged Out Successfully"
    })
}



async function getMe(req, res) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not logged in" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userModel = require('../models/user.model');
        const user = await userModel.findById(decoded.id).select('username email propic');

        if (!user) {
            return res.status(401).json({ message: "Not logged in" });
        }

        res.status(200).json({
            user: { id: user._id, username: user.username, email: user.email, propic: user.propic }
        });

    } catch (error) {
        res.status(401).json({ message: "Not logged in" });
    }
}



module.exports = {registerUser , loginUser , logout, getMe}