// external imports
const createError = require("http-errors");
const path = require("path");
const fs = require("fs");


// internal imports
const Prisma = require("../prisma/prismaClient");


// get multiple profile 
async function getSingleProfile(req,res) {
    try {
        const profile = await Prisma.profile.findUnique({
            where:{
                id:req.params.id,
            }
        });

        if(profile){
            
            let profilePhotoPath;
            let coverPhotoPath;

            if(profile.profilePhoto) {
                profilePhotoPath = `${process.env.SITE_URL}profile-photo/`;
            }else{
                profilePhotoPath='';
            }
            if(profile.coverPhoto) {
                coverPhotoPath = `${process.env.SITE_URL}profile-photo/`;
            }else{
                coverPhotoPath='';
            }
            
            const  biolinkProfile = {
                    id:profile.id,
                    userId:profile.userId,
                    themeId:profile.themeId,
                    name:profile.name,
                    bio:profile.bio,
                    profilePhoto: profilePhotoPath + profile.profilePhoto, 
                    coverPhoto: coverPhotoPath + profile.coverPhoto,
                    sub_directory:profile.sub_directory,
                    seo_title:profile.seo_title,
                    seo_description:profile.seo_description,
            
                }
            
            res.status(200).json(
                biolinkProfile,
            );

        }else{
            throw createError("Unable to find profile");   
        }
        
    } catch (error) {
        res.status(500).json({
            errors: {
                common: {
                  msg: error.message,
                },
              },
        });   
    }
    finally { 
        await Prisma.$disconnect(); 

    }    
}
// get multiple profile 
async function getMultipleProfile(req, res) {
    try {
        const userId = req.params.id;
        let page = parseInt(req.query.page) || 1; 
        let limit = parseInt(req.query.limit) || 5; 

        // Ensure page and limit are not negative
        if (page < 1) page = 1;
        if (limit < 1) limit = 5;

        const offset = (page - 1) * limit;

        // Get the total count of profiles
        const totalProfiles = await Prisma.profile.count({
            where: {
                userId: userId,
            },
        });

        // Calculate total pages
        const totalPages = Math.ceil(totalProfiles / limit);

        const profiles = await Prisma.profile.findMany({
            where: {
                userId: userId,
            },
            skip: offset,
            take: limit,
        });

        const profilePhotoPath = `${process.env.SITE_URL}profile-photo/`;

        if (profiles.length > 0) {
            const ProfileList = profiles.map(profile => ({ 
                ...profile, 
                profilePhoto: profile.profilePhoto ? `${profilePhotoPath}${profile.profilePhoto}` : ""  
            }));

            res.status(200).json({
                page,
                limit,
                totalPages,
                ProfileList,              
            });

        } else {
            throw new Error("Unable to find profile");   
        }
        
    } catch (error) {
        res.status(500).json({
            errors: {
                common: {
                    msg: error.message,
                },
            },
        });   
    } finally { 
        await Prisma.$disconnect(); 
    }    
}



// Create a new profile
async function createProfile(req,res) {
    

    const {userId,name,bio,sub_directory} = req.body;
    let profilePhoto;
    if(req.files[0]){
         profilePhoto = req.files[0].filename;
    }else{
        profilePhoto = "";
    }
    
    try {

        const newProfile = await Prisma.profile.create({
            data:{
                name,
                bio,
                profilePhoto,
                coverPhoto:"", 
                sub_directory,
                seo_title: name,
                seo_description: bio,
                User: { 
                    connect: { 
                        id: userId, 
                    }
                }
            }
        });

        if(newProfile){
            res.status(201).json({
                message: "Profile successfully created",
                newProfile
            });
        }else{
            throw createError("Unable to create new profile");
        } 
        
    } catch (error) {   
        if(error){    
            
            if (req.files.length > 0) {
                const filename  = req.files[0];               
                fs.unlink(
                  path.join(__dirname, `../public/profile-photo/${filename}`),
                  (err) => {
                    
                  }
                );
              }
              //response the error
              res.status(500).json({
                errors: {
                    common: {
                      msg: error.message,
                    },
                  },
            });
        }      
    }   
}

// update user existing  profile
async function updateProfile(req,res) {

    try {
        let newProfilePhotoFilename;
        let newCoverPhotoFilename;
    
        const profile = await Prisma.profile.findUnique({
            where:{
                id: req.params.id,
            }
        });
        if(!profile){
            throw new Error("Profile not found!");
        }
        
        if(req.files.profilePhoto){
            newProfilePhotoFilename = req.files.profilePhoto[0].filename ;
    
            // remove previous profile photo
           if(profile.profilePhoto){
            fs.unlink(
                path.join(__dirname, `../public/profile-photo/${profile.profilePhoto}`),
                (error) => {  
                  
                }
              );
           }
        }
    
        if(req.files.coverPhoto){
            newCoverPhotoFilename = req.files.coverPhoto[0].filename ;
            // remove previous cover photo
            if(profile.coverPhoto && profile.coverPhoto !== ""){
                fs.unlink(
                    path.join(__dirname, `../public/profile-photo/${profile.coverPhoto}`),
                    (error) => {
                        
                    }
                  );
            }
        }     
        // update profile with new data
        const updateProfile = await Prisma.profile.update({
            where:{
                id: req.params.id,
            },
            data:{
            name:req.body.name,
            bio:req.body.bio,
            profilePhoto:newProfilePhotoFilename,
            coverPhoto:newCoverPhotoFilename,
            sub_directory:req.body.sub_directory,
            seo_title:req.body.seo_title,
            seo_description:req.body.seo_description,
            }
        });

        if (updateProfile){
            res.status(200).json({
                message:"Profile successfully updated",
                updateProfile,
            });
        }else{
            throw createError("Unable to update profile");
        }
          
    } catch (error) {
        if(error){ 
            // remove uploaded file
            if (req.files) {

                let profile_Photo;
                let cover_Photo;
            
                if(req.files.profilePhoto){
                  profile_Photo  = req.files.profilePhoto[0].filename;
            
                }
            
                if(req.files.coverPhoto){
                   cover_Photo  = req.files.coverPhoto[0].filename;
                }
                
                if(profile_Photo){
                  fs.unlink(
                    path.join(__dirname, `../public/profile-photo/${profile_Photo}`),
                    (err) => {
                      
                    }
                  );
                }
                if(cover_Photo){
                  fs.unlink(
                    path.join(__dirname, `../public/cover-photo/${cover_Photo}`),
                    (err) => {
                      
                    }
                  );
                }
              }   
            res.status(500).json({
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

// delete user existing  profile
async function deleteProfile(req, res) {
    try {
        const Profile = await Prisma.profile.findUnique({
            where: {
                id: req.params.id,
            },
        });

        if (!Profile) {
            throw createError("Unable to delete the profile");

        } else {
            // get profile custom link
            const profileCustomLink  = await Prisma.profileCustomLink.findMany({
                where: {
                    profileId: req.params.id,
                }     
            });
            
            //delete custom link & header
            if(profileCustomLink && profileCustomLink.length > 0){

               
                // Find header custom links
                const headerCustomLinks = await Prisma.headerCustomlink.findMany({
                        where: {
                            customLinkId: {
                                in: profileCustomLink.map(link => link.customLinkId)
                            }
                        }
                    });


                if(headerCustomLinks && headerCustomLinks.length > 0){
                    
                        // Delete header custom links
                        await Prisma.headerCustomlink.deleteMany({
                            where: {
                                customLinkId: {
                                    in: profileCustomLink.map(link => link.customLinkId)
                                }
                            }
                        });
                    
                        // Get profile headers
                        const profileHeader = await Prisma.profileHeader.findMany({
                            where: {
                                profileId: req.params.id
                            }
                        });
                    
                        // Delete profile headers
                        await Prisma.profileHeader.deleteMany({
                            where: {
                                profileId: req.params.id
                            }
                        });
                    
                        // Delete headers
                        await Prisma.header.deleteMany({
                            where: {
                                id: {
                                    in: profileHeader.map(header => header.headerId)
                                }
                            }
                        });
                }
                // delete profilecustom link
                const deletedProfileCustomLink = await Prisma.profileCustomLink.deleteMany({
                    where: {
                    profileId: req.params.id,
                    }
                }); 

                // delete custom link
                 await Prisma.customLink.deleteMany({
                    where: {
                        id: {
                            in:profileCustomLink.map(link => link.customLinkId),
                        }
                    }
                })
            }
                
            // delete profile social media
            await Prisma.profileSocialMediaLink.deleteMany({
                where: {
                    profileId: req.params.id,
                }
            }); 

            const deleteProfile = await Prisma.profile.delete({
                where: {
                    id: req.params.id,
                }
            });      

            // Remove profile photo
            if (deleteProfile.profilePhoto) {
                fs.unlink(
                    path.join(__dirname, `../public/profile-photo/${deleteProfile.profilePhoto}`),
                    (error) => {

                    }
                );
            }
            // Remove cover photo
            if (deleteProfile.coverPhoto && deleteProfile.coverPhoto !== "null") {
                fs.unlink(
                    path.join(__dirname, `../public/profile-photo/${deleteProfile.coverPhoto}`),
                    (error) => {

                    }
                );
            }

            // Send response
            res.status(200).json({
                message: "Profile deleted successfully!",
            });

        }
    } catch (error) {
        const errorMsg = "Record to delete does not exist.";
        if (error.message.includes(errorMsg)) {
            res.status(500).json({
                errors: {
                    common: {
                        msg: errorMsg,
                    }
                }
            });
        } else {
            res.status(500).json({
                errors: {
                    common: {
                        msg: error.message,
                    }
                }
            });
        }
    } finally {
        await Prisma.$disconnect();
    }
}

// delete user existing  profile
async function changeTheme(req, res) {
    try {
        const themeid = parseInt(req.body.themeId);
        const updateTheme = await Prisma.profile.update({
            where: {
                id: req.params.id,
            },
            data: {
                themeId: themeid,
            }
        });
        if (updateTheme) {
            res.status(200).json({
                message: "Theme updated successfully!",
            });
        } else {
            throw new Error("Unable to update theme");
        }
    } catch (error) {
        let errorMessage = "An unknown error occurred.";

        if (error.code === 'P2025') { // Prisma record not found error code
            errorMessage = "Record to update not found.";
        } else if (error.message === "Unable to update theme") {
            errorMessage = "Unable to update theme.";
        } else {
            errorMessage = error.message;
        }

        res.status(500).json({
            error: {
                common: {
                    msg: errorMessage
                }
            }
        });
    } finally {
        await Prisma.$disconnect();
    }
}


async function profileCounter(req, res) {
    try {
        const userId = req.params.id;

        const user = await Prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (user && user.id === userId) {
            const totalProfiles = await Prisma.profile.count({
                where: {
                    userId: userId,
                },
            });

            let customLinksCounts ;
            let headerCounts ;
            let socialMediaCounts ;

            if (totalProfiles > 0) {
                const profiles = await Prisma.profile.findMany({
                    where: {
                        userId: userId,
                    },
                });

                for (const profile of profiles) { // Use a for...of loop for async/await
                    const customLinks = await Prisma.profileCustomLink.count({
                        where: {
                            profileId: profile.id,
                        },
                    });
                    customLinksCounts= customLinks;

                    const headers = await Prisma.profileHeader.count({
                        where: {
                            profileId: profile.id,
                        },
                    });
                    headerCounts= headers;

                    const socialMedias = await Prisma.profileSocialMediaLink.count({
                        where: {
                            profileId: profile.id,
                        },
                    });
                    socialMediaCounts = socialMedias;
                }
            }

            res.status(200).json({
                totalProfiles,
                customLinksCounts,
                headerCounts,
                socialMediaCounts,
            });

        } else {
            throw new Error("User not found");
        }

    } catch (error) {
        if (error.message === "User not found") {
            res.status(404).json({
                error: {
                    common: {
                        msg: error.message,
                    },
                },
            });
        } else {
            console.error(error); // Log the error for debugging
            res.status(500).json({
                error: {
                    common: {
                        msg: "Internal server error",
                    },
                },
            });
        }

    }
}

module.exports = {
    getSingleProfile,
    getMultipleProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    changeTheme,
    profileCounter,
}