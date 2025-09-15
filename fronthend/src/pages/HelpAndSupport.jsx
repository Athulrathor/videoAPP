import React, { useState } from 'react';
import {
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  Book,
  Video,
  Search,
  FileText,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Star,
  ThumbsUp,
  ThumbsDown,
  Bug,
  Shield,
  CreditCard,
  Settings,
  Globe,
  Smartphone,
  Monitor,
  Headphones,
  Eye,
  Upload
} from 'lucide-react';
import { useAppearance } from '../hooks/appearances';

const HelpAndSupport = () => {
  const { appearanceSettings } = useAppearance();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [contactForm, setContactForm] = useState({
    category: 'general',
    subject: '',
    description: '',
    priority: 'medium',
    attachments: []
  });
  const [ticketStatus, setTicketStatus] = useState('');

  // All your existing data arrays remain the same...
  const supportCategories = [
    { id: 'all', name: 'All Topics', icon: HelpCircle, count: 156 },
    { id: 'account', name: 'Account & Billing', icon: CreditCard, count: 28 },
    { id: 'technical', name: 'Technical Issues', icon: Settings, count: 45 },
    { id: 'accessibility', name: 'Accessibility', icon: Eye, count: 22 },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield, count: 18 },
    { id: 'content', name: 'Content & Playback', icon: Video, count: 31 },
    { id: 'mobile', name: 'Mobile Apps', icon: Smartphone, count: 12 }
  ];

  const faqs = [
    {
      id: 1,
      category: 'account',
      question: 'How do I change my password?',
      answer: 'Go to Settings > Privacy & Security > Password. Enter your current password, then your new password twice. Click "Update Password" to save changes.',
      helpful: 24,
      notHelpful: 2
    },
    {
      id: 2,
      category: 'account',
      question: 'How do I cancel my subscription?',
      answer: 'Navigate to Settings > Account > Subscription. Click "Manage Subscription" and follow the cancellation process. Your access will continue until the end of your billing period.',
      helpful: 18,
      notHelpful: 1
    },
    {
      id: 3,
      category: 'technical',
      question: 'Videos won\'t load or keep buffering',
      answer: 'Try these steps: 1) Check your internet connection, 2) Clear browser cache, 3) Disable browser extensions, 4) Try a different browser, 5) Lower video quality in Settings > Accessibility.',
      helpful: 45,
      notHelpful: 3
    },
    {
      id: 4,
      category: 'accessibility',
      question: 'How do I enable closed captions?',
      answer: 'Go to Settings > Accessibility > Captions & Audio and toggle "Closed Captions" on. You can also press "C" while watching a video to toggle captions.',
      helpful: 32,
      notHelpful: 0
    },
    {
      id: 5,
      category: 'privacy',
      question: 'How is my data protected?',
      answer: 'We use industry-standard encryption, secure servers, and strict access controls. Read our full Privacy Policy for detailed information about data collection and protection.',
      helpful: 28,
      notHelpful: 2
    },
    {
      id: 6,
      category: 'content',
      question: 'Why can\'t I find a specific video?',
      answer: 'Content availability may vary by region due to licensing. Try searching with different keywords or check if the content is available in your location.',
      helpful: 15,
      notHelpful: 4
    },
    {
      id: 7,
      category: 'mobile',
      question: 'App crashes on my phone',
      answer: 'Update the app to the latest version, restart your device, clear app cache, or reinstall the app. If issues persist, contact support with your device model and OS version.',
      helpful: 22,
      notHelpful: 3
    },
    {
      id: 8,
      category: 'technical',
      question: 'How do I clear my cache?',
      answer: 'In Chrome: Settings > Privacy & Security > Clear browsing data. In Firefox: Settings > Privacy & Security > Clear Data. Select "Cached images and files" and click Clear.',
      helpful: 38,
      notHelpful: 1
    }
  ];

  const quickActions = [
    {
      id: 'account-recovery',
      title: 'Account Recovery',
      description: 'Recover your account or reset password',
      icon: Shield,
      action: 'Start Recovery'
    },
    {
      id: 'report-bug',
      title: 'Report a Bug',
      description: 'Help us fix technical issues',
      icon: Bug,
      action: 'Report Issue'
    },
    {
      id: 'billing-help',
      title: 'Billing Support',
      description: 'Questions about payments or subscriptions',
      icon: CreditCard,
      action: 'Get Help'
    },
    {
      id: 'accessibility',
      title: 'Accessibility Help',
      description: 'Get assistance with accessibility features',
      icon: Eye,
      action: 'Learn More'
    }
  ];

  const supportChannels = [
    {
      id: 'live-chat',
      name: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: MessageCircle,
      availability: 'Available 24/7',
      avgResponse: '< 2 minutes',
      status: 'online'
    },
    {
      id: 'email',
      name: 'Email Support',
      description: 'Send us a detailed message',
      icon: Mail,
      availability: 'Response within 24 hours',
      avgResponse: '< 4 hours',
      status: 'available'
    },
    {
      id: 'phone',
      name: 'Phone Support',
      description: 'Speak directly with our team',
      icon: Phone,
      availability: 'Mon-Fri 9AM-6PM EST',
      avgResponse: 'Immediate',
      status: 'limited'
    },
    {
      id: 'community',
      name: 'Community Forum',
      description: 'Get help from other users',
      icon: Users,
      availability: 'Always active',
      avgResponse: '< 1 hour',
      status: 'online'
    }
  ];

  const resources = [
    {
      id: 'user-guide',
      title: 'User Guide',
      description: 'Complete guide to using all features',
      icon: Book,
      type: 'PDF',
      size: '2.4 MB'
    },
    {
      id: 'video-tutorials',
      title: 'Video Tutorials',
      description: 'Step-by-step video instructions',
      icon: Video,
      type: 'Playlist',
      size: '45 videos'
    },
    {
      id: 'api-docs',
      title: 'API Documentation',
      description: 'For developers and integrations',
      icon: FileText,
      type: 'Online',
      size: 'Live docs'
    },
    {
      id: 'accessibility-guide',
      title: 'Accessibility Guide',
      description: 'How to use accessibility features',
      icon: Eye,
      type: 'PDF',
      size: '1.8 MB'
    }
  ];

  const recentTickets = [
    {
      id: 'TK-001234',
      subject: 'Video playback issues',
      status: 'resolved',
      priority: 'high',
      created: '2024-08-01',
      lastUpdate: '2024-08-02'
    },
    {
      id: 'TK-001235',
      subject: 'Billing question',
      status: 'in-progress',
      priority: 'medium',
      created: '2024-08-01',
      lastUpdate: '2024-08-02'
    },
    {
      id: 'TK-001236',
      subject: 'Feature request',
      status: 'pending',
      priority: 'low',
      created: '2024-07-30',
      lastUpdate: '2024-07-31'
    }
  ];

  // All your existing functions remain the same...
  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleContactFormSubmit = () => {
    console.log('Submitting contact form:', contactForm);
    setTicketStatus('submitted');
    setContactForm({
      category: 'general',
      subject: '',
      description: '',
      priority: 'medium',
      attachments: []
    });
  };

  const handleFeedback = (faqId, type) => {
    console.log(`Feedback for FAQ ${faqId}: ${type}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-amber-600" />;
      default: return <HelpCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'available': return 'text-blue-600 bg-blue-100';
      case 'limited': return 'text-amber-600 bg-amber-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div
      className="w-4xl p-6 max-sm:p-0 max-md:p-4 overflow-y-auto h-[calc(100vh-65px)] max-md:h-[calc(100vh-53px)] max-xl:w-2xl max-md:w-screen max-[1040px]:w-2xl scrollBar transition-all"
      style={{
        backgroundColor: appearanceSettings.customBackground ? 'transparent' : "var(--color-bg-primary)",
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-family)',
        transitionDuration: 'var(--animation-duration)'
      }}
    >
      {/* Header */}
      <div
        className="mb-6 max-sm:mb-4 max-sm:p-2"
        style={{ marginBottom: 'var(--section-gap)' }}
      >
        <h1
          className="text-3xl max-sm:text-lg font-bold mb-2 flex items-center"
          style={{
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-3xl)',
            fontFamily: 'var(--font-family)'
          }}
        >
          <HelpCircle className="mr-3 h-8 w-8" />
          Help & Support
        </h1>
        <p
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-base)'
          }}
        >
          Get help, find answers, and contact our support team
        </p>
      </div>

      {/* Search Bar */}
      <div
        className="rounded-lg p-6 max-sm:p-2 mb-8 transition-all"
        style={{
          backgroundColor: 'var(--color-bg-tertiary)',
          padding: 'var(--component-padding)',
          marginBottom: 'var(--section-gap)',
          transitionDuration: 'var(--animation-duration)'
        }}
      >
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
            style={{ color: 'var(--color-text-secondary)' }}
          />
          <input
            type="text"
            placeholder="Search for help articles, guides, or common issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-family)',
              transitionDuration: 'var(--animation-duration)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-color)';
              e.target.style.boxShadow = '0 0 0 2px var(--accent-color)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--color-border)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <div
              key={action.id}
              className="p-4 max-sm:p-2 max-sm:mx-2 border rounded-lg cursor-pointer transition-all"
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                borderColor: 'var(--color-border)',
                transitionDuration: 'var(--animation-duration)'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                e.target.style.backgroundColor = 'var(--color-hover)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = 'none';
                e.target.style.backgroundColor = 'var(--color-bg-primary)';
              }}
            >
              <Icon
                className="h-8 w-8 mb-3"
                style={{ color: 'var(--accent-color)' }}
              />
              <h3
                className="font-semibold mb-1"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {action.title}
              </h3>
              <p
                className="text-sm mb-3"
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                {action.description}
              </p>
              <button
                className="text-sm font-medium transition-colors"
                style={{
                  color: 'var(--accent-color)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                {action.action} →
              </button>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-sm:gap-4">
        {/* FAQ Section */}
        <div className="lg:col-span-2">
          <div
            className="rounded-lg p-6 max-sm:p-2 transition-all"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              padding: 'var(--component-padding)',
              transitionDuration: 'var(--animation-duration)'
            }}
          >
            <h2
              className="text-xl font-semibold mb-6 flex items-center"
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-xl)',
                marginBottom: 'var(--component-padding)'
              }}
            >
              <Book className="mr-2 h-5 w-5" />
              Frequently Asked Questions
            </h2>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {supportCategories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center px-3 py-2 rounded-lg text-sm transition-all"
                    style={{
                      backgroundColor: isSelected ? 'var(--accent-color)' : 'var(--color-bg-primary)',
                      color: isSelected ? 'white' : 'var(--color-text-primary)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.target.style.backgroundColor = 'var(--color-hover)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.target.style.backgroundColor = 'var(--color-bg-primary)';
                      }
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {category.name}
                    <span
                      className="ml-2 text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(4px)'
                      }}
                    >
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="border rounded-lg overflow-hidden transition-all"
                  style={{
                    backgroundColor: 'var(--color-bg-primary)',
                    borderColor: 'var(--color-border)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full p-4 text-left flex items-center justify-between transition-colors"
                    style={{
                      backgroundColor: 'transparent',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--color-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <h3
                      className="font-medium"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {faq.question}
                    </h3>
                    {expandedFAQ === faq.id ? (
                      <ChevronDown
                        className="h-5 w-5"
                        style={{ color: 'var(--color-text-secondary)' }}
                      />
                    ) : (
                      <ChevronRight
                        className="h-5 w-5"
                        style={{ color: 'var(--color-text-secondary)' }}
                      />
                    )}
                  </button>

                  {expandedFAQ === faq.id && (
                    <div
                      className="px-4 pb-4"
                      style={{
                        borderTop: '1px solid var(--color-border)',
                        marginTop: '0'
                      }}
                    >
                      <p
                        className="mb-4 mt-4"
                        style={{
                          color: 'var(--color-text-secondary)',
                          fontSize: 'var(--font-size-base)',
                          lineHeight: '1.6'
                        }}
                      >
                        {faq.answer}
                      </p>
                      <div
                        className="flex items-center justify-between pt-3 border-t"
                        style={{ borderColor: 'var(--color-border)' }}
                      >
                        <span
                          className="text-sm"
                          style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--font-size-sm)'
                          }}
                        >
                          Was this helpful?
                        </span>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleFeedback(faq.id, 'helpful')}
                            className="flex items-center text-sm transition-colors"
                            style={{
                              color: 'var(--color-text-secondary)',
                              fontSize: 'var(--font-size-sm)',
                              transitionDuration: 'var(--animation-duration)'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.color = 'var(--color-success)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = 'var(--color-text-secondary)';
                            }}
                          >
                            <ThumbsUp className="mr-1 h-4 w-4" />
                            Yes ({faq.helpful})
                          </button>
                          <button
                            onClick={() => handleFeedback(faq.id, 'not-helpful')}
                            className="flex items-center text-sm transition-colors"
                            style={{
                              color: 'var(--color-text-secondary)',
                              fontSize: 'var(--font-size-sm)',
                              transitionDuration: 'var(--animation-duration)'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.color = 'var(--color-error)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = 'var(--color-text-secondary)';
                            }}
                          >
                            <ThumbsDown className="mr-1 h-4 w-4" />
                            No ({faq.notHelpful})
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-8">
                <Search
                  className="h-12 w-12 mx-auto mb-4"
                  style={{ color: 'var(--color-text-secondary)' }}
                />
                <h3
                  className="text-lg font-medium mb-2"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-lg)'
                  }}
                >
                  No results found
                </h3>
                <p
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-base)'
                  }}
                >
                  Try adjusting your search or browse different categories
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Support Channels */}
        <div className="space-y-6 max-sm:space-y-4">
          <div
            className="rounded-lg max-sm:p-2 p-6 transition-all"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              padding: 'var(--component-padding)',
              transitionDuration: 'var(--animation-duration)'
            }}
          >
            <h2
              className="text-xl font-semibold mb-6 flex items-center"
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-xl)',
                marginBottom: 'var(--component-padding)'
              }}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Contact Support
            </h2>

            <div className="space-y-4">
              {supportChannels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <div
                    key={channel.id}
                    className="p-4 max-sm:p-3 border rounded-lg transition-all"
                    style={{
                      backgroundColor: 'var(--color-bg-primary)',
                      borderColor: 'var(--color-border)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Icon
                          className="h-5 w-5"
                          style={{ color: 'var(--accent-color)' }}
                        />
                        <h3
                          className="font-medium"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {channel.name}
                        </h3>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(channel.status)}`}
                      >
                        {channel.status}
                      </span>
                    </div>
                    <p
                      className="text-sm mb-3"
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-sm)'
                      }}
                    >
                      {channel.description}
                    </p>
                    <div
                      className="text-xs space-y-1 mb-3"
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-xs)'
                      }}
                    >
                      <div>{channel.availability}</div>
                      <div>Avg. response: {channel.avgResponse}</div>
                    </div>
                    <button
                      className="w-full px-4 py-2 text-white rounded-lg transition-all"
                      style={{
                        backgroundColor: 'var(--accent-color)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.opacity = '0.9';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.opacity = '1';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      Start {channel.name}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resources */}
          <div
            className="rounded-lg max-sm:p-2 p-6 transition-all"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              padding: 'var(--component-padding)',
              transitionDuration: 'var(--animation-duration)'
            }}
          >
            <h2
              className="text-xl font-semibold mb-6 flex items-center"
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-xl)',
                marginBottom: 'var(--component-padding)'
              }}
            >
              <FileText className="mr-2 h-5 w-5" />
              Resources
            </h2>

            <div className="space-y-3">
              {resources.map((resource) => {
                const Icon = resource.icon;
                return (
                  <div
                    key={resource.id}
                    className="p-4 max-sm:p-2 border rounded-lg transition-all"
                    style={{
                      backgroundColor: 'var(--color-bg-primary)',
                      borderColor: 'var(--color-border)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon
                          className="h-5 w-5"
                          style={{ color: 'var(--accent-color)' }}
                        />
                        <div>
                          <h3
                            className="font-medium"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {resource.title}
                          </h3>
                          <p
                            className="text-sm"
                            style={{
                              color: 'var(--color-text-secondary)',
                              fontSize: 'var(--font-size-sm)'
                            }}
                          >
                            {resource.description}
                          </p>
                          <div
                            className="text-xs mt-1"
                            style={{
                              color: 'var(--color-text-secondary)',
                              fontSize: 'var(--font-size-xs)'
                            }}
                          >
                            {resource.type} • {resource.size}
                          </div>
                        </div>
                      </div>
                      <button
                        className="p-2 transition-colors"
                        style={{
                          color: 'var(--accent-color)',
                          transitionDuration: 'var(--animation-duration)'
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                        onMouseLeave={(e) => e.target.style.opacity = '1'}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Support Tickets */}
      {recentTickets.length > 0 && (
        <div
          className="rounded-lg p-6 max-sm:p-2 mt-6 transition-all"
          style={{
            backgroundColor: 'var(--color-bg-tertiary)',
            padding: 'var(--component-padding)',
            marginTop: 'var(--section-gap)',
            transitionDuration: 'var(--animation-duration)'
          }}
        >
          <h2
            className="text-xl font-semibold mb-6 flex items-center"
            style={{
              color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-xl)',
              marginBottom: 'var(--component-padding)'
            }}
          >
            <Clock className="mr-2 h-5 w-5" />
            Recent Support Tickets
          </h2>

          <div className="space-y-3 max-sm:space-y-1.5">
            {recentTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 max-sm:p-2 border rounded-lg transition-all"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border)',
                  transitionDuration: 'var(--animation-duration)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 max-sm:space-x-1.5">
                    {getStatusIcon(ticket.status)}
                    <div>
                      <h3
                        className="font-medium flex max-sm:flex-col"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        <span>{ticket.subject}</span>
                        <span
                          className="text-sm max-sm:text-xs"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          #{ticket.id}
                        </span>
                      </h3>
                      <div
                        className="text-sm max-sm:text-xs flex max-sm:flex-col"
                        style={{
                          color: 'var(--color-text-secondary)',
                          fontSize: 'var(--font-size-sm)'
                        }}
                      >
                        <span>Created: {ticket.created}</span>
                        <span className='max-sm:hidden'>•</span>
                        <span>Last update: {ticket.lastUpdate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 max-sm:space-x-1.5">
                    <span
                      className={`px-2 py-1 max-sm:px-1 max-sm:text-xs text-sm rounded-full max-sm:rounded-lg ${ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                          ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                        }`}
                    >
                      {ticket.priority} priority
                    </span>
                    <button
                      className="text-sm max-sm:text-xs font-medium transition-colors"
                      style={{
                        color: 'var(--accent-color)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Form */}
      <div
        className="rounded-lg p-6 max-sm:p-2 mt-8 transition-all"
        style={{
          backgroundColor: 'var(--color-bg-tertiary)',
          padding: 'var(--component-padding)',
          marginTop: 'var(--section-gap)',
          transitionDuration: 'var(--animation-duration)'
        }}
      >
        <h2
          className="text-xl font-semibold mb-6 flex items-center"
          style={{
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-xl)',
            marginBottom: 'var(--component-padding)'
          }}
        >
          <Mail className="mr-2 h-5 w-5" />
          Submit a Support Request
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-sm:gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-sm)'
              }}
            >
              Category
            </label>
            <select
              value={contactForm.category}
              onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family)',
                transitionDuration: 'var(--animation-duration)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-color)';
                e.target.style.boxShadow = '0 0 0 2px var(--accent-color)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="general">General Question</option>
              <option value="technical">Technical Issue</option>
              <option value="billing">Billing & Account</option>
              <option value="accessibility">Accessibility</option>
              <option value="privacy">Privacy & Security</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-sm)'
              }}
            >
              Priority
            </label>
            <select
              value={contactForm.priority}
              onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family)',
                transitionDuration: 'var(--animation-duration)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-color)';
                e.target.style.boxShadow = '0 0 0 2px var(--accent-color)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="low">Low - General inquiry</option>
              <option value="medium">Medium - Standard issue</option>
              <option value="high">High - Urgent problem</option>
              <option value="critical">Critical - Service down</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-sm)'
              }}
            >
              Subject
            </label>
            <input
              type="text"
              value={contactForm.subject}
              onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
              placeholder="Brief description of your issue"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family)',
                transitionDuration: 'var(--animation-duration)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-color)';
                e.target.style.boxShadow = '0 0 0 2px var(--accent-color)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div className="md:col-span-2">
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-sm)'
              }}
            >
              Description
            </label>
            <textarea
              value={contactForm.description}
              onChange={(e) => setContactForm({ ...contactForm, description: e.target.value })}
              placeholder="Please provide detailed information about your issue, including any error messages and steps to reproduce..."
              rows={5}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family)',
                transitionDuration: 'var(--animation-duration)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-color)';
                e.target.style.boxShadow = '0 0 0 2px var(--accent-color)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div className="md:col-span-2">
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-sm)'
              }}
            >
              Attachments
            </label>
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center transition-all"
              style={{
                borderColor: 'var(--color-border)',
                transitionDuration: 'var(--animation-duration)'
              }}
            >
              <Upload
                className="h-8 w-8 mx-auto mb-2"
                style={{ color: 'var(--color-text-secondary)' }}
              />
              <p
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Drop files here or click to upload
              </p>
              <p
                className="text-xs mt-1"
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-xs)'
                }}
              >
                Max file size: 10MB • Supported: PNG, JPG, PDF, TXT
              </p>
            </div>
          </div>
        </div>

        {ticketStatus === 'submitted' && (
          <div
            className="mt-6 p-4 border rounded-lg"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderColor: 'rgba(16, 185, 129, 0.3)'
            }}
          >
            <div className="flex items-center">
              <CheckCircle
                className="h-5 w-5 mr-2"
                style={{ color: 'var(--color-success)' }}
              />
              <span
                className="font-medium"
                style={{ color: 'var(--color-success)' }}
              >
                Support request submitted successfully!
              </span>
            </div>
            <p
              className="text-sm mt-1"
              style={{
                color: 'var(--color-success)',
                fontSize: 'var(--font-size-sm)',
                opacity: '0.8'
              }}
            >
              We'll respond within 24 hours. You'll receive updates via email.
            </p>
          </div>
        )}

        <div className="flex max-md:justify justify-end mt-6">
          <button
            onClick={handleContactFormSubmit}
            disabled={!contactForm.subject || !contactForm.description}
            className="flex items-center px-6 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{
              backgroundColor: 'var(--accent-color)',
              transitionDuration: 'var(--animation-duration)'
            }}
            onMouseEnter={(e) => {
              if (!e.target.disabled) {
                e.target.style.opacity = '0.9';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.target.disabled) {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            <Send className="mr-2 h-4 w-4" />
            Submit Request
          </button>
        </div>
      </div>

      {/* Community & Additional Help */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div
          className="border rounded-lg p-6 max-sm:p-2 transition-all"
          style={{
            backgroundColor: 'var(--color-accent-bg)',
            borderColor: 'var(--accent-color)',
            transitionDuration: 'var(--animation-duration)'
          }}
        >
          <h3
            className="font-semibold mb-2 flex items-center"
            style={{
              color: 'var(--accent-color)',
              fontSize: 'var(--font-size-base)'
            }}
          >
            <Users className="mr-2 h-5 w-5" />
            Community Forum
          </h3>
          <p
            className="text-sm mb-4"
            style={{
              color: 'var(--accent-color)',
              fontSize: 'var(--font-size-sm)',
              opacity: '0.8'
            }}
          >
            Connect with other users, share tips, and get help from the community.
          </p>
          <button
            className="flex items-center font-medium transition-colors"
            style={{
              color: 'var(--accent-color)',
              transitionDuration: 'var(--animation-duration)'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Visit Forum <ExternalLink className="ml-1 h-4 w-4" />
          </button>
        </div>

        <div
          className="border rounded-lg max-sm:p-2 p-6 transition-all"
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            transitionDuration: 'var(--animation-duration)'
          }}
        >
          <h3
            className="font-semibold mb-2 flex items-center"
            style={{
              color: 'var(--color-success)',
              fontSize: 'var(--font-size-base)'
            }}
          >
            <Star className="mr-2 h-5 w-5" />
            Premium Support
          </h3>
          <p
            className="text-sm mb-4"
            style={{
              color: 'var(--color-success)',
              fontSize: 'var(--font-size-sm)',
              opacity: '0.8'
            }}
          >
            Get priority support, phone assistance, and dedicated help from our experts.
          </p>
          <button
            className="flex items-center font-medium transition-colors"
            style={{
              color: 'var(--color-success)',
              transitionDuration: 'var(--animation-duration)'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Upgrade Now <ExternalLink className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default HelpAndSupport;
