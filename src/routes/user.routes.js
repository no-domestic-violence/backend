import express from 'express';
import { verifyToken, requireAllContactFields } from '../middleware';

import {
  getContact,
  addContact,
  editContact,
  deleteContact,
} from '../controllers';

const router = express.Router();

router
  .route('/users/:username/contacts/:id')
  .patch(verifyToken, requireAllContactFields, editContact)
  .delete(verifyToken, deleteContact);
router
  .route('/users/:username/contacts')
  .get(verifyToken, getContact)
  .patch(verifyToken, requireAllContactFields, addContact);

export default router;
