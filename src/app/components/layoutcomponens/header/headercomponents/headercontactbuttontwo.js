import Link from "next/link";
import "../styles/headercontactbutton.css";

export default function HeaderContactButtonTwo({ name }) {
  return (
    <>
      <Link
        href="login"
        className="footer-list-item font-inter"
        title="Email us (opens your mail app)"
      >
        <button className="header-contact-button-two font-inria">{name}</button>
      </Link>
    </>
  );
}
