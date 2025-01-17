import React, { useState } from "react";

const ChatForm = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResponse(data.response); // Assuming the server sends a `response` key in the JSON
    } catch (error) {
      console.error("Error submitting form:", error);
      setResponse("An error occurred. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} style={{ display: "flex" }}>
        <input
          type="text"
          name="prompt"
          placeholder="Enter your question..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
          style={{ width: 800 }}
        />
        <button type="submit">Ask</button>
      </form>

      {response && (
        <div
          className="response-container"
          dangerouslySetInnerHTML={{ __html: response }}
        />
      )}
    </div>
  );
};

export default ChatForm;
