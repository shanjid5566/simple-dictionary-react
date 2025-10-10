import "./App.css";

function App() {
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
      </div>
    </div>
  );
}

export default App;
