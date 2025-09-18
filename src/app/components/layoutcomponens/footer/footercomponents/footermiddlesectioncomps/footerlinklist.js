import Link from "next/link";

export default function FooterLinkList() {
  return (
    <ul className="footer-linklist">
      <li className="footer-linklist-item">
        <Link href="/" title="back to top" className="general-linkage">
          Home
        </Link>
      </li>
      <li className="footer-linklist-item">
        <Link href="#about" title="back to top" className="general-linkage">
          About{" "}
        </Link>
      </li>
      <li className="footer-linklist-item">
        <Link href="#reviews" title="back to top" className="general-linkage">
          Reviews{" "}
        </Link>
      </li>
      <li className="footer-linklist-item">
        <Link href="#process" title="back to top" className="general-linkage">
          Process{" "}
        </Link>
      </li>
      <li className="footer-linklist-item">
        <Link href="#features" title="back to top" className="general-linkage">
          Features{" "}
        </Link>
      </li>
      <li className="footer-linklist-item">
        <Link
          href="#technology"
          title="back to top"
          className="general-linkage"
        >
          Technology{" "}
        </Link>
      </li>
    </ul>
  );
}
