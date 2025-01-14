import { jsPDF } from 'jspdf';
import { Course } from '../types';

export async function generateCertificatePDF(
  course: Course,
  email: string,
  completionDate: string
): Promise<Uint8Array> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Calculate course statistics
  const totalDuration = course.modules.reduce(
    (acc, module) => acc + module.lessons.reduce((sum, lesson) => sum + lesson.duration, 0),
    0
  );
  const totalModules = course.modules.length;
  const totalLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0
  );

  try {
    // Set up the document
    doc.setFont('helvetica', 'normal');
    
    // Add certificate border
    doc.setDrawColor(102, 102, 102); // #666666
    doc.setLineWidth(1);
    doc.rect(10, 10, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20);
    
    // Add decorative corners
    doc.setLineWidth(0.5);
    // Top left
    doc.line(10, 20, 30, 20);
    doc.line(20, 10, 20, 30);
    // Top right
    doc.line(doc.internal.pageSize.width - 30, 20, doc.internal.pageSize.width - 10, 20);
    doc.line(doc.internal.pageSize.width - 20, 10, doc.internal.pageSize.width - 20, 30);
    // Bottom left
    doc.line(10, doc.internal.pageSize.height - 20, 30, doc.internal.pageSize.height - 20);
    doc.line(20, doc.internal.pageSize.height - 30, 20, doc.internal.pageSize.height - 10);
    // Bottom right
    doc.line(doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 20, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 20);
    doc.line(doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 30, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);

    // Load and add ADLX logo
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Create an image element
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Enable CORS
      
      // Wait for image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = 'https://www.adlx.de/images/Logo_ADLX_schwarz-gelb.png';
      });

      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image to canvas
      ctx.drawImage(img, 0, 0);

      // Get base64 data
      const base64data = canvas.toDataURL('image/png');

      // Calculate dimensions to maintain aspect ratio and fit width
      const maxWidth = 50; // mm
      const aspectRatio = img.width / img.height;
      const width = maxWidth;
      const height = width / aspectRatio;
      
      // Center the logo horizontally
      const x = (doc.internal.pageSize.width - width) / 2;
      
      // Add the logo
      doc.addImage(
        base64data,
        'PNG',
        x,
        15, // y position
        width,
        height
      );
    } catch (error) {
      console.warn('Failed to load ADLX logo, using text fallback:', error);
      doc.setFontSize(24);
      doc.setTextColor(0, 0, 0);
      doc.text('ADLX', doc.internal.pageSize.width / 2, 25, { align: 'center' });
    }

    // Add certificate title
    doc.setFontSize(40);
    doc.setTextColor(102, 102, 102); // #666666
    doc.text('Zertifikat', doc.internal.pageSize.width / 2, 50, { align: 'center' });

    // Add completion text
    doc.setFontSize(16);
    doc.text(
      `Hiermit wird bestätigt, dass`,
      doc.internal.pageSize.width / 2,
      70,
      { align: 'center' }
    );

    // Add user email
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(email, doc.internal.pageSize.width / 2, 85, { align: 'center' });

    // Add course completion text
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `erfolgreich den Kurs`,
      doc.internal.pageSize.width / 2,
      100,
      { align: 'center' }
    );

    // Add course title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(course.title, doc.internal.pageSize.width / 2, 115, { align: 'center' });

    // Add course description
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const description = doc.splitTextToSize(course.description, 200);
    doc.text(description, doc.internal.pageSize.width / 2, 130, { align: 'center' });

    // Add course statistics
    doc.setFontSize(14);
    const statsY = 150;
    doc.text(
      [
        `Kursdauer: ${totalDuration} Minuten`,
        `${totalModules} Abschnitte mit insgesamt ${totalLessons} Lektionen`
      ],
      doc.internal.pageSize.width / 2,
      statsY,
      { align: 'center' }
    );

    // Add completion date
    doc.text(
      `Abgeschlossen am ${completionDate}`,
      doc.internal.pageSize.width / 2,
      170,
      { align: 'center' }
    );

    // Add footer with ADLX GmbH branding
    doc.setFontSize(10);
    doc.text(
      'Ein Zertifikat der ADLX GmbH',
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 15,
      { align: 'center' }
    );

    return doc.output('arraybuffer');
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw new Error('Fehler beim Erstellen des Zertifikats');
  }
}