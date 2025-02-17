

//internal imports
const Prisma = require("../prisma/prismaClient");


async function getBiolink(req,res) {
    try {
        const {subDirectory}  = req.params;

        if(subDirectory.length < 3) return res.status(400).json({error:{msg:"URL length is too short"}});
        // find profile
        const profile = await Prisma.profile.findUnique({
            where:{
                sub_directory: subDirectory,
            }
        });

        if(profile){
        
            let biolinkProfile;
            let customLinks;
            let Links;
            let socialMediaLinks;
            

            // find custom link list for this exsisting profile 
            const profileCustomlink = await Prisma.profileCustomLink.findMany({
                where: {
                    profileId: profile.id,
                },
            });
            
            // Fetch custom links
            
            if (profileCustomlink && profileCustomlink.length > 0) {
                const customLinkIds = profileCustomlink.map(link => link.customLinkId);
            
                const getAllCustomlink = await Prisma.customLink.findMany({
                    where: {
                        id: {
                            in: customLinkIds,
                        },
                    },
                    include: {
                        HeaderCustomlink: {
                            include: {
                                header: true,
                            },
                        },
                    },
                });
            
                customLinks = getAllCustomlink;
            }
            if (customLinks) {
                 Links = customLinks.reduce((acc, customLink) => {
                    if (customLink.HeaderCustomlink.length > 0) {
                        customLink.HeaderCustomlink.forEach(link => {
                            acc.push({
                                id: customLink.id,
                                title: link.header.title,
                                name: customLink.name,
                                url: customLink.url,
                                createdAt: customLink.createdAt,
                                updatedAt: customLink.updatedAt,
                            });
                        });
                    } else {
                        acc.push({
                            id: customLink.id,
                            title: "",
                            name: customLink.name,
                            url: customLink.url,
                            createdAt: customLink.createdAt,
                            updatedAt: customLink.updatedAt,
                        });
                    }
                    return acc;
                }, []);
                  
            }else{
                Links = [];
            }
                
  
           
            // find social medias for the exsisting profile
            const profileSocialmedia = await Prisma.profileSocialMediaLink.findMany({
                where:{
                    profileId: profile.id,
                }
            });

            // get socialmedia
            if(profileSocialmedia){
                const socialMediaIds = profileSocialmedia.map(socialMedia => socialMedia.socialMediaId);
                const socialMedias = await Prisma.socialMedia.findMany({
                    where:{
                        id:{
                            in: socialMediaIds,
                        }
                    }
                });
                // response all social media and icon
            
                socialMediaLinks = profileSocialmedia.map(profileSocialmedia => { 
                const socialMedia = socialMedias.find(s => s.id === profileSocialmedia.socialMediaId); 
                if (socialMedia) { 
                    return {  
                        name: socialMedia.name, 
                        socialMediaId: profileSocialmedia.socialMediaId, 
                        url: profileSocialmedia.socialMediaSubdirectory,
                        icon: process.env.SITE_URL + socialMedia.icon }; 
                    } return null; }).filter(Boolean);     
            }


            // filter profile
            let profilePhoto = profile.profilePhoto && profile.profilePhoto !== "" ? `${process.env.SITE_URL}profile-photo/ ${profile.profilePhoto}`: "";
            let coverPhoto =  profile.coverPhoto && profile.coverPhoto !== "" ? `${process.env.SITE_URL}cover-photo/ ${profile.coverPhoto}`: "";

            if(profile.coverPhoto && profile.coverPhoto !== ""){
                
            }else{
                
            }
            biolinkProfile = {
                themeId:profile.themeId,
                name:profile.name,
                bio:profile.bio,
                profilePhoto: profilePhoto, 
                coverPhoto: coverPhoto,
                profileUrl:process.env.CLIENT_URL + profile.sub_directory,
                seo_title:profile.seo_title,
                seo_description:profile.seo_description,
            };
            

            // response object
            const biolink = {
                biolinkProfile,
                Links,
                socialMediaLinks,
            };

            res.status(200).json(biolink) 

        }else{
            res.status(404).json({
                error:{
                    msg:"Your requested biolink was not found",
                }
            });
        }
  
    } catch (error) {
        res.status(500).json({
            error:{
                msg:error.message,
            }
        });
        
    }finally { 
        await Prisma.$disconnect(); 
    }
    
}

module.exports = getBiolink;