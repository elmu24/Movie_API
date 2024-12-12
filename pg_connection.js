import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Lädt Umgebungsvariablen aus der .env-Datei

const { Pool } = pkg;

// Initialisierung des Pools
const pgPool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: process.env.PGSSL === 'true', // Konvertiere die SSL-Variable in Boolean
});

export default pgPool;
