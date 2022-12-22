import Blog from "../model/Blog.js";
import mongoose from "mongoose"
import User from "../model/User.js"

export const getAllBlogs = async (req, res, next)=> {
    let blogs;
    try {
        blogs = await Blog.find().populate('user') //find all of the blogs of the user
    } catch (error) {
        return console.log(error)
    }
    if (!blogs) {
        return res.status(404).json({message: "No Blogs Found"}) //if no blogs exist it will print this error
    }
    return res.status(200).json({blogs}) //if blogs it will return all the blogs
}

export const addBlog = async (req, res, next) => {
    const {title, description, image, user} = req.body;

    let existingUser;
    try {
        existingUser = await User.findById(user);  //fetching the user by id
    } catch (error) {
        return console.log(error)
    }
    if (!existingUser) {
        return res.status(400).json({message: "Unable to find user by this id"})
    }
    const blog = new Blog ({
        title,
        description,
        image,
        user,
    });
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({ session }); //saving the blog data to the mongodb
        existingUser.blogs.push(blog)
        await existingUser.save({ session })
        await session.commitTransaction();
    } catch (error) {
        // return console.log(error)
        return res.status(500).json({message: error})
    }
    return res.status(200).json({blog})
}

export const updateBlog = async(req, res, next)=>{
    const { title, description, image } = req.body;
    const blogId = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndUpdate(blogId, {   //fetching by id and updating the values
            title,  
            description,
            image
        })     
    } catch (error) {
        return console.log(error)
    }
    if(!blog) {
        return res.status(500).json({message: "Unable to update the blog"})
    }
    return res.status(200).json({blog})
}

export const getById = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try{
        blog = await Blog.findById(id);
    } catch (error) {
        return console.log(error);
    }
    if (!blog) {
        return res.status(404).json({message: "No Blog Found"})
    }
    return res.status(200).json({blog})
};

export const deleteBlog = async(req, res, next) => {
    const id = req.params.id;

    let blog;
    try{
        blog = await Blog.findByIdAndRemove(id).populate('user');  //populate means it would be spread to other documents only when itis specify
        await blog.user.blogs.pull(blog);   //removing the blogs array from the user blog 
        await blog.user.save()      //blog user.save() is use to save in the mongodb
    } catch (error) {
        return console.log(error);
    }
    if (!blog) {
        return res.status(400).json({message: "Unable to Delete"})
    }
    return res.status(200).json({message: "Successfully Delete"})
}

export const getByUserId = async (req, res, next) => {
    const userId = req.params.id;
    let userBlogs;
    try {
        userBlogs = await User.findById(userId).populate('blogs');
    } catch (error) {
        return console.log(error);
    }
    if(!userBlogs) {
        return res.status(404).json({message: "No Blog Found"})
    }
    return res.status(200).json({user :userBlogs})
}