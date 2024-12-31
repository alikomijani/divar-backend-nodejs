import express from 'express';
import profileController from '../controllers/profile.controllers'; // Import the controller

const router = express.Router();

router.post('/', profileController.createProfile);
router.get('/:id', profileController.getProfileById);
router.put('/:id', profileController.updateProfile);
router.delete('/:id', profileController.deleteProfile);
router.get('/', profileController.getAllProfiles);

export default router;
