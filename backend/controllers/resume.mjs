import Resume from '../modles/resume-module.mjs';  // Resume model ko import karna
import { uploadFileOnCloudinary, deleteImg } from '../utils/cloudinary.mjs';  // Resume model ko import karna
import fs from 'fs';  // To remove local temp file
import cloudinary from 'cloudinary';  // Make sure Cloudinary is configured correctly

// Create resume
export const createResume = async (req, res) => {
  try {

    const { candidateName, email, phone, experience, education, skills, userId } = req.body;
    // console.log("name, email, password, role :", req.body);


    if (!candidateName || !email || !phone || !experience || !education || !skills || !userId) {
      return res.status(403).json({ message: "Required parameters missing" });
    }

    const resumeLocalPath = req.files?.resumeImage[0]?.path
    console.log("resumeLocalPath: ", resumeLocalPath);

    if (!resumeLocalPath) {
      return res.status(400).json({ message: "Resume image is required" });  // Successfully created response dena
    }

    const resumeImage = await uploadFileOnCloudinary(resumeLocalPath)
    console.log("resumeImage: ", resumeImage);

    if (!resumeImage) {
      return res.status(400).json({ message: "Resume image is required" });  // Successfully created response dena
    }

    const resumeCreated = await Resume.create({
      candidateName,
      email,
      phone,
      experience,
      education,
      skills,
      userId,
      resumeImage: resumeImage.url
    });
    // console.log("resumeCreated: ", resumeCreated);

    res.status(201).json({ message: "Resume image is required", resumeCreated });  // Successfully created response dena
  } catch (error) {
    console.log("Error in creating resume", error);

    res.status(500).json({ error: 'Error creating resume' });
  }
};

// Read resumes
export const readResumes = async (req, res) => {
  try {
    const resumes = await Resume.find();  // Sare resumes database se fetch karna
    res.status(200).json(resumes);  // Response mein resumes bhejna
  } catch (error) {
    res.status(500).json({ error: 'Error fetching resumes' });
  }
};

// Update resume
export const updateResume = async (req, res) => {
  try {
    const { id } = req.params;  // URL se resume ID lena
    const updatedResume = await Resume.findByIdAndUpdate(id, req.body, { new: true });  // Update the resume
    res.status(200).json(updatedResume);  // Response mein updated resume dena
  } catch (error) {
    res.status(500).json({ error: 'Error updating resume' });
  }
};

export const updateResumeImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Pehle existing resume ko find karo
    const existingResume = await Resume.findById(id);

    if (!existingResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Agar image update karni hai (agar nayi file hai)
    if (req.files?.resumeImage && req.files.resumeImage[0]) {
      const resumeLocalPath = req.files.resumeImage[0].path;
      console.log("New resumeLocalPath: ", resumeLocalPath);

      // Pehle purani image ko Cloudinary se delete karo
      if (existingResume.resumeImage) {
        const publicId = existingResume.resumeImage.split('/').pop().split('.')[0];
        console.log("publicId: ", publicId);

        const deleteResponse = await deleteImg(publicId);
        console.log("Image delete response: ", deleteResponse);
      }

      // Nayi image ko Cloudinary par upload karo
      const newResumeImage = await uploadFileOnCloudinary(resumeLocalPath);
      console.log("New resumeImage URL: ", newResumeImage.url);

      if (!newResumeImage) {
        return res.status(400).json({ message: "Resume image upload failed" });
      }

      // Temp file ko delete karne se pehle check karo agar file exist karti hai ya nahi
      if (fs.existsSync(resumeLocalPath)) {
        fs.unlinkSync(resumeLocalPath);  // Temp file ko remove karo
        console.log("Temporary file deleted");
      } else {
        console.log("Temporary file not found, skipping deletion.");
      }

      // Nayi image ko update karo
      existingResume.resumeImage = newResumeImage.url;
    }

    // Save the updated resume
    const updatedResume = await existingResume.save();
    console.log("Updated Resume: ", updatedResume);

    // Success response
    res.status(200).json({ message: "Resume updated successfully", updatedResume });
  } catch (error) {
    console.log("Error in updating resume", error);
    res.status(500).json({ error: 'Error updating resume' });
  }
};

// Delete resume
export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;  // URL se resume ID lena
    await Resume.findByIdAndDelete(id);  // Resume ko delete karna
    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting resume' });
  }
};
