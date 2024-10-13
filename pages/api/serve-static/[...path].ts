import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path: filePath } = req.query;
  const rootDir = serverRuntimeConfig.PROJECT_ROOT;
  
  if (!filePath || typeof filePath === 'string') {
    res.status(400).json({ error: 'Invalid file path' });
    return;
  }

  const fullPath = path.join(rootDir, ...filePath);

  try {
    const fileContent = fs.readFileSync(fullPath);
    const contentType = path.extname(fullPath) === '.jpg' ? 'image/jpeg' : 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.status(200).send(fileContent);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(404).json({ error: 'File not found' });
  }
}
