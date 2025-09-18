"use client";
import { useState, useEffect } from "react";
import DesktopHeader from "./headercomponents/desktopheader";
import MobileHeader from "./headercomponents/mobileheader";
import "./styles/header.css";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
      console.log("one", window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    console.log("two", window.scrollY);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      console.log("three", window.scrollY);
    };
  }, []);

  return (
    <>
      <div className="header-main-wrapper">
        <DesktopHeader isScrolled={isScrolled} />
      </div>
      <div className="header-mobile-wrapper">
        <MobileHeader isScrolled={isScrolled} />
      </div>
    </>
  );
}
