import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Serve static handler called');
  const { path: filePath } = req.query;
  const rootDir = process.cwd();
  
  console.log('Query path:', filePath);
  console.log('Root directory:', rootDir);

  if (!filePath || typeof filePath === 'string') {
    console.log('Invalid file path');
    res.status(400).json({ error: 'Invalid file path' });
    return;
  }

  const fullPath = path.join(rootDir, '.next', 'standalone', ...filePath);
  console.log('Full file path:', fullPath);

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

    console.log('Content type:', contentType);
    console.log('File size:', fileContent.length);

    res.setHeader('Content-Type', contentType);
    res.status(200).send(fileContent);
    console.log('File sent successfully');
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
  }
}
