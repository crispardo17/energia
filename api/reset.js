import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    await sql`TRUNCATE TABLE apartamentos, historial, configuracion RESTART IDENTITY;`;
    
    await sql`
      INSERT INTO apartamentos (apto, ultima_lectura) VALUES
        ('202', 145656), ('203', 137462), ('301', 183709), ('302', 167209)
      ON CONFLICT (apto) DO NOTHING;
    `;
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
