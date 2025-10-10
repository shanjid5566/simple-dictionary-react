import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault(); 
    // Basic validation to ensure the user entered a word
    if (!word) {
      setError("Please enter a word.");
      setDefinition(null);
      return;
    }

    // Set loading state to true and clear previous results/errors
    setIsLoading(true);
    setDefinition(null);
    setError("");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/define/${word}`
      );
      setDefinition(response.data[0]);
      console.log(response.data[0])
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred.");
      setDefinition(null);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    // Main container with Tailwind CSS classes for styling
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
            Smart Dictionary
          </h1>
          <p className="text-gray-600 mt-2">
            Find meanings, phonetics, and more.
          </p>
        </header>
        {/* Search Form Section */}
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)} // Update 'word' state on input change
                placeholder="Enter a word..."
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button
                type="submit"
                disabled={isLoading} // Disable button while loading
                className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition disabled:bg-blue-300"
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
