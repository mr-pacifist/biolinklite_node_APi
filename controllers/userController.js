// external imports
const bcrypt = require("bcrypt");
const createError = require("http-errors");

// internal imports
const Prisma = require("../prisma/prismaClient");



// get single by id 
async function getUser(req,res) {
    try {
        // find user
        const user = await Prisma.user.findUnique({
            where:{
                id:req.params.id,
            }
        });

        // find address information accourding to user id
        const userAddress = await Prisma.address.findUnique({
            where:{
                userId: req.params.id,
            }
        });
        // find all counry list 
        const countryList = await Prisma.country.findMany();
        
        if(user && user.id && userAddress.id && countryList){

            const { password,userName, createdAt, updatedAt, ...filteredUser } = user;

            // send response
            res.status(200).json({
                message:"Request successfull!",
                user:filteredUser,
                address:userAddress,
                countryList,
            });

        }else{
            throw createError("Unable to complete request");
        }
       
    } catch (error) {
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

// update exsisting user info
async function updateUser(req,res) {
    try {
        // data that came with request body
        const {
            firstName,
            lastName,
            phone,
            email,
            city,
            state,
            postalCode,
            country,
        } = req.body;

        // check user exsistance
        const user = await Prisma.user.findUnique({
            where:{
                id: req.params.id,
            }
        });

        if (user && user.id === req.params.id) {

            // update user data
            const updateUser = await Prisma.user.update({
                where:{
                    id: req.params.id,
                },
                data:{
                    firstName,
                    lastName,
                    phone,
                    email,
                }
            });

            // check user address exist or not

            const updateUserAddress = await Prisma.address.update({
                where:{
                    userId:req.params.id,
                },
                data:{
                    city,
                    state,
                    postalCode,
                    country,
                }
            });

            if(updateUser && updateUserAddress){
                const { password, createdAt, updatedAt, ...filteredUser } = updateUser;
                res.status(200).json({
                    message:"Successfully updated",
                    updatedUser:filteredUser,
                    address: updateUserAddress,
                });

            }else{

                throw createError("Unable to update user");
            }

        }else{
            throw createError("User not founded");
        }
   
    } catch (error) {
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
                const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

                await Prisma.user.update({
                    where:{
                        id:req.params.id,
                    },
                    data:{
                        password: hashedPassword,
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
        
    }finally { 
        await Prisma.$disconnect(); 
    } 
    
}

module.exports ={
    getUser,
    updateUser,
    changePassword,
}