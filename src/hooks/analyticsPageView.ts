"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnalyticsEvents } from "@/lib/analytics";

export function AnalyticsPageView() {

    const pathname = usePathname();

    useEffect(() => {

        AnalyticsEvents.pageView({

            title: document.title,

            path: pathname,

            location: window.location.href,

        });

    }, [pathname]);

    return null;
}