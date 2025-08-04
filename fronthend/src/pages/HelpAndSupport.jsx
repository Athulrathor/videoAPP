
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

const HelpAndSupport = () => {
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
    // Reset form
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
    // Handle feedback submission
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
    <div>
      <div className="w-4xl p-6 max-sm:p-0  max-md:p-4 bg-white overflow-y-auto h-[calc(100vh-65px)] max-md:h-[calc(100vh-53px)] max-xl:w-2xl max-md:w-screen max-[1040px]:w-2xl scrollBar">
        {/* Header */}
        <div className="mb-6 max-sm:mb-4 max-sm:p-2">
          <h1 className="text-3xl max-sm:text-lg font-bold text-gray-900 mb-2 flex items-center">
            <HelpCircle className="mr-3 h-8 w-8" />
            Help & Support
          </h1>
          <p className="text-gray-600">Get help, find answers, and contact our support team</p>
        </div>

        {/* Search Bar */}
        <div className="bg-gray-50 rounded-lg p-6 max-sm:p-2 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help articles, guides, or common issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div key={action.id} className="p-4 max-sm:p-2 max-sm:mx-2 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <Icon className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  {action.action} →
                </button>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-sm:gap-4">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-6 max-sm:p-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Book className="mr-2 h-5 w-5" />
                Frequently Asked Questions
              </h2>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {supportCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {category.name}
                      <span className="ml-2 text-xs bg-gray-200 bg-opacity-20 shadow-4xl px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* FAQ List */}
              <div className="space-y-3">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-medium text-gray-900">{faq.question}</h3>
                      {expandedFAQ === faq.id ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </button>

                    {expandedFAQ === faq.id && (
                      <div className="px-4 pb-4">
                        <p className="text-gray-700 mb-4">{faq.answer}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-sm text-gray-600">Was this helpful?</span>
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleFeedback(faq.id, 'helpful')}
                              className="flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
                            >
                              <ThumbsUp className="mr-1 h-4 w-4" />
                              Yes ({faq.helpful})
                            </button>
                            <button
                              onClick={() => handleFeedback(faq.id, 'not-helpful')}
                              className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors"
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
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">Try adjusting your search or browse different categories</p>
                </div>
              )}
            </div>
          </div>

          {/* Support Channels */}
          <div className="space-y-6 max-sm:space-y-4">
            <div className="bg-gray-50 rounded-lg max-sm:p-2 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                Contact Support
              </h2>

              <div className="space-y-4">
                {supportChannels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <div key={channel.id} className="p-4 max-sm:p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-blue-600" />
                          <h3 className="font-medium text-gray-900">{channel.name}</h3>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(channel.status)}`}>
                          {channel.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{channel.description}</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>{channel.availability}</div>
                        <div>Avg. response: {channel.avgResponse}</div>
                      </div>
                      <button className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Start {channel.name}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resources */}
            <div className="bg-gray-50 rounded-lg max-sm:p-2 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Resources
              </h2>

              <div className="space-y-3">
                {resources.map((resource) => {
                  const Icon = resource.icon;
                  return (
                    <div key={resource.id} className="p-4 max-sm:p-2 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-blue-600" />
                          <div>
                            <h3 className="font-medium text-gray-900">{resource.title}</h3>
                            <p className="text-sm text-gray-600">{resource.description}</p>
                            <div className="text-xs text-gray-500 mt-1">
                              {resource.type} • {resource.size}
                            </div>
                          </div>
                        </div>
                        <button className="p-2 text-blue-600 hover:text-blue-700">
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
          <div className="bg-gray-50 rounded-lg p-6 max-sm:p-2 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Recent Support Tickets
            </h2>

            <div className="space-y-3 max-sm:space-y-1.5">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 max-sm:p-2 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 max-sm:space-x-1.5">
                      {getStatusIcon(ticket.status)}
                      <div>
                        <h3 className="font-medium flex max-sm:flex-col text-gray-900">
                          <span>{ticket.subject}</span> <span className="text-sm max-sm:text-xs text-gray-500">#{ticket.id}</span>
                        </h3>
                        <div className="text-sm max-sm:text-xs flex max-sm:flex-col text-gray-600">
                          <span>Created: {ticket.created}</span> <span className='max-sm:hidden'>•</span> <span>Last update: {ticket.lastUpdate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 max-sm:space-x-1.5">
                      <span className={`px-2 py-1 max-sm:px-1 max-sm:text-xs text-sm rounded-full max-sm:rounded-lg ${ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                          ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                        }`}>
                        {ticket.priority} priority
                      </span>
                      <button className="text-blue-600 hover:text-blue-700 text-sm max-sm:text-xs font-medium">
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
        <div className="bg-gray-50 rounded-lg p-6 max-sm:p-2 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            Submit a Support Request
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={contactForm.category}
                onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={contactForm.priority}
                onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low - General inquiry</option>
                <option value="medium">Medium - Standard issue</option>
                <option value="high">High - Urgent problem</option>
                <option value="critical">Critical - Service down</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="Brief description of your issue"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={contactForm.description}
                onChange={(e) => setContactForm({ ...contactForm, description: e.target.value })}
                placeholder="Please provide detailed information about your issue, including any error messages and steps to reproduce..."
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Drop files here or click to upload</p>
                <p className="text-xs text-gray-500 mt-1">Max file size: 10MB • Supported: PNG, JPG, PDF, TXT</p>
              </div>
            </div>
          </div>

          {ticketStatus === 'submitted' && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">Support request submitted successfully!</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                We'll respond within 24 hours. You'll receive updates via email.
              </p>
            </div>
          )}

          <div className="flex max-md:justif justify-end mt-6">
            <button
              onClick={handleContactFormSubmit}
              disabled={!contactForm.subject || !contactForm.description}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="mr-2 h-4 w-4" />
              Submit Request
            </button>
          </div>
        </div>

        {/* Community & Additional Help */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-sm:p-2">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Community Forum
            </h3>
            <p className="text-blue-800 text-sm mb-4">
              Connect with other users, share tips, and get help from the community.
            </p>
            <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
              Visit Forum <ExternalLink className="ml-1 h-4 w-4" />
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg max-sm:p-2 p-6">
            <h3 className="font-semibold text-green-900 mb-2 flex items-center">
              <Star className="mr-2 h-5 w-5" />
              Premium Support
            </h3>
            <p className="text-green-800 text-sm mb-4">
              Get priority support, phone assistance, and dedicated help from our experts.
            </p>
            <button className="flex items-center text-green-600 hover:text-green-700 font-medium">
              Upgrade Now <ExternalLink className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpAndSupport
