import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { Logger } from '@nestjs/common';

export const initApp = () => {
  const logger = new Logger('AppInit');
  const publicDir = join(process.cwd(), 'public');
  if (!existsSync(publicDir)) {
    logger.log('Creating public directory...');
    mkdirSync(publicDir);
    logger.log('Public directory created');
  }
};
