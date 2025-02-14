import express from 'express';
import {
  createBannerSlider,
  getAllBannerSliders,
  getBannerSliderById,
  updateBannerSlider,
  deleteBannerSlider,
} from '../controllers/bannerSlider.controller';

const bannerSliderAdminRouter = express.Router();
const bannerSliderRouter = express.Router();
bannerSliderRouter.get('/', getAllBannerSliders);
bannerSliderRouter.get('/:id', getBannerSliderById);

bannerSliderAdminRouter.post('/', createBannerSlider);
bannerSliderAdminRouter.get('/', getAllBannerSliders);
bannerSliderAdminRouter.get('/:id', getBannerSliderById);
bannerSliderAdminRouter.put('/:id', updateBannerSlider);
bannerSliderAdminRouter.delete('/:id', deleteBannerSlider);

export { bannerSliderAdminRouter, bannerSliderRouter };
