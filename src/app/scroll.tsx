"use client";

// MutationObserver ашиглахгүй — HeroUI-тай DOM тэмцэлгүй
// CSS override-р scroll lock-г унтраана
export function DisableScrollLock() {
  return (
    <style>{`
      body[data-scroll-locked] {
        overflow: auto !important;
        margin-right: 0 !important;
        position: static !important;
        touch-action: auto !important;
        pointer-events: auto !important;
      }
    `}</style>
  );
}
