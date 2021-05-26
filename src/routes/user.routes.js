import express from 'express';
import {
  verifyToken,
  validateContactFields,
  contactValidationErrors,
  validateObjId,
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
    validateObjId('Contact'),
    validateContactFields,
    contactValidationErrors,
    editContact,
  )
  .delete(verifyToken, validateObjId('Contact'), deleteContact);
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
