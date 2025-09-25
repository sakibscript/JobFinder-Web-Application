"use client";
import { useEffect, useRef } from "react";
import { FaSearch, FaUser, FaChartLine, FaEnvelope } from "react-icons/fa";

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-x-0");
          entry.target.classList.remove("opacity-0", "translate-x-20");
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative bg-gradient-to-r from-gray-800 to-black py-20 opacity-0 translate-x-20 transition-all duration-1000"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-70"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-teal-100 mb-6">
              Who We Are
            </h2>
            <p className="text-teal-200 text-lg mb-8 leading-relaxed max-w-md">
              We empower job seekers and employers with a cutting-edge platform
              designed to simplify hiring and career growth. Our mission is to
              bridge the gap between talent and opportunity with innovative
              tools and a user-friendly experience.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center text-teal-100">
                <FaSearch className="mr-3 text-teal-500" size={20} />
                <span>Smart job matching technology</span>
              </li>
              <li className="flex items-center text-teal-100">
                <FaUser className="mr-3 text-teal-500" size={20} />
                <span>Customizable user profiles</span>
              </li>
              <li className="flex items-center text-teal-100">
                <FaChartLine className="mr-3 text-teal-500" size={20} />
                <span>Real-time career insights</span>
              </li>
              <li className="flex items-center text-teal-100">
                <FaEnvelope className="mr-3 text-teal-500" size={20} />
                <span>Streamlined application process</span>
              </li>
            </ul>
          </div>
          <div className="md:w-1/2">
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-teal-900/50 backdrop-blur-sm p-6 rounded-xl border border-teal-100/20 shadow-lg transform transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold text-teal-100 mb-2">
                  Our Mission
                </h3>
                <p className="text-teal-200 text-sm">
                  To create a world where every individual finds the right job
                  and every company discovers the ideal candidate.
                </p>
              </div>
              <div className="bg-teal-900/50 backdrop-blur-sm p-6 rounded-xl border border-teal-100/20 shadow-lg transform transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold text-teal-100 mb-2">
                  Why Choose Us?
                </h3>
                <p className="text-teal-200 text-sm">
                  With a focus on innovation and user satisfaction, we provide
                  the tools you need to succeed in today’s competitive job
                  market.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
