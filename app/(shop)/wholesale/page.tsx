'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, Package, DollarSign, Truck, CheckCircle, Users, BarChart3, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header-new';
import { Footer } from '@/components/layout/footer';
import { Input } from '@/components/ui/input';

export default function WholesalePage() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    phone: '',
    email: '',
    businessType: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Wholesale inquiry:', formData);
  };

  const pricingTiers = [
    {
      name: 'Starter',
      minOrder: '৳5,000',
      discount: '5-10%',
      features: [
        'Access to full product catalog',
        'Monthly settlements',
        'Standard delivery',
        'Email support',
      ],
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Professional',
      minOrder: '৳15,000',
      discount: '10-20%',
      features: [
        'Everything in Starter',
        'Priority delivery (2-4 hours)',
        'Dedicated account manager',
        'API access for inventory',
        'Weekly settlement option',
        'Phone support',
      ],
      color: 'from-[#1E9972] to-[#0F6D5C]',
      featured: true,
    },
    {
      name: 'Enterprise',
      minOrder: 'Custom',
      discount: '20-35%',
      features: [
        'Everything in Professional',
        'Same-day delivery',
        'Custom pricing',
        'Dedicated logistics manager',
        'Real-time tracking system',
        'Priority customer service',
        'Quarterly business reviews',
      ],
      color: 'from-amber-500 to-amber-600',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#1E9972] to-[#0F6D5C] text-white py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
                  B2B Solutions
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Wholesale Medicine Solutions for Bangladesh
                </h1>
                <p className="text-lg opacity-90 mb-8">
                  Partnering with pharmacies, clinics, hospitals, and healthcare retailers across Bangladesh. 
                  Get competitive wholesale prices, reliable delivery, and dedicated support.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <a href="#pricing">
                    <Button size="lg" className="bg-white text-[#1E9972] hover:bg-gray-100 font-bold">
                      View Pricing
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </a>
                  <a href="#contact">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      Get in Touch
                    </Button>
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-white" />
                  <p className="text-sm opacity-90">500+ Partner Businesses</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-white" />
                  <p className="text-sm opacity-90">10,000+ Products</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                  <Truck className="h-12 w-12 mx-auto mb-4 text-white" />
                  <p className="text-sm opacity-90">Fast Delivery Network</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 text-white" />
                  <p className="text-sm opacity-90">Up to 35% Discount</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Wholesale Section */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Why Partner with Medora?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: DollarSign,
                  title: 'Competitive Wholesale Pricing',
                  description: 'Get discounts up to 35% on bulk orders. Better margins for your business.',
                },
                {
                  icon: Truck,
                  title: 'Reliable Fast Delivery',
                  description: '2-4 hour delivery in Dhaka, same-day for enterprise partners across Bangladesh.',
                },
                {
                  icon: CheckCircle,
                  title: '100% Authentic Medicines',
                  description: 'All products verified from authorized manufacturers and distributors.',
                },
                {
                  icon: BarChart3,
                  title: 'Real-time Inventory Tracking',
                  description: 'API access to check stock, manage orders, and track deliveries in real-time.',
                },
                {
                  icon: Users,
                  title: 'Dedicated Account Manager',
                  description: 'Personal support from experienced professionals for your business needs.',
                },
                {
                  icon: Phone,
                  title: '24/7 Customer Support',
                  description: 'Priority phone support, emergency deliveries, and quick problem resolution.',
                },
              ].map((item, i) => (
                <Card key={i} className="border border-gray-200 hover:border-[#1E9972] transition-colors">
                  <CardHeader>
                    <div className="p-3 bg-[#1E9972]/10 rounded-lg w-fit mb-4">
                      <item.icon className="h-6 w-6 text-[#1E9972]" />
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 md:py-24 bg-gray-50">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Simple Wholesale Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingTiers.map((tier, i) => (
                <div
                  key={i}
                  className={`relative ${tier.featured ? 'md:scale-105' : ''}`}
                >
                  {tier.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-amber-500 text-white">Most Popular</Badge>
                    </div>
                  )}
                  <Card className={`h-full border-2 ${tier.featured ? 'border-[#1E9972]' : 'border-gray-200'}`}>
                    <CardHeader className={`bg-gradient-to-r ${tier.color} text-white rounded-t-lg`}>
                      <CardTitle className="text-2xl">{tier.name}</CardTitle>
                      <CardDescription className="text-white/90">
                        Min. Order: {tier.minOrder}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-sm text-gray-600 mb-2">Wholesale Discount</p>
                        <p className="text-2xl font-bold text-[#1E9972]">{tier.discount}</p>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {tier.features.map((feature, j) => (
                          <li key={j} className="flex gap-3 text-sm">
                            <CheckCircle className="h-5 w-5 text-[#1E9972] flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={`w-full ${
                          tier.featured
                            ? 'bg-gradient-to-r from-[#1E9972] to-[#0F6D5C] text-white'
                            : 'border-2 border-gray-200 text-gray-900'
                        }`}
                        size="lg"
                      >
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              How Wholesale Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  number: '1',
                  title: 'Contact Us',
                  description: 'Fill the form below or call us directly to discuss your business needs.',
                },
                {
                  number: '2',
                  title: 'Account Setup',
                  description: 'Complete your profile and choose your pricing tier. Takes 24 hours.',
                },
                {
                  number: '3',
                  title: 'Place Orders',
                  description: 'Use our platform or app to browse and order from 10,000+ medicines.',
                },
                {
                  number: '4',
                  title: 'Fast Delivery',
                  description: 'Get your orders delivered fast with real-time tracking and support.',
                },
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#1E9972] to-[#0F6D5C] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                      {step.number}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 text-center mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-center text-sm">
                      {step.description}
                    </p>
                  </div>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-8 -right-4 text-2xl text-gray-300">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="py-16 md:py-24 bg-gray-50">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
                <p className="text-gray-600 mb-8">
                  Our wholesale team is ready to discuss partnership opportunities and create a customized solution for your business.
                </p>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <Phone className="h-6 w-6 text-[#1E9972] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-900">Phone</h4>
                      <p className="text-gray-600">+880 1234-567890</p>
                      <p className="text-sm text-gray-500">Available 24/7</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Mail className="h-6 w-6 text-[#1E9972] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-900">Email</h4>
                      <p className="text-gray-600">wholesale@medora.com</p>
                      <p className="text-sm text-gray-500">Response within 2 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Business Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Your pharmacy/clinic name"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Contact Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      placeholder="+880 1XXXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Business Type
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E9972] focus:border-transparent"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="clinic">Clinic</option>
                    <option value="hospital">Hospital</option>
                    <option value="distributor">Distributor</option>
                    <option value="retailer">Retailer</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your business and requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E9972] focus:border-transparent"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#1E9972] to-[#0F6D5C] text-white font-bold"
                >
                  Send Inquiry
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
