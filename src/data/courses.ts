import { Course } from '../types';

export const courses: Course[] = [
  {
    id: 'learning-fundamentals',
    title: 'Learning Fundamentals',
    description: 'Master the art of learning with proven techniques and strategies',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    level: 'starter',
    modules: [
      {
        id: '1',
        title: 'Getting Started',
        description: 'Learn the fundamentals and core concepts',
        lessons: [
          {
            id: '1-1',
            title: 'Introduction',
            description: 'Brief overview of the course',
            duration: 5,
            completed: false,
            content: `
# Welcome to Learning Fundamentals!

In this introductory lesson, we'll cover:
- How the platform works
- Best practices for micro-learning
- Setting up your learning goals

## Key Benefits of Micro-Learning
1. Better retention through bite-sized content
2. Flexible learning at your own pace
3. Immediate application of concepts

Remember: Small steps lead to big achievements!
            `,
            quiz: {
              question: "What is the main benefit of micro-learning?",
              options: [
                "It takes less time to complete courses",
                "Better retention of information",
                "It's cheaper than traditional learning",
                "It requires less effort"
              ],
              correctAnswer: 1
            }
          },
          {
            id: '1-2',
            title: 'Core Concepts',
            description: 'Understanding the basics',
            duration: 10,
            completed: false,
            content: `
# Core Concepts Overview

## Foundation Principles
- Start with fundamentals
- Practice regularly
- Build on existing knowledge

## Learning Strategies
1. Active recall
2. Spaced repetition
3. Practical application

Take your time to understand each concept before moving forward.
            `,
            quiz: {
              question: "Which learning strategy involves testing yourself on material you've learned?",
              options: [
                "Spaced repetition",
                "Active recall",
                "Practical application",
                "Knowledge building"
              ],
              correctAnswer: 1
            }
          },
        ],
      },
      {
        id: '2',
        title: 'Advanced Topics',
        description: 'Dive deeper into advanced concepts',
        lessons: [
          {
            id: '2-1',
            title: 'Advanced Techniques',
            description: 'Master advanced strategies',
            duration: 15,
            completed: false,
            content: `
# Advanced Learning Techniques

## Deep Dive Topics
1. Metacognition
2. Learning Transfer
3. Pattern Recognition

## Implementation Steps
- Identify knowledge gaps
- Create learning roadmaps
- Track progress systematically

These techniques will help accelerate your learning journey.
            `,
            quiz: {
              question: "What is metacognition?",
              options: [
                "The ability to memorize information quickly",
                "The process of learning new skills",
                "Thinking about one's own thinking",
                "A method of organizing notes"
              ],
              correctAnswer: 2
            }
          },
          {
            id: '2-2',
            title: 'Best Practices',
            description: 'Learn industry best practices',
            duration: 10,
            completed: false,
            content: `
# Best Practices Guide

## Key Principles
1. Consistency is key
2. Quality over quantity
3. Regular review cycles

## Implementation Tips
- Set clear goals
- Create a study schedule
- Monitor your progress
- Adjust as needed

Follow these practices for optimal results.
            `,
            quiz: {
              question: "Which of these is NOT mentioned as a key principle in the lesson?",
              options: [
                "Consistency is key",
                "Quality over quantity",
                "Regular review cycles",
                "Speed over accuracy"
              ],
              correctAnswer: 3
            }
          },
        ],
      },
    ],
  },
  {
    id: 'web-development',
    title: 'Web Development Essentials',
    description: 'Learn modern web development from the ground up',
    image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&q=80&w=800',
    level: 'advanced',
    modules: [
      {
        id: 'web-1',
        title: 'HTML & CSS Basics',
        description: 'Master the building blocks of the web',
        lessons: [
          {
            id: 'web-1-1',
            title: 'HTML Fundamentals',
            description: 'Learn the basics of HTML markup',
            duration: 10,
            completed: false,
            content: `
# HTML Fundamentals

## Core Concepts
- Document structure
- Semantic elements
- Accessibility basics

## Essential Elements
1. Headings and paragraphs
2. Lists and tables
3. Forms and inputs

Practice writing clean, semantic HTML for better accessibility.
            `,
            quiz: {
              question: "What is the main purpose of semantic HTML elements?",
              options: [
                "To make the code look prettier",
                "To provide meaning and structure to content",
                "To improve website loading speed",
                "To add visual styles"
              ],
              correctAnswer: 1
            }
          },
          {
            id: 'web-1-2',
            title: 'CSS Styling',
            description: 'Style your web pages with CSS',
            duration: 15,
            completed: false,
            content: `
# CSS Styling Guide

## Basic Concepts
- Selectors and specificity
- Box model
- Layout systems

## Styling Techniques
1. Colors and typography
2. Flexbox and Grid
3. Responsive design

Master these fundamentals for beautiful web pages.
            `,
            quiz: {
              question: "Which CSS layout system is best suited for two-dimensional layouts?",
              options: [
                "Flexbox",
                "Float",
                "Grid",
                "Position"
              ],
              correctAnswer: 2
            }
          },
        ],
      },
    ],
  },
];