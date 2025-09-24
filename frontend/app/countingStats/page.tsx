"use client";
import { JSX, useEffect, useRef, useState } from "react";
import { FaBriefcase, FaUsers, FaFileAlt, FaBuilding } from "react-icons/fa";

interface Counts {
  jobs: number;
  members: number;
  resumes: number;
  companies: number;
}

interface TargetCounts {
  jobs: number;
  members: number;
  resumes: number;
  companies: number;
}

interface Icons {
  jobs: JSX.Element;
  members: JSX.Element;
  resumes: JSX.Element;
  companies: JSX.Element;
}

interface Labels {
  jobs: string;
  members: string;
  resumes: string;
  companies: string;
}

const CountingStats = () => {
  const [counts, setCounts] = useState<Counts>({
    jobs: 0,
    members: 0,
    resumes: 0,
    companies: 0,
  });

  const targetCounts: TargetCounts = {
    jobs: 1354,
    members: 1741,
    resumes: 1204,
    companies: 142,
  };

  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const icons: Icons = {
    jobs: <FaBriefcase className="text-blue-500" size={24} />,
    members: <FaUsers className="text-green-500" size={24} />,
    resumes: <FaFileAlt className="text-purple-500" size={24} />,
    companies: <FaBuilding className="text-orange-500" size={24} />,
  };

  const labels: Labels = {
    jobs: "Job Posts",
    members: "Members",
    resumes: "Resumes",
    companies: "Companies",
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounts();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounts = () => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    (Object.keys(targetCounts) as Array<keyof TargetCounts>).forEach((key) => {
      const target = targetCounts[key];
      let current = 0;
      const increment = target / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCounts((prev) => ({
          ...prev,
          [key]: Math.floor(current),
        }));
      }, stepDuration);
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  return (
    <div
      ref={sectionRef}
      className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 py-16"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {(Object.keys(targetCounts) as Array<keyof TargetCounts>).map(
            (key) => (
              <div
                key={key}
                className="text-center transform transition-all duration-700 hover:scale-105"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      {icons[key]}
                    </div>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2">
                    <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {formatNumber(counts[key])}
                      {counts[key] >= 1000 && (
                        <span className="text-2xl">+</span>
                      )}
                    </span>
                  </h3>
                  <p className="text-gray-300 font-medium text-sm uppercase tracking-wider">
                    {labels[key]}
                  </p>
                  <div className="mt-3 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full"></div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-500/10 rounded-full blur-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default CountingStats;
