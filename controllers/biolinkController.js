

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
            let headers;
            let socialMediaLinks;
            

            // find custom link list for this exsisting profile 
            const profileCustomlink = await Prisma.profileCustomLink.findMany({
                where:{
                    profileId: profile.id,
                }
            });

            // find custom link
            if(profileCustomlink){
                const customLinkIds = profileCustomlink.map(link => link.customLinkId);

                 const getAllCustomlink = await Prisma.customLink.findMany({
                     where: { 
                        id: { 
                            in: customLinkIds, 
                        }, 
                    }, 
                });

                const {id, ...filterLinks} = getAllCustomlink;
                customLinks = filterLinks;
            }

            // find header list for the exsisting profile
            const profile_headers = await Prisma.profileHeader.findMany({
                where:{
                    profileId: profile.id,
                }
            });

            // find headers
            if(profile_headers){
                const headerIds = profile_headers.map(heading => heading.headerId);
                const getAllHeaders = await Prisma.header.findMany({
                    where:{
                        id:{
                            in: headerIds,
                        }
                    }
                });
                const {id, ...filterHeader} = getAllHeaders;
                headers = filterHeader;
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
                        url: socialMedia.url + profileSocialmedia.socialMediaSubdirectory.replace(/^\//, ''), // Remove leading slash if present 
                        icon: process.env.SITE_URL + socialMedia.icon }; 
                    } return null; }).filter(Boolean);     
            }


            // filter profile
            const profilePhotoPath = `${process.env.SITE_URL}profile-photo/`;
            const coverPhotoPath = `${process.env.SITE_URL}cover-photo/`;

            if(profile.coverPhoto && profile.coverPhoto !== "null"){
                biolinkProfile = {
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
                    themeId:profile.themeId,
                    name:profile.name,
                    bio:profile.bio,
                    profilePhoto: profilePhotoPath + profile.profilePhoto,
                    sub_directory:profile.sub_directory,
                    seo_title:profile.seo_title,
                    seo_description:profile.seo_description,
                };
            }

            // response object
            const biolink = {
                biolinkProfile,
                customLinks,
                headers,
                socialMediaLinks
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
                msg:"Internal server error",
            }
        });
        
    }finally { 
        await Prisma.$disconnect(); 
    }
    
}

module.exports = getBiolink;