// external imports
const createError = require("http-errors");

// internal imports
const Prisma = require("../prisma/prismaClient")

async function getHeaderTitle(req,res) {
    try {
        // find header list for the exsisting profile
        const profile_headers = await Prisma.profileHeader.findMany({
            where:{
                profileId: req.params.id,
            }
        });

        // find headers
        if(profile_headers){
            const headerIds = profile_headers.map(heading => heading.headerId);
            const headers = await Prisma.header.findMany({
                where:{
                    id:{
                        in: headerIds,
                    }
                }
            });
            // response the custom link list
            if(headers){
                res.status(200).json({
                    headers
                });
            }else{
                throw createError("Unable to find headers");
            }
                        
        }else{
            throw createError("Unable to find links");
        }
        
    } catch (error) {
        res.status(500).json({
            error:{
                common:{
                    msg:error.message,
                }
            }
        });
        
    }finally { 
        await Prisma.$disconnect(); 
    }    
}

// Add Header title
async function addHeaderTitle(req,res) {

    try{
        const {profileId, title} = req.body;
        // create new Header
        const newHeader = await Prisma.header.create({
            data:{
                title,
            }
        });

        if(newHeader){
             // Associate the header with the profile
        await Prisma.profileHeader.create({
            data:{
                profileId,
                headerId:newHeader.id,
            }
        });

        res.status(201).json({
            message: "Header added successfully!",
            newHeader,
        });
        }else{
            throw createError("Unable to add header")
        }

    }
    catch(error){
        res.status(400).json({
            error:{
                common:{
                    msg:error.message,
                }
            }
        });
            
    } 
    finally { 
        await Prisma.$disconnect(); 

    } 
}

// update header
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

        if(updatedHeader){
            res.status(200).json({
                message: "Header updated successfully!",
                updatedHeader,
            });
             
        }
        else{
            throw createError("Unable to update header");
        }

    }
    catch(error){
        res.status(500).json({
            error:{
                msg:error.message,
            }
        });
        
    }finally { 
        await Prisma.$disconnect(); 
    } 
}

async function deleteHeaderTitle(req,res) {
    try{
        const deleteHeader = await Prisma.header.delete({
            where: {
              id:req.params.id,
            },
          });
          
          if(deleteHeader){
            res.status(200).json({
                message:"Header successfully removed!"
            }); 
          }else{
            throw createError("Header not deleted");
          }  
    }
    catch(error){
        res.status(400).json({
            error:{
                common:{
                    msg:error.message,
                }  
            }
        });
    }finally { 
        await Prisma.$disconnect(); 

    }
}

module.exports={
    getHeaderTitle,
    addHeaderTitle,
    updateHeaderTitle,
    deleteHeaderTitle

}