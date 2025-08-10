"use client";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "../utils/nprogress";

NProgress.configure({ showSpinner: false });
NProgress.setColor("var(--accent-1)");
export function Progress() {
  const pathname = usePathname();
  const renderId = useRef(Date.now());
  const searchParams = useSearchParams();
  useEffect(() => {
    NProgress.done();
    return () => {
      NProgress.remove();
    };
  }, [pathname, searchParams, renderId.current]);
  return null;
}
