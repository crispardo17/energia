import { config } from 'dotenv';import http from 'node:http';import {createServer} from 'vite';import react from '@vitejs/plugin-react';
config({path:process.env.ACADEMY_ENV_FILE||'/private/tmp/angkor-hub-branch.env',quiet:true});
const {default:courses}=await import('../api/courses.js');const {default:academy}=await import('../api/academy.js');
const api=http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost');req.query=Object.fromEntries(url.searchParams);let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>1000000){res.writeHead(413);res.end();return;}}req.body=raw?JSON.parse(raw):{};
 res.status=n=>{res.statusCode=n;return res;};res.json=value=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(value));return res;};
 await (url.pathname==='/api/courses'?courses:academy)(req,res);
}catch{res.statusCode=500;res.end(JSON.stringify({error:'Local API error'}));}});
const apiPort=Number(process.env.ACADEMY_API_PORT||3104),webPort=Number(process.env.ACADEMY_WEB_PORT||3003);
api.listen(apiPort,'127.0.0.1');
const server=await createServer({configFile:false,plugins:[react()],server:{port:webPort,host:'127.0.0.1',proxy:{'/api':`http://127.0.0.1:${apiPort}`}}});await server.listen();server.printUrls();
