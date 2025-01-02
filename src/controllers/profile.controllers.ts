import ProfileModel from '@/models/profile.model';
import type { Controller } from '@/types/express';
import { getPaginatedQuery } from '@/utils/paginatedQuery';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

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
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || 'Could not get profile' });
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
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Profile not found' });
    }
    res.json(updatedProfile);
  } catch (error: any) {
    console.error('Error updating profile:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || 'Could not update profile' });
  }
};

// Get all profiles (use with caution in production, consider pagination)
export const getAllProfiles: Controller = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const profiles = await getPaginatedQuery(ProfileModel, { page, pageSize });
    res.json(profiles);
  } catch (error: any) {
    console.error('Error getting all profiles:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || 'Could not get profiles' });
  }
};

export default {
  getProfileById,
  updateProfile,
  getAllProfiles,
};
