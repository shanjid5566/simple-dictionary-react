import { useState } from "react";
import "./App.css";
import axios from "axios";

const staticWordList = [
  "hello",
  "hell",
  "help",
  "happen",
  "happy",
  "house",
  "dictionary",
  "define",
  "definition",
  "data",
  "frontend",
  "function",
  "form",
  "fetch",
  "future",
];

// A small static mapping of some English words to Bangla meanings.
const banglaDictionary = {
  hello: "হ্যালো",
  hell: "নরক",
  help: "সহায়তা",
  happen: "ঘটা",
  happy: "সুখী",
  house: "বাড়ি",
  dictionary: "শব্দকোষ",
  define: "সংজ্ঞা",
  definition: "সংজ্ঞা",
  data: "তথ্য",
  frontend: "ফ্রন্টএন্ড",
  function: "ফাংশন",
  form: "ফরম",
  fetch: "আনা/ফেচ",
  future: "ভবিষ্যত",
};

function App() {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Compute Bangla meaning (if available) from the static mapping.
  // Use the current `word` input (trimmed + lowercased) first to avoid
  // mismatches from the API (extra spaces, capitalization), then fall
  // back to `definition.word` if `word` is empty.
  const lookupKey = word?.trim()?.toLowerCase() || definition?.word?.toLowerCase();
  const banglaMeaning = lookupKey ? banglaDictionary[lookupKey] : null;

  const handleWordChange = (e) => {
    const newWord = e.target.value.toLowerCase();
    setWord(newWord);

    // Logic to filter the static list for suggestions
    if (newWord.length < 2) {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions = staticWordList
      .filter((w) => w.startsWith(newWord))
      .slice(0, 5); // Limit to top 5

    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (suggestedWord) => {
    setWord(suggestedWord);
    setSuggestions([]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    // Basic validation to ensure the user entered a word
    setSuggestions([]);
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
        `https://dictionary-app-react-server.vercel.app/api/define/${word}`
      );
      setDefinition(response.data[0]);
      console.log(response.data[0]);
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred.");
      setDefinition(null);
    } finally {
      setIsLoading(false);
    }
  };

  const AudioPlayer = ({ phonetics }) => {
    if (!phonetics || phonetics.length === 0) return null;

    // Find the first phonetic entry that has an audio URL
    const audioSource = phonetics.find((p) => p.audio)?.audio;

    if (!audioSource) return null;

    return (
      <audio controls src={audioSource} className="w-full mt-4 rounded-md">
        Your browser does not support the audio element.
      </audio>
    );
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
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
          {/* Use a relative positioning container for the search box and suggestions */}
          <div className="relative">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={word}
                  onChange={handleWordChange} 
                  placeholder="Enter a word..."
                  className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition disabled:bg-blue-300"
                >
                  {isLoading ? "Searching..." : "Search"}
                </button>
              </div>
            </form>

            {/* 3. Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                {suggestions.map((s, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(s)} 
                    type="button" 
                    className="w-full text-left p-3 hover:bg-blue-50 text-gray-800 border-b border-gray-100 last:border-b-0 transition duration-150 ease-in-out"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>{" "}
          {/* End of relative container */}
        </div>
        {/* ... (rest of the component remains the same) */}
        <div className="max-w-2xl mx-auto mt-6">
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md"
              role="alert"
            >
              <strong className="font-bold">Oops! </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {definition && (
            <div className="bg-white p-6 rounded-xl shadow-md animate-fade-in">
              {/* Word and Phonetic Text */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 capitalize">
                    {definition.word}
                  </h2>
                  <p className="text-blue-500 text-lg">{definition.phonetic}</p>
                </div>
              </div>

              {/* Audio Player */}
              <AudioPlayer phonetics={definition.phonetics} />

              {/* Bangla Meaning Section */}
              <div className="mt-4">
                <h4 className="font-semibold text-gray-600">বাংলা অর্থ:</h4>
                {banglaMeaning ? (
                  <p className="text-gray-800 mt-2">{banglaMeaning}</p>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">বাংলা অর্থ উপলব্ধ নেই।</p>
                )}
              </div>

              {/* Meanings and Definitions */}
              {definition.meanings.map((meaning, index) => (
                <div key={index} className="mt-6 border-t pt-4">
                  <h3 className="text-xl font-semibold text-gray-700 italic">
                    {meaning.partOfSpeech}
                  </h3>
                  {meaning.definitions.map((def, defIndex) => (
                    <div key={defIndex} className="mt-3 pl-4">
                      <p className="text-gray-800">{def.definition}</p>
                      {def.example && (
                        <p className="text-gray-500 italic mt-1">
                          e.g., "{def.example}"
                        </p>
                      )}
                    </div>
                  ))}
                  {/* Synonyms */}
                  {meaning.synonyms && meaning.synonyms.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-600">Synonyms:</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {meaning.synonyms.map((synonym, synIndex) => (
                          <span
                            key={synIndex}
                            className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm"
                          >
                            {synonym}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {/* Source URL */}
              <div className="mt-6 border-t pt-4 text-sm text-gray-500">
                Source:{" "}
                <a
                  href={definition.sourceUrls[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {definition.sourceUrls[0]}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
