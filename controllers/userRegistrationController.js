//external imports
const bcrypt = require("bcrypt");


// internal imports
const Prisma = require("../prisma/prismaClient")



async function addUser(req,res,next) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try{
        const newUser = await Prisma.user.create({
            data:{
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                userName: req.body.userName,
                password: hashedPassword            
            }
        });

        res.status(200).json({
            message:"User registation successful!",
            newUser,

        })

    }catch(error){
        res.json(error.message);

    }
    
}

module.exports ={

    addUser,

}