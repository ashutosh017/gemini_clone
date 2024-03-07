import { useState } from "react";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();
  // console.log(user);
  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const getResponse = async () => {
    if (!value) {
      return;
    }

    try {
      setLoading(true);

      const input = value;
      setValue("");
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: input,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("/gemini", options);
      const data = await response.text();

      setChatHistory((oldHistory) => [
        ...oldHistory,
        { role: "user", parts: input, timestamp: new Date() },
        { role: "model", parts: data, timestamp: new Date() },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setChatHistory((oldHistory) => [
        ...oldHistory,
        {
          role: "user",
          parts: value,
          timestamp: new Date(),
        },
        {
          role: "model",
          parts: "Oops! Something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    if (e.key === "Enter" && !loading) {
      getResponse();
    }
  };

  const clear = () => {
    setChatHistory([]);
    setValue("");
  };

  const formatTimestamp = (timestamp) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(timestamp);
  };

  return (
    <div className="bg-gray-100 h-screen flex flex-col">
      <div className="bg-blue-500 p-4 text-white flex justify-between items-center">
        <span className="text-lg font-semibold">ChatBot</span>

        <div>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4 ">
              <div className="flex space-x-2">
                <img
                  src={user.picture}
                  className="w-8 rounded-full"
                  alt="user"
                />
                <p className="text-xl">Hello, {user.name}</p>
              </div>
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="border bg-transparent hover:bg-white hover:text-blue-500 px-2 py-1 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={loginWithRedirect}
              className="border bg-transparent hover:bg-white hover:text-blue-500 px-2 py-1 rounded"
            >
              Login
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto ">
        {chatHistory.map((chatItem, i) => (
          <div
            key={i}
            className={`flex mb-4 ${
              chatItem.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${
                chatItem.role === "user" ? "bg-blue-500" : "bg-green-500"
              } text-white p-3 rounded-lg shadow`}
            >
              <p className=" whitespace-pre-wrap">{chatItem.parts}</p>
              {chatItem.timestamp && (
                <span className="text-xs mt-1 text-gray-300">
                  {formatTimestamp(chatItem.timestamp)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 flex items-center">
        <input
          className="flex-1 border rounded-l px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
          type="text"
          placeholder="Type your message..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
          onKeyDown={handleSend}
        />
        <button
          disabled={!value || loading}
          className="border bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-400 focus:outline-none"
          onClick={getResponse}
        >
          {loading ? "Sending..." : "Send"}
        </button>
        <button
          onClick={clear}
          className="border bg-transparent hover:bg-white hover:text-blue-500 px-2 py-1 rounded"
        >
          Clear Chat
        </button>
      </div>
    </div>
  );
}

export default App;
