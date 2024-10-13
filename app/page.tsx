"use client";

import React, { useEffect, useState, useRef } from 'react';
import { getLatestFile } from '@/lib/htmlUtils';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetch('/api/html-files')
      .then(res => res.json())
      .then(data => {
        const latestFile = getLatestFile(data.files);
        if (latestFile) {
          loadHtmlContent(latestFile);
        } else {
          console.error('No latest file found');
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error('Error fetching files:', error);
        setIsLoading(false);
      });
  }, []);

  const loadHtmlContent = (filename: string) => {
    if (iframeRef.current) {
      iframeRef.current.src = `/website/${filename}`;
      iframeRef.current.onload = () => setIsLoading(false);
    }
  };

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
