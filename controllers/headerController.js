
// internal imports
const Prisma = require("../prisma/prismaClient")

async function getHeaderTitle(req,res) {
    
}

// Add Header title
async function addHeaderTitle(req,res) {

    try{
        const newHeader = await Prisma.header.create({
            data:{
                title:req.body.title,
            }
        });

        if(!newHeader){
            res.status(500).json("Internal server error!");  
        }
        else{
            res.status(201).json({
                message: "Header added successfully!",
                newHeader,
            });
        }

    }
    catch(error){
        console.log(error.message);
        
        if(error){
            res.status(500).json({
                error:{
                    msg:"Internal server errro!",
                }
            });
        }
    }  
}
    


async function updateHeaderTitle(req,res) {
    try{
        const updatedHeader = await Prisma.header.update({
            where:{
                id: req.params.id,
            },
            data:{
                title: req.body.title,
            }
        });

        if(!updatedHeader){
            res.status(500).json("Internal server error!");  
        }
        else{
            res.status(200).json({
                message: "Header updated successfully!",
                updatedHeader,
            });
        }

    }
    catch(error){
        if(error){
            res.status(500).json({
                error:{
                    msg:"Internal server errro!",
                }
            });
        }
    } 
    
}

async function deleteHeaderTitle(req,res) {
    try{
        const deleteHeader = await Prisma.header.delete({
            where: {
              id:req.params.id,
            },
          });
         
        res.status(200).json({
            message:"Header successfully removed!"
        });    
    }
    catch(error){
        if(error){
            res.status(404).json({
                error:{
                    msg:"Header not founded!",
                }
            });
        }
    }
}
    

module.exports={
    getHeaderTitle,
    addHeaderTitle,
    updateHeaderTitle,
    deleteHeaderTitle

}