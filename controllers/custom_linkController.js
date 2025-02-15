// external imports
const createError = require("http-errors");
const { decode } = require('html-entities');

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
        if(profileCustomlink && profileCustomlink.length > 0){
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
                // Merge the arrays 
                const customLinkList = customLinks.map(link => { 
                const profileCustomLink = profileCustomlink.find(cl => cl.customLinkId === link.id); 
                return { 
                    id: link.id, 
                    profileCustomlinkId: profileCustomLink.id, 
                    name: link.name, 
                    url: link.url 
                }; 
            }); 
            res.status(200).json({ customLinkList, });
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

    // Decode HTML entities in the URL
    const decodedHtmlEntities = decode(url);
          
    // Decode the URL from the request body
    const decodedUrl = decodeURIComponent(decodedHtmlEntities);
    try{
        //find profile
        const profile = await Prisma.profile.findUnique({
            where: {
              id: profileId,
            },
          });
        if(profile && profile.id == profileId){
             //create the custom link
        const newLink = await Prisma.customLink.create({
            data:{
                name,
                url:decodedUrl,
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
        }else{
            throw createError("Profile not found");
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
    const {profileId,name,url} = req.body;
    // Decode HTML entities in the URL
    const decodedHtmlEntities = decode(url);
          
    // Decode the URL from the request body
    const decodedUrl = decodeURIComponent(decodedHtmlEntities);
    
    try{
        //find profile
        const profile = await Prisma.profile.findUnique({
            where: {
              id: profileId,
            },
          });
        if(profile && profile.id == profileId){
            
        // update custom link
        const updatedLink = await Prisma.customLink.update({
            where: {
              id: req.params.id,
            },
            data:{
                name,
                url:decodedUrl,
            }
          });

        if(updatedLink && updatedLink.id == req.params.id){
            res.status(200).json({
                message: "Updated successfully!",
                updatedLink,
            }); 
            
        }
        else{
            throw createError("There is no link founded");  
        }
            
        }else{
            throw createError("Profile not found");
        }
    }catch(error){
        if (error.code === 'P2025') { // Prisma record not found error code
            res.status(400).json({
                error:{
                    common:{
                        msg:"Link not found",
                    }
                }
            });
        } else{
            res.status(404).json({
                error:{
                    common:{
                        msg:error.message,
                    }
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
        
          // find header custom link
          const headerCustomLink = await Prisma.headerCustomlink.findUnique({
            where: {
              customLinkId: req.params.id,
            },
          });
          // delete header
        if(headerCustomLink){
            // delete header custom link
            const deletedHeaderCustomLink = await Prisma.headerCustomlink.delete({
                where: {
                  customLinkId: req.params.id,
                },
              });
              
    
            // delete profile header
            const deletedProfileHeader = await Prisma.profileHeader.deleteMany({
                where: {
                  headerId: deletedHeaderCustomLink.headerId,
                },
              });
    
            // delete header
            const deletedHeader = await Prisma.header.delete({
                where: {
                  id: deletedHeaderCustomLink.headerId,
                },
              });
        }

          //delete profile custom link
          const deletedProfileCustomLink = await Prisma.profileCustomLink.delete({
            where: {
              id: req.body.profileCustomlinkId,
            },
          });

        // delete custom link
        const deletedCustomLink = await Prisma.customLink.delete({
            where: {
              id:req.params.id,
            },
          });

          if( deletedProfileCustomLink && deletedCustomLink){
            res.status(200).json({
                message:"Link deleted successfully."
            });
          }else{
            throw createError("Unable to delete the link");
          } 
    }
    catch(error){
        let errorMessage = "An unknown error occurred.";

        if (error.code === 'P2025') { // Prisma record not found error code
            errorMessage = "Link  not found.";
        } else if (error.message === "Unable to delete the link") {
            errorMessage = "Unable to delete the link";
        } else {
            errorMessage = error.message;
        }
        if(errorMessage == "Link  not found."){
            res.status(404).json({
                error: {
                    common: {
                        msg: errorMessage
                    }
                }
            });
        }else{
            res.status(500).json({
                error: {
                    common: {
                        msg: errorMessage
                    }
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