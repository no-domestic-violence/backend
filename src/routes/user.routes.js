import express from 'express';
import {
  verifyToken,
  requireAllContactFields,
  validateContactFields,
  contactValidationErrors,
} from '../middleware';

import {
  getContact,
  addContact,
  editContact,
  deleteContact,
} from '../controllers';

const router = express.Router();

router
  .route('/users/:username/contacts/:id')
  .patch(
    verifyToken,
    validateContactFields,
    contactValidationErrors,
    editContact,
  )
  .delete(verifyToken, deleteContact);
router
  .route('/users/:username/contacts')
  .get(verifyToken, getContact)
  .patch(
    verifyToken,
    validateContactFields,
    contactValidationErrors,
    addContact,
  );

export default router;
