import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const websiteDir = path.join(serverRuntimeConfig.PROJECT_ROOT, 'website');
  
  try {
    const files = fs.readdirSync(websiteDir)
      .filter(file => file.endsWith('.html'));
    console.log('Files in website directory:', files);
    res.status(200).json({ files });
  } catch (error: any) {
    console.error('Error reading website directory:', error);
    res.status(500).json({ error: 'Unable to read HTML files', details: error.message });
  }
}
