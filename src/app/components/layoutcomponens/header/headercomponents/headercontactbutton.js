import Link from "next/link";
import "../styles/headercontactbutton.css";

export default function HeaderContactButton({ name }) {
  return (
    <>
      <Link
        href="#demo"
        className="footer-list-item font-inter"
        title="Email us (opens your mail app)"
        aria-label="Email info@nemesisam.com"
        prefetch={false}
      >
        <button className="header-contact-button font-inria">{name}</button>
      </Link>
    </>
  );
}
