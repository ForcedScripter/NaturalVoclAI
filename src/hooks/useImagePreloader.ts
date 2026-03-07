"use client";

import { useState, useEffect } from "react";

export function useImagePreloader(frameCount: number, basePath: string) {
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let loadedCount = 0;
        const imgArray: HTMLImageElement[] = [];

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            const paddedIndex = i.toString().padStart(3, "0");
            img.src = `${basePath}/ezgif-frame-${paddedIndex}.jpg`;

            img.onload = () => {
                loadedCount++;
                if (loadedCount === frameCount) {
                    setLoaded(true);
                }
            };

            imgArray.push(img);
        }

        setImages(imgArray);
    }, [frameCount, basePath]);

    return { images, loaded };
}
