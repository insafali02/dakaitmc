"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const MIN_VISIBLE_MS = 360;
const FAILSAFE_HIDE_MS = 12000;

function shouldIgnoreLink(event: MouseEvent, anchor: HTMLAnchorElement) {
  if (event.defaultPrevented) return true;
  if (event.button !== 0) return true;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return true;

  if (anchor.hasAttribute("download")) return true;
  if (anchor.target && anchor.target !== "_self") return true;

  const hrefAttr = anchor.getAttribute("href");
  if (!hrefAttr) return true;

  const lowered = hrefAttr.toLowerCase();
  if (
    lowered.startsWith("#") ||
    lowered.startsWith("mailto:") ||
    lowered.startsWith("tel:") ||
    lowered.startsWith("javascript:")
  ) {
    return true;
  }

  const nextUrl = new URL(anchor.href, window.location.href);
  if (nextUrl.origin !== window.location.origin) return true;

  if (
    nextUrl.pathname === window.location.pathname &&
    nextUrl.search === window.location.search
  ) {
    return true;
  }

  return false;
}

export function RouteTransitionLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentRouteKey = useMemo(
    () => `${pathname || ""}?${searchParams?.toString() || ""}`,
    [pathname, searchParams]
  );

  const [visible, setVisible] = useState(false);
  const startAtRef = useRef<number>(0);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failsafeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimers() {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    if (failsafeTimeoutRef.current) {
      clearTimeout(failsafeTimeoutRef.current);
      failsafeTimeoutRef.current = null;
    }
  }

  function startLoader() {
    if (visible) return;
    clearTimers();
    startAtRef.current = Date.now();
    setVisible(true);

    failsafeTimeoutRef.current = setTimeout(() => {
      setVisible(false);
      clearTimers();
    }, FAILSAFE_HIDE_MS);
  }

  function stopLoader() {
    if (!visible) return;
    const elapsed = Date.now() - startAtRef.current;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    clearTimers();
    hideTimeoutRef.current = setTimeout(() => {
      setVisible(false);
      clearTimers();
    }, remaining);
  }

  useEffect(() => {
    stopLoader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRouteKey]);

  useEffect(() => {
    function onClickCapture(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a");
      if (!anchor) return;
      if (shouldIgnoreLink(event, anchor as HTMLAnchorElement)) return;
      startLoader();
    }

    function onPopState() {
      startLoader();
    }

    document.addEventListener("click", onClickCapture, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", onClickCapture, true);
      window.removeEventListener("popstate", onPopState);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <div
      aria-hidden="true"
      className={`route-loader-overlay ${visible ? "route-loader-overlay-visible" : ""}`}
    >
      <div className="route-loader-core">
        <div className="route-loader-ring" />
        <div className="route-loader-ring route-loader-ring-delay" />
        <div className="route-loader-bar" />
      </div>
    </div>
  );
}

