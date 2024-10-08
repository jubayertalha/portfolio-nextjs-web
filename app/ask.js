'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

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
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false); // Added state for collapsing
  const textareaRef = useRef(null);

  // Array for bubbly texts
  const bubblyTexts = [
    'Tell me about Talha.',
    'Who are Talha\'s friends?',
    'Tell me about Talha\'s programming journey.'
  ];

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
            updatedMessages[thinkingMessageIndex] = { 
              type: 'system', 
              text: answer, 
              time: `Responded in ${timeTaken}m`
            };
            return updatedMessages;
          });

          setThinkingMessageIndex(thinkingMessageIndex + 2);
        }
      }, 10);
      return () => clearInterval(interval);
    }
  }, [typing, answer, timeTaken]);

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
    const trimmedQuery = query.trim();

    // Validation to ensure query has more than one letter and is not empty or just spaces
    if (trimmedQuery.length <= 1 || typing) return;

    setLoading(true);
    setError('');
    setAnswer('');
    setDisplayedAnswer('');
    setTimeTaken('00:00');
    setStartTime(Date.now());

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'user', time: '', text: query, animation: 'user-chat' },
      { type: 'system', time: '', text: '' }
    ]);

    setQuery('');

    // Reset textarea size
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
    }

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

      setTyping(true);
    } catch (error) {
      setError('There was an error processing your request.');
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'system', time: '', text: error.message }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow new line with Shift + Enter
        return;
      } else {
        // Trigger Ask only if Enter is pressed alone
        e.preventDefault();
        
        // Trim the query and check if it has more than one letter
        if (query.trim().length > 1 && !typing && !loading) {
          handleAsk();
        }
      }
    }
  }, [query, handleAsk]);  

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      const maxHeight = 96; // Max height in pixels (6 lines of text roughly)
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`; // Adjust height
      textareaRef.current.style.overflowY = textareaRef.current.scrollHeight > maxHeight ? 'auto' : 'hidden'; // Conditional scrollbar
    }
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleBubblyClick = (text) => {
    setQuery(text);
    if (textareaRef.current) {
      textareaRef.current.focus(); // Focus the textarea
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
    if (!isCollapsed) {
      // Scroll to the top when collapsing
      window.scrollTo({top: 0, behavior: "smooth"});
    }
  };

  return (
    <div className="flex flex-col items-center mb-8 mx-12">
      <div className="flex flex-col space-y-4 bg-indigo-400 p-6 rounded-lg shadow-lg w-full">
        {/* Bubbly texts section */}
        <div className="relative flex items-center mx-5">
          {bubblyTexts.map((text, index) => (
            <div
              key={index}
              className={`rounded-full bg-white text-gray-500 px-4 py-2 text-xs font-medium shadow-md ${hoveredIndex === index ? 'animate-none' : 'animate-float'} cursor-pointer`}
              style={{ margin: '0.5rem', position: 'relative' }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleBubblyClick(text)}
            >
              {text}
            </div>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <textarea
            ref={textareaRef}
            value={query}
            onChange={handleChange}
            placeholder="Hey, ask me anything about Talha!"
            className="flex-1 p-4 border border-gray-400 rounded-lg bg-white text-gray-900 resize-none"
            onKeyDown={handleKeyDown}
            rows={1}
            style={{ minHeight: '3rem', maxHeight: '96px' }}
          />
          <button
            onClick={handleAsk}
            className="ml-2 p-2 bg-blue-800 text-white rounded-full flex items-center justify-center shadow-lg transform hover:bg-blue-600"
            disabled={loading || query.trim().length <= 1 || typing} // Disable if loading or query is too short
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                <span className="ml-2 text-xs font-normal">{timeTaken}</span>
              </div>
            ) : (
              <img src="/send.ico" alt="Send" className="w-6 h-6 filter invert shadow-sm" />
            )}
          </button>
        </div>

        <div className={`relative flex flex-col space-y-4 w-full overflow-hidden transition-max-height duration-1000 ease-in-out ${isCollapsed ? 'max-h-0' : 'max-h-[10000px]'}`}>
          {!isCollapsed && messages.length > 0 && (
            <div className="p-4 rounded-lg shadow-md space-y-4">
              {error && (
                <div className="mb-4 p-4 bg-red-200 text-red-800 rounded-lg">
                  {error}
                </div>
              )}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.type === 'user' ? (
                    <div className={`flex items-start space-x-2 ${msg.animation || ''}`}>
                      <div className="flex-1 min-w-0">
                        <div className="p-4 rounded-lg bg-blue-100 text-left">
                          <p className="text-gray-800" style={{ fontFamily: 'Georgia, serif', fontSize: '16px' }}>
                            {msg.text}
                          </p>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        {/* Reduced image size and kept image aligned to the top */}
                        <img src="/user.ico" alt="User Logo" className="w-7 h-7 object-cover" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start">
                      <div className="flex items-start">
                        <div className="mr-2 w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          {/* Reduced image size and kept image aligned to the top */}
                          <img src="/favicon.ico" alt="Site Logo" className="w-7 h-7 object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="p-4 rounded-lg bg-gray-100">
                            {msg.type === 'system' && index === thinkingMessageIndex && loading ? (
                              <div className="flex items-center space-x-2">
                                {/* <span className="font-semibold">Thinking</span> */}
                                <div className="animate-bounce">
                                  <span>.</span><span className="ml-1">.</span><span className="ml-1">.</span>
                                </div>
                              </div>
                            ) : msg.type === 'system' && index === thinkingMessageIndex ? (
                              <div>
                                <p className="text-gray-800" style={{ fontFamily: 'Georgia, serif', fontSize: '16px' }}>
                                  {displayedAnswer}
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-gray-800" style={{ fontFamily: 'Georgia, serif', fontSize: '16px' }}>
                                  {msg.text}
                                </p>
                              </div>
                            )}
                          </div>
                          {msg.time && (
                            <p className="text-xs text-gray-500 mt-1 ml-2">
                              {msg.time}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {messages.length > 0 && (
          <button
            onClick={toggleCollapse}
            className="mx-auto">
            {isCollapsed ? <img src="/expand.ico" alt="Expand" className="w-10 h-10 transform hover:scale-110 transition-transform duration-200" /> : <img src="/collapse.ico" alt="Collapse" className="w-10 h-10 transform hover:scale-110 transition-transform duration-200" />}
          </button>
        )}
      </div>
    </div>
  );
}
