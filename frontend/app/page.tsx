// "use client";
// import { JSX, useEffect, useState } from "react";
// import axios from "axios";
// import TopBar from "./topBar/page";
// import { Toaster, toast } from "react-hot-toast";
// import {
//   FaUserTie,
//   FaCode,
//   FaPencilRuler,
//   FaBrain,
//   FaMoneyBill,
//   FaBullhorn,
//   FaChartLine,
//   FaCogs,
//   FaSearch,
//   FaTimes,
//   FaArrowRight,
//   FaMapMarkerAlt,
//   FaBuilding,
//   FaTag,
//   FaClock,
//   FaDollarSign,
//   FaEnvelope,
//   FaBriefcase,
//   FaArrowUp,
//   FaChartBar,
//   FaLaptopCode,
//   FaUsers,
//   FaHeadset,
//   FaMobileAlt,
//   FaCheckCircle,
//   FaServer,
//   FaCodeBranch,
// } from "react-icons/fa";
// import RegistrationModal from "./register/page";
// import LoginModal from "./login/page";
// import Footer from "./footer/page";
// import CountingStats from "./countingStats/page";
// import AboutSection from "./about/page";

// type Job = {
//   jobId: number;
//   title: string;
//   description: string;
//   location: string;
//   category: string;
//   company: string;
//   salary: number;
//   created_at: string;
// };

// export default function HomePage() {
//   const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
//   const [isLoginOpen, setIsLoginOpen] = useState(false);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [activeCategory, setActiveCategory] = useState<string>("");
//   const [jobsByCategory, setJobsByCategory] = useState<{
//     [key: string]: Job[];
//   }>({});
//   const [visibleCount, setVisibleCount] = useState(6);
//   const [selectedJob, setSelectedJob] = useState<Job | null>(null);
//   const [searchTitle, setSearchTitle] = useState("");
//   const [searchResults, setSearchResults] = useState<Job[] | null>(null);
//   const [searchPage, setSearchPage] = useState(1);
//   const [searchTotalPages, setSearchTotalPages] = useState(0);
//   const [isSearching, setIsSearching] = useState(false);
//   const [jobCount, setJobCount] = useState<number | null>(null);
//   const [coverLetter, setCoverLetter] = useState("");

//   useEffect(() => {
//     const fetchCategoriesAndJobs = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/jobs/categories");
//         setCategories(res.data);
//         if (res.data.length > 0) {
//           setActiveCategory(res.data[0]);
//         }
//         res.data.forEach(async (category: string) => {
//           const jobRes = await axios.get(
//             `http://localhost:3000/jobs/category/${category}`
//           );
//           setJobsByCategory((prev) => ({ ...prev, [category]: jobRes.data }));
//         });
//       } catch (err) {
//         console.error("Failed to fetch categories or jobs:", err);
//       }
//     };
//     fetchCategoriesAndJobs();
//   }, []);

//   const [popularCategories, setPopularCategories] = useState<
//     { category: string; count: number }[]
//   >([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:3000/jobs/popular-categories")
//       .then((res) => setPopularCategories(res.data))
//       .catch((err) => console.error(err));
//   }, []);

//   const handleSeeMore = () => setVisibleCount((prev) => prev + 6);

//   const categoryIcons: Record<string, JSX.Element> = {
//     Development: <FaCode />,
//     Design: <FaPencilRuler />,
//     Government: <FaUserTie />,
//     Marketing: <FaBullhorn />,
//     Finance: <FaMoneyBill />,
//     Mechanical: <FaCogs />,
//     Engineering: <FaBrain />,
//     Business: <FaChartLine />,
//     "Data Science": <FaChartBar />,
//     "Software Engineering": <FaLaptopCode />,
//     "Human Resources": <FaUsers />,
//     "Customer Support": <FaHeadset />,
//     "Mobile Development": <FaMobileAlt />,
//     "Quality Assurance": <FaCheckCircle />,
//     Sales: <FaDollarSign />,
//     DevOps: <FaServer />,
//     Management: <FaUserTie />,
//     "Software Development": <FaCodeBranch />,
//   };

//   const categoryColors: Record<string, string> = {
//     Development: "bg-blue-200 text-blue-900 border-blue-400",
//     Design: "bg-teal-200 text-teal-900 border-teal-400",
//     Government: "bg-slate-300 text-slate-900 border-slate-500",
//     Marketing: "bg-purple-200 text-purple-900 border-purple-400",
//     Finance: "bg-emerald-200 text-emerald-900 border-emerald-400",
//     Mechanical: "bg-cyan-200 text-cyan-900 border-cyan-400",
//     Engineering: "bg-indigo-200 text-indigo-900 border-indigo-400",
//     Business: "bg-gray-300 text-gray-900 border-gray-500",
//     "Data Science": "bg-violet-200 text-violet-900 border-violet-400",
//     "Software Engineering": "bg-blue-300 text-blue-900 border-blue-500",
//     "Human Resources": "bg-lime-200 text-lime-900 border-lime-400",
//     "Customer Support": "bg-green-200 text-green-900 border-green-400",
//     "Mobile Development": "bg-cyan-300 text-cyan-900 border-cyan-500",
//     "Quality Assurance": "bg-cyan-200 text-cyan-900 border-cyan-400",
//     Sales: "bg-orange-200 text-orange-900 border-orange-400",
//     DevOps: "bg-amber-200 text-amber-900 border-amber-400",
//     Management: "bg-slate-400 text-slate-900 border-slate-600",
//     "Software Development": "bg-blue-250 text-blue-900 border-blue-450",
//   };

//   const handleApplyJob = async (jobId: number) => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       toast.error("Please login to apply for a job.");
//       setIsLoginOpen(true);
//       return;
//     }

//     try {
//       const userRes = await axios.get("http://localhost:3000/job-seekers/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const user = userRes.data;

//       if (!user.resumeUrl) {
//         toast.error("Please upload your resume before applying.");
//         return;
//       }

//       await axios.post(
//         "http://localhost:3000/job-applications",
//         {
//           jobId,
//           jobSeekerId: user.jobSeekerId,
//           coverLetter: coverLetter || "I am interested in this position.",
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       toast.success("Job application submitted successfully!");
//       setSelectedJob(null);
//       setCoverLetter("");
//     } catch (error: any) {
//       if (error.response?.status === 409) {
//         toast.error("You've already applied for this job.");
//       } else {
//         toast.error("Failed to apply. Please try again later.");
//         console.error(error);
//       }
//     }
//   };

//   const handleSearch = async (page = 1) => {
//     if (!searchTitle.trim()) {
//       setSearchResults([]);
//       setSearchTotalPages(0);
//       setIsSearching(false);
//       return;
//     }

//     try {
//       setIsSearching(true);
//       const res = await axios.get("http://localhost:3000/jobs/search", {
//         params: {
//           title: searchTitle,
//           page,
//           limit: 6,
//         },
//       });

//       setSearchResults(res.data.results);
//       setSearchPage(res.data.currentPage);
//       setSearchTotalPages(res.data.totalPages);
//     } catch (err) {
//       toast.error("Search failed");
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     if (searchTitle.trim() === "") {
//       setSearchResults(null);
//     }
//   }, [searchTitle]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:3000/jobs/count")
//       .then((res) => setJobCount(res.data.count))
//       .catch((err) => console.error("Failed to fetch job count:", err));
//   }, []);

//   const formatDate = (dateString: string) => {
//     const options: Intl.DateTimeFormatOptions = {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const formatSalary = (salary: number) => {
//     if (salary >= 1000) {
//       return `$${(salary / 1000).toFixed(0)}k/year`;
//     }
//     return `$${salary}/year`;
//   };

//   const renderJobCard = (job: Job) => (
//     <div
//       key={job.jobId}
//       className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-300 group"
//     >
//       <div className="flex justify-between items-start mb-4">
//         <div className="flex items-center space-x-3">
//           <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
//             {categoryIcons[job.category] || <FaBriefcase size={20} />}
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
//               {job.title}
//             </h3>
//             <p className="text-gray-600 text-sm flex items-center mt-1">
//               <FaBuilding className="mr-2 text-blue-500" size={12} />
//               {job.company}
//             </p>
//           </div>
//         </div>
//         <span
//           className={`text-center px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[job.category] || "bg-gray-100 text-gray-800 border-gray-200"}`}
//         >
//           {job.category}
//         </span>
//       </div>

//       <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
//         <div className="flex items-center space-x-4">
//           <span className="flex items-center">
//             <FaMapMarkerAlt className="mr-1 text-red-500" size={12} />
//             {job.location}
//           </span>
//           <span className="flex items-center">
//             <FaClock className="mr-1 text-gray-400" size={12} />
//             {formatDate(job.created_at)}
//           </span>
//         </div>
//       </div>

//       <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//         <span className="font-semibold text-blue-600 text-lg">
//           {formatSalary(job.salary)}
//         </span>
//         <button
//           onClick={() => setSelectedJob(job)}
//           className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white"
//         >
//           <span>View Details</span>
//           <FaArrowUp
//             className="transform rotate-45 group-hover:rotate-0 transition-transform duration-200"
//             size={14}
//           />
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <main className="min-h-screen bg-gray-50 font-sans">
//       {/* <Toaster position="top-right" toastOptions={{ duration: 4000 }} /> */}
//       <div className="sticky top-0 z-50 bg-white shadow-sm">
//         <TopBar
//           setIsLoginOpen={setIsLoginOpen}
//           setIsRegistrationOpen={setIsRegistrationOpen}
//         />
//       </div>

//       <div
//         className="relative h-[500px] bg-black text-white flex flex-col justify-center items-center bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://edwardscampus.ku.edu/sites/edwards/files/2023-01/jobsearch-blogpost-Jan-2023%20%281%29.jpg')",
//         }}
//       >
//         <div className="text-center px-4">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight animate-fade-in">
//             Discover Your Next Career Opportunity
//           </h1>
//           <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in-up">
//             {jobCount !== null
//               ? `Explore ${jobCount}+ job opportunities tailored for you`
//               : "Loading job opportunities..."}
//           </p>
//           <div className="flex bg-white rounded-lg p-2 shadow-lg w-full max-w-3xl mx-auto">
//             <input
//               type="text"
//               placeholder="Search by job title, company, or keyword..."
//               className="flex-grow p-3 rounded-lg outline-none text-gray-700 placeholder-gray-400"
//               value={searchTitle}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                 setSearchTitle(e.target.value);
//                 setSearchPage(1);
//               }}
//               onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
//                 if (e.key === "Enter") {
//                   handleSearch(1);
//                 }
//               }}
//             />
//             {searchTitle && (
//               <button
//                 onClick={() => {
//                   setSearchTitle("");
//                   setSearchResults([]);
//                   setIsSearching(false);
//                   setSearchPage(1);
//                   setSearchTotalPages(0);
//                 }}
//                 className="text-gray-500 hover:text-rose-500 p-2"
//                 aria-label="Clear search"
//               >
//                 <FaTimes />
//               </button>
//             )}
//             <button
//               className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition"
//               onClick={() => handleSearch(1)}
//               aria-label="Search"
//             >
//               <FaSearch />
//             </button>
//           </div>
//         </div>
//       </div>

//       {searchResults && searchTitle.trim() !== "" && (
//         <section className="py-12 px-4 max-w-7xl mx-auto">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
//             Search Results for "{searchTitle}"
//           </h2>

//           {searchResults.length === 0 ? (
//             <p className="text-center text-gray-500 text-lg">
//               No jobs found for "{searchTitle}". Try a different keyword.
//             </p>
//           ) : (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {searchResults.map(renderJobCard)}
//               </div>
//               <div className="flex justify-center mt-8 gap-3">
//                 <button
//                   disabled={searchPage <= 1}
//                   className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium transition disabled:opacity-50 hover:bg-gray-300"
//                   onClick={() => handleSearch(searchPage - 1)}
//                 >
//                   Previous
//                 </button>
//                 <span className="px-4 py-2 text-gray-800 font-medium">
//                   Page {searchPage} of {searchTotalPages}
//                 </span>
//                 <button
//                   disabled={searchPage >= searchTotalPages}
//                   className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium transition disabled:opacity-50 hover:bg-indigo-700"
//                   onClick={() => handleSearch(searchPage + 1)}
//                 >
//                   Next
//                 </button>
//               </div>
//             </>
//           )}
//         </section>
//       )}

//       <section className="py-12 bg-white">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-8">
//             Explore Popular Job Categories
//           </h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
//             {popularCategories.map((cat, i) => {
//               const icon = categoryIcons[cat.category] || <FaUserTie />;
//               const color = categoryColors[cat.category] || "bg-indigo-500";
//               return (
//                 <div
//                   key={i}
//                   className={`${color} text-black rounded-lg p-4 flex flex-col justify-center items-center shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg`}
//                 >
//                   <div className="text-2xl mb-2">{icon}</div>
//                   <span className="font-medium">{cat.category}</span>
//                   <span className="text-sm opacity-80">{cat.count} Jobs</span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       <section className="py-12 px-4 max-w-7xl mx-auto">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
//           Featured Job Listings
//         </h2>
//         <div className="flex justify-center flex-wrap gap-2 mb-8">
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
//                 activeCategory === cat
//                   ? "bg-indigo-600 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//               onClick={() => {
//                 setActiveCategory(cat);
//                 setVisibleCount(6);
//               }}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {(jobsByCategory[activeCategory] || [])
//             .slice(0, visibleCount)
//             .map(renderJobCard)}
//         </div>

//         {(jobsByCategory[activeCategory]?.length || 0) > visibleCount && (
//           <div className="text-center mt-8">
//             <button
//               onClick={handleSeeMore}
//               className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
//             >
//               Show More Jobs
//             </button>
//           </div>
//         )}
//       </section>

//       {selectedJob && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 transition-opacity duration-500">
//           <div className="bg-white/95 backdrop-blur-2xl max-w-2xl w-full rounded-3xl p-8 relative shadow-2xl border border-blue-200 transform transition-all duration-500 hover:scale-[1.02]">
//             <button
//               onClick={() => {
//                 setSelectedJob(null);
//                 setCoverLetter("");
//               }}
//               className="absolute top-6 right-6 text-gray-600 hover:text-rose-500 transition-colors duration-300"
//               aria-label="Close job details"
//             >
//               <FaTimes size={24} />
//             </button>
//             <h2 className="text-3xl font-extrabold text-blue-900 mb-3">
//               {selectedJob.title}
//             </h2>
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center text-gray-600">
//                 <FaBuilding className="mr-2 text-indigo-500" />
//                 <span className="font-medium">{selectedJob.company}</span>
//               </div>
//               <div className="flex items-center text-gray-500">
//                 <FaMapMarkerAlt className="mr-2 text-rose-500" />
//                 <span>{selectedJob.location}</span>
//               </div>
//             </div>
//             <div className="bg-gray-50 p-6 rounded-xl mb-6 border border-gray-100">
//               <p className="text-gray-700 leading-relaxed text-sm">
//                 {selectedJob.description}
//               </p>
//             </div>
//             <div className="flex items-center justify-between mb-6">
//               <p className="text-indigo-600 font-semibold flex items-center">
//                 <FaDollarSign className="mr-1" />
//                 {selectedJob.salary.toLocaleString("en-US", {
//                   style: "currency",
//                   currency: "USD",
//                   maximumFractionDigits: 0,
//                 })}
//               </p>
//               <p className="text-gray-400 text-xs flex items-center">
//                 <FaClock className="mr-2" /> Posted on{" "}
//                 {formatDate(selectedJob.created_at)}
//               </p>
//             </div>
//             <div className="mb-6">
//               <label
//                 htmlFor="coverLetter"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 Cover Letter (Optional)
//               </label>
//               <textarea
//                 id="coverLetter"
//                 value={coverLetter}
//                 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
//                   setCoverLetter(e.target.value)
//                 }
//                 placeholder="Write a brief cover letter to highlight your qualifications..."
//                 className="w-full p-4 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-400 outline-none text-gray-900 placeholder:text-gray-400 resize-none"
//                 rows={4}
//               />
//             </div>
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={() => {
//                   setSelectedJob(null);
//                   setCoverLetter("");
//                 }}
//                 className="px-5 py-2.5 rounded-lg text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
//                 aria-label="Cancel application"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleApplyJob(selectedJob.jobId)}
//                 className="px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:shadow-md transition-all duration-200"
//                 aria-label="Apply for job"
//               >
//                 <FaEnvelope size={20} /> Apply Now
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <AboutSection />
//       <CountingStats />
//       <Footer />

//       {isRegistrationOpen && (
//         <RegistrationModal onClose={() => setIsRegistrationOpen(false)} />
//       )}
//       {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
//     </main>
//   );
// }
// "use client";
// import { JSX, useEffect, useRef, useState } from "react";
// import axios from "axios";
// import TopBar from "./topBar/page";
// import { Toaster, toast } from "react-hot-toast";
// import {
//   FaUserTie,
//   FaCode,
//   FaPencilRuler,
//   FaBrain,
//   FaMoneyBill,
//   FaBullhorn,
//   FaChartLine,
//   FaCogs,
//   FaSearch,
//   FaTimes,
//   FaArrowRight,
//   FaMapMarkerAlt,
//   FaBuilding,
//   FaTag,
//   FaClock,
//   FaDollarSign,
//   FaEnvelope,
//   FaBriefcase,
//   FaArrowUp,
//   FaChartBar,
//   FaLaptopCode,
//   FaUsers,
//   FaHeadset,
//   FaMobileAlt,
//   FaCheckCircle,
//   FaServer,
//   FaCodeBranch,
// } from "react-icons/fa";
// import RegistrationModal from "./register/page";
// import LoginModal from "./login/page";
// import Footer from "./footer/page";
// import CountingStats from "./countingStats/page";
// import AboutSection from "./about/page";

// type Job = {
//   jobId: number;
//   title: string;
//   description: string;
//   location: string;
//   category: string;
//   company: string;
//   salary: number;
//   created_at: string;
// };

// export default function HomePage() {
//   const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
//   const [isLoginOpen, setIsLoginOpen] = useState(false);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [activeCategory, setActiveCategory] = useState<string>("");
//   const [jobsByCategory, setJobsByCategory] = useState<{
//     [key: string]: Job[];
//   }>({});
//   const [visibleCount, setVisibleCount] = useState(6);
//   const [selectedJob, setSelectedJob] = useState<Job | null>(null);
//   const [searchTitle, setSearchTitle] = useState("");
//   const [searchResults, setSearchResults] = useState<Job[] | null>(null);
//   const [searchPage, setSearchPage] = useState(1);
//   const [searchTotalPages, setSearchTotalPages] = useState(0);
//   const [isSearching, setIsSearching] = useState(false);
//   const [jobCount, setJobCount] = useState<number | null>(null);
//   const [coverLetter, setCoverLetter] = useState("");

//   const heroRef = useRef<HTMLDivElement>(null);
//   const searchResultsRef = useRef<HTMLDivElement>(null);
//   const popularCategoriesRef = useRef<HTMLDivElement>(null);
//   const featuredJobsRef = useRef<HTMLDivElement>(null);

//   const [hasHeroAnimated, setHasHeroAnimated] = useState(false);
//   const [hasSearchAnimated, setHasSearchAnimated] = useState(false);
//   const [hasPopularAnimated, setHasPopularAnimated] = useState(false);
//   const [hasFeaturedAnimated, setHasFeaturedAnimated] = useState(false);

//   useEffect(() => {
//     const fetchCategoriesAndJobs = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/jobs/categories");
//         setCategories(res.data);
//         if (res.data.length > 0) {
//           setActiveCategory(res.data[0]);
//         }
//         res.data.forEach(async (category: string) => {
//           const jobRes = await axios.get(
//             `http://localhost:3000/jobs/category/${category}`
//           );
//           setJobsByCategory((prev) => ({ ...prev, [category]: jobRes.data }));
//         });
//       } catch (err) {
//         console.error("Failed to fetch categories or jobs:", err);
//       }
//     };
//     fetchCategoriesAndJobs();
//   }, []);

//   const [popularCategories, setPopularCategories] = useState<
//     { category: string; count: number }[]
//   >([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:3000/jobs/popular-categories")
//       .then((res) => setPopularCategories(res.data))
//       .catch((err) => console.error(err));
//   }, []);

//   const handleSeeMore = () => setVisibleCount((prev) => prev + 6);

//   const categoryIcons: Record<string, JSX.Element> = {
//     Development: <FaCode />,
//     Design: <FaPencilRuler />,
//     Government: <FaUserTie />,
//     Marketing: <FaBullhorn />,
//     Finance: <FaMoneyBill />,
//     Mechanical: <FaCogs />,
//     Engineering: <FaBrain />,
//     Business: <FaChartLine />,
//     "Data Science": <FaChartBar />,
//     "Software Engineering": <FaLaptopCode />,
//     "Human Resources": <FaUsers />,
//     "Customer Support": <FaHeadset />,
//     "Mobile Development": <FaMobileAlt />,
//     "Quality Assurance": <FaCheckCircle />,
//     Sales: <FaDollarSign />,
//     DevOps: <FaServer />,
//     Management: <FaUserTie />,
//     "Software Development": <FaCodeBranch />,
//   };

//   const categoryColors: Record<string, string> = {
//     Development: "bg-blue-200 text-blue-900 border-blue-400",
//     Design: "bg-teal-200 text-teal-900 border-teal-400",
//     Government: "bg-slate-300 text-slate-900 border-slate-500",
//     Marketing: "bg-purple-200 text-purple-900 border-purple-400",
//     Finance: "bg-emerald-200 text-emerald-900 border-emerald-400",
//     Mechanical: "bg-cyan-200 text-cyan-900 border-cyan-400",
//     Engineering: "bg-indigo-200 text-indigo-900 border-indigo-400",
//     Business: "bg-gray-300 text-gray-900 border-gray-500",
//     "Data Science": "bg-violet-200 text-violet-900 border-violet-400",
//     "Software Engineering": "bg-blue-300 text-blue-900 border-blue-500",
//     "Human Resources": "bg-lime-200 text-lime-900 border-lime-400",
//     "Customer Support": "bg-green-200 text-green-900 border-green-400",
//     "Mobile Development": "bg-cyan-300 text-cyan-900 border-cyan-500",
//     "Quality Assurance": "bg-cyan-200 text-cyan-900 border-cyan-400",
//     Sales: "bg-orange-200 text-orange-900 border-orange-400",
//     DevOps: "bg-amber-200 text-amber-900 border-amber-400",
//     Management: "bg-slate-400 text-slate-900 border-slate-600",
//     "Software Development": "bg-blue-250 text-blue-900 border-blue-450",
//   };

//   const handleApplyJob = async (jobId: number) => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       toast.error("Please login to apply for a job.");
//       setIsLoginOpen(true);
//       return;
//     }

//     try {
//       const userRes = await axios.get("http://localhost:3000/job-seekers/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const user = userRes.data;

//       if (!user.resumeUrl) {
//         toast.error("Please upload your resume before applying.");
//         return;
//       }

//       await axios.post(
//         "http://localhost:3000/job-applications",
//         {
//           jobId,
//           jobSeekerId: user.jobSeekerId,
//           coverLetter: coverLetter || "I am interested in this position.",
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       toast.success("Job application submitted successfully!");
//       setSelectedJob(null);
//       setCoverLetter("");
//     } catch (error: any) {
//       if (error.response?.status === 409) {
//         toast.error("You've already applied for this job.");
//       } else {
//         toast.error("Failed to apply. Please try again later.");
//         console.error(error);
//       }
//     }
//   };

//   const handleSearch = async (page = 1) => {
//     if (!searchTitle.trim()) {
//       setSearchResults([]);
//       setSearchTotalPages(0);
//       setIsSearching(false);
//       return;
//     }

//     try {
//       setIsSearching(true);
//       const res = await axios.get("http://localhost:3000/jobs/search", {
//         params: {
//           title: searchTitle,
//           page,
//           limit: 6,
//         },
//       });

//       setSearchResults(res.data.results);
//       setSearchPage(res.data.currentPage);
//       setSearchTotalPages(res.data.totalPages);
//     } catch (err) {
//       toast.error("Search failed");
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     if (searchTitle.trim() === "") {
//       setSearchResults(null);
//     }
//   }, [searchTitle]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:3000/jobs/count")
//       .then((res) => setJobCount(res.data.count))
//       .catch((err) => console.error("Failed to fetch job count:", err));
//   }, []);

//   const formatDate = (dateString: string) => {
//     const options: Intl.DateTimeFormatOptions = {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const formatSalary = (salary: number) => {
//     if (salary >= 1000) {
//       return `$${(salary / 1000).toFixed(0)}k/year`;
//     }
//     return `$${salary}/year`;
//   };

//   const renderJobCard = (job: Job) => (
//     <div
//       key={job.jobId}
//       className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-300 group"
//     >
//       <div className="flex justify-between items-start mb-4">
//         <div className="flex items-center space-x-3">
//           <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
//             {categoryIcons[job.category] || <FaBriefcase size={20} />}
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
//               {job.title}
//             </h3>
//             <p className="text-gray-600 text-sm flex items-center mt-1">
//               <FaBuilding className="mr-2 text-blue-500" size={12} />
//               {job.company}
//             </p>
//           </div>
//         </div>
//         <span
//           className={`text-center px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[job.category] || "bg-gray-100 text-gray-800 border-gray-200"}`}
//         >
//           {job.category}
//         </span>
//       </div>

//       <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
//         <div className="flex items-center space-x-4">
//           <span className="flex items-center">
//             <FaMapMarkerAlt className="mr-1 text-red-500" size={12} />
//             {job.location}
//           </span>
//           <span className="flex items-center">
//             <FaClock className="mr-1 text-gray-400" size={12} />
//             {formatDate(job.created_at)}
//           </span>
//         </div>
//       </div>

//       <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//         <span className="font-semibold text-blue-600 text-lg">
//           {formatSalary(job.salary)}
//         </span>
//         <button
//           onClick={() => setSelectedJob(job)}
//           className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white"
//         >
//           <span>View Details</span>
//           <FaArrowUp
//             className="transform rotate-45 group-hover:rotate-0 transition-transform duration-200"
//             size={14}
//           />
//         </button>
//       </div>
//     </div>
//   );

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             if (entry.target === heroRef.current && !hasHeroAnimated) {
//               setHasHeroAnimated(true);
//             } else if (
//               entry.target === searchResultsRef.current &&
//               !hasSearchAnimated
//             ) {
//               setHasSearchAnimated(true);
//             } else if (
//               entry.target === popularCategoriesRef.current &&
//               !hasPopularAnimated
//             ) {
//               setHasPopularAnimated(true);
//             } else if (
//               entry.target === featuredJobsRef.current &&
//               !hasFeaturedAnimated
//             ) {
//               setHasFeaturedAnimated(true);
//             }
//           }
//         });
//       },
//       { threshold: 0.3 }
//     );

//     if (heroRef.current) observer.observe(heroRef.current);
//     if (searchResultsRef.current) observer.observe(searchResultsRef.current);
//     if (popularCategoriesRef.current)
//       observer.observe(popularCategoriesRef.current);
//     if (featuredJobsRef.current) observer.observe(featuredJobsRef.current);

//     return () => observer.disconnect();
//   }, [
//     hasHeroAnimated,
//     hasSearchAnimated,
//     hasPopularAnimated,
//     hasFeaturedAnimated,
//   ]);

//   return (
//     <main className="min-h-screen bg-gray-50 font-sans">
//       <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
//       <div className="sticky top-0 z-50 bg-white shadow-sm">
//         <TopBar
//           setIsLoginOpen={setIsLoginOpen}
//           setIsRegistrationOpen={setIsRegistrationOpen}
//         />
//       </div>

//       <div
//         ref={heroRef}
//         className={`relative h-[500px] bg-black text-white flex flex-col justify-center items-center bg-cover bg-center transition-all duration-700 ${
//           hasHeroAnimated
//             ? "opacity-100 translate-y-0"
//             : "opacity-0 translate-y-10"
//         }`}
//         style={{
//           backgroundImage:
//             "url('https://edwardscampus.ku.edu/sites/edwards/files/2023-01/jobsearch-blogpost-Jan-2023%20%281%29.jpg')",
//         }}
//       >
//         <div className="text-center px-4">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight animate-fade-in">
//             Discover Your Next Career Opportunity
//           </h1>
//           <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in-up">
//             {jobCount !== null
//               ? `Explore ${jobCount}+ job opportunities tailored for you`
//               : "Loading job opportunities..."}
//           </p>
//           <div className="flex bg-white rounded-lg p-2 shadow-lg w-full max-w-3xl mx-auto">
//             <input
//               type="text"
//               placeholder="Search by job title, company, or keyword..."
//               className="flex-grow p-3 rounded-lg outline-none text-gray-700 placeholder-gray-400"
//               value={searchTitle}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                 setSearchTitle(e.target.value);
//                 setSearchPage(1);
//               }}
//               onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
//                 if (e.key === "Enter") {
//                   handleSearch(1);
//                 }
//               }}
//             />
//             {searchTitle && (
//               <button
//                 onClick={() => {
//                   setSearchTitle("");
//                   setSearchResults([]);
//                   setIsSearching(false);
//                   setSearchPage(1);
//                   setSearchTotalPages(0);
//                 }}
//                 className="text-gray-500 hover:text-rose-500 p-2"
//                 aria-label="Clear search"
//               >
//                 <FaTimes />
//               </button>
//             )}
//             <button
//               className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition"
//               onClick={() => handleSearch(1)}
//               aria-label="Search"
//             >
//               <FaSearch />
//             </button>
//           </div>
//         </div>
//       </div>

//       {searchResults && searchTitle.trim() !== "" && (
//         <section
//           ref={searchResultsRef}
//           className={`py-12 px-4 max-w-7xl mx-auto transition-all duration-700 ${
//             hasSearchAnimated
//               ? "opacity-100 translate-y-0"
//               : "opacity-0 translate-y-10"
//           }`}
//         >
//           <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
//             Search Results for "{searchTitle}"
//           </h2>

//           {searchResults.length === 0 ? (
//             <p className="text-center text-gray-500 text-lg">
//               No jobs found for "{searchTitle}". Try a different keyword.
//             </p>
//           ) : (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {searchResults.map(renderJobCard)}
//               </div>
//               <div className="flex justify-center mt-8 gap-3">
//                 <button
//                   disabled={searchPage <= 1}
//                   className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium transition disabled:opacity-50 hover:bg-gray-300"
//                   onClick={() => handleSearch(searchPage - 1)}
//                 >
//                   Previous
//                 </button>
//                 <span className="px-4 py-2 text-gray-800 font-medium">
//                   Page {searchPage} of {searchTotalPages}
//                 </span>
//                 <button
//                   disabled={searchPage >= searchTotalPages}
//                   className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium transition disabled:opacity-50 hover:bg-indigo-700"
//                   onClick={() => handleSearch(searchPage + 1)}
//                 >
//                   Next
//                 </button>
//               </div>
//             </>
//           )}
//         </section>
//       )}

//       <section
//         ref={popularCategoriesRef}
//         className={`py-12 bg-white transition-all duration-700 ${
//           hasPopularAnimated
//             ? "opacity-100 translate-y-0"
//             : "opacity-0 translate-y-10"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-8">
//             Explore Popular Job Categories
//           </h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
//             {popularCategories.map((cat, i) => {
//               const icon = categoryIcons[cat.category] || <FaUserTie />;
//               const color = categoryColors[cat.category] || "bg-indigo-500";
//               return (
//                 <div
//                   key={i}
//                   className={`${color} text-black rounded-lg p-4 flex flex-col justify-center items-center shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg`}
//                 >
//                   <div className="text-2xl mb-2">{icon}</div>
//                   <span className="font-medium">{cat.category}</span>
//                   <span className="text-sm opacity-80">{cat.count} Jobs</span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       <section
//         ref={featuredJobsRef}
//         className={`py-12 px-4 max-w-7xl mx-auto transition-all duration-700 ${
//           hasFeaturedAnimated
//             ? "opacity-100 translate-y-0"
//             : "opacity-0 translate-y-10"
//         }`}
//       >
//         <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
//           Featured Job Listings
//         </h2>
//         <div className="flex justify-center flex-wrap gap-2 mb-8">
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
//                 activeCategory === cat
//                   ? "bg-indigo-600 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//               onClick={() => {
//                 setActiveCategory(cat);
//                 setVisibleCount(6);
//               }}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {(jobsByCategory[activeCategory] || [])
//             .slice(0, visibleCount)
//             .map(renderJobCard)}
//         </div>

//         {(jobsByCategory[activeCategory]?.length || 0) > visibleCount && (
//           <div className="text-center mt-8">
//             <button
//               onClick={handleSeeMore}
//               className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
//             >
//               Show More Jobs
//             </button>
//           </div>
//         )}
//       </section>

//       {selectedJob && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 transition-opacity duration-500">
//           <div className="bg-white/95 backdrop-blur-2xl max-w-2xl w-full rounded-3xl p-8 relative shadow-2xl border border-blue-200 transform transition-all duration-500 hover:scale-[1.02]">
//             <button
//               onClick={() => {
//                 setSelectedJob(null);
//                 setCoverLetter("");
//               }}
//               className="absolute top-6 right-6 text-gray-600 hover:text-rose-500 transition-colors duration-300"
//               aria-label="Close job details"
//             >
//               <FaTimes size={24} />
//             </button>
//             <h2 className="text-3xl font-extrabold text-blue-900 mb-3">
//               {selectedJob.title}
//             </h2>
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center text-gray-600">
//                 <FaBuilding className="mr-2 text-indigo-500" />
//                 <span className="font-medium">{selectedJob.company}</span>
//               </div>
//               <div className="flex items-center text-gray-500">
//                 <FaMapMarkerAlt className="mr-2 text-rose-500" />
//                 <span>{selectedJob.location}</span>
//               </div>
//             </div>
//             <div className="bg-gray-50 p-6 rounded-xl mb-6 border border-gray-100">
//               <p className="text-gray-700 leading-relaxed text-sm">
//                 {selectedJob.description}
//               </p>
//             </div>
//             <div className="flex items-center justify-between mb-6">
//               <p className="text-indigo-600 font-semibold flex items-center">
//                 <FaDollarSign className="mr-1" />
//                 {selectedJob.salary.toLocaleString("en-US", {
//                   style: "currency",
//                   currency: "USD",
//                   maximumFractionDigits: 0,
//                 })}
//               </p>
//               <p className="text-gray-400 text-xs flex items-center">
//                 <FaClock className="mr-2" /> Posted on{" "}
//                 {formatDate(selectedJob.created_at)}
//               </p>
//             </div>
//             <div className="mb-6">
//               <label
//                 htmlFor="coverLetter"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 Cover Letter (Optional)
//               </label>
//               <textarea
//                 id="coverLetter"
//                 value={coverLetter}
//                 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
//                   setCoverLetter(e.target.value)
//                 }
//                 placeholder="Write a brief cover letter to highlight your qualifications..."
//                 className="w-full p-4 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-400 outline-none text-gray-900 placeholder:text-gray-400 resize-none"
//                 rows={4}
//               />
//             </div>
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={() => {
//                   setSelectedJob(null);
//                   setCoverLetter("");
//                 }}
//                 className="px-5 py-2.5 rounded-lg text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
//                 aria-label="Cancel application"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleApplyJob(selectedJob.jobId)}
//                 className="px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:shadow-md transition-all duration-200"
//                 aria-label="Apply for job"
//               >
//                 <FaEnvelope size={20} /> Apply Now
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <AboutSection />
//       <CountingStats />
//       <Footer />

//       {isRegistrationOpen && (
//         <RegistrationModal onClose={() => setIsRegistrationOpen(false)} />
//       )}
//       {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
//     </main>
//   );
// }
"use client";
import { JSX, useEffect, useRef, useState } from "react";
import axios from "axios";
import TopBar from "./topBar/page";
import { Toaster, toast } from "react-hot-toast";
import {
  FaUserTie,
  FaCode,
  FaPencilRuler,
  FaBrain,
  FaMoneyBill,
  FaBullhorn,
  FaChartLine,
  FaCogs,
  FaSearch,
  FaTimes,
  FaArrowRight,
  FaMapMarkerAlt,
  FaBuilding,
  FaTag,
  FaClock,
  FaDollarSign,
  FaEnvelope,
  FaBriefcase,
  FaArrowUp,
  FaChartBar,
  FaLaptopCode,
  FaUsers,
  FaHeadset,
  FaMobileAlt,
  FaCheckCircle,
  FaServer,
  FaCodeBranch,
} from "react-icons/fa";
import RegistrationModal from "./register/page";
import LoginModal from "./login/page";
import Footer from "./footer/page";
import CountingStats from "./countingStats/page";
import AboutSection from "./about/page";

type Job = {
  jobId: number;
  title: string;
  description: string;
  location: string;
  category: string;
  company: string;
  salary: number;
  created_at: string;
};

export default function HomePage() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [jobsByCategory, setJobsByCategory] = useState<{
    [key: string]: Job[];
  }>({});
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchResults, setSearchResults] = useState<Job[] | null>(null);
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [jobCount, setJobCount] = useState<number | null>(null);
  const [coverLetter, setCoverLetter] = useState("");

  const heroRef = useRef<HTMLDivElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const popularCategoriesRef = useRef<HTMLDivElement>(null);
  const featuredJobsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const [hasHeroAnimated, setHasHeroAnimated] = useState(false);
  const [hasSearchAnimated, setHasSearchAnimated] = useState(false);
  const [hasPopularAnimated, setHasPopularAnimated] = useState(false);
  const [hasFeaturedAnimated, setHasFeaturedAnimated] = useState(false);
  const [hasAboutAnimated, setHasAboutAnimated] = useState(false);

  useEffect(() => {
    const fetchCategoriesAndJobs = async () => {
      try {
        const res = await axios.get("http://localhost:3000/jobs/categories");
        setCategories(res.data);
        if (res.data.length > 0) {
          setActiveCategory(res.data[0]);
        }
        res.data.forEach(async (category: string) => {
          const jobRes = await axios.get(
            `http://localhost:3000/jobs/category/${category}`
          );
          setJobsByCategory((prev) => ({ ...prev, [category]: jobRes.data }));
        });
      } catch (err) {
        console.error("Failed to fetch categories or jobs:", err);
      }
    };
    fetchCategoriesAndJobs();
  }, []);

  const [popularCategories, setPopularCategories] = useState<
    { category: string; count: number }[]
  >([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/jobs/popular-categories")
      .then((res) => setPopularCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSeeMore = () => setVisibleCount((prev) => prev + 6);

  const categoryIcons: Record<string, JSX.Element> = {
    Development: <FaCode />,
    Design: <FaPencilRuler />,
    Government: <FaUserTie />,
    Marketing: <FaBullhorn />,
    Finance: <FaMoneyBill />,
    Mechanical: <FaCogs />,
    Engineering: <FaBrain />,
    Business: <FaChartLine />,
    "Data Science": <FaChartBar />,
    "Software Engineering": <FaLaptopCode />,
    "Human Resources": <FaUsers />,
    "Customer Support": <FaHeadset />,
    "Mobile Development": <FaMobileAlt />,
    "Quality Assurance": <FaCheckCircle />,
    Sales: <FaDollarSign />,
    DevOps: <FaServer />,
    Management: <FaUserTie />,
    "Software Development": <FaCodeBranch />,
  };

  const categoryColors: Record<string, string> = {
    Development: "bg-blue-200 text-blue-900 border-blue-400",
    Design: "bg-teal-200 text-teal-900 border-teal-400",
    Government: "bg-slate-300 text-slate-900 border-slate-500",
    Marketing: "bg-purple-200 text-purple-900 border-purple-400",
    Finance: "bg-emerald-200 text-emerald-900 border-emerald-400",
    Mechanical: "bg-cyan-200 text-cyan-900 border-cyan-400",
    Engineering: "bg-indigo-200 text-indigo-900 border-indigo-400",
    Business: "bg-gray-300 text-gray-900 border-gray-500",
    "Data Science": "bg-violet-200 text-violet-900 border-violet-400",
    "Software Engineering": "bg-blue-300 text-blue-900 border-blue-500",
    "Human Resources": "bg-lime-200 text-lime-900 border-lime-400",
    "Customer Support": "bg-green-200 text-green-900 border-green-400",
    "Mobile Development": "bg-cyan-300 text-cyan-900 border-cyan-500",
    "Quality Assurance": "bg-cyan-200 text-cyan-900 border-cyan-400",
    Sales: "bg-orange-200 text-orange-900 border-orange-400",
    DevOps: "bg-amber-200 text-amber-900 border-amber-400",
    Management: "bg-slate-400 text-slate-900 border-slate-600",
    "Software Development": "bg-blue-250 text-blue-900 border-blue-450",
  };

  const handleApplyJob = async (jobId: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to apply for a job.");
      setIsLoginOpen(true);
      return;
    }

    try {
      const userRes = await axios.get("http://localhost:3000/job-seekers/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = userRes.data;

      if (!user.resumeUrl) {
        toast.error("Please upload your resume before applying.");
        return;
      }

      await axios.post(
        "http://localhost:3000/job-applications",
        {
          jobId,
          jobSeekerId: user.jobSeekerId,
          coverLetter: coverLetter || "I am interested in this position.",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Job application submitted successfully!");
      setSelectedJob(null);
      setCoverLetter("");
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("You've already applied for this job.");
      } else {
        toast.error("Failed to apply. Please try again later.");
        console.error(error);
      }
    }
  };

  const handleSearch = async (page = 1) => {
    if (!searchTitle.trim()) {
      setSearchResults([]);
      setSearchTotalPages(0);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const res = await axios.get("http://localhost:3000/jobs/search", {
        params: {
          title: searchTitle,
          page,
          limit: 6,
        },
      });

      setSearchResults(res.data.results);
      setSearchPage(res.data.currentPage);
      setSearchTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("Search failed");
      console.error(err);
    }
  };

  useEffect(() => {
    if (searchTitle.trim() === "") {
      setSearchResults(null);
    }
  }, [searchTitle]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/jobs/count")
      .then((res) => setJobCount(res.data.count))
      .catch((err) => console.error("Failed to fetch job count:", err));
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatSalary = (salary: number) => {
    if (salary >= 1000) {
      return `$${(salary / 1000).toFixed(0)}k/year`;
    }
    return `$${salary}/year`;
  };

  const renderJobCard = (job: Job) => (
    <div
      key={job.jobId}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-300 group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
            {categoryIcons[job.category] || <FaBriefcase size={20} />}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {job.title}
            </h3>
            <p className="text-gray-600 text-sm flex items-center mt-1">
              <FaBuilding className="mr-2 text-blue-500" size={12} />
              {job.company}
            </p>
          </div>
        </div>
        <span
          className={`text-center px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[job.category] || "bg-gray-100 text-gray-800 border-gray-200"}`}
        >
          {job.category}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <FaMapMarkerAlt className="mr-1 text-red-500" size={12} />
            {job.location}
          </span>
          <span className="flex items-center">
            <FaClock className="mr-1 text-gray-400" size={12} />
            {formatDate(job.created_at)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="font-semibold text-blue-600 text-lg">
          {formatSalary(job.salary)}
        </span>
        <button
          onClick={() => setSelectedJob(job)}
          className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white"
        >
          <span>View Details</span>
          <FaArrowUp
            className="transform rotate-45 group-hover:rotate-0 transition-transform duration-200"
            size={14}
          />
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === heroRef.current && !hasHeroAnimated) {
              setHasHeroAnimated(true);
            } else if (
              entry.target === searchResultsRef.current &&
              !hasSearchAnimated
            ) {
              setHasSearchAnimated(true);
            } else if (
              entry.target === popularCategoriesRef.current &&
              !hasPopularAnimated
            ) {
              setHasPopularAnimated(true);
            } else if (
              entry.target === featuredJobsRef.current &&
              !hasFeaturedAnimated
            ) {
              setHasFeaturedAnimated(true);
            } else if (entry.target === aboutRef.current && !hasAboutAnimated) {
              setHasAboutAnimated(true);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (searchResultsRef.current) observer.observe(searchResultsRef.current);
    if (popularCategoriesRef.current)
      observer.observe(popularCategoriesRef.current);
    if (featuredJobsRef.current) observer.observe(featuredJobsRef.current);
    if (aboutRef.current) observer.observe(aboutRef.current);

    return () => observer.disconnect();
  }, [
    hasHeroAnimated,
    hasSearchAnimated,
    hasPopularAnimated,
    hasFeaturedAnimated,
    hasAboutAnimated,
  ]);

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <TopBar
          setIsLoginOpen={setIsLoginOpen}
          setIsRegistrationOpen={setIsRegistrationOpen}
        />
      </div>

      {/* Hero Section */}
      <section id="home" ref={heroRef}>
        <div
          className={`relative h-[500px] bg-black text-white flex flex-col justify-center items-center bg-cover bg-center transition-all duration-700 ${
            hasHeroAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
          style={{
            backgroundImage:
              "url('https://edwardscampus.ku.edu/sites/edwards/files/2023-01/jobsearch-blogpost-Jan-2023%20%281%29.jpg')",
          }}
        >
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Discover Your Next Career Opportunity
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              {jobCount !== null
                ? `Explore ${jobCount}+ job opportunities tailored for you`
                : "Loading job opportunities..."}
            </p>
            <div className="flex bg-white rounded-lg p-2 shadow-lg w-full max-w-3xl mx-auto">
              <input
                type="text"
                placeholder="Search by job title, company, or keyword..."
                className="flex-grow p-3 rounded-lg outline-none text-gray-700 placeholder-gray-400"
                value={searchTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchTitle(e.target.value);
                  setSearchPage(1);
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    handleSearch(1);
                  }
                }}
              />
              {searchTitle && (
                <button
                  onClick={() => {
                    setSearchTitle("");
                    setSearchResults([]);
                    setIsSearching(false);
                    setSearchPage(1);
                    setSearchTotalPages(0);
                  }}
                  className="text-gray-500 hover:text-rose-500 p-2"
                  aria-label="Clear search"
                >
                  <FaTimes />
                </button>
              )}
              <button
                className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition"
                onClick={() => handleSearch(1)}
                aria-label="Search"
              >
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results Section */}
      {searchResults && searchTitle.trim() !== "" && (
        <section
          id="search"
          ref={searchResultsRef}
          className={`py-12 px-4 max-w-7xl mx-auto transition-all duration-700 ${
            hasSearchAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
            Search Results for "{searchTitle}"
          </h2>

          {searchResults.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">
              No jobs found for "{searchTitle}". Try a different keyword.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map(renderJobCard)}
              </div>
              <div className="flex justify-center mt-8 gap-3">
                <button
                  disabled={searchPage <= 1}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium transition disabled:opacity-50 hover:bg-gray-300"
                  onClick={() => handleSearch(searchPage - 1)}
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-800 font-medium">
                  Page {searchPage} of {searchTotalPages}
                </span>
                <button
                  disabled={searchPage >= searchTotalPages}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium transition disabled:opacity-50 hover:bg-indigo-700"
                  onClick={() => handleSearch(searchPage + 1)}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {/* Popular Categories Section */}
      <section
        id="categories"
        ref={popularCategoriesRef}
        className={`py-12 bg-white transition-all duration-700 ${
          hasPopularAnimated
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">
            Explore Popular Job Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
            {popularCategories.map((cat, i) => {
              const icon = categoryIcons[cat.category] || <FaUserTie />;
              const color = categoryColors[cat.category] || "bg-indigo-500";
              return (
                <div
                  key={i}
                  className={`${color} text-black rounded-lg p-4 flex flex-col justify-center items-center shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg`}
                >
                  <div className="text-2xl mb-2">{icon}</div>
                  <span className="font-medium">{cat.category}</span>
                  <span className="text-sm opacity-80">{cat.count} Jobs</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section
        id="jobs"
        ref={featuredJobsRef}
        className={`py-12 px-4 max-w-7xl mx-auto transition-all duration-700 ${
          hasFeaturedAnimated
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
          Featured Job Listings
        </h2>
        <div className="flex justify-center flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => {
                setActiveCategory(cat);
                setVisibleCount(6);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(jobsByCategory[activeCategory] || [])
            .slice(0, visibleCount)
            .map(renderJobCard)}
        </div>

        {(jobsByCategory[activeCategory]?.length || 0) > visibleCount && (
          <div className="text-center mt-8">
            <button
              onClick={handleSeeMore}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Show More Jobs
            </button>
          </div>
        )}
      </section>

      {/* About Section */}
      <section
        id="about"
        ref={aboutRef}
        className={`transition-all duration-700 ${
          hasAboutAnimated
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <AboutSection />
      </section>

      {/* Counting Stats Section */}
      <CountingStats />

      {/* Footer */}
      <Footer />

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 transition-opacity duration-500">
          <div className="bg-white/95 backdrop-blur-2xl max-w-2xl w-full rounded-3xl p-8 relative shadow-2xl border border-blue-200 transform transition-all duration-500 hover:scale-[1.02]">
            <button
              onClick={() => {
                setSelectedJob(null);
                setCoverLetter("");
              }}
              className="absolute top-6 right-6 text-gray-600 hover:text-rose-500 transition-colors duration-300"
              aria-label="Close job details"
            >
              <FaTimes size={24} />
            </button>
            <h2 className="text-3xl font-extrabold text-blue-900 mb-3">
              {selectedJob.title}
            </h2>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-600">
                <FaBuilding className="mr-2 text-indigo-500" />
                <span className="font-medium">{selectedJob.company}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <FaMapMarkerAlt className="mr-2 text-rose-500" />
                <span>{selectedJob.location}</span>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl mb-6 border border-gray-100">
              <p className="text-gray-700 leading-relaxed text-sm">
                {selectedJob.description}
              </p>
            </div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-indigo-600 font-semibold flex items-center">
                <FaDollarSign className="mr-1" />
                {selectedJob.salary.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-gray-400 text-xs flex items-center">
                <FaClock className="mr-2" /> Posted on{" "}
                {formatDate(selectedJob.created_at)}
              </p>
            </div>
            <div className="mb-6">
              <label
                htmlFor="coverLetter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Cover Letter (Optional)
              </label>
              <textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setCoverLetter(e.target.value)
                }
                placeholder="Write a brief cover letter to highlight your qualifications..."
                className="w-full p-4 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-400 outline-none text-gray-900 placeholder:text-gray-400 resize-none"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setCoverLetter("");
                }}
                className="px-5 py-2.5 rounded-lg text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                aria-label="Cancel application"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApplyJob(selectedJob.jobId)}
                className="px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:shadow-md transition-all duration-200"
                aria-label="Apply for job"
              >
                <FaEnvelope size={20} /> Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isRegistrationOpen && (
        <RegistrationModal onClose={() => setIsRegistrationOpen(false)} />
      )}
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
    </main>
  );
}
