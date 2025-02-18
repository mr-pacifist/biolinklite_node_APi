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
        if(profile_headers && profile_headers.length > 0){
            const headerIds = profile_headers.map(heading => heading.headerId);
            const headers = await Prisma.header.findMany({
                where:{
                    id:{
                        in: headerIds,
                    }
                }
            });
            // response the custom link list
            if(headers && headers.length > 0){
                // Merge the arrays 
                const headerList = headers.map(header => {
                    const profileHeader = profile_headers.find(ph => ph.headerId === header.id); 
                    return { 
                        id: header.id, 
                        profileHeaderId: profileHeader.id, 
                        title: header.title,
                    }
                })
                // send response
                res.status(200).json({headerList});
            }else{
                throw createError("Unable to find headers");
            }
                        
        }else{
            throw createError("No headers found");
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
        //find profile
        const profile = await Prisma.profile.findUnique({
            where: {
              id: req.body.profileId,
            },
          });
        
        if(profile && profile.id == req.body.profileId){
           
        //find the last added custom link
        const lastEntry = await Prisma.profileCustomLink.findFirst({
            where: {
              profileId: req.body.profileId,
            },
            orderBy: {
              id: 'desc',
            },
          });
          

          const findCustomlinkId = await Prisma.headerCustomlink.findUnique({
            where: {
              customLinkId: lastEntry.customLinkId,
            }
          });

          if(!findCustomlinkId) {
            const {profileId, title} = req.body;
            // create new Header
            const newHeader = await Prisma.header.create({
                data:{
                    title,
                }
            });
        
              // Associate the header with the profile
              await Prisma.profileHeader.create({
                data:{
                    profileId,
                    headerId:newHeader.id,
                }
            });
            //link the header with the last added custom link
            await Prisma.headerCustomlink.create({
                data: {
                    headerId: newHeader.id,
                    customLinkId: lastEntry.customLinkId,
                }
            });
    
            res.status(201).json({
                message: "Header added successfully!",
                newHeader,
            });      
          }else{
            throw createError("Add new custom link first");
          }
        
        }else{
            throw createError("Unable to add header")
        }

    }
    catch(error){
        res.status(401).json({
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

        if(updatedHeader && updatedHeader.id){
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
        if (error.code === 'P2025') { // Prisma record not found error code
            res.status(400).json({
                error:{
                    common:{
                        msg:"Header not found",
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
        };
        
    }finally { 
        await Prisma.$disconnect(); 
    } 
}

async function deleteHeaderTitle(req,res) {
    try{
        // find header list for the exsisting profile
        const profile_header = await Prisma.profileHeader.findUnique({
            where: {
              id: req.body.profileHeaderId,
            }
          });
          
          if (profile_header) {
            // Delete the profile header
            const deletedProfileHeader = await Prisma.profileHeader.delete({
              where: {
                id: req.body.profileHeaderId,
              }
            });
          
            if (deletedProfileHeader) {
              // Delete header custom link
              const deleteHeaderCustomLink = await Prisma.headerCustomlink.deleteMany({
                where: {
                  headerId: req.params.id,
                }
              });
          
              // Delete header
              const deleteHeader = await Prisma.header.delete({
                where: {
                  id: req.params.id,
                }
              });
          
              if (deleteHeaderCustomLink.count>0 && deleteHeader) {
                res.status(200).json({
                  message: "Header successfully removed!"
                });
              } else {
                throw createError("Header not deleted");
              }
            } else {
              throw createError("Header not deleted");
            }
          } else {
            throw createError("Header not found");
          }
  
    }
    catch(error){
        if (error.code === 'P2025') { // Prisma record not found error code
            res.status(400).json({
                error:{
                    common:{
                        msg:error.message,
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
        };
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