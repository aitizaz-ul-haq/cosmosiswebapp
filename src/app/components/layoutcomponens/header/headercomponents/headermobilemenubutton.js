"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import "../styles/headermobilemenubutton.css";

export default function HeaderMobileMenuButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  // Disable/Enable body scroll when menu state changes
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // Cleanup on component unmount
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isMenuOpen]);

  const handleMobileMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveSubMenu(null);
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
    setActiveSubMenu(null);
  };

  const handleSubMenuToggle = (menu) => {
    setActiveSubMenu(activeSubMenu === menu ? null : menu);
  };

  return (
    <>
      <button
        className="header-mobile-menu-button"
        onClick={handleMobileMenuToggle}
      >
        <Image
          src="/images/mobile_menu_icon.png"
          alt="Mobile Menu Icon"
          width={40}
          height={40}
        />
      </button>
      {isMenuOpen && (
        <div className="mobile-menu">
          <button
            className="mobile-menu-close-button"
            onClick={handleMobileMenuToggle}
          >
            &times;
          </button>
          <div className="mobile-menu-imgcontainer">
            <Image
              src="/images/cosmosis-logo.png"
              alt="Mobile Menu Icon"
              width={158}
              height={54}
              className="mobile-menu-logo"
            />
          </div>

          <ul>
            <li className="font-poppins">
              <Link href="/" onClick={handleMenuItemClick}>
                Home
              </Link>
            </li>
            <li>
              <button
                onClick={() => handleSubMenuToggle("services")}
                className="submenu-toggle font-poppins"
              >
                Our Products
              </button>
              <ul
                className={`submenu ${
                  activeSubMenu === "services" ? "active" : ""
                }`}
              >
                {/* <li className="font-nunito">
                  <Link href="/ourproducts" onClick={handleMenuItemClick} className="submenu-item-text">
                    Products Overview
                  </Link>
                </li> */}
                <li className="font-nunito">
                  <Link
                    href="/ourproducts/fundstructuring"
                    onClick={handleMenuItemClick}
                    className="submenu-item-text"
                  >
                    Fund Structuring
                  </Link>
                </li>
                <li className="font-nunito">
                  <Link
                    href="/ourproducts/portfolioadvisory"
                    onClick={handleMenuItemClick}
                  >
                    Portfolio Advisory
                  </Link>
                </li>
                <li className="font-nunito">
                  <Link
                    href="/ourproducts/executionservices"
                    onClick={handleMenuItemClick}
                  >
                    Execution Services
                  </Link>
                </li>
                <li className="font-nunito">
                  <Link
                    href="/ourproducts/discretionaryportfolios"
                    onClick={handleMenuItemClick}
                  >
                    Discretionary Portfolios
                  </Link>
                </li>
                <li className="font-nunito">
                  <Link
                    href="/ourproducts/portfoliomanagersplatform"
                    onClick={handleMenuItemClick}
                  >
                    Portfolio Managers Platform
                  </Link>
                </li>
                <li className="font-nunito">
                  <Link
                    href="/ourproducts/appointedrepresentativeservices"
                    onClick={handleMenuItemClick}
                  >
                    Appointed Representative Services
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <button
                onClick={() => handleSubMenuToggle("approach")}
                className="submenu-toggle font-poppins"
              >
                Our Investment Approach
              </button>
              <ul
                className={`submenu ${
                  activeSubMenu === "approach" ? "active" : ""
                }`}
              >
                <li className="font-nunito">
                  <Link
                    href="/ourinvestmentapproach/focusinvesting"
                    onClick={handleMenuItemClick}
                  >
                    Focus Investing
                  </Link>
                </li>
                <li className="font-nunito">
                  <Link
                    href="/ourinvestmentapproach/investmentprocess"
                    onClick={handleMenuItemClick}
                  >
                    Investment Process
                  </Link>
                </li>
                <li className="font-nunito">
                  <Link
                    href="/ourinvestmentapproach/investmentphilosophy"
                    onClick={handleMenuItemClick}
                  >
                    Investment Philosophy
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <button
                onClick={() => handleSubMenuToggle("locations")}
                className="submenu-toggle font-poppins"
              >
                Our Locations
              </button>
              <ul
                className={`submenu ${
                  activeSubMenu === "locations" ? "active" : ""
                }`}
              >
                <li className="font-nunito">
                  <Link
                    href="/ourlocation/London"
                    onClick={handleMenuItemClick}
                  >
                    London
                  </Link>
                </li>
                <li className="font-nunito">
                  <Link
                    href="/ourlocation/Monaco"
                    onClick={handleMenuItemClick}
                  >
                    Monaco
                  </Link>
                </li>
              </ul>
            </li>
            <li className="font-poppins">
              <Link href="/ourpeople" onClick={handleMenuItemClick}>
                Our People
              </Link>
            </li>
            <li className="font-poppins">
              <Link href="/about" onClick={handleMenuItemClick}>
                About
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
