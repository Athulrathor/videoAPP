import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Simplified approach - use regular upload for all files
const uploadOnCloudinary = async (localFilePath, options = { resource_type: "auto" }) => {
  try {
    if (!localFilePath) {
      return { error: 'No file path provided' };
    }

    const normalizedPath = path.resolve(localFilePath);


    if (!fs.existsSync(normalizedPath)) {
      return { error: `File does not exist at path: ${normalizedPath}` };
    }

    const stats = fs.statSync(normalizedPath);
    console.log(`📁 File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

    console.log('☁️ Starting Cloudinary upload...');

    // ✅ Regular upload can handle large files with proper timeout
    const response = await cloudinary.uploader.upload(normalizedPath, {
      ...options,
      timeout: 600000, // 10 minutes for large files
      chunk_size: 6000000, // 6MB chunks
    });

    console.log('✅ Upload successful:', response.secure_url);

    // Clean up local file
    if (fs.existsSync(normalizedPath)) {
      fs.unlinkSync(normalizedPath);
      console.log('🗑️ Local file deleted successfully');
    }

    return response;

  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);

    const normalizedPath = path.resolve(localFilePath);

    if (normalizedPath && fs.existsSync(normalizedPath)) {
      try {
        fs.unlinkSync(normalizedPath);
      } catch (cleanupError) {
        console.error('❌ Error cleaning up file:', cleanupError);
      }
    }

    return {
      error: error.message || 'Unknown Cloudinary error',
      details: error
    };
  }
};
const uploadLargeVideo = async (localFilePath, options = { resource_type: "auto" }) => {
  try {
    if (!localFilePath) {
      return { error: 'No file path provided for large upload' };
    }

    if (!fs.existsSync(localFilePath)) {
      return { error: `File does not exist at path: ${localFilePath}` };
    }

    const stats = fs.statSync(localFilePath);
    console.log(`📁 Large file size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

    console.log('☁️ Starting large file upload to Cloudinary...');

    // ✅ Wrap upload_large in a Promise to handle the stream
    const response = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_large(localFilePath, {
        ...options,
        timeout: 600000, // 10 minutes
      });

      uploadStream.on('end', (result) => {
        console.log('✅ Large file upload completed:', result);
        resolve(result);
      });

      uploadStream.on('error', (error) => {
        console.error('❌ Large file upload error:', error);
        reject(error);
      });

      // Optional: Track progress
      uploadStream.on('progress', (progress) => {
        console.log(`📊 Upload progress: ${progress}%`);
      });
    });

    // Clean up local file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log('🗑️ Large file deleted successfully');
    }

    return response;

  } catch (error) {
    console.error('❌ Large file upload error:', error);

    if (localFilePath && fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
      } catch (cleanupError) {
        console.error('❌ Error cleaning up large file:', cleanupError);
      }
    }

    return {
      error: error.message || 'Unknown large file upload error',
      details: error
    };
  }
};

const deleteOnCloudinary = async (localFilePath,options={resource_type: "auto",}) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.destroy(localFilePath,options);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log('File deleted successfully');
    } else {
      console.log('File does not exist:', localFilePath);
    }

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const testCloudinaryConnection = async () => {
  try {
    console.log('🔧 Testing Cloudinary configuration...');
    console.log('☁️ Cloud Name:', process.env.CLOUDINARY_NAME);
    console.log('🔑 API Key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing');
    console.log('🔐 API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing');

    // Test with a simple upload
    const response = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful:', response);
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error);
    return false;
  }
};

export { uploadOnCloudinary,deleteOnCloudinary,uploadLargeVideo };