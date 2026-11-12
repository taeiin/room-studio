import {readFile} from 'node:fs/promises';
export async function assertPublicBuild(){
 const config=JSON.parse(await readFile('dist/server/wrangler.json','utf8'));
 if(config.vars?.ROOM_STUDIO_PUBLIC!=='true'||config.d1_databases?.length||config.r2_buckets?.length||config.services?.length)throw new Error('Not a safe public build: run npm run build:public first.');
 const entry=await readFile('dist/server/index.js','utf8');
 if(!entry.includes('ROOM_STUDIO_PUBLIC'))throw new Error('Public API protection was not found in the worker build.');
 return config;
}
