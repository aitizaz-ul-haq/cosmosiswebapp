import Image from "next/image";
import LoginIcon from "./loginicon";

// Left side of the login page: logo, headline, description and the three highlights.
export default function LoginHero({ title, description, logo, features }) {
  return (
    <section className="login-hero">
      <Image
        className="login-hero-logo"
        src={logo.src}
        title={logo.title}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        priority
      />
      <h1 className="login-hero-title">{title}</h1>
      <p className="login-hero-description">{description}</p>

      <ul className="login-features">
        {features.map((f) => (
          <li className={`login-feature feature-${f.id}`} key={f.id}>
            <span className="login-feature-icon">
              <LoginIcon name={f.id} size={24} strokeWidth={1.7} />
            </span>
            <span className="login-feature-text">
              {f.line1}
              <br />
              {f.line2}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
