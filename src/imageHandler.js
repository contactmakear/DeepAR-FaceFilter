const multer = require("multer")
const sharp = require("sharp")
const path = require("path")
const fs = require("fs")

// Multer Configuration (for handling image uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/multer");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `social-selfie-${Date.now()}`);
  },
})

const upload = multer({ storage });

  // Function to Compress and Save Image
const processImage = async (file) => {
    try {
      const outputDir = path.join(__dirname, "../public/uploads/");
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
  
      const outputPath = path.join(outputDir, `${file.filename}.webp`);
      await sharp(file.path)
        .resize(800, 600, { fit: "inside" })
        .toFormat("webp")
        .webp({ quality: 100 }) // Compression quality
        .toFile(outputPath);
  
      // fs.unlinkSync(file.path); // Delete the original file
  
      return `/uploads/${file.filename}.webp`; // Relative path
    } catch (error) {
      console.error("Error processing image:", error);
      throw error;
    }
  }

  module.exports = {
    upload,
    processImage,
  }