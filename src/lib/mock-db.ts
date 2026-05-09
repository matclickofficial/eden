"use client";

// Simple mock database using localStorage to "link" Admin and Client panels in Demo mode
const IS_SERVER = typeof window === 'undefined';

const DEFAULT_APPLICATIONS = [
  {
    id: "EDEN-482910",
    service: "Work Permit",
    submitted: "May 1, 2026",
    status: "in_progress",
    current_stage: "BIOMETRICS",
    timeline: [
      { step: "Application Received",     date: "May 1, 2026",  done: true },
      { step: "Document Verification",    date: "May 3, 2026",  done: true },
      { step: "Review in Progress",       date: "May 5, 2026",  done: true },
      { step: "Biometric Verification",   date: "Ongoing",      done: false, active: true },
    ],
    note: "Your application is ready for biometrics. Please use your mobile device to complete the identity verification.",
  },
];

const DEFAULT_QUESTIONS = [
  "What is the primary purpose of your travel to the destination country?",
  "How will you support yourself financially during your stay?",
  "Tell me about your previous work experience and qualifications.",
  "Do you have any family members currently residing at the destination?",
  "What are your long-term plans after your initial visa period ends?"
];

export const mockDb = {
  getApplications: () => {
    if (IS_SERVER) return DEFAULT_APPLICATIONS;
    const stored = localStorage.getItem('demo_applications');
    return stored ? JSON.parse(stored) : DEFAULT_APPLICATIONS;
  },

  getInterviewQuestions: () => {
    if (IS_SERVER) return DEFAULT_QUESTIONS;
    const stored = localStorage.getItem('demo_questions');
    return stored ? JSON.parse(stored) : DEFAULT_QUESTIONS;
  },

  updateInterviewQuestions: (questions: string[]) => {
    if (IS_SERVER) return;
    localStorage.setItem('demo_questions', JSON.stringify(questions));
    window.dispatchEvent(new Event('storage'));
  },

  updateApplication: (id: string, stage: string, note: string) => {
    if (IS_SERVER) return;
    const apps = mockDb.getApplications();
    const updated = apps.map((app: any) => {
      if (app.id === id || id.includes(app.id.split('-')[1])) {
        // Add to timeline
        const newTimeline = [...app.timeline.map((t: any) => ({ ...t, active: false }))];
        newTimeline.push({
          step: stage.replace(/_/g, ' '),
          date: new Date().toLocaleDateString(),
          done: false,
          active: true
        });
        
        return {
          ...app,
          current_stage: stage.replace(/_/g, ' '),
          status: stage === 'completed' ? 'completed' : 'in_progress',
          note: note || app.note,
          timeline: newTimeline
        };
      }
      return app;
    });
    localStorage.setItem('demo_applications', JSON.stringify(updated));
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
  },

  reset: () => {
    if (IS_SERVER) return;
    localStorage.removeItem('demo_applications');
  }
};
