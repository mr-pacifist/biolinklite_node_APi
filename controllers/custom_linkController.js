// external imports
const createError = require("http-errors");

// internal imports
const Prisma = require("../prisma/prismaClient");

//get link name and url
async function getCustomLink(req,res) {

    try{
        // find custom link list for this exsisting profile 
        const profileCustomlink = await Prisma.profileCustomLink.findMany({
            where:{
                profileId: req.params.id,
            }
        });

        // find custom link
        if(profileCustomlink){
            const customLinkIds = profileCustomlink.map(link => link.customLinkId);

             const customLinks = await Prisma.customLink.findMany({
                 where: { 
                    id: { 
                        in: customLinkIds, 
                    }, 
                }, 
            });
            // response the custom link list
            if(customLinks){
                res.status(200).json({
                    customLinks
                });
            }else{
                throw createError("Unable to find custom links");
            }
        }else{
            throw createError("Unable to find links");
        }
    }
    catch(error){
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

// add link name and url
async function addCustomLink(req,res) {

    const {profileId,name,url} = req.body;
    try{
        //create the custom link
        const newLink = await Prisma.customLink.create({
            data:{
                name,
                url,
            }
        });
        if(newLink){
            // associate the customlink with the profile
            await Prisma.profileCustomLink.create({
                data:{
                    profileId,
                    customLinkId: newLink.id,
                }
            });

            res.status(201).json({
                message: "Link added successfully!",
                newLink,
            });
        }else{
            throw createError("Unable to add link")
        }    
        
    }
    catch(error){
        res.status(500).json({
            error:{
                common:{
                    msg:error.message
                }
            }
        });
    }finally { 
        await Prisma.$disconnect(); 

    }  
}

// update link name and link url
async function updateCustomLink(req,res) {
    const {name,url} = req.body;
    
    try{
        const updatedLink = await Prisma.customLink.update({
            where: {
              id: req.params.id,
            },
            data:{
                name,
                url,
            }
          });

        if(updatedLink){
            res.status(200).json({
                message: "Updated successfully!",
                updatedLink,
            }); 
            
        }
        else{
            throw createError("There is no link founded");  
        }
    }
    catch(error){
        res.status(404).json({
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

// delete custom link
async function removeCustomLink(req,res) {
    try{
        const deleteCustomLink = await Prisma.customLink.delete({
            where: {
              id:req.params.id,
            },
          });

          if(deleteCustomLink){
            res.status(200).json({
                message:"Link deleted successfully."
            });
          }else{
            throw createError("Unable to delete the link");
          }
         
    }
    catch(error){
            res.status(500).json({
                error:{
                    common:{
                        msg: error.message,
                    }
                }
            });
        
    }finally { 
        await Prisma.$disconnect(); 

    }
}

module.exports ={
    getCustomLink,
    addCustomLink,
    updateCustomLink,
    removeCustomLink,
};