'use client'

import { HelpCircle, MessageCircle, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I upload resumes?",
      answer: "Navigate to the Upload page from the sidebar. You can upload PDF files by clicking the upload area or dragging and dropping files."
    },
    {
      question: "How does the AI matching work?",
      answer: "Our AI uses RAG (Retrieval Augmented Generation) technology to analyze resumes against job requirements, providing match scores based on skills, experience, and qualifications."
    },
    {
      question: "How do I create a job posting?",
      answer: "Go to the Search page (Jobs) and click 'Create Job'. Fill in the job details and requirements, then click 'Match All Resumes' to find candidates."
    },
    {
      question: "What do the match scores mean?",
      answer: "Match scores range from 0-100%. Green (70%+) indicates excellent match, yellow (40-69%) indicates good match, and red (<40%) indicates poor match."
    },
    {
      question: "Can I download matched resumes?",
      answer: "Yes, click on any matched candidate's resume to view and download it."
    }
  ]

  return (
    <div className="space-y-8 max-w-screen-cl mx-auto p-6 min-h-screen">
      <div>
        <h1 className="text-4xl font-bold text-text-primary">
          Help & Support
        </h1>
        <p className="text-text-secondary mt-1">
          Frequently asked questions and guides
        </p>
      </div>

      <div className="bg-primary-bg rounded-3xl shadow-sm border border-border/30 p-6">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-text-primary">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="pb-6 border-b border-border/30 last:border-0 last:pb-0">
              <h3 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-text-tertiary" />
                {faq.question}
              </h3>
              <p className="text-text-secondary pl-6">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary-bg rounded-3xl shadow-sm border border-border/30 p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-2">
                Need More Help?
              </h2>
              <p className="text-text-secondary">
                Can't find what you're looking for? Contact our support team for assistance.
              </p>
            </div>
          </div>
          <Button 
          variant="default"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  )
}
