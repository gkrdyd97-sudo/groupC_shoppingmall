'use client';

import { Button } from '@base-ui/react';
import React, { useRef, useState } from 'react';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';

interface ProductGalleryProps {
    images: string[];
    name: string;
}

export default function ProductGallery({
    images,
    name,
}: ProductGalleryProps): React.JSX.Element {
    const [selected, setSelected] = useState(0);
    const stripRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        stripRef.current?.scrollBy({
            left: direction === 'left' ? -200 : 200,
            behavior: 'smooth',
        });
    };

    const hasMany = images.length > 4;

    return (
        <div>
            <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                    src={images[selected]}
                    alt={name}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="relative mt-3">
                {hasMany && (
                    <button
                        type="button"
                        onClick={() => scroll('left')}
                        aria-label="이전 이미지"
                        className="-translate-y-1-2 absolute top-1/2 left-0 z-10 rounded-full bg-white/90 px-2 py-1 text-lg shadow"
                    >
                        <MdArrowBackIosNew />
                    </button>
                )}
                <div
                    ref={stripRef}
                    className="flex gap-2 overflow-x-auto scroll-smooth"
                >
                    {images.map((image, index) => (
                        <button
                            key={image}
                            type="button"
                            onClick={() => setSelected(index)}
                            className={`w-20 shrink-0 overflow-hidden border-2 ${
                                index === selected
                                    ? 'border-black'
                                    : 'border-transparent'
                            }`}
                        >
                            <img
                                src={image}
                                alt={'${name} ${index + 1} 번째 이미지'}
                                className="aspect-square w-full object-cover"
                            />
                        </button>
                    ))}
                </div>
                {hasMany && (
                    <button
                        type="button"
                        onClick={() => scroll('right')}
                        aria-label="다음 이미지"
                        className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow"
                    >
                        <MdArrowForwardIos />
                    </button>
                )}
            </div>
        </div>
    );
}
