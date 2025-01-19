import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
const ChatApp = () => {
  const [messages, setMessages] = useState([]); // State to hold messages
  const [input, setInput] = useState(""); // State to hold the current input
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const navigate = useNavigate();

  const user = localStorage.getItem("user");

  // Check if token exists and validate it
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     navigate("/Login");
  //   } else {
  //     fetch("/protected-route", {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //       .then((response) => {
  //         if (!response.ok) {
  //           throw new Error("Unauthorized");
  //         }
  //         return response.json();
  //       })
  //       .then((data) => {
  //         console.log("Protected route accessed successfully:", data);
  //       })
  //       .catch((error) => {
  //         console.error("Error accessing protected route:", error);
  //         navigate("/Login");
  //       });
  //   }
  // }, [navigate]);

  // Function to handle sending the prompt and getting response from the API

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    console.log("User logged out");

    // Navigate to the login page
    navigate("/Login");
  };

  const sendMessage = async () => {
    if (input.trim()) {
      // Add user message to the state
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/Login");
        return;
      }
      const newMessages = [...messages, { sender: "user", text: input }];
      setMessages(newMessages);

      try {
        // Call the API to get a response based on the user's input
        const res = await fetch(`http://localhost:3000/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ prompt: input }),
        });

        const data = await res.json();
        const botResponse =
          data.response || "Sorry, I couldn't get a response."; // Ensure there's a response

        // Add bot's response to the state
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: botResponse },
        ]);
      } catch (error) {
        console.error("Error submitting prompt:", error);
        const botErrorMessage = "An error occurred. Please try again.";
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: botErrorMessage },
        ]);
      }
      setHasSentMessage(true);
    }
    setInput(""); // Clear input after sending
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          style={{ backgroundColor: "blue", color: "white", padding: 10 }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div
        style={{
          backgroundColor: "#222",
          height: "710px",
          margin: 0,
          padding: 0,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {hasSentMessage === true ? (
          <h1
            style={{
              paddingTop: hasSentMessage ? "30px" : "100px",
              fontSize: 50,
              color: "white",
            }}
          >
            AI ChatBot!
          </h1>
        ) : (
          <h1
            style={{
              paddingTop: hasSentMessage ? "30px" : "100px",
              fontSize: 50,
              color: "white",
            }}
          >
            welcome to AI ChatBot!
          </h1>
        )}

        <div style={{ paddingTop: hasSentMessage ? "20px" : "20px" }}>
          {!hasSentMessage && (
            <div
              style={{
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 30,
              }}
            >
              <h1 style={{ color: "whitesmoke" }}>Hello {user}!</h1>
              <h2 style={{ color: "whitesmoke", paddingTop: 5 }}>
                How can i help you today?
              </h2>
            </div>
          )}
          <div
            style={{
              maxWidth: "800px",
              minWidth: "800px",
              margin: "0 auto",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            {hasSentMessage && (
              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "scroll",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "10px",
                  marginBottom: "10px",
                }}
              >
                {messages.map((message, index) => (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    <div style={{ fontWeight: "bold", color: "#037bfc" }}>
                      {message.sender === "user" ? "You" : "Bot"}:
                    </div>
                    <div
                      style={{ color: "white" }}
                      dangerouslySetInnerHTML={{ __html: message.text }}
                    />
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                value={input}
                placeholder="Enter Prompt here..."
                onChange={(e) => setInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px",
                  marginRight: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  backgroundColor: "#037bfc",
                  color: "white",
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatApp;
