//external imports
const bcrypt = require("bcrypt");
const createError = require("http-errors");



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
                    email: email || '',
                    phone:"",
                    password: hashedPassword            
                }
            });

            // create user address
            const userAddress = await Prisma.address.create({
                data:{
                    userId: user.id,
                    city: '',
                    state: '',
                    postalCode: '',
                    country: '',
                }
            });
            
            if(user && user.id && userAddress){
                // Object for new user to generate token
                const userObject = {
                    userId: user.id,
                    displayName: user.firstName + " " + user.lastName,
                    userName: user.userName, 
                }
                res.status(201).json({
                    message:"User registation successful!",
                    userObject
                  });
            }else{
                throw createError("Registration faild!");
            }
              
        }catch(error){
            res.status(400).json({
                errors: {
                    common: {
                      msg: error.message,
                    },
                  },
            });
    
        }finally { 
            await Prisma.$disconnect(); 
        }      
}

module.exports ={
    addUser,
    
}