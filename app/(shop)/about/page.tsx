'use client';

import Link from 'next/link';
import { Heart, Users, Globe, Pill, ArrowRight, Star, Award, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/header-new';
import { Footer } from '@/components/layout/footer';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#1E9972] to-[#0F6D5C] text-white py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                About Medora
              </h1>
              <p className="text-xl opacity-90">
                Bangladesh's trusted online pharmacy delivering quality medicines and healthcare solutions to millions of families since 2020.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="border-2 border-[#1E9972]/20 hover:border-[#1E9972] transition-colors">
                <CardContent className="pt-8">
                  <div className="p-4 bg-[#1E9972]/10 rounded-lg w-fit mb-6">
                    <Heart className="h-8 w-8 text-[#1E9972]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To make quality medicines accessible, affordable, and convenient for every Bangladeshi by leveraging technology and trusted partnerships.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#1E9972] hover:border-[#1E9972] transition-colors md:scale-105">
                <CardContent className="pt-8">
                  <div className="p-4 bg-[#1E9972]/10 rounded-lg w-fit mb-6">
                    <Globe className="h-8 w-8 text-[#1E9972]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To become Bangladesh's most trusted and customer-centric online pharmacy, setting industry standards for quality, service, and innovation.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#1E9972]/20 hover:border-[#1E9972] transition-colors">
                <CardContent className="pt-8">
                  <div className="p-4 bg-[#1E9972]/10 rounded-lg w-fit mb-6">
                    <Pill className="h-8 w-8 text-[#1E9972]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Integrity, customer care, and innovation drive everything we do. We believe in transparency and putting our customers' health first.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Our Journey
            </h2>
            <div className="max-w-3xl mx-auto">
              {[
                {
                  year: '2020',
                  title: 'Founded',
                  description: 'Medora launches as Bangladesh\'s first trusted online pharmacy with a mission to revolutionize healthcare delivery.',
                },
                {
                  year: '2021',
                  title: 'Rapid Growth',
                  description: 'Expanded to 32 districts and onboarded 50,000+ customers. Launched prescription verification system.',
                },
                {
                  year: '2022',
                  title: 'Major Milestone',
                  description: 'Reached 100,000+ satisfied customers. Introduced B2B wholesale platform for pharmacies and clinics.',
                },
                {
                  year: '2023',
                  title: 'Expansion',
                  description: 'Covered all 64 districts of Bangladesh. Partnered with 500+ healthcare businesses nationwide.',
                },
                {
                  year: '2024',
                  title: 'Innovation',
                  description: 'Launched AI-powered medicine recommendations and real-time pharmacy inventory tracking system.',
                },
                {
                  year: '2025',
                  title: 'Present',
                  description: 'Serving millions with 10,000+ medicines, 24/7 support, and industry-leading customer satisfaction.',
                },
              ].map((item, i) => (
                <div key={i} className="relative mb-12 pb-12 last:pb-0 last:mb-0">
                  {/* Timeline Line */}
                  {i < 5 && (
                    <div className="absolute left-8 top-20 bottom-0 w-1 bg-gradient-to-b from-[#1E9972] to-[#0F6D5C]" />
                  )}

                  {/* Timeline Dot */}
                  <div className="flex gap-8">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#1E9972] to-[#0F6D5C] text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {item.year}
                      </div>
                    </div>
                    <div className="flex-1 pt-3">
                      <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 mt-2">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { stat: '100K+', label: 'Happy Customers' },
                { stat: '10K+', label: 'Medicines Available' },
                { stat: '64', label: 'Districts Covered' },
                { stat: '4.8★', label: 'Average Rating' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#1E9972] to-[#0F6D5C] bg-clip-text text-transparent mb-3">
                    {item.stat}
                  </div>
                  <p className="text-gray-600 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Why People Trust Medora
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Award,
                  title: '100% Authentic',
                  description: 'All medicines sourced directly from authorized manufacturers and verified distributors.',
                },
                {
                  icon: Zap,
                  title: 'Fast Delivery',
                  description: '2-4 hour delivery in Dhaka. Same-day delivery available for premium members.',
                },
                {
                  icon: Users,
                  title: 'Expert Team',
                  description: 'Licensed pharmacists available 24/7 to answer your health questions.',
                },
                {
                  icon: Heart,
                  title: 'Customer First',
                  description: 'Transparent pricing, easy returns, and customer satisfaction guarantee.',
                },
                {
                  icon: Star,
                  title: 'Quality Assured',
                  description: 'Every medicine is quality-checked before dispatch to ensure safety.',
                },
                {
                  icon: Globe,
                  title: 'Nationwide Network',
                  description: 'Operating across all 64 districts with reliable logistics partners.',
                },
              ].map((item, i) => (
                <Card key={i} className="border border-gray-200 hover:border-[#1E9972] transition-colors">
                  <CardContent className="pt-8">
                    <div className="p-3 bg-[#1E9972]/10 rounded-lg w-fit mb-4">
                      <item.icon className="h-6 w-6 text-[#1E9972]" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Our Leadership Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Dr. Ahmed Khan',
                  role: 'Founder & CEO',
                  bio: 'Pharmacist with 15+ years experience in healthcare. Vision is to make medicines accessible to all.',
                },
                {
                  name: 'Fatima Begum',
                  role: 'Chief Operations Officer',
                  bio: 'Expert in logistics and operations. Ensures smooth delivery across Bangladesh.',
                },
                {
                  name: 'Karim Hassan',
                  role: 'Chief Technology Officer',
                  bio: 'Tech innovator building scalable solutions for healthcare delivery.',
                },
              ].map((member, i) => (
                <Card key={i} className="border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-r from-[#1E9972] to-[#0F6D5C]" />
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                    <p className="text-[#1E9972] font-medium text-sm mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-[#1E9972] to-[#0F6D5C] text-white py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience Better Healthcare?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join hundreds of thousands of Bangladeshis who trust Medora for their healthcare needs.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/medicines">
                <Button size="lg" className="bg-white text-[#1E9972] hover:bg-gray-100 font-bold">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
