import React from 'react';
import { Star } from 'lucide-react';
import { CelebrationElements } from '../ui/CelebrationElements';

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Entrepreneur",
      content: "The AI coach feels like having a personal mentor. It's helped me stay focused and achieve my business goals faster than ever.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      content: "This platform transformed how I approach goal setting. The daily and weekly tracking keeps me accountable.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    },
    {
      name: "Emily Rodriguez",
      role: "Life Coach",
      content: "I recommend this to all my clients. The AI insights are surprisingly profound and helpful.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
    }
  ];

  return (
    <div className="relative py-24 overflow-hidden">
      <CelebrationElements />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Built for achievers like you
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of successful users achieving their goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="achievement-card relative bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-primary-100 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary-500 text-primary-500" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">{testimonial.content}</p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}