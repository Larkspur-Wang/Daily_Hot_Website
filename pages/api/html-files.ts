import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 尝试多个可能的路径
  const possiblePaths = [
    path.join(serverRuntimeConfig.PROJECT_ROOT, 'website'),
    path.join(process.cwd(), 'website'),
    '/src/website',
    '/app/website'
  ];

  let websiteDir = '';
  for (const dir of possiblePaths) {
    if (fs.existsSync(dir)) {
      websiteDir = dir;
      break;
    }
  }

  if (!websiteDir) {
    console.error('Website directory not found');
    res.status(500).json({ error: 'Website directory not found' });
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
