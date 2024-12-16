const { decode } = require('html-entities');

 const splitSubdirectories = async function(req, res, next) {
  try {
    // Decode HTML entities in the URL
    const decodedHtmlEntities = decode(req.body.url);
    
    // Decode the URL from the request body
    const decodedUrl = decodeURIComponent(decodedHtmlEntities);
    const parsedUrl = new URL(decodedUrl);
    console.log(parsedUrl);
    const socialMedia = await Prisma.socialMedia.findUnique({
      where:{
          id: req.body.socialMediaId,
      }
    });
    //if(socialMedia.url !== 'null' && parsedUrl.URL.origin )
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
      return res.status(400).json({
        error: {
          common: {
            msg: "URL is not acceptable!",
          }
        }
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: {
        common: {
          msg: "Invalid URL!",
        }
      }
    });
  }
};

module.exports = splitSubdirectories;
