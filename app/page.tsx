"use client";

import React, { useEffect, useState, useRef } from 'react';
import { getLatestFile } from '@/lib/htmlUtils';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetch('/api/html-files')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (!data.files || data.files.length === 0) {
          throw new Error('No HTML files found');
        }
        const latestFile = getLatestFile(data.files);
        if (latestFile) {
          loadHtmlContent(latestFile);
        } else {
          throw new Error('No latest file found');
        }
      })
      .catch(error => {
        console.error('Error fetching files:', error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const loadHtmlContent = (filename: string) => {
    if (iframeRef.current) {
      iframeRef.current.src = `/website/${filename}`;
      iframeRef.current.onload = () => setIsLoading(false);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      {isLoading && <div>Loading...</div>}
      <iframe
        ref={iframeRef}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Content"
      />
    </div>
  );
}
