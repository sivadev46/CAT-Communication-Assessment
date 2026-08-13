import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import SkeletonLoader from '../components/Loader/SkeletonLoader';

const PageFallback = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-10 bg-gray-200/80 rounded-lg w-1/3 mb-4" />
    <div className="h-4 bg-gray-200/80 rounded-lg w-1/2 mb-6" />
    <SkeletonLoader count={3} type="card" />
  </div>
);

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const outlet = useOutlet();
  const mainRef = useRef(null);
  const scrollPositions = useRef({});

  // 1. Reduced Motion Preference
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // 2. Route Order to determine slide direction
  const routeOrder = useMemo(() => [
    '/dashboard',
    '/patients',
    '/assessment',
    '/reports',
    '/vr',
    '/settings',
    '/parent-dashboard',
    '/teaching-videos',
    '/therapy-activities'
  ], []);

  const prevPathRef = useRef(location.pathname);
  const [direction, setDirection] = useState('forward');

  useEffect(() => {
    const prevPath = prevPathRef.current;
    const currentPath = location.pathname;

    if (prevPath !== currentPath) {
      const prevIndex = routeOrder.indexOf(prevPath);
      const currentIndex = routeOrder.indexOf(currentPath);

      if (prevIndex >= 0 && currentIndex >= 0) {
        setDirection(currentIndex > prevIndex ? 'forward' : 'backward');
      } else {
        setDirection('forward');
      }
      prevPathRef.current = currentPath;
    }
  }, [location.pathname, routeOrder]);

  // 3. Scroll Preservation
  const handleScroll = (e) => {
    scrollPositions.current[location.pathname] = e.currentTarget.scrollTop;
  };

  useEffect(() => {
    const mainElement = mainRef.current;
    if (mainElement) {
      const savedScroll = scrollPositions.current[location.pathname] || 0;
      const timer = setTimeout(() => {
        mainElement.scrollTop = savedScroll;
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  // 4. Motion Animation Variants
  const slideVariants = {
    initial: (dir) => ({
      x: dir === 'forward' ? 100 : -100,
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1
    },
    exit: (dir) => ({
      x: dir === 'forward' ? -100 : 100,
      opacity: 0
    })
  };

  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const variants = reducedMotion ? fadeVariants : slideVariants;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main
          ref={mainRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 relative"
        >
          <div className="max-w-7xl mx-auto h-full relative">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={location.pathname}
                custom={direction}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="w-full h-full"
              >
                <Suspense fallback={<PageFallback />}>
                  {outlet}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
