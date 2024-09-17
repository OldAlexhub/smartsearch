import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import "./styles.css";

const SmartSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typedText, setTypedText] = useState(""); // State for the typewriter effect
  const [currentResultIndex, setCurrentResultIndex] = useState(0); // To handle multiple results

  // Fetch policies based on query
  const fetchPolicies = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/qahandbook/${query}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setResults([data]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching policies:", error);
      setLoading(false);
    }
  };

  // Debounced function to fetch policies after a delay
  const debouncedFetchPolicies = useCallback(debounce(fetchPolicies, 500), []);

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      debouncedFetchPolicies(value);
    } else {
      setResults([]);
      setTypedText("");
    }
  };

  // Typing effect logic
  useEffect(() => {
    if (results.length > 0) {
      const text = results[currentResultIndex]?.description || "";
      let index = 0;
      const typeWriterEffect = () => {
        if (index < text.length) {
          setTypedText((prev) => prev + text.charAt(index));
          index++;
          setTimeout(typeWriterEffect, 50); // Adjust the speed of typing here (in ms)
        }
      };

      setTypedText(""); // Reset typed text
      typeWriterEffect(); // Start the typewriter effect
    }
  }, [results, currentResultIndex]);

  return (
    <div className="search-container">
      {/* Introductory Section */}
      <div className="intro-section">
        <h1>Welcome to the AI-Powered Smart Policy Search</h1>
        <p>
          Leverage the power of AI with Python to quickly find relevant policies
          by simply typing a keyword. As you type, our intelligent search system
          analyzes your input and dynamically retrieves the most relevant
          policies. Watch as the results are displayed interactively, simulating
          a typewriter effect for a unique experience.
          <br />
          <br />
          Try searching for terms like <strong>"vacation policy"</strong>,{" "}
          <strong>"sick leave"</strong>, or <strong>"remote work"</strong> to
          get started!
        </p>
      </div>

      {/* Search Input */}
      <input
        type="text"
        className="search-input"
        placeholder="Search policies..."
        value={query}
        onChange={handleInputChange}
      />

      {/* Loading Spinner */}
      {loading ? <div className="spinner"></div> : null}

      {/* Results Section */}
      <div className="results-container">
        {results.length > 0 ? (
          <div className="result-card">
            <h2>{results[currentResultIndex]?.policy}</h2>
            <p>{typedText}</p>
          </div>
        ) : (
          <p>No policies found</p>
        )}
      </div>
    </div>
  );
};
export default SmartSearch;
