"use client";

import { Button } from "@heroui/button";
import { ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!showButton) return null;

  return (
    <Button
      onPress={scrollToTop}
      aria-label="Scroll to top"
      className="fixed text-white transition border shadow-2xl flex-center border-neutral-700 rounded-xl size-16 bottom-10 right-10 bg-dark"
      style={{ zIndex: 1000 }}
    >
      <ChevronUp className="size-4" />
    </Button>
  );
}
