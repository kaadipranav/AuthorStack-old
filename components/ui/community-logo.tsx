"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface CommunityLogoProps {
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
}

export function CommunityLogo({ width = 300, height = 100, className = "", priority = false }: CommunityLogoProps) {
    const [isDimMode, setIsDimMode] = useState(false);

    useEffect(() => {
        // Check initial state
        const checkDimMode = () => {
            setIsDimMode(document.documentElement.classList.contains("dim"));
        };

        checkDimMode();

        // Watch for class changes on html element
        const observer = new MutationObserver(checkDimMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <Image
            src={isDimMode ? "/logos/Community_logo_dark.png" : "/logos/Community_logo_light.png"}
            alt="AuthorStack Community"
            width={width}
            height={height}
            priority={priority}
            className={className}
        />
    );
}
