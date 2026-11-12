import {spawnSync} from 'node:child_process';
import {assertPublicBuild} from './assert-public-build.mjs';
await assertPublicBuild();
const result=spawnSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','deploy','--config','dist/server/wrangler.json'],{stdio:'inherit'});
if(result.error)throw result.error;
process.exit(result.status??1);
