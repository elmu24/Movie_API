import express from 'express';
import multer from 'multer';
import { Pool } from 'pg';

const app = express();

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(multer({ dest: 'uploads/' }).none());
app.use(express.json());


