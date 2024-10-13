"use client";

import { useState, useEffect } from 'react';
import { getLatestFile } from '@/lib/htmlUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
  const [htmlFiles, setHtmlFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    fetch('/api/html-files')
      .then(res => res.json())
      .then(data => {
        setHtmlFiles(data.files);
        const latestFile = getLatestFile(data.files);
        if (latestFile) {
          setSelectedFile(latestFile);
          loadHtmlContent(latestFile);
        }
      });
  }, []);

  const loadHtmlContent = (filename: string) => {
    fetch(`/website/${filename}`)
      .then(res => res.text())
      .then(content => setHtmlContent(content));
  };

  const handleFileChange = (value: string) => {
    setSelectedFile(value);
    loadHtmlContent(value);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dynamic HTML Loader</h1>
      <Select onValueChange={handleFileChange} value={selectedFile || undefined}>
        <SelectTrigger className="w-full mb-4">
          <SelectValue placeholder="Select an HTML file" />
        </SelectTrigger>
        <SelectContent>
          {htmlFiles.map(file => (
            <SelectItem key={file} value={file}>{file}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="border p-4 rounded-lg">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </div>
  );
}