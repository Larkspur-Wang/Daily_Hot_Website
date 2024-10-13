import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API handler called');
  const { path: filePath } = req.query;
  const websiteDir = path.join(serverRuntimeConfig.PROJECT_ROOT, 'website');
  
  console.log('Requested file path:', filePath);
  console.log('Website directory:', websiteDir);
  console.log('SERVER_RUNTIME_CONFIG:', serverRuntimeConfig);

  if (!filePath || typeof filePath === 'string') {
    console.log('Invalid file path');
    res.status(400).json({ error: 'Invalid file path' });
    return;
  }

  const fullPath = path.join(websiteDir, ...filePath);
  console.log('Full file path:', fullPath);

  // 检查 websiteDir 是否存在
  if (!fs.existsSync(websiteDir)) {
    console.log('Website directory does not exist');
    res.status(500).json({ error: 'Website directory not found' });
    return;
  }

  // 列出 websiteDir 中的文件
  try {
    console.log('Files in website directory:', fs.readdirSync(websiteDir));
  } catch (error) {
    console.error('Error reading website directory:', error);
  }

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
  } catch (error: unknown) {
    console.error('Error reading file:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: 'Internal server error', details: error.message, stack: error.stack });
    } else {
      res.status(500).json({ error: 'Internal server error', details: 'Unknown error occurred' });
    }
  }
}
