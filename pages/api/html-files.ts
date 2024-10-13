import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Current working directory:', process.cwd());
  console.log('SERVER_RUNTIME_CONFIG:', serverRuntimeConfig);

  // 尝试多个可能的路径
  const possiblePaths = [
    path.join(serverRuntimeConfig.PROJECT_ROOT, 'website'),
    path.join(process.cwd(), 'website'),
    path.join(process.cwd(), '.next', 'standalone', 'website'),
    '/src/website',
    '/app/website',
    './website',
    '../website'
  ];

  console.log('Possible paths:', possiblePaths);

  let websiteDir = '';
  for (const dir of possiblePaths) {
    console.log('Checking directory:', dir);
    if (fs.existsSync(dir)) {
      websiteDir = dir;
      console.log('Website directory found:', websiteDir);
      break;
    }
  }

  if (!websiteDir) {
    console.error('Website directory not found');
    res.status(500).json({ error: 'Website directory not found', checkedPaths: possiblePaths });
    return;
  }

  try {
    const files = fs.readdirSync(websiteDir)
      .filter(file => file.endsWith('.html'));
    console.log('Files in website directory:', files);
    if (files.length === 0) {
      throw new Error('No HTML files found');
    }
    res.status(200).json({ files });
  } catch (error: any) {
    console.error('Error reading website directory:', error);
    res.status(500).json({ error: 'Unable to read HTML files', details: error.message });
  }
}
