import express from 'express';
import { verifyAccessToken, validateObjId } from '../middleware';
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
    verifyAccessToken,
    validateObjId('Contact'),
    contactValidationRules,
    validateRequest,
    editContact,
  )
  .delete(verifyAccessToken, validateObjId('Contact'), deleteContact);
router
  .route('/users/:username/contacts')
  .get(verifyAccessToken, getContact)
  .patch(verifyAccessToken, contactValidationRules, validateRequest, addContact);

export default router;
