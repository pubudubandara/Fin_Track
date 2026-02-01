import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState({ login: false, signup: false });

  const financialCards = [
    {
      title: "Smart Budgeting",
      description: "Create and manage budgets with intelligent suggestions",
      icon: "💰",
      points: [
        "Automated expense categorization",
        "Real-time budget tracking",
        "Predictive spending alerts"
      ]
    },
    {
      title: "Investment Insights",
      description: "Track and optimize your investment portfolio",
      icon: "📈",
      points: [
        "Portfolio performance analysis",
        "Market trend predictions",
        "Risk assessment tools"
      ]
    },
    {
      title: "Financial Reports",
      description: "Comprehensive financial reports and analytics",
      icon: "📊",
      points: [
        "Customizable report generation",
        "Year-over-year comparisons",
        "Tax optimization insights"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed top-0 left-0 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="fixed top-0 right-0 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="fixed bottom-0 left-1/2 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6 animate-slide-up">
            Welcome to <span className="text-primary animate-pulse animation-delay-4000">FinTrack Pro</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-10 animate-slide-up animation-delay-300">
            The ultimate platform for intelligent financial tracking and wealth management
          </p>
          
          {/* Animated Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-slide-up animation-delay-500">
            <button
              className={`px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform ${
                isHovered.login 
                  ? 'scale-105 bg-primary-dark shadow-2xl' 
                  : 'bg-primary shadow-lg hover:animate-pulse'
              } text-white hover:shadow-xl`}
              onMouseEnter={() => setIsHovered(prev => ({ ...prev, login: true }))}
              onMouseLeave={() => setIsHovered(prev => ({ ...prev, login: false }))}
              onClick={() => navigate("/login")}
            >
              <span className="flex items-center justify-center gap-2">
                <span className={`transition-all duration-300 ${isHovered.login ? 'translate-x-1 animate-ping animation-delay-4000' : ''}`}>
                  →
                </span>
                <span>Login to Dashboard</span>
              </span>
            </button>
            
            <button
              className={`px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform ${
                isHovered.signup 
                  ? 'scale-105 bg-white border-2 border-primary shadow-2xl' 
                  : 'bg-white border-2 border-primary shadow-lg hover:animate-pulse'
              } text-primary hover:shadow-xl`}
              onMouseEnter={() => setIsHovered(prev => ({ ...prev, signup: true }))}
              onMouseLeave={() => setIsHovered(prev => ({ ...prev, signup: false }))}
              onClick={() => navigate("/register")}
            >
              <span className="flex items-center justify-center gap-2">
                <span>Get Started Free</span>
                <span className={`transition-all duration-300 ${isHovered.signup ? 'translate-x-1 animate-ping animation-delay-4000' : ''}`}>
                  →
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {financialCards.map((card, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl border border-primary/10 animate-slide-up ${
                index === 0 ? 'animation-delay-700' : 
                index === 1 ? 'animation-delay-900' : 'animation-delay-1100'
              }`}
            >
              <div className="text-5xl mb-6 text-center ">{card.icon}</div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4 text-center">
                {card.title}
              </h3>
              <p className="text-neutral-600 mb-6 text-center">
                {card.description}
              </p>
              <ul className="space-y-3">
                {card.points.map((point, idx) => (
                  <li 
                    key={idx}
                    className="flex items-center gap-3 text-neutral-700 animate-fade-in"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-12 text-white animate-slide-up animation-delay-1300">
          <h2 className="text-4xl font-bold mb-6 animate-pulse animation-delay-4000">
            Join 10,000+ Financial Enthusiasts
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start your journey to financial freedom today
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="text-3xl font-bold">$5M+</div>
              <div className="text-primary-light/80">Assets Managed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-primary-light/80">Real-time Tracking</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">99%</div>
              <div className="text-primary-light/80">User Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-neutral-50 py-12 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-neutral-900 mb-6 animate-slide-up">
            Ready to Transform Your Financial Future?
          </h3>
          <button
            className="px-10 py-4 bg-gradient-to-r from-success to-success-dark text-white text-xl font-bold rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse"
            onClick={() => navigate("/register")}
          >
            🚀 Start Your Free Trial Now
          </button>
          <p className="text-neutral-500 mt-4 animate-fade-in">
            No credit card required • 30-day free trial
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;