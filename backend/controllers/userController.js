import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";

const signupUser = async(req, res)=>{
    try{
        const {name, email, password, username} = req.body;

        if(!name || !email || !password || !username){
            return res.status(400).json({error: "Please fill all the required feilds!"})
        }

        const user = await User.findOne({$or :[{email}, {username}]});

        if(user){
            return res.status(400).json({error:"User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({name, email, username, password:hashedPassword});
        await newUser.save();

        if(newUser) {

            generateTokenAndSetCookie(newUser._id, res);
            return res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                message:"User created successfully"
            })
        }
        else{
            res.status(400).json({ error: "Invalid user data"});
        }
    }
    catch(error){
        res.status(500).json({ error: error.message });
        console.log("Error in signupUser", error.message);
    }
}

const loginUser = async(req, res) =>{
    try {
        const{email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({ error:"Please fill all the required feilds"});
        }
        const user = await User.findOne({email});
            const isPasswordCorrect = await bcrypt.compare(password, user?.password || " ");
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid email or password"})
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username
        })

    } catch (error) {
        res.status(500).json({error:error.message})
        console.log("Error in loginUser", error.message);
    }
}

const logoutUser = async(req, res)=>{
    try {
        res.cookie("jwt", "", {maxAge:1});
        res.status(200).json({message: "User logged out successfully"});
    } catch (error) {
        res.status(500).json({error:error.message})
        console.log("Error in logoutUser", error.message);
    }
}

const followUnFollowUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id.toString() === req.user._id.toString()) {
            return res.status(400).json({ error: "You cannot follow or unfollow yourself" });
        }
        
        
        if(!userToModify || !currentUser){
            return res.status(400).json({error:"User not found"})
        }
        
        const isFollowing = currentUser.following.includes(id);

        if(isFollowing){
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id}})
            await User.findByIdAndUpdate(req.user._id, {$pull: {following: id}})
            res.status(200).json({message:"User unfollowed successfully"})
        }
        else{
            //follow user
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id}})
            await User.findByIdAndUpdate(req.user._id, {$push: {following: id}})
            res.status(200).json({message:"User followed successfully"})

        }

    } catch (error) {
        res.status(500).json({error:error.message})
        console.log("Error in followUnFollowUser", error.message);
    }
}

    const updateUser = async(req, res)=>{
        try {
            const {name, email, password, username, profilePic, bio} = req.body;
            const userId = req.user._id;
            let user = await User.findById(userId);
            if(!user){
                return res.status(400).json({error:"User not found"});
            }        
            if(req.params.id !== userId.toString()){
                return res.status(400).json({error:"Unauthorized access"});
            }
            if(password){
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                user.password = hashedPassword;
            }
            
            user.name = name || user.name;
            user.email = email || user.email;
            user.username = username || user.username;
            user.profilePic = profilePic || user.profilePic;
            user.bio = bio || user.bio;

            user = await user.save();

            res.status(200).json({message:"Profile updated successfully", user})


        } catch (error) {
            res.status(500).json({error:error.message})
            console.log("Error in updateUser", error.message); 
        }
    }

    const getUserProfile = async(req, res)=>{
        const {username}= req.params
        try {
            const user = await User.findOne({username}).select("-password").select("-updatedAt");
            if(!user){
                return res.status(404).json({error:"User not found"});
                }
                res.status(200).json({user})
        } catch (error) {
            res.status(500).json({error:error.message})
            console.log("Error in updateUser", error.message);   
        }
    }


export {
    signupUser,
    loginUser,
    logoutUser,
    followUnFollowUser,
    updateUser,
    getUserProfile
}