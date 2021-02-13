
import { Router } from 'express';
import { searchHotline } from '../controllers';

const router = Router();

router.get('/hotlines', searchHotline);

export default router;