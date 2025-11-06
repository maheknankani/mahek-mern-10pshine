import express from 'express';
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
  toggleArchive,
} from '../controllers/noteController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();


router.use(authenticate);


router.route('/')
  .get(getNotes)
  .post(createNote);

router.route('/:id')
  .get(getNote)
  .put(updateNote)
  .delete(deleteNote);


router.patch('/:id/pin', togglePin);
router.patch('/:id/archive', toggleArchive);

export default router;

