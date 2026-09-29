import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface DelhiLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  baseTemp: number; // in Celsius
  humidity: number; // percentage
  greenCover: 'Low' | 'Medium' | 'High';
  populationDensity: 'High' | 'Very High' | 'Moderate';
}

export const DELHI_HEAT_ZONES: DelhiLocation[] = [
  { id: 'cp', name: 'Connaught Place (Central Delhi)', lat: 28.6280, lng: 77.2090, baseTemp: 44.5, humidity: 35, greenCover: 'Low', populationDensity: 'Very High' },
  { id: 'kb', name: 'Karol Bagh (West Delhi)', lat: 28.6519, lng: 77.1906, baseTemp: 45.2, humidity: 32, greenCover: 'Low', populationDensity: 'Very High' },
  { id: 'rk', name: 'Rohini (North-West Delhi)', lat: 28.7495, lng: 77.0565, baseTemp: 43.8, humidity: 40, greenCover: 'Medium', populationDensity: 'High' },
  { id: 'dk', name: 'Dhaula Kuan (South-West)', lat: 28.5919, lng: 77.1667, baseTemp: 42.1, humidity: 45, greenCover: 'High', populationDensity: 'Moderate' },
  { id: 'mv', name: 'Mayur Vihar (East Delhi)', lat: 28.6127, lng: 77.2971, baseTemp: 44.0, humidity: 38, greenCover: 'Medium', populationDensity: 'High' },
  { id: 'okh', name: 'Okhla Industrial Area (South Delhi)', lat: 28.5300, lng: 77.2831, baseTemp: 46.0, humidity: 30, greenCover: 'Low', populationDensity: 'Very High' },
];

/**
 * Calculates a dynamic Heat Risk Score (0-100) based on location stats & custom temperature offsets
 */
export function calculateRiskScore(loc: DelhiLocation, customTempOffset: number = 0): { score: number; level: string; color: string } {
  const effectiveTemp = loc.baseTemp + customTempOffset;
  
  let scoreMultiplier = 1.0;
  if (loc.greenCover === 'Low') scoreMultiplier += 0.2;
  if (loc.populationDensity === 'Very High') scoreMultiplier += 0.25;
  else if (loc.populationDensity === 'High') scoreMultiplier += 0.15;

  const rawScore = (effectiveTemp - 35) * 6 * scoreMultiplier;
  const score = Math.min(Math.max(Math.round(rawScore), 10), 99);

  let level = 'Moderate';
  let color = 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';

  if (score >= 80) {
    level = 'Severe Emergency';
    color = 'text-red-600 bg-red-500/10 border-red-500/20 animate-pulse';
  } else if (score >= 60) {
    level = 'High Risk';
    color = 'text-orange-500 bg-orange-500/10 border-orange-500/20';
  } else if (score >= 40) {
    level = 'Elevated Risk';
    color = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  }

  return { score, level, color };
}

/**
 * Captures a target HTML element by ID and exports it as a formatted PDF action plan
 */
export async function exportDashboardToPDF(elementId: string, locationName: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Export target element with id "${elementId}" not found.`);
    return;
  }

  try {
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.setFontSize(18);
    pdf.text(`Heat Shield AI - Action Plan: ${locationName}`, 14, 20);
    
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

    pdf.addImage(imgData, 'PNG', 14, 35, pdfWidth - 28, pdfHeight > 220 ? 220 : pdfHeight);
    pdf.save(`Heat_Shield_Plan_${locationName.replace(/\s+/g, '_')}.pdf`);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
  }
}