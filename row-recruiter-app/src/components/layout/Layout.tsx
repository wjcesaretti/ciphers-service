import React from 'react';
import { AuroraBackground } from '@/components/ui/aurora-background';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <AuroraBackground>
        <main className="relative z-10 container mx-auto px-4 py-8">
          {children}
        </main>
      </AuroraBackground>
    </div>
  );
}; 