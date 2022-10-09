// Require the Cloudinary library
const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
    cloud_name: 'dnefd0ty5', 
    api_key: '755292982911296', 
    api_secret: '1WD-MKbvF5SXs-iejgEDGEnXBsA' 
  });
  
module.exports = cloudinary;
