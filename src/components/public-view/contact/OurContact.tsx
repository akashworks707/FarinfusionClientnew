/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { Mail, Phone, Send, MapPinIcon, Facebook,
  Twitter,
  Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Type definitions
interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

interface ContactInfo {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  color: string;
}

export default function Contacts() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormData, boolean>>>({});

  const contactInfo: ContactInfo[] = [
    {
      icon: <Phone className="w-6 h-6" />,
      label: 'WhatsApp',
      value: '+880 1805-999422',
      href: 'https://api.whatsapp.com/send?phone=8801805999422',
      color: 'text-green-500 dark:text-green-400',
    },
    {
      icon: <Mail className="w-6 h-6" />,
      label: 'Email',
      value: 'farinfusion@gmail.com',
      href: 'mailto:farinfusion@gmail.com',
      color: 'text-blue-500 dark:text-blue-400',
    },
    {
      icon: (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.5 2c.3 2.1 1.6 3.9 3.5 4.8v2.4c-1.4-.1-2.7-.6-3.9-1.4v5.6c0 3-2.4 5.4-5.4 5.4S1.3 16.4 1.3 13.4 3.7 8 6.7 8c.5 0 1 .1 1.5.2v2.6c-.5-.2-1-.3-1.5-.3-1.6 0-2.9 1.3-2.9 2.9S5.1 16.3 6.7 16.3s2.9-1.3 2.9-2.9V2h2.9z"/>
  </svg>
),
      label: 'TikTok',
      value: '@farinfusion',
      href: 'https://tiktok.com/@farinfusion',
      color: 'text-black dark:text-white',
    },
  ];

  const socialLinks = [
  {
    name: "Facebook",
    icon: <Facebook className="w-5 h-5" />,
    href: "https://facebook.com/farinfusion",
    bg: "bg-blue-600 hover:bg-blue-700",
  },
  {
    name: "X (Twitter)",
    icon: <Twitter className="w-5 h-5" />,
    href: "https://twitter.com/farinfusion",
    bg: "bg-black hover:bg-gray-900",
  },
  {
    name: "Pinterest",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.74 7.84 6.54 9.11-.09-.77-.17-1.95.04-2.8.19-.8 1.23-5.1 1.23-5.1s-.31-.62-.31-1.54c0-1.44.83-2.52 1.87-2.52.88 0 1.3.66 1.3 1.45 0 .88-.56 2.2-.85 3.43-.24 1.02.51 1.85 1.52 1.85 1.83 0 3.06-2.36 3.06-5.16 0-2.13-1.44-3.73-4.07-3.73-2.97 0-4.82 2.21-4.82 4.67 0 .85.25 1.45.64 1.91.18.21.2.3.14.55-.05.18-.15.62-.2.79-.06.25-.24.34-.44.25-1.22-.5-1.79-1.83-1.79-3.34 0-2.49 2.09-5.47 6.26-5.47 3.35 0 5.55 2.43 5.55 5.05 0 3.45-1.92 6.03-4.75 6.03-.95 0-1.84-.51-2.14-1.09l-.58 2.2c-.21.81-.63 1.82-.94 2.44.71.21 1.46.33 2.24.33 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
      </svg>
    ),
    href: "https://pinterest.com/farinfusion",
    bg: "bg-red-600 hover:bg-red-700",
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="w-5 h-5" />,
    href: "https://linkedin.com/company/farinfusion",
    bg: "bg-blue-700 hover:bg-blue-800",
  },
  {
    name: "Telegram",
    icon: <Send className="w-5 h-5" />,
    href: "https://t.me/farinfusion",
    bg: "bg-sky-500 hover:bg-sky-600",
  },
];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      toast.error('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error('Last name is required');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Invalid email address');
      return false;
    }
    if (!formData.message.trim()) {
      toast.error('Message cannot be empty');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Message sent successfully! We will contact you soon.');
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
      setTouched({});
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-linear-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get in touch with our team. We&apos;re here to help and answer any question you might have.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="">
        <div className="container max-w-352 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-6 md:p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Get in Touch</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                        First Name
                      </label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className="border-slate-200 dark:border-slate-700 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 transition-all duration-200"
                        disabled={loading}
                      />
                      {touched.firstName && !formData.firstName && (
                        <p className="text-red-500 text-xs mt-1">First name is required</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                        Last Name
                      </label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className="border-slate-200 dark:border-slate-700 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 transition-all duration-200"
                        disabled={loading}
                      />
                      {touched.lastName && !formData.lastName && (
                        <p className="text-red-500 text-xs mt-1">Last name is required</p>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className="border-slate-200 dark:border-slate-700 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 transition-all duration-200"
                      disabled={loading}
                    />
                    {touched.email && !formData.email && (
                      <p className="text-red-500 text-xs mt-1">Email is required</p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Your Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us what you think..."
                      value={formData.message}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      rows={5}
                      className="border-slate-200 dark:border-slate-700 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 resize-none transition-all duration-200"
                      disabled={loading}
                    />
                    {touched.message && !formData.message && (
                      <p className="text-red-500 text-xs mt-1">Message cannot be empty</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="py-5 hover:cursor-pointer bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin inline-block mr-2">⏳</span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="inline-block mr-2 w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <h3 className="text-xl font-bold text-foreground mb-6">Need a Help?</h3>

                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <a
                      key={index}
                      href={info.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 group"
                    >
                      <div className={`${info.color} mt-1 group-hover:scale-110 transition-transform duration-200`}>
                        {info.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{info.label}</p>
                        <p className="text-foreground font-semibold group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {info.value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </Card>

              {/* Subscribe Section */}
              <Card className="p-4 border-slate-200 dark:border-slate-800 bg-linear-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900">
                <h3 className="text-xl font-bold text-foreground mb-4">Subscribe us</h3>

                <div className="grid grid-cols-5 gap-2">
                  {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.name}
                    className={`${social.bg} text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95`}
                    >
                    {social.icon}
                    </a>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Map Section */}
          <div className="mb-12">
            <Card className="overflow-hidden border-slate-200 dark:border-slate-800 h-96 md:h-125">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                title="Farin Fusion Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.7519260376417!2d90.36477631531686!3d23.81089629384195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7215c0a0001%3A0x0!2sFarin%20Fusion!5e0!3m2!1sen!2sbd!4v1234567890"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Card>
          </div>

          {/* Store Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Mirpur Store',
                address: 'Mirpur, Dhaka, Bangladesh',
                phone: '01511-799745',
                email: 'farinfusion@gmail.com',
              },
              {
                title: 'Alameda Store',
                address: 'Alameda, California, USA',
                phone: '+1-234-567-8900',
                email: 'alameda@farinfusion.com',
              },
              {
                title: 'Valencia Store',
                address: '1501 Valencia St, San Francisco, CA',
                phone: '+1-415-555-0123',
                email: 'valencia@farinfusion.com',
              },
            ].map((store, index) => (
              <Card key={index} className="p-6 border-slate-200 dark:border-slate-800 hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all duration-200">
                <div className="flex items-start gap-3 mb-4">
                  <MapPinIcon className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{store.title}</h3>
                    <p className="text-sm text-muted-foreground">{store.address}</p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
                  <a href={`tel:${store.phone}`} className="flex items-center gap-2 text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{store.phone}</span>
                  </a>
                  <a href={`mailto:${store.email}`} className="flex items-center gap-2 text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{store.email}</span>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};