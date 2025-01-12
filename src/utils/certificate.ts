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

  // Set up the document
  doc.setFont('helvetica', 'normal');
  
  // Add certificate title
  doc.setFontSize(40);
  doc.text('Zertifikat', doc.internal.pageSize.width / 2, 40, { align: 'center' });

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

  // Add completion date
  doc.setFontSize(14);
  doc.text(
    `Abgeschlossen am ${completionDate}`,
    doc.internal.pageSize.width / 2,
    160,
    { align: 'center' }
  );

  return doc.output('arraybuffer');
}