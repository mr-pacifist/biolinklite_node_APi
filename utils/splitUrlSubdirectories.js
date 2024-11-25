

const splitSubdirectories = function(req,res,next) {
    
    const parsedUrl = new URL(req.body.url);
  
    const pathParts = parsedUrl.pathname.split('/');
    console.log(parsedUrl,pathParts);

    const subdirectories = pathParts.filter(part => part !== '' && part !== '/');
    if(!subdirectories){
        return res.status(401).json({
            error:{
                msg:"Url is not acceptable!",
            }
        })
        
    }else{
        req.dataShare = subdirectories;
        next();
    }
    
  }
module.exports = splitSubdirectories;
