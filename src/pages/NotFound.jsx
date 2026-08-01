import React from 'react';
import Header from '../components/Header/Header';
import Card from '../components/Card/Card';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <Header title="404 - Page Not Found" subtitle="The page you requested could not be found." />
        <Card className="text-center py-12">
          <p className="text-gray-500 font-medium">This page will be implemented later.</p>
        </Card>
      </div>
    </div>
  );
}
