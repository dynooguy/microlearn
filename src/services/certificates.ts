import { jsPDF } from 'jspdf';
import type { Course } from '../types/seatable';

export async function generateCertificate(course: Course, fullName?: string) {
  // Initialize PDF document
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Set up certificate data
  const certificateData = {
    courseName: course.LVxv,
    courseLevel: course.Rfrz === '840548' ? 'Starter' : course.Rfrz === '194107' ? 'Fortgeschritten' : 'Experte',
    fullName: fullName || '',
    completionDate: new Date().toLocaleDateString('de-DE'),
  };

  // Add background color
  doc.setFillColor(249, 250, 251); // Light gray background
  doc.rect(0, 0, 297, 210, 'F');

  // Add border
  doc.setDrawColor(209, 213, 219); // Gray border
  doc.setLineWidth(1);
  doc.rect(10, 10, 277, 190);

  // Add decorative elements
  doc.setDrawColor(79, 70, 229); // Indigo color
  doc.setLineWidth(2);
  doc.line(20, 30, 277, 30);
  doc.line(20, 180, 277, 180);

  // Set fonts and colors
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39); // Dark gray text

  // Add title
  doc.setFontSize(40);
  doc.text('Zertifikat', 148.5, 50, { align: 'center' });

  // Add content
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('Hiermit wird bestätigt, dass', 148.5, 70, { align: 'center' });
  
  // Add participant name if available
  if (certificateData.fullName) {
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(certificateData.fullName, 148.5, 85, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('den Kurs', 148.5, 100, { align: 'center' });
  } else {
    doc.text('der Kurs', 148.5, 85, { align: 'center' });
  }

  // Add course name
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(certificateData.courseName, 148.5, 115, { align: 'center' });

  // Add level
  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');
  doc.text(`Level: ${certificateData.courseLevel}`, 148.5, 135, { align: 'center' });
  doc.text('erfolgreich abgeschlossen wurde', 148.5, 150, { align: 'center' });

  // Add date
  doc.setFontSize(14);
  doc.setFont('helvetica', 'italic');
  doc.text(`Abschlussdatum: ${certificateData.completionDate}`, 148.5, 170, { align: 'center' });

  // Save the PDF
  doc.save(`Zertifikat-${course.LVxv.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`);
}