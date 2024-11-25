

// internal imports

const Prisma = require("../prisma/prismaClient");



// get all social media 

async function getSocialmedia(req,res) {
    
}


// add  social media 

async function addSocialmedia(req,res) {
    const {socialMediaSubdirectory} = req.body;
    try{
        const newSocialMedia = await Prisma.profileSocialMediaLink.create({
            data:{
                socialMediaSubdirectory, 
            }
        });

        if(!newSocialMedia){
            res.status(500).json("Internal server error!"); 
        }
        else{
            res.status(200).json({
                message: "Social media added successfully!",
                newSocialMedia,
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
    

// update social media 

async function updateSocialmedia(req,res) {
    const {socialMediaSubdirectory} = req.body;
    try{
        const updatedSocialMedia = await Prisma.profileSocialMediaLink.update({
            where:{
                id: req.params.id,
            },
            data:{
                socialMediaSubdirectory, 
            }
        });

        if(!updatedSocialMedia){
            res.status(500).json("Internal server error!"); 
        }
        else{
            res.status(200).json({
                message: "Updated successfully!",
                updatedSocialMedia,
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


// remove social media 

async function removeSocialmedia(req,res) {
    try{
        const deleteSocialMedia = await Prisma.profileSocialMediaLink.delete({
            where: {
              id:req.params.id,
            },
          });
         
        res.status(200).json({
            message:"Social media deleted successfully."
        });   
    }
    catch(error){
        
        if(error){
            res.status(500).json({
                error:{
                    msg:"Could not delete the Social media!",
                }
            });
        }
    }
}


module.exports = {
    getSocialmedia,
    addSocialmedia,
    updateSocialmedia,
    removeSocialmedia
};