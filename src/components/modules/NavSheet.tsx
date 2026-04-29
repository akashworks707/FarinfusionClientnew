/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, ShoppingCart, LogIn, LogOut, Search } from 'lucide-react';
import { useUser } from '@/context/UserContext';

interface MobileNavSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const NavSheet: FC<MobileNavSheetProps> = ({
                                             isOpen,
                                             onOpenChange,
                                             searchQuery,
                                             onSearchChange,
                                             onLoginClick,
                                             onRegisterClick,
                                           }) => {
  const { user, logout } = useUser();

  const menuItems = [
    { label: 'Promotions', href: '/promotions', icon: '🎉' },
    { label: 'Home', href: '/', icon: '🏠', highlight: true },
    { label: 'Stores', href: '/stores', icon: '🏪' },
    { label: 'Our Contacts', href: '/contact', icon: '📞' },
    { label: 'Delivery & Return', href: '/delivery', icon: '🚚' },
    { label: 'Outlet', href: '/outlet', icon: '🏷️' },
  ];

  const userActions = [
    { label: 'Wishlist', href: '/wishlist', icon: Heart, count: 0 },
    { label: 'Compare', href: '/compare', icon: ShoppingCart, count: 0 },
  ];

  const handleNavClick = (href: string) => {
    onOpenChange(false);
  };

  return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-full sm:w-96 p-0 flex flex-col bg-white dark:bg-slate-900">
          {/* Search Bar */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="relative">
              <Input
                  type="text"
                  placeholder="Search for products"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-4 pr-10 py-2.5 border-slate-300 dark:border-slate-700 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 rounded-lg transition-all duration-200"
              />
              <button className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {menuItems.map((item) => (
                  <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                          item.highlight
                              ? 'bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-l-4 border-amber-600 dark:border-amber-400'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-400'
                      }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className="my-6 border-t border-slate-200 dark:border-slate-800" />

            {/* User Actions */}
            <div className="px-2 space-y-2 mb-6">
              {userActions.map((action) => {
                const IconComponent = action.icon;
                return (
                    <Link
                        key={action.href}
                        href={action.href}
                        onClick={() => handleNavClick(action.href)}
                        className="flex items-center justify-between px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-200 font-medium"
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5" />
                        <span>{action.label}</span>
                      </div>
                      {action.count > 0 && (
                          <span className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {action.count}
                    </span>
                      )}
                    </Link>
                );
              })}
            </div>
          </div>

          {/* Auth Section */}
          <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-3">
            {user ? (
                <>
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Logged in as</p>
                    <p className="font-semibold text-foreground truncate">{user.email}</p>
                  </div>

                  <Button
                      onClick={() => {
                        logout();
                        onOpenChange(false);
                      }}
                      variant="outline"
                      className="w-full border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
            ) : (
                <div className="space-y-3">
                  <Button
                      onClick={() => {
                        onLoginClick();
                        onOpenChange(false);
                      }}
                      className="w-full bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold transition-all duration-300 hover:scale-105 active:scale-95 py-2.5"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>

                  <Button
                      onClick={() => {
                        onRegisterClick();
                        onOpenChange(false);
                      }}
                      variant="outline"
                      className="w-full border-amber-600 dark:border-amber-400 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 font-semibold transition-all duration-200"
                  >
                    Register
                  </Button>
                </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
  );
};

export default NavSheet;
