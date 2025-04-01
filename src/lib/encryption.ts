export function generateAccessCode(): string {
  // Generate a random string of 8 characters
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(
    { length: 8 },
    () => chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
}

export function encryptLessonIds(lessonIds: string[]): string {
  try {
    const data = JSON.stringify(lessonIds);
    return btoa(data);
  } catch (error) {
    console.error('Error encrypting lesson IDs:', error);
    throw new Error('Failed to encrypt lesson IDs');
  }
}

export function decryptLessonIds(code: string): string[] {
  try {
    const data = atob(code);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error decrypting lesson IDs:', error);
    throw new Error('Invalid access code');
  }
}