// // external imports


// // internal imports
// const Prisma = require("../prisma/prismaClient");


// //get link name and url
// async function getSeo(req,res) {
//     try{
//         const LinkList = await Prisma.seo.findMany({
//             // where: {
//             //   id: {
//             //     in: linkIds,
//             //   },
//             // },
//           });

//           if(LinkList){
//             res.status(200).json(LinkList);
//           }else{
//             res.status(404).json({
//                 error:{
//                     msg:"There is no link founded"
//                 }
//             });
//           }
//     }
//     catch(error){
//         if(error){
//             res.status(500).json({
//                 error:{
//                     msg:"Internal server errro!",
//                 }
//             });
//         }
//     }   
// }

// // add link name and url
// async function addSeo(req,res) {
//     const {title,description} = req.body;
//     try{
//         const newSeo = await Prisma.seo.create({
//             data:{
//                 title,
//                 description,
//             }
//         });

//         if(!newSeo){
//             res.status(500).json("Internal server error!"); 
//         }
//         else{
//             res.status(200).json({
//                 message: "SEO added successfully!",
//                 newSeo,
//             });
//         }
//     }
//     catch(error){
//         if(error){
//             res.status(500).json({
//                 error:{
//                     msg:"Internal server errro!",
//                 }
//             });
//         }
//     }  
// }

// // update link name and link url
// async function updateSeo(req,res) {
//     const {title,description} = req.body;
    
//     try{
//         const updatedSeo = await Prisma.seo.update({
//             where: {
//               id: req.params.id,
//             },
//             data:{
//                 title,
//                 description,
//             }
//           });

//         if(!updatedSeo){
//             res.status(404).json({
//                 error:{
//                     msg:"SEO not founded",
//                 }
//             });  
//         }
//         else{
//             res.status(200).json({
//                 message: "Updated successfully!",
//                 updatedSeo,
//             });  
//         }
//     }
//     catch(error){
//         if(error){
//             res.status(500).json({
//                 error:{
//                     msg:"Internal server errro!",
//                 }
//             });
//         }
//     }  
// }

// // delete custom link
// async function removeSeo(req,res) {
//     try{
//         const removedSeo = await Prisma.seo.delete({
//             where: {
//               id:req.params.id,
//             },
//           });
//           if(!removedSeo){
//             res.status(404).json({
//                 error:{
//                     msg:"SEO not founded",
//                 }
//             });  
//         }
//         else{
//             res.status(200).json({
//                 message: "SEO deleted successfully!",
//             });  
//         }    
//     }
//     catch(error){
        
//         if(error){
//             res.status(500).json({
//                 error:{
//                     msg:"Could not delete the SEO!",
//                 }
//             });
//         }
//     }
// }

// module.exports ={
//     getSeo,
//     addSeo,
//     updateSeo,
//     removeSeo,
// };