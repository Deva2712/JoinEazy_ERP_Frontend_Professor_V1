// src/pages/CohortNotes/utility/useNotesData.js

import { useState, useEffect } from "react";

const COLOR_COMBINATIONS = [
  { background: "#e8daff", text: "#6929c4" },
  { background: "#bae6ff", text: "#00539a" },
  { background: "#a7f0ba", text: "#0e6027" },
  { background: "#dde1e6", text: "#121619" },
  { background: "#9ef0f0", text: "#005d5d" },
];

const getRandomColor = () =>
  COLOR_COMBINATIONS[Math.floor(Math.random() * COLOR_COMBINATIONS.length)];

const MOCK_NOTES = [
  { id: 1, title: "Introduction to React", lastUpdated: "21st June", category: "Group 21",
    content: "This note covers the basics of React components, state management, and props.\n\nReact uses a component-based architecture where each component manages its own state.\n\nKey concepts include:\n- JSX syntax\n- Component lifecycle\n- Props and state\n- Event handling" },
  { id: 2, title: "JavaScript ES6 Features", lastUpdated: "5 hours ago", category: "Meeting 10th July",
    content: "Arrow functions, destructuring, template literals, and other ES6 features.\n\nconst add = (a, b) => a + b;\n\nconst {name, age} = person;" },
  { id: 3, title: "CSS Grid Layout", lastUpdated: "3 days ago", category: "Chatur Varma Inampudi • SE22UARI034",
    content: "Understanding CSS Grid for creating complex layouts.\n\nCSS Grid is a two-dimensional layout system." },
  { id: 4, title: "Node.js Fundamentals", lastUpdated: "23rd May", category: "Backend",
    content: "Server-side JavaScript with Node.js. Covers modules, npm, express framework, and building REST APIs." },
  { id: 5, title: "Database Design Principles", lastUpdated: "7th Jan", category: "Database Error Notes",
    content: "Relational database design, normalization, indexing, and best practices.\n\nFirst Normal Form (1NF):\n- Each table cell should contain a single value\n- Each record needs to be unique" },
];

const withColors = (notes) => notes.map((n) => ({ ...n, colors: n.colors || getRandomColor() }));

const useNotesData = (cohortId) => {
  const [notes,         setNotes]         = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);

  const fetchNotesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cohortAPI.getNotes(cohortId);
      if (!response.success) throw new Error(response.error || "Failed to fetch notes");
      const colored = withColors(response.data);
      setNotes(colored);
      setFilteredNotes(colored);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError(err.message || "Failed to load notes");
      const fallback = withColors(MOCK_NOTES);
      setNotes(fallback);
      setFilteredNotes(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cohortId) fetchNotesData();
  }, [cohortId]);

  return { notes, filteredNotes, loading, error, handleRetry: fetchNotesData };
};

export default useNotesData;