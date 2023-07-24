const User = require('../modal/userModal')
const bcrypt = require('bcrypt')

module.exports.register = async (req, res, next) => {
    try{
        const {username, password, email} = req.body;
        const usernameCheck = await User.findOne({username: username});
        if(usernameCheck)
            return res.json({msg: "Username already used", status: false});
        const emailCheck = await User.findOne({email: email});
        if(emailCheck)
            return res.json({msg: "Email already used", status: false});
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });
        delete user.password;
        return res.json({status: true, user});
    }
    catch(e)
    {
        console.log(e);
    }
};

module.exports.login = async (req, res, next) => {
    try{
        console.log("Login called");
        const {username, password} = req.body;
        const user = await User.findOne({username: username});
        if(!user)
            return res.json({msg: "Username not found", status: false});
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid)
            return res.json({msg: "Password is not valid", status: false})
        delete user.password;
        return res.json({status: true, user});
    }
    catch(e)
    {
        console.log(e);
    }
};

module.exports.setAvatar = async (req, res, next) => {
    try{
        const userId = req.params.id;
        const img  = req.body.image;
        const userData = await User.findByIdAndUpdate(userId ,{
            isAvatarImageSet: true,
            avatarImage: img
        })
        return res.json({
            isSet: userData.isAvatarImageSet, 
            image: userData.avatarImage
        });
    }
    catch(e)
    {
        next(e);
    }
}

module.exports.getAllUsers = async (req, res, next) => {
    try{
        console.log("Get all users called...");
        const users = await User.find({_id: {$ne: req.params.id}}).select([
            "username",
            "email",
            "avatarImage",
            "_id"
        ]);
        return res.json(users);
    }
    catch(e)
    {
        next(e);
    }
}