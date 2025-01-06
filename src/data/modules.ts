import { Module } from '../types';

export const modules: Module[] = [
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
# Welcome to MicroLearn!

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
      },
    ],
  },
];