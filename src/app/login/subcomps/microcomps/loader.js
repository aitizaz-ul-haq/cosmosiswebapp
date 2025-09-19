"use client";
import "../../styles/loader.css";

export default function Loader({ size = 80, color = "#21CFB2", speed = "1s" }) {
  return (
    <div
      className="loader"
      style={{
        width: size,
        height: size,
        borderTopColor: color,
        animationDuration: speed,
      }}
    ></div>
  );
}
