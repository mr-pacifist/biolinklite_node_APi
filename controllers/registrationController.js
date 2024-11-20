//external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// internal imports
const Prisma = require("../prisma/prismaClient")


async function addUser(req,res,next) {
    
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const { firstName, lastName, userName, email } = req.body;
        try{
            const user = await Prisma.user.create({
                data:{
                    firstName,
                    lastName,
                    userName,
                    email: email || null,
                    password: hashedPassword            
                }
            });
            
            // Object for new user to generate token
            const userObject = {
                userId: user.id,
                displayName: user.firstName + " " + user.lastName,
                userName: user.userName, 
            }
             req.dataShare = userObject;

            next();  
              
        }catch(error){
            res.status(500).json({
                error:{
                    msg:"Internal server errro!!",
                }
            });
    
        }
        
}

module.exports ={
    addUser,

}