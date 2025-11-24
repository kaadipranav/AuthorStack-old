"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface LogoProps {
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    variant?: "default" | "community";
}

export function Logo({
    width = 32,
    height = 32,
    className = "",
    priority = false,
    variant = "default"
}: LogoProps) {
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

    const getLogoSrc = () => {
        if (variant === "community") {
            return isDimMode ? "/logos/Community_logo_dark.png" : "/logos/Community_logo_light.png";
        }
        return isDimMode ? "/logos/Dark_logo.png" : "/logos/Light_logo.png";
    };

    return (
        <Image
            src={getLogoSrc()}
            alt={variant === "community" ? "AuthorStack Community" : "AuthorStack logo"}
            width={width}
            height={height}
            priority={priority}
            className={className}
        />
    );
}
