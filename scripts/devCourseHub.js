// Keep development on one port, including API handlers.
import {config} from 'dotenv';import {createServer} from 'vite';
if(process.env.ACADEMY_ENV_FILE)config({path:process.env.ACADEMY_ENV_FILE,quiet:true});
const server=await createServer({server:{port:Number(process.env.ACADEMY_WEB_PORT||3006),strictPort:true}});
await server.listen();server.printUrls();
