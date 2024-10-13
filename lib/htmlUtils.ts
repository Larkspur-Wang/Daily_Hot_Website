export function parseDate(filename: string): Date | null {
  const match = filename.match(/(\d{4}-\d{2}-\d{2})/);
  return match ? new Date(match[1]) : null;
}

export function getLatestFile(files: string[]): string | null {
  return files.reduce((latest, current) => {
    const latestDate = parseDate(latest);
    const currentDate = parseDate(current);
    if (!latestDate) return current;
    if (!currentDate) return latest;
    return currentDate > latestDate ? current : latest;
  }, '');
}
