// external imports
const path = require("path");
const fs = require("fs");


// internal imports
const Prisma = require("../prisma/prismaClient");
const { create } = require("domain");


// get profile

async function getProfile(req,res) {
    
}

// Create a new profile
async function createProfile(req,res) {
    

    const {userId,name,bio,sub_directory} = req.body;
    const profilePhoto = req.files[0].filename;
    try {

        const seo = await Prisma.seo.create({
            data:{
                title: name,
                description: bio,
            }
        });

        const newProfile = await Prisma.profile.create({
            data:{
                name,
                bio,
                profilePhoto,
                coverPhoto: "null", 
                sub_directory,
                Seo: {
                    connect: { 
                        id: seo.id, 
                    }
                },
                User: { 
                    connect: { 
                        id: userId, 
                    }
                }
            }
        });
        if(!newProfile) return res.json({error:{msg:"Unable to create new profile"}});

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
                const { filename } = req.files[0];               
                fs.unlink(
                  path.join(__dirname, `../public/profile-photo/${filename}`),
                  (err) => {
                    if (err) return res.json({message:"unknown error occurred!"});
                  }
                );
              }
        }      
    }   
}

// update user existing  profile
async function updateProfile(req,res) {
    
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