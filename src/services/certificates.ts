import { jsPDF } from 'jspdf';
import type { Course } from '../types/seatable';

interface CertificateData {
  courseName: string;
  courseLevel: string;
  fullName: string;
  completionDate: string;
  totalLessons: number;
  totalDuration: number;
  description: string;
}

export async function generateCertificate(course: Course, fullName?: string) {
  // Calculate course statistics
  const totalLessons = course.Kapitel.reduce(
    (sum, chapter) => sum + chapter.Lektionen.length,
    0
  );
  
  const totalDuration = course.Kapitel.reduce(
    (sum, chapter) => 
      sum + chapter.Lektionen.reduce(
        (chapterSum, lesson) => chapterSum + lesson.azCf,
        0
      ),
    0
  );

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
    totalLessons,
    totalDuration,
    description: course['6lhR']
  };

  // Add background color
  doc.setFillColor(249, 250, 251); // Light gray background
  doc.rect(0, 0, 297, 210, 'F');

  // Add decorative border
  doc.setDrawColor(79, 70, 229); // Indigo border
  doc.setLineWidth(1);
  doc.rect(10, 10, 277, 190);
  doc.rect(12, 12, 273, 186); // Double border effect

  // Add decorative elements
  doc.setDrawColor(79, 70, 229); // Indigo color
  doc.setLineWidth(2);
  doc.line(20, 40, 277, 40);
  doc.line(20, 170, 277, 170);

  // Set fonts and colors
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39); // Dark gray text

  // Add title
  doc.setFontSize(40);
  doc.text('Zertifikat', 148.5, 30, { align: 'center' });

  // Add content
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('Hiermit wird bestätigt, dass', 148.5, 55, { align: 'center' });
  
  // Add participant name if available
  if (certificateData.fullName) {
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(certificateData.fullName, 148.5, 70, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('den Kurs', 148.5, 85, { align: 'center' });
  } else {
    doc.text('der Kurs', 148.5, 70, { align: 'center' });
  }

  // Add course name
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(certificateData.courseName, 148.5, 100, { align: 'center' });

  // Add course description
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const descriptionLines = doc.splitTextToSize(certificateData.description, 200);
  doc.text(descriptionLines, 148.5, 115, { align: 'center' });

  // Add course details
  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');
  doc.text('erfolgreich abgeschlossen hat.', 148.5, 135, { align: 'center' });

  // Add course statistics
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text([
    `Level: ${certificateData.courseLevel}       Anzahl der Lektionen: ${certificateData.totalLessons}       Gesamtdauer: ${certificateData.totalDuration} Minuten`
  ], 148.5, 160, { align: 'center', lineHeightFactor: 1.5 });

  // Add date
  doc.setFontSize(10);
  doc.text(`Abschlussdatum: ${certificateData.completionDate}`, 148.5, 185, { align: 'center' });

  // Add imprint
  doc.text(`Kursanbieter: ADLX GmbH, Beutnitzer Str. 15, 07749 Jena`, 148.5, 190, { align: 'center' });

  // Save the PDF
  doc.save(`Zertifikat-${course.LVxv.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`);
}