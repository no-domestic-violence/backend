import express from 'express';
import verifyToken from '../utils/verifyToken';

import {
  getContact,
  addContact,
  editContact,
  deleteContact,
} from '../controllers';

const router = express.Router();

router
  .route('/users/:username/contacts/:_id')
  .patch(verifyToken, editContact)
  .delete(verifyToken, deleteContact);
router
  .route('/users/:username/contacts')
  .get(verifyToken, getContact)
  .patch(verifyToken, addContact);

export default router;
