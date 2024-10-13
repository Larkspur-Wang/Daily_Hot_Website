import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const websiteDir = path.join(process.cwd(), 'website');
  
  try {
    const files = fs.readdirSync(websiteDir).filter(file => file.endsWith('.html'));
    res.status(200).json({ files });
  } catch (error) {
    console.error('Error reading website directory:', error);
    res.status(500).json({ error: 'Unable to read HTML files' });
  }
}