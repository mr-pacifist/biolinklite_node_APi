// external imports
const createError = require("http-errors");
const path = require("path");
const fs = require("fs");


// internal imports
const Prisma = require("../prisma/prismaClient");



// get profile

async function getProfile(req,res) {
    
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
        
        res.status(201).json({
            message: "Profile successfully created",
            newProfile
        });
        
    } catch (error) {   
        if(error){    
            res.status(500).json({
                error:{
                    msg:"Internal server errro!",
                    result:error.message,
                }
            });
            if (req.files.length > 0) {
                const filename  = req.files[0];               
                fs.unlink(
                  path.join(__dirname, `../public/profile-photo/${filename}`),
                  (err) => {
                    
                  }
                );
              }
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
        })
         
        res.status(200).json({
            message:"Profile successfully updated!",
            data:updateProfile,
        });
        
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
                    msg:"Internal server errro!",
                    result:error.message,
                }
            });
        }
        
    }
   
}

// delete user existing  profile
async function deleteProfile(req,res) {
    
}


module.exports = {
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
}