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
            let biolinkProfile;
            const profilePhotoPath = `${process.env.SITE_URL}profile-photo/`;
            const coverPhotoPath = `${process.env.SITE_URL}cover-photo/`;

            if(profile.coverPhoto && profile.coverPhoto !== "null"){
                biolinkProfile = {
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
                };
            }else{
                biolinkProfile = {
                    id:profile.id,
                    userId:profile.userId,
                    themeId:profile.themeId,
                    name:profile.name,
                    bio:profile.bio,
                    profilePhoto: profilePhotoPath + profile.profilePhoto,
                    sub_directory:profile.sub_directory,
                    seo_title:profile.seo_title,
                    seo_description:profile.seo_description,
                };
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
                profilePhoto: `${profilePhotoPath}${profile.profilePhoto}` 
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
    const profilePhoto = req.files[0].filename;
    try {

        const newProfile = await Prisma.profile.create({
            data:{
                name,
                bio,
                profilePhoto,
                coverPhoto:"null", 
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
            if(profile.coverPhoto && profile.coverPhoto !== "null"){
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
        const deleteProfile = await Prisma.profile.delete({
            where: {
                id: req.params.id,
            }
        });

        if (!deleteProfile) {
            throw createError("Unable to delete the profile");

        } else {
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



module.exports = {
    getSingleProfile,
    getMultipleProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    changeTheme,
}