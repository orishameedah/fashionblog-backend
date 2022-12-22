import express from "express";
import { addBlog, deleteBlog, getAllBlogs, getById, getByUserId, updateBlog } from "../controllers/blog-controller.js";

const blogRouter = express.Router();

blogRouter.get("/", getAllBlogs); //get means to fetch
blogRouter.post("/add", addBlog);  //post means to insert
blogRouter.put("/update/:id", updateBlog);  //:id means a string query
blogRouter.get("/:id", getById); 
blogRouter.delete("/:id", deleteBlog);  //delete means delete
blogRouter.get("/user/:id", getByUserId)

export default blogRouter;