"use client";

import { useEffect } from "react";

export  function DisableScrollLock() {
  useEffect(() => {
    const unlock = () => {
      // CSS attributes remove
      document.body.removeAttribute("data-scroll-locked");

      // Styles reset
      document.body.style.overflow = "auto";
      document.body.style.marginRight = "0px";
      document.body.style.position = "static";
      document.body.style.touchAction = "auto";
      document.body.style.pointerEvents = "auto";

      // Remove injected <style> tags from RemoveScroll
      document
        .querySelectorAll(
          'style[data-scroll-lock], style[hide-scrollbars], style#__remove_scroll__, style#removed-scroll-bar'
        )
        .forEach((el) => el.remove());
    };

    // Observe changes (Dropdown open/close)
    const ob = new MutationObserver(unlock);
    ob.observe(document.body, { attributes: true, subtree: true });
    
    // Call once immediately
    unlock();

    // Remove all scroll-blocking event listeners from window
    const restore = () => {
      window.onwheel = null;
      window.ontouchmove = null;
      window.onscroll = null;
    };

    restore();

    return () => ob.disconnect();
  }, []);

  return null;
}
