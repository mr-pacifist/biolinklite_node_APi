// external imports
const bcrypt = require("bcrypt");
const createError = require("http-errors");

// internal imports
const Prisma = require("../prisma/prismaClient");



// get single by id 
async function getUser(req,res) {
    
}

// update exsisting user info
async function updateUser(req,res) {
    
}

// update user password
async function changePassword(req,res) {

    try {

        const user = await Prisma.user.findUnique({
            where:{
                id: req.params.id,
            }
        });

        if (user && user.id) {
            const isValidPassword = await bcrypt.compare(
              req.body.currentPassword,
              user.password
            );

            if(isValidPassword){

                await Prisma.user.update({
                    where:{
                        id:req.params.id,
                    },
                    data:{
                        password: req.body.newPassword,
                    }

                });

                res.status(200).json({
                    message:"Password updated successfully!",
                })

            }else{

                throw createError("Password not matched");
            }

        }else{
            throw createError("Unable to find user");
        }
   
    } catch (error) {
        res.status(400).json({
            errors: {
                common: {
                  msg: error.message,
                },
              },
        });
        
    }
    
}





module.exports ={

    changePassword,
}