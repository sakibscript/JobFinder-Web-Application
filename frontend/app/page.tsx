"use client";
import { JSX, useEffect, useState } from "react";
import axios from "axios";
import TopBar from "./topBar/page";
import { Toaster } from "react-hot-toast";
import {
  FaUserTie,
  FaCode,
  FaPencilRuler,
  FaBrain,
  FaMoneyBill,
  FaBullhorn,
  FaChartLine,
  FaCogs,
} from "react-icons/fa";
import toast from "react-hot-toast";
import RegistrationModal from "./register/page";
import LoginModal from "./login/page";

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
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchResults, setSearchResults] = useState<Job[] | null>(null);
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [jobCount, setJobCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get("http://localhost:3000/jobs/categories");
      setCategories(res.data);
      setActiveCategory(res.data[0]);

      setCategories(res.data);
      if (res.data.length > 0) {
        setActiveCategory(res.data[0]);
      }
      // Fetch jobs for all categories
      res.data.forEach(async (category: string) => {
        const jobRes = await axios.get(
          `http://localhost:3000/jobs/category/${category}`
        );
        setJobsByCategory((prev) => ({ ...prev, [category]: jobRes.data }));
      });
    };

    fetchCategories();
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

  const [popularCompanies, setPopularCompanies] = useState<
    { company: string; count: number }[]
  >([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/jobs/popular-companies")
      .then((res) => setPopularCompanies(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSeeMore = () => setVisibleCount((prev) => prev + 3);

  const categoryIcons: Record<string, JSX.Element> = {
    Development: <FaCode />,
    Design: <FaPencilRuler />,
    Government: <FaUserTie />,
    Marketing: <FaBullhorn />,
    Finance: <FaMoneyBill />,
    Mechanical: <FaCogs />,
    Engineering: <FaBrain />,
    Business: <FaChartLine />,
  };

  const categoryColors: Record<string, string> = {
    Development: "bg-blue-500",
    Design: "bg-gray-700",
    Government: "bg-red-500",
    Marketing: "bg-yellow-500",
    Finance: "bg-green-500",
    Mechanical: "bg-purple-500",
    Engineering: "bg-pink-500",
    Business: "bg-indigo-500",
  };

  // Called when 'Apply Job' is clicked
  const handleApplyJob = async (jobId: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to apply for a job.");
      return;
    }

    try {
      // Get logged-in job seeker info
      const userRes = await axios.get("http://localhost:3000/job-seekers/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = userRes.data;

      if (!user.resumeUrl) {
        toast.error("Please upload your resume before applying.");
        return;
      }

      // Apply to job
      const applyRes = await axios.post(
        "http://localhost:3000/job-applications",
        {
          jobId,
          jobSeekerId: user.jobSeekerId,
          coverLetter: "I am interested in this position.",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Job application submitted successfully!");
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("You've already applied for this job.");
      } else {
        toast.error("Failed to apply. Try again later.");
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
      setIsSearching(true);
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-100 to-blue-200 relative">
      {/* TopBar overlapping */}
      <div className="absolute top-0 left-0 w-full z-10">
        <TopBar
          setIsLoginOpen={setIsLoginOpen}
          setIsRegistrationOpen={setIsRegistrationOpen}
        />
      </div>
      <Toaster position="top-center" />
      {/* Hero Section */}
      <div
        className="relative h-[400px] bg-black text-white flex flex-col justify-center items-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://edwardscampus.ku.edu/sites/edwards/files/2023-01/jobsearch-blogpost-Jan-2023%20%281%29.jpg')",
        }}
      >
        <h1 className="text-3xl font-bold">Find Your Next Job</h1>
        <p className="mb-6">
          {jobCount !== null
            ? `More than ${jobCount} jobs listed here.`
            : "Loading..."}
        </p>
        <div className="flex bg-white rounded-lg overflow-hidden shadow w-[90%] max-w-2xl relative">
          <input
            type="text"
            placeholder="Search by job title..."
            className="p-3 w-full outline-none text-black pr-10" // add right padding for ×
            value={searchTitle}
            onChange={(e) => {
              setSearchTitle(e.target.value);
              setSearchPage(1);
            }}
            onKeyDown={(e) => {
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
              className="absolute right-25 top-1/2 transform -translate-y-1/2 text-3xl w-8 h-8 leading-none flex items-center justify-center text-gray-500 hover:text-red-500"
              aria-label="Clear search"
            >
              ×
            </button>
          )}

          {/* Search Button */}
          <button
            className="bg-blue-600 text-white px-6"
            onClick={() => handleSearch(1)}
          >
            Search
          </button>
        </div>
      </div>
      {searchResults && searchTitle.trim() !== "" && (
        <section className="py-10 px-4 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-900 mb-8">
            Search Results for "{searchTitle}"
          </h2>

          {searchResults.length === 0 ? (
            <p className="text-center text-gray-600">
              No jobs found for "{searchTitle}"
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {searchResults.map((job) => (
                  <div
                    key={job.jobId}
                    className="bg-white shadow-lg rounded-xl p-5 transition-transform hover:scale-[1.02] hover:shadow-xl border border-blue-100"
                  >
                    <div className="mb-2">
                      <h3 className="text-lg font-bold text-blue-900">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-500">{job.company}</p>
                      <p className="text-sm text-gray-600">{job.location}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                      ${job.salary}
                    </span>
                    <div className="mt-4 text-right">
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="text-sm text-blue-600 hover:underline hover:text-blue-800 font-medium"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-8 gap-2">
                <button
                  disabled={searchPage <= 1}
                  className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"
                  onClick={() => handleSearch(searchPage - 1)}
                >
                  Prev
                </button>
                <span className="px-4 py-2 text-blue-800 font-semibold">
                  Page {searchPage} of {searchTotalPages}
                </span>
                <button
                  disabled={searchPage >= searchTotalPages}
                  className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"
                  onClick={() => handleSearch(searchPage + 1)}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      )}
      {/* Popular Categories */}
      <section className="py-12 text-center">
        <h2 className="text-2xl font-semibold mb-8 text-black-900">
          Popular Categories
        </h2>
        <div className="flex justify-center gap-6 flex-wrap">
          {popularCategories.map((cat, i) => {
            const icon = categoryIcons[cat.category] || <FaUserTie />;
            const color = categoryColors[cat.category] || "bg-blue-400";

            return (
              <div
                key={i}
                className={`w-32 h-32 ${color} text-white rounded flex flex-col justify-center items-center shadow-md hover:scale-105 transition`}
              >
                <div className="text-2xl mb-2">{icon}</div>
                <span className="font-medium">{cat.category}</span>
              </div>
            );
          })}
        </div>
      </section>
      {/* Jobs by Category */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-black-900 text-center mb-8">
          Jobs Listing
        </h2>

        {/* Category Tabs */}
        <div className="flex justify-center flex-wrap gap-4 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full transition font-semibold shadow ${
                activeCategory === cat
                  ? "bg-blue-600 text-white scale-105"
                  : "bg-white border text-gray-700 hover:bg-blue-100"
              }`}
              onClick={() => {
                setActiveCategory(cat);
                setVisibleCount(3);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {(jobsByCategory[activeCategory] || [])
            .slice(0, visibleCount)
            .map((job) => (
              <div
                key={job.jobId}
                className="bg-white shadow-lg rounded-xl p-5 transition-transform hover:scale-[1.02] hover:shadow-xl border border-blue-100"
              >
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-blue-900">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-500">{job.company}</p>
                  <p className="text-sm text-gray-600">{job.location}</p>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                  ${job.salary}
                </span>
                <div className="mt-4 text-right">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="text-sm text-blue-600 hover:underline hover:text-blue-800 font-medium"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* See More */}
        {(jobsByCategory[activeCategory]?.length || 0) > visibleCount && (
          <div className="text-center mt-10">
            <button
              onClick={handleSeeMore}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-semibold shadow hover:scale-105 transition"
            >
              Show More
            </button>
          </div>
        )}
      </section>
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white max-w-xl w-full rounded-lg p-6 relative shadow-lg">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-extrabold"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-blue-800 mb-2">
              {selectedJob.title}
            </h2>
            <p className="text-sm text-gray-600 mb-1">{selectedJob.company}</p>
            <p className="text-sm text-gray-600 mb-3">{selectedJob.location}</p>
            <p className="text-gray-800 mb-4">{selectedJob.description}</p>
            <p className="text-blue-800 font-bold text-lg mb-4">
              ${selectedJob.salary}
            </p>
            <button
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-lg hover:scale-105 transition font-semibold"
              onClick={() => handleApplyJob(selectedJob.jobId)}
            >
              Apply Job
            </button>
          </div>
        </div>
      )}
      {/* Stats Section */}
      <div className="bg-black text-white py-8 grid grid-cols-2 md:grid-cols-4 text-center">
        <div>
          <h3 className="text-2xl font-bold">1354</h3>
          <p>Job Post</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold">1741</h3>
          <p>Members</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold">1204</h3>
          <p>Resume</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold">142</h3>
          <p>Company</p>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} JobFinder | Designed by Sakib</p>
        <p>All rights reserved.</p>
      </footer>{" "}
      {isRegistrationOpen && (
        <RegistrationModal onClose={() => setIsRegistrationOpen(false)} />
      )}
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
    </main>
  );
}
