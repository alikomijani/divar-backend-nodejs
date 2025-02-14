import {
  BannerSliderModel,
  BannerSliderSchemaZod,
} from '@/schema/bannerSlider.schema';
import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

// @desc    Create a new BannerSlider
// @route   POST /api/bannersliders
export const createBannerSlider = asyncHandler(
  async (req: Request, res: Response) => {
    const validationResult = BannerSliderSchemaZod.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        errors: validationResult.error.flatten().fieldErrors,
        non_field_errors: validationResult.error.flatten().formErrors,
      });
      return;
    }
    const bannerSlider = await BannerSliderModel.create(req.body);
    res.status(201).json(bannerSlider);
  },
);

// @desc    Get all BannerSliders (with optional filtering by page)
// @route   GET /api/bannersliders?filterPage=home
export const getAllBannerSliders = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, type } = req.query; // Extract query parameter

    // Build filter object dynamically
    const filter: { page?: string; type?: string } = {};
    if (page && typeof page === 'string') {
      filter.page = page;
    }
    if (type && typeof type === 'string') {
      filter.type = type;
    }

    const banners = await BannerSliderModel.find(filter);
    res.json(banners);
  },
);

// @desc    Get a single BannerSlider by ID
// @route   GET /api/bannersliders/:id
export const getBannerSliderById = asyncHandler(
  async (req: Request, res: Response) => {
    const banner = await BannerSliderModel.findById(req.params.id);
    if (!banner) {
      res.status(404).json({ message: 'BannerSlider not found' });
      return;
    }
    res.json(banner);
  },
);

// @desc    Update a BannerSlider
// @route   PUT /api/bannersliders/:id
export const updateBannerSlider = asyncHandler(
  async (req: Request, res: Response) => {
    const validationResult = BannerSliderSchemaZod.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ errors: validationResult.error.format() });
      return;
    }

    const updatedBanner = await BannerSliderModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedBanner) {
      res.status(404).json({ message: 'BannerSlider not found' });
      return;
    }

    res.json(updatedBanner);
  },
);

// @desc    Delete a BannerSlider
// @route   DELETE /api/bannersliders/:id
export const deleteBannerSlider = asyncHandler(
  async (req: Request, res: Response) => {
    const deletedBanner = await BannerSliderModel.findByIdAndDelete(
      req.params.id,
    );
    if (!deletedBanner) {
      res.status(404).json({ message: 'BannerSlider not found' });
      return;
    }
    res.json({ message: 'BannerSlider deleted successfully' });
  },
);
