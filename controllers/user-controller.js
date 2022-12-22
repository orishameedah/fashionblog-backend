import User from "../model/User.js";
import bcrypt from "bcryptjs"

export const getAllUser = async(req, res, next) => { //the next is a function which we allow to have access the next middleware
    let users;
    try {
        users = await User.find(); //it will fetch all the users array 
        console.log("All Users:", users)
    } catch (error) {
        console.log(error)
    }
    if(!users) {
        return res.status(404).json({ message: "No Users Found" });
    }
    return res.status(200).json({ users }) //if it is successful it should return the the individual object of the users
}

export const signup = async(req, res, next) =>{
    const { name, email, password } = req.body; //which means that {name, email, password} is also req.body.name and others
    let existingUser;
    try {
        existingUser = await User.findOne({ email }) //which means each user email must be unique one user per email
    } catch (error) {
      return console.log(error);
    }
    if(existingUser){  //if existingUser is avaliable 
        return res.status(400).json({ message: "User Already Exists! Login Instead" }) //just to login if avaliable or already a user
    }
    const hashedPassword = bcrypt.hashSync(password);  //synchronously generate an hashed string instead of the password value for protection 
    //against bad hackers and also as a means of encoding our password
    const user = new User({ //if the user is not avaliable then the user need to create a new user to signup
        name,
        email,
        password : hashedPassword,  //e.g "password": "$2a$10$1zTn5FRkd2fHHVlaDehdQ.uLDlLc9sUgwNPzixklKdyORZRfrAaRe",
        blogs: [],
    });  

    try {
        user.save(); //this will save the user data object in the mongodb
        // console.log("SignIn:", user)
    } catch (error) {
      return console.log(error) //it also print the error on the postman screen
    }
    return res.status(201).json({user})
}

export const login = async(req, res, next) => { //here we are only in need of the email and password of the already signup user
    const { email, password } = req.body;   
    let existingUser;
    try {
        existingUser = await User.findOne({ email }); //the existinguser email is truly equall to the user email
    } catch (error) {
       return console.log(error);
    }
    if(!existingUser){  
        return res.status(404).json({ message: "couldn't find User by this email" }); 
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password) //this will compare the the password of the user and the existinguser whether there are the same before login the password
    if(!isPasswordCorrect){
        return res.status(400).json({message: "Password Incorrect"}) //if password is not compare the user existinging password it will print it
    }
    return res.status(200).json({ message: "Login Successful", user: existingUser }) //if password is truly the same as the user existinging password it will print this
}
