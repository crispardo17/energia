import {defineConfig,loadEnv} from 'vite';
import react from '@vitejs/plugin-react';

// Serve the same handlers locally as on Vercel, without a second API port.
function localApi(){return {name:'angkor-local-api',async configureServer(server){
 const [{default:academy},{default:courses},{default:session}]=await Promise.all([import('./api/academy.js'),import('./api/courses.js'),import('./api/session.js')]);
 server.middlewares.use(async(req,res,next)=>{
  const url=new URL(req.url,'http://localhost:3006');
  const handler=url.pathname==='/api/academy'?academy:url.pathname==='/api/courses'?courses:url.pathname==='/api/session'||url.pathname.startsWith('/api/session/')?session:null;
  if(!handler){
   if(url.pathname.startsWith('/api/')){res.statusCode=404;res.setHeader('Content-Type','application/json');return res.end(JSON.stringify({error:'Ruta no disponible.'}));}
   return next();
  }
  res.status=n=>{res.statusCode=n;return res;};res.json=value=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(value));return res;};
  try{
   req.query=Object.fromEntries(url.searchParams);
   if(url.pathname.startsWith('/api/session/'))req.query.path=url.pathname.slice('/api/session/'.length);
   if(!['GET','HEAD'].includes(req.method)){
    let raw='';for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>1000000)return res.status(413).json({error:'La solicitud es demasiado grande.'});}
    try{req.body=raw?JSON.parse(raw):{};}catch{return res.status(400).json({error:'Datos no válidos.'});}
   }
   await handler(req,res);
  }catch(error){console.error('Local API failed',{code:error.code||error.name});if(!res.headersSent)res.status(503).json({error:'No pudimos conectar con el servicio local.'});else res.end();}
 });
}};}
export default defineConfig(({mode})=>{
 for(const [name,value] of Object.entries(loadEnv(mode,process.cwd(),'')))if(process.env[name]===undefined)process.env[name]=value;
 return {plugins:[react(),localApi()],server:{port:3006,strictPort:true,host:'127.0.0.1',open:false},preview:{port:3006,strictPort:true,host:'127.0.0.1'}};
});
