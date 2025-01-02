import type { ProfileType } from '@/models/profile.model';
import ProfileModel from '@/models/profile.model';
import type { Controller } from '@/types/express';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Create a new profile
export const createProfile = async (req: Request, res: Response) => {
  try {
    const newProfile: ProfileType = new ProfileModel(req.body);
    const savedProfile = await newProfile.save();
    res.status(StatusCodes.CREATED).json(savedProfile); // 201 Created
  } catch (error: any) {
    console.error('Error creating profile:', error);
    res
      .status(500)
      .json({ error: error.message || 'Could not create profile' }); // 500 Internal Server Error
  }
};

// Get a profile by ID
export const getProfileById: Controller<{ id: string }> = async (
  req: Request,
  res: Response,
) => {
  try {
    const profile = await ProfileModel.findById(req.params.id);
    if (!profile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Profile not found' }); // 404 Not Found
    }
    return res.json(profile);
  } catch (error: any) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: error.message || 'Could not get profile' });
  }
};

// Update a profile by ID
export const updateProfile: Controller<{ id: string }> = async (
  req: Request,
  res: Response,
) => {
  try {
    const updatedProfile = await ProfileModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }, // Important: runValidators to enforce schema validation
    );
    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(updatedProfile);
  } catch (error: any) {
    console.error('Error updating profile:', error);
    res
      .status(500)
      .json({ error: error.message || 'Could not update profile' });
  }
};

// Delete a profile by ID
export const deleteProfile: Controller<{ id: string }> = async (
  req: Request,
  res: Response,
) => {
  try {
    const deletedProfile = await ProfileModel.findByIdAndDelete(req.params.id);
    if (!deletedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(204).send(); // 204 No Content (successful deletion)
  } catch (error: any) {
    console.error('Error deleting profile:', error);
    res
      .status(500)
      .json({ error: error.message || 'Could not delete profile' });
  }
};

// Get all profiles (use with caution in production, consider pagination)
export const getAllProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await ProfileModel.find();
    res.json(profiles);
  } catch (error: any) {
    console.error('Error getting all profiles:', error);
    res.status(500).json({ error: error.message || 'Could not get profiles' });
  }
};

export default {
  createProfile,
  getProfileById,
  updateProfile,
  deleteProfile,
  getAllProfiles,
};
