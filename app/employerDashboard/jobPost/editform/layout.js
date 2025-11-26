// app/employerDashboard/jobPost/editform/layout.js

import React, { Suspense } from 'react';

// You can create a simple loading component to show during the wait time
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center text-gray-600">
    Loading job editor...
  </div>
);

export default function JobEditLayout({ children }) {
  return (
    // 💥 The Fix: Wrap the children (your page.js content) in <Suspense>
    <Suspense fallback={<LoadingFallback />}>
      {children}
    </Suspense>
  );
}