const { default: mongoose } = require("mongoose");
const { populate } = require("../models/car");
const {User} = require("../models/user");
const {Car} = require("../models/car");

exports.getAllCars = async (req, res) => {
    let cars;
    try{
        cars = await Car.find().populate("user");

    }catch(err){
        return console.log(err);
    }

    if(!cars){
        return res.status(500).json({message: "Unexpected error occured"});
    }
    return res.status(200).json({cars});
}

exports.addCars = async (req, res) => {
    const {image, desc,title, tags, user } = req.body;
    if(!desc && 
        desc?.trim() === "" &&
        !title && 
        title?.trim() === "" &&
        tags.trim() ==="" &&
        image.trim() === "" &&
        (image.length>=10) &&
        !user &&
        user.trim() === ""){
            return res.status(422).json({message : "Invalid data"});
        }
        if(image.length>10){
            return res.status(422).json({message:"Images more than 10"});
        }
        //user id
        let existingUser;
        try{
            existingUser = await User.findById(user);
        }catch(err){
            return console.log(err);
        }

        if(!existingUser){
            return res.status(404).json({message: "user not found"});
        }
        //new post
        let post;

        try {
            post = new Car({image, desc,title, tags, user});

            const session = await mongoose.startSession();

            session.startTransaction();
            await post.save({session});
            existingUser.cars.push(post);            
            await existingUser.save({session});

            await session.commitTransaction();

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unexpected error occured"});
        }
        return res.status(201).json({post});
}

exports.getCarById = async (req, res) => {
    const id = req.params.id;

    let post;
    try {
        post = await Car.findById(id);
    } catch (err) {
        return console.log(err);
    }

    if(!post){
        return res.status(404).json({message: "no post found"});
    }
    return res.status(200).json({post});
}

exports.getCarByTitle = async (req, res) => {
    const title = req.params.tl;
    try {
        post = await Car.find({"title": { "$regex": title, "$options": "i" }});
    } catch (err) {
        return console.log(err);
    }
    
    if(!post){
        return res.status(404).json({message: "no car found"});
    }
    console.log(post);
    return res.status(200).json({post});
}

exports.getCarByDesc = async (req, res) => {
    const desc = req.params.desc;
    try {
        post = await Car.find({"desc": { "$regex": desc, "$options": "i" }});
    } catch (err) {
        return console.log(err);
    }
    
    if(!post){
        return res.status(404).json({message: "no car found"});
    }
    return res.status(200).json({post});
}
exports.getCarByTags = async (req, res) => {
    const tags = req.params.tags;
    try {
        post = await Car.find({"tags": {$in: tags}})
    } catch (err) {
        return console.log(err);
    }
    
    if(!post){
        return res.status(404).json({message: "no car found"});
    }

    return res.status(200).json({post});
}
exports.updateCar = async (req, res) =>{
    const id = req.params.id;
    const {image, desc, title, tags, user} = req.body;
    if(!desc && 
        desc?.trim() === "" &&
        !title && 
        title?.trim() === "" &&
        tags.trim() ==="" &&
        image.trim() === "" &&
        (image.length>=10) &&
        !user &&
        user.trim() === ""){
            return res.status(422).json({message : "Invalid data"});
        }
        if(image.length>10){
            return res.status(422).json({message:"Images more than 10"});
        }

        let post;
        try {
            post = await Car.findByIdAndUpdate(id,{image, desc,title, tags});

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully"});
}

exports.deleteCar = async (req, res) => {
    const id = req.params.id;
    let post;
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        post = await Car.findById(id).populate("user");
        post.user.cars.pull(post);
        await post.user.save({session});
        post = await Car.findByIdAndRemove(id);
        session.commitTransaction();
    } catch (err) {
        return console.log(err);
    }

    if(!post){
        return res.status(500).json({message: "unable to delete"});
    }
    return res.status(200).json({message: "deleted successfully"});
}