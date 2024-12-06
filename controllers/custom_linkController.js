// external imports


// internal imports
const Prisma = require("../prisma/prismaClient");


//get link name and url
async function getCustomLink(req,res) {
    const linkIds = req.body.customLinkIds;
    try{
        const LinkList = await Prisma.customLink.findMany({
            // where: {
            //   id: {
            //     in: linkIds,
            //   },
            // },
          });

          if(LinkList){
            res.status(200).json(LinkList);
          }else{
            res.status(404).json({
                error:{
                    msg:"There is no link founded"
                }
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
            
        
    }
    catch(error){
        if(error){
            res.status(500).json({
                error:{
                    msg:"Internal server errro!",
                }
            });
        }
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

        if(!updatedLink){
            res.status(404).json({
                error:{
                    msg:"There is no link founded",
                }
            });  
        }
        else{
            res.status(200).json({
                message: "Updated successfully!",
                updatedLink,
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
         
        res.status(200).json({
            message:"Link deleted successfully."
        });
          
    }
    catch(error){
        
        if(error){
            res.status(500).json({
                error:{
                    msg:"Could not delete the link!",
                }
            });
        }
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