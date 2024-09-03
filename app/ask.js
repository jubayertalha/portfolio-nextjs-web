'use client';

import { useState, useEffect } from 'react';

export default function Ask() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [typing, setTyping] = useState(false);
  const [displayedAnswer, setDisplayedAnswer] = useState('');
  const [timeTaken, setTimeTaken] = useState('00:00');
  const [startTime, setStartTime] = useState(0);
  const [messages, setMessages] = useState([]);
  const [thinkingMessageIndex, setThinkingMessageIndex] = useState(1);

  useEffect(() => {
    let index = -1;

    if (typing && answer) {
      const interval = setInterval(() => {
        index++;
        setDisplayedAnswer((prev) => prev + answer[index]);
        if (index === answer.length - 1) {
          clearInterval(interval);
          setTyping(false);
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[thinkingMessageIndex] = { type: 'system', text: answer }; // Placeholder for typing effect
            return updatedMessages;
          });

          console.log(messages);
          console.log(thinkingMessageIndex);

          setThinkingMessageIndex(thinkingMessageIndex + 2);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [typing, answer]);

  useEffect(() => {
    let timer;
    if (loading) {
      setStartTime(Date.now());
      timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const seconds = String(elapsed % 60).padStart(2, '0');
        setTimeTaken(`${minutes}:${seconds}`);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [loading, startTime]);

  const handleAsk = async () => {
    setLoading(true);
    setError('');
    setAnswer('');
    setDisplayedAnswer('');
    setTimeTaken('00:00');
    setStartTime(Date.now());

    // Add user message to messages state without removing previous messages
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'user', text: query },
      { type: 'system', text: '' }
    ]);

    // Store the index of the "Thinking..." message

    // Clear the input box
    setQuery('');

    try {
      const response = await fetch('http://ai.trahman.me:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setAnswer(data.answer);

      // Update the specific "Thinking..." message with the answer
      // setMessages((prevMessages) => {
      //   const updatedMessages = [...prevMessages];
      //   updatedMessages[thinkingMessageIndex] = { type: 'system', text: answer }; // Placeholder for typing effect
      //   return updatedMessages;
      // });

      // Simulate typing effect
      setTyping(true);
    } catch (error) {
      setError('There was an error processing your request.');
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'system', text: error.message }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="flex flex-col space-y-4 bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hey, ask me anything about Talha!"
            className="flex-1 p-4 border border-gray-400 rounded-lg bg-white text-gray-900"
          />
          <button
            onClick={handleAsk}
            className="ml-2 p-4 bg-blue-600 text-white rounded-full flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                <span className="ml-2 text-xs font-normal">{timeTaken}</span>
              </div>
            ) : (
              <span className="text-xs font-normal">ASK</span>
            )}
          </button>
        </div>

        {/* Conditionally render the chat container */}
        {messages.length > 0 && (
          <div className="p-4 bg-gray-200 rounded-lg shadow-md space-y-4">
            {error && (
              <div className="mb-4 p-4 bg-red-200 text-red-800 rounded-lg">
                {error}
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start ${msg.type === 'user' ? 'justify-end' : ''}`}
              >
                {msg.type === 'user' ? (
                  <>
                    <div className={`p-4 rounded-lg bg-blue-100 text-right flex-1`}>
                      <p className="text-gray-800" style={{ fontFamily: 'Georgia, serif', fontSize: '16px' }}>
                        {msg.text}
                      </p>
                    </div>
                    <div className={`ml-2 w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center`}>
                      <img src="/favicon.ico" alt="User Logo" className="w-6 h-6" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`mr-2 w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center`}>
                      <img src="/favicon.ico" alt="Site Logo" className="w-6 h-6" />
                    </div>
                    <div className={`p-4 rounded-lg bg-gray-100 flex-1`}>
                      {msg.type === 'system' && index == thinkingMessageIndex && loading ? (
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">Thinking</span>
                          <div className="animate-bounce">
                            <span>.</span><span className="ml-1">.</span><span className="ml-1">.</span>
                          </div>
                        </div>
                      ) : msg.type === 'system' && index == thinkingMessageIndex ? (
                        <p className="text-gray-800" style={{ fontFamily: 'Georgia, serif', fontSize: '16px' }}>
                          {displayedAnswer}
                        </p>
                      ) : (
                        <p className="text-gray-800" style={{ fontFamily: 'Georgia, serif', fontSize: '16px' }}>
                          {msg.text}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
