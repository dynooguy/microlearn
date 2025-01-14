import { Course } from '../types';

export const courses: Course[] = [
  {
    id: 'chatgpt-prompting',
    title: 'ChatGPT Prompting Strategien',
    description: 'Lernen Sie effektive Techniken für die Kommunikation mit ChatGPT und erstellen Sie bessere Prompts für optimale Ergebnisse.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    level: 'starter',
    access: 'free',
    modules: [
      {
        id: 'basics',
        title: 'Grundlagen des Promptings',
        description: 'Verstehen Sie die Grundprinzipien effektiver Prompts',
        lessons: [
          {
            id: 'intro',
            title: 'Einführung in Prompting',
            description: 'Lernen Sie die Basics der Kommunikation mit ChatGPT',
            duration: 10,
            completed: false,
            content: `
# Einführung in Prompting

## Was ist Prompting?
- Die Kunst der effektiven Kommunikation mit KI
- Grundlegende Prinzipien der Prompt-Erstellung
- Bedeutung präziser Anweisungen

## Warum ist gutes Prompting wichtig?
1. Bessere Antwortqualität
2. Zeitersparnis durch präzise Anfragen
3. Vermeidung von Missverständnissen

Prompting ist der Schlüssel zur erfolgreichen Nutzung von ChatGPT!
            `,
            quiz: {
              question: "Was ist der Hauptvorteil von gutem Prompting?",
              options: [
                "Schnellere Antworten von ChatGPT",
                "Bessere Qualität der Antworten",
                "Weniger Serverauslastung",
                "Günstigere API-Kosten"
              ],
              correctAnswer: 1
            }
          },
          {
            id: 'structure',
            title: 'Struktur eines guten Prompts',
            description: 'Die wichtigsten Elemente erfolgreicher Prompts',
            duration: 15,
            completed: false,
            content: `
# Struktur eines guten Prompts

## Kernelemente
- Klarer Kontext
- Spezifische Anweisungen
- Gewünschtes Format

## Best Practices
1. Präzise Formulierungen verwenden
2. Beispiele bereitstellen
3. Erwartetes Ergebnis definieren

Die richtige Struktur ist entscheidend für erfolgreiche Prompts.
            `,
            quiz: {
              question: "Welches Element gehört NICHT zu einem guten Prompt?",
              options: [
                "Klarer Kontext",
                "Spezifische Anweisungen",
                "Technische Details zur KI",
                "Gewünschtes Format"
              ],
              correctAnswer: 2
            }
          }
        ]
      },
      {
        id: 'advanced',
        title: 'Fortgeschrittene Techniken',
        description: 'Erweiterte Strategien für bessere Ergebnisse',
        lessons: [
          {
            id: 'chain',
            title: 'Prompt Chaining',
            description: 'Verketten Sie Prompts für komplexe Aufgaben',
            duration: 20,
            completed: false,
            content: `
# Prompt Chaining

## Was ist Prompt Chaining?
- Verkettung mehrerer Prompts
- Aufbau komplexer Gespräche
- Schrittweise Verfeinerung

## Anwendungsbeispiele
1. Textanalyse und -überarbeitung
2. Mehrstufige Problemlösung
3. Iterative Verbesserung

Nutzen Sie Prompt Chaining für anspruchsvolle Aufgaben.
            `,
            quiz: {
              question: "Wofür ist Prompt Chaining am besten geeignet?",
              options: [
                "Einfache Ja/Nein-Fragen",
                "Komplexe, mehrstufige Aufgaben",
                "Einzelne Definitionen",
                "Kurze Übersetzungen"
              ],
              correctAnswer: 1
            }
          }
        ]
      }
    ]
  },
  {
    id: 'chatgpt-legal',
    title: 'Rechtliche Aspekte von ChatGPT',
    description: 'Verstehen Sie die rechtlichen Rahmenbedingungen und Datenschutzaspekte bei der Nutzung von ChatGPT in Deutschland.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800',
    level: 'advanced',
    access: 'paid',
    modules: [
      {
        id: 'privacy',
        title: 'Datenschutz und DSGVO',
        description: 'Datenschutzrechtliche Anforderungen bei der ChatGPT-Nutzung',
        lessons: [
          {
            id: 'basics-privacy',
            title: 'Grundlagen des Datenschutzes',
            description: 'DSGVO-Konformität bei der KI-Nutzung',
            duration: 25,
            completed: false,
            content: `
# Datenschutz bei ChatGPT

## DSGVO-Grundlagen
- Personenbezogene Daten
- Verarbeitungsgrundsätze
- Rechtmäßigkeit der Verarbeitung

## Praktische Umsetzung
1. Datensparsamkeit
2. Zweckbindung
3. Dokumentationspflichten

Datenschutz ist bei der KI-Nutzung unverzichtbar.
            `,
            quiz: {
              question: "Was ist ein wichtiger Grundsatz der DSGVO?",
              options: [
                "Maximale Datensammlung",
                "Datensparsamkeit",
                "Unbegrenzte Speicherung",
                "Globale Weitergabe"
              ],
              correctAnswer: 1
            }
          },
          {
            id: 'compliance',
            title: 'Compliance-Anforderungen',
            description: 'Rechtliche Anforderungen im Unternehmenskontext',
            duration: 30,
            completed: false,
            content: `
# Compliance bei ChatGPT

## Rechtliche Rahmenbedingungen
- Unternehmensrichtlinien
- Branchenspezifische Vorschriften
- Dokumentationspflichten

## Implementierung
1. Richtlinien erstellen
2. Mitarbeiter schulen
3. Kontrollen einführen

Compliance sichert die rechtskonforme KI-Nutzung.
            `,
            quiz: {
              question: "Was ist für die Compliance besonders wichtig?",
              options: [
                "Schnelle Implementation",
                "Kosteneinsparung",
                "Dokumentation",
                "Marketing"
              ],
              correctAnswer: 2
            }
          }
        ]
      }
    ]
  }
];