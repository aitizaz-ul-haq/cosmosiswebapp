"use client";
import Link from "next/link";
import Image from "next/image";
import headerButtons from "../headerdata/headerButtons.json";
import { useState } from "react";

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Uses first path segment from button.link to derive a stable key */
function menuKeyFor(button) {
  if (button?.link) {
    try {
      const seg = new URL(button.link, "https://example.com").pathname.split("/").filter(Boolean)[0];
      if (seg) return seg; // "ourproducts", "ourinvestmentapproach", "ourlocation"
    } catch {}
  }
  return slugify(button?.name || "menu");
}

export default function HeaderRightSectionButtonSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <>
      {headerButtons.map((button, index) => {
        const hasDropdown = Array.isArray(button.subpages) && button.subpages.length > 0;
        const menuKey = hasDropdown ? menuKeyFor(button) : null;

        // Location menu → right icons; others → left icons
        const iconSide = menuKey === "ourlocation" ? "right" : "left";

        return (
          <div
            key={index}
            className={`header-button-wrapper ${menuKey ? `header-button-wrapper--${menuKey}` : ""}`}
            data-menu={menuKey || undefined}
            onMouseEnter={() => hasDropdown && setHoveredIndex(index)}
            onMouseLeave={() => hasDropdown && setHoveredIndex(null)}
          >
            <Link
              href={button.link}
              className="header-nobackground-button font-inria"
              title={button.title}
              aria-haspopup={hasDropdown ? "true" : undefined}
              aria-expanded={hasDropdown && hoveredIndex === index ? "true" : "false"}
            >
              {button.name}
            </Link>

            {hasDropdown && hoveredIndex === index && (
              <div
                className={`header-dropdown-menu header-dropdown-menu--${menuKey}`}
                data-menu={menuKey}
                role="menu"
              >
                {button.subpages.map((subpage, subIndex) => {
                  const src = subpage.iconSrc; // REQUIRED per your request
                  const alt = subpage.iconAlt || `${subpage.name} icon`;

                  const Icon = src ? (
                    <span
                      className={`header-dropdown-item__icon ${iconSide === "right" ? "header-dropdown-item__icon--right" : ""}`}
                      aria-hidden="true"
                    >
                      <Image
                        src={src}
                        alt={alt}
                        width={32}
                        height={32}
                        className="header-icon-img"
                      />
                    </span>
                  ) : null;

                  return (
                    <Link
                      key={subIndex}
                      href={subpage.link}
                      className={`header-dropdown-item font-inria header-dropdown-item--${menuKey}`}
                      role="menuitem"
                      title={subpage.title}
                    >
                      {iconSide === "left" && Icon}
                      <span className="header-dropdown-item__label">{subpage.name}</span>
                      {iconSide === "right" && Icon}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
