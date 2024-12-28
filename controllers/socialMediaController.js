const createError = require("http-errors");

// internal imports
const Prisma = require("../prisma/prismaClient");

// get all social media 
async function getSocialmediaList(req,res) {
    try {
        const socialMedias = await Prisma.socialMedia.findMany();
        // get socialmedia
        if(socialMedias && socialMedias.length > 0){
            socialMedias.forEach(media => {
                media.icon = `${process.env.SITE_URL}${media.icon}`; 
            });
            // response all social media and icon
            res.status(200).json(socialMedias);     
               
        }else{
            throw createError("No social media found");
        }
        
    } catch (error) {
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
// get all profile social media 
async function getProfileSocialmedia(req,res) {
    try {
        // check if profile exists
        const profile = await Prisma.profile.findUnique({
            where: {
              id: req.params.id,
            },
        })
        if(!profile){
            throw createError("Profile not found");
        }
        // find social medias for the exsisting profile
        const profileSocialmedia = await Prisma.profileSocialMediaLink.findMany({
            where:{
                profileId: req.params.id,
            }
        });

        // get socialmedia
        if(profileSocialmedia && profileSocialmedia.length > 0){
            const socialMediaIds = profileSocialmedia.map(socialMedia => socialMedia.socialMediaId);
            const socialMedias = await Prisma.socialMedia.findMany({
                where:{
                    id:{
                        in: socialMediaIds,
                    }
                }
            });
            // response all social media and icon
        
            const socialMediaLinks = profileSocialmedia.map(profileSocialmedia => { 
            const socialMedia = socialMedias.find(s => s.id === profileSocialmedia.socialMediaId); 
            if (socialMedia) { 
                return { 
                    id: profileSocialmedia.id, 
                    profileId: profileSocialmedia.profileId, 
                    name: socialMedia.name, 
                    socialMediaId: profileSocialmedia.socialMediaId, 
                    url: socialMedia.url + profileSocialmedia.socialMediaSubdirectory,
                    icon: process.env.SITE_URL + socialMedia.icon }; 
                } return null; }).filter(Boolean); 
            res.status(200).json({socialMediaLinks});        
        }else{
            throw createError("Profile dosen't contain any socialmedia");
        }
        
    } catch (error) {
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

// add  social media 

async function addSocialmedia(req,res) {
    let {profileId, socialMediaId} = req.body;
    const parsedSocialMediaId = parseInt(socialMediaId);
    try{
        const newSocialMedia = await Prisma.profileSocialMediaLink.create({
            data:{
                profileId,
                socialMediaId:parsedSocialMediaId,
                socialMediaSubdirectory: req.dataShare, 
            }
        });

        if(!newSocialMedia){
            throw createError("Unable to add social media");
        }
        else{
            res.status(201).json({
                message: "Social media added successfully!",
                newSocialMedia,
            });
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

// update social media 

async function updateSocialmedia(req,res) {
    
    try{
        const updatedSocialMedia = await Prisma.profileSocialMediaLink.update({
            where:{
                id: req.params.id,
            },
            data:{
                socialMediaSubdirectory:req.dataShare, 
            }
        });

        if(updateSocialmedia){
            res.status(200).json({
                message: "Updated successfully!",
                updatedSocialMedia,
            });
        }else{
            throw createError("Unable to update social media");
        }      
    }
    catch(error){
        if (error.code === 'P2025') { // Prisma record not found error code
            res.status(404).json({
                error:{
                    common:{
                        msg:"Social media not found",
                    }
                }
            });
        } else{
            res.status(400).json({
                error:{
                    common:{
                        msg:error.message,
                    }
                }
            });
        };
    }finally { 
        await Prisma.$disconnect(); 
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
          if (deleteSocialMedia && deleteSocialMedia.id){ 
            res.status(200).json({
                message:"Social media deleted successfully."
            }); 
          }else{
            throw createError("social media not found");
          }         
    }
    catch(error){
        if (error.code === 'P2025') { // Prisma record not found error code
            res.status(404).json({
                error:{
                    common:{
                        msg:"Social media not found",
                    }
                }
            });
        } else{
            res.status(400).json({
                error:{
                    common:{
                        msg:error.message,
                    }
                }
            });
        };
       
    }finally { 
        await Prisma.$disconnect(); 
    }
}

module.exports = {
    getSocialmediaList,
    getProfileSocialmedia,
    addSocialmedia,
    updateSocialmedia,
    removeSocialmedia
};