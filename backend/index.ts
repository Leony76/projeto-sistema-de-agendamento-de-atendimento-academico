import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

export const app = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

