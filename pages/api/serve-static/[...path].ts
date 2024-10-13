import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path: filePath } = req.query;
  const rootDir = process.cwd();
  
  if (!filePath || typeof filePath === 'string') {
    res.status(400).json({ error: 'Invalid file path' });
    return;
  }

  const fullPath = path.join(rootDir, ...filePath);

  console.log('Attempting to serve file:', fullPath);

  try {
    if (!fs.existsSync(fullPath)) {
      console.log('File not found:', fullPath);
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const fileContent = fs.readFileSync(fullPath);
    const ext = path.extname(fullPath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
    }

    res.setHeader('Content-Type', contentType);
    res.status(200).send(fileContent);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
