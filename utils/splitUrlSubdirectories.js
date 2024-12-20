// external imports
const { decode } = require('html-entities');
const createError = require("http-errors");

// internal imports
const Prisma = require("../prisma/prismaClient");

 const splitSubdirectories = async function(req, res, next) {

  const socialMediaId = parseInt(req.body.socialMediaId);
  if ([1, 5].includes(socialMediaId)) {
    req.dataShare = req.body.url;
    return next();
  }else{
    try {
      // Decode HTML entities in the URL
      const decodedHtmlEntities = decode(req.body.url);
      
      // Decode the URL from the request body
      const decodedUrl = decodeURIComponent(decodedHtmlEntities);
      const parsedUrl = new URL(decodedUrl);

      const socialMedia = await Prisma.socialMedia.findUnique({
          where:{
              id: socialMediaId,
          }
        });
        const parsedUrlOrigin = parsedUrl.origin + "/";
        if(parsedUrlOrigin == socialMedia.url){

          // Split the pathname into parts
        const pathParts = parsedUrl.pathname.split('/');
  
        // Filter out empty parts
      
        const parts = pathParts.filter(part => part !== '' && part !== '/');
        let subdirectories;
        if(parts.length > 1){
          subdirectories = parts.join('/');
        }else{
          subdirectories = parts.toString();
        }
  
        // Check if subdirectories exist and are not empty
        if (subdirectories.length > 0) {
          req.dataShare = subdirectories;
          next();
        } else {
          throw createError("URL is not acceptable!");
        }

        }else{
          throw createError(`Use correct ${socialMedia.name} url!`);
        }   
      
    } catch (error) {
      return res.status(400).json({
        error: {
          common: {
            msg: error.message,
          }
        }
      });
    }
  }
}

module.exports = splitSubdirectories;
