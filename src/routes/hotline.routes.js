import { Router } from 'express';
import { searchHotline } from '../controllers';
import { hotlinesCache } from '../middleware';

const router = Router();

router.get('/hotlines', hotlinesCache, searchHotline);

export default router;
