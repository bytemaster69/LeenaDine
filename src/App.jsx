import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [answer, setAnswer] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [copyStatus, setCopyStatus] = useState("");

  const keywordsCustomer = [
    "Taste", 
    "Quality", 
    "Packaging", 
    "Freshness", 
    "Delivery Time", 
    "Customer Service", 
    "Hygiene"
  ];

  function handleRating(ratingValue) {
    setRating(ratingValue);
  }

  function toggleKeyword(keyword) {
    setSelectedKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword]
    );
  }

  async function generateAnswer() {
    setAnswer("Generating review...");

    // Construct the prompt dynamically
    const keywordText = selectedKeywords.join(", ");

    // Make the API call to Gemini
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBCkgmmPofxu_a5e9NYkx5dxxdLYIsXko0",
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: `Generate a ${rating}-star customer review for Leena's Dine. Focus on the following aspects: ${keywordText}. The review should describe the dining experience, meal quality, and delivery service. Make it SEO-friendly, simple, and humanized, avoiding formatting like bold or separators. Use language that resonates with customers and conveys satisfaction.review should be in 35 to 40 words. reviews should not have jargon word ,it should have be like normal consumer who had eaten their food`,
                },
              ],
            },
          ],
        },
      });

      setAnswer(response.data.candidates[0].content.parts[0].text);
    } catch (error) {
      setAnswer("Failed to generate review. Please try again.");
    }
  }

  function copyToClipboardAndRedirect() {
    navigator.clipboard.writeText(answer).then(() => {
      setCopyStatus("Review copied to clipboard! Redirecting...");

      setTimeout(() => {
        window.location.href = "https://g.page/r/CX2NjS7mh2TREBM/review";
      }, 1000); // Redirect after 2 seconds
    }).catch(() => {
      setCopyStatus("Failed to copy review. Please try again.");
    });
  }

  return (
    <div className="container">
      <h1>Leena's Dine AI Review</h1>

      <div>
        <h2>Rate Us</h2>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`star ${rating > index ? "selected" : ""}`}
            onClick={() => handleRating(index + 1)}
          >
            ★
          </span>
        ))}
      </div>

      <div>
        <h2>Select Keywords</h2>
        {keywordsCustomer.map((keyword) => (
          <button
            key={keyword}
            className={`keyword ${
              selectedKeywords.includes(keyword) ? "selected" : ""
            }`}
            onClick={() => toggleKeyword(keyword)}
          >
            {keyword}
          </button>
        ))}
      </div>

      <button onClick={generateAnswer}>Generate Review</button>

      <p>{answer}</p>

      {answer && (
        <button onClick={copyToClipboardAndRedirect}>Submit Review</button>
      )}

      {/* Display copy status */}
      {copyStatus && <p>{copyStatus}</p>}
    </div>
  );
}

export default App;
