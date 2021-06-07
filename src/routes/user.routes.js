import express from 'express';
import { verifyToken, validateObjId } from '../middleware';
import {
  contactValidationRules,
  validateRequest,
} from '../middleware/validation';

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
    contactValidationRules,
    validateRequest,
    editContact,
  )
  .delete(verifyToken, validateObjId('Contact'), deleteContact);
router
  .route('/users/:username/contacts')
  .get(verifyToken, getContact)
  .patch(verifyToken, contactValidationRules, validateRequest, addContact);

export default router;
