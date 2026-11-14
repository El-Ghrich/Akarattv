import * as migration_20261111_153402_initial from './20261111_153402_initial';
import * as migration_20261113_183625_schedule_publish_jobs from './20261113_183625_schedule_publish_jobs';
import * as migration_20261114_142001_redirects from './20261114_142001_redirects';

export const migrations = [
  {
    up: migration_20261111_153402_initial.up,
    down: migration_20261111_153402_initial.down,
    name: '20261111_153402_initial',
  },
  {
    up: migration_20261113_183625_schedule_publish_jobs.up,
    down: migration_20261113_183625_schedule_publish_jobs.down,
    name: '20261113_183625_schedule_publish_jobs',
  },
  {
    up: migration_20261114_142001_redirects.up,
    down: migration_20261114_142001_redirects.down,
    name: '20261114_142001_redirects'
  },
];
