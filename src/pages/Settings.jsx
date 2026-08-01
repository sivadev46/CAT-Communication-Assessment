import React from 'react';
import Header from '../components/Header/Header';
import Card from '../components/Card/Card';

export default function Settings() {
  return (
    <div>
      <Header
        title="Settings"
        subtitle="Manage clinician preferences, system defaults, and notifications."
      />
      <Card className="text-center py-16">
        <p className="text-gray-500 font-medium">This page will be implemented later.</p>
      </Card>
    </div>
  );
}
