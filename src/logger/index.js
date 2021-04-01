import { buildDevLogger } from './dev-logger';
import { buildProdLogger } from './prod-logger';

/* eslint-disable  import/no-mutable-exports */
let logger = null;
if (process.env.NODE_ENV === 'development') {
  logger = buildDevLogger();
} else {
  logger = buildProdLogger();
}

export default logger;
