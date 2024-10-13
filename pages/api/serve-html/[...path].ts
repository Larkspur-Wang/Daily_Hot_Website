import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path: filePath } = req.query;
  const websiteDir = path.join(serverRuntimeConfig.PROJECT_ROOT, 'website');
  
  console.log('Requested file path:', filePath);
  console.log('Website directory:', websiteDir);

  if (!filePath || typeof filePath === 'string') {
    console.log('Invalid file path');
    res.status(400).json({ error: 'Invalid file path' });
    return;
  }

  const fullPath = path.join(websiteDir, ...filePath);
  console.log('Full file path:', fullPath);

  try {
    if (!fs.existsSync(fullPath)) {
      console.log('File not found:', fullPath);
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const fileContent = fs.readFileSync(fullPath, 'utf8');
    console.log('File content length:', fileContent.length);
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(fileContent);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
