// Header.js
'use client';

import { useState, useEffect } from "react";

export default function Header() {
  const [animateHeader, setAnimateHeader] = useState(false);

  useEffect(() => {
    const listener = () => {
      if (window.scrollY > 140) {
        setAnimateHeader(true);
      } else setAnimateHeader(false);
    };
    window.addEventListener("scroll", listener);

    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, []);

  const menuItems = [
    { title: "Home", url: "http://web.trahman.me" },
    { title: "Portfolio", url: "http://web.trahman.me" },
    { title: "Contact", url: "http://web.trahman.me" }
  ];

  return (
    <header
      className={`w-full fixed top-0 z-10 backdrop-filter backdrop-blur-lg bg-white/50 transition ease-in-out duration-500 ${
        animateHeader && "shadow-xl"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`flex max-w-screen-xl py-10 ${
            animateHeader && "py-5"
          } mx-auto items-center justify-between px-8 transition ease-in-out duration-500`}
        >
          <a
            href="http://web.trahman.me"
            className="text-xl font-bold tracking-tighter text-indigo-400 pr-8"
          >
            Talha Jubayer
          </a>
          <nav>
            <ul className="flex items-center justify-start">
              {menuItems?.map((item) => (
                <li key={item?.title}>
                  <a
                    href={item?.url}
                    className="px-2 lg:px-6 py-6 text-md border-b-2 border-transparent hover:border-indigo-400 leading-[22px] md:px-3 text-gray-400 hover:text-indigo-500"
                  >
                    {item?.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
