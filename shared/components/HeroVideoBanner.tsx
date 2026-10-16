'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';

export default function HeroVideoBanner() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [muted, setMuted] = useState(true);

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setMuted(video.muted);
    };

    return (
        <div className="relative h-[420px] w-full overflow-hidden md:h-[560px]">
            <video
                ref={videoRef}
                src="/banner/banner-runner.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 p-6 text-white md:p-12">
                <span className="text-xs font-semibold tracking-[0.2em] text-white/70 uppercase">
                    2026 Running Collection
                </span>
                <h1 className="text-3xl leading-tight font-extrabold md:text-5xl">
                    퇴근 후 러닝부터 주말 트레일까지
                </h1>
                <Link
                    href="/products"
                    className="mt-2 flex w-fit items-center gap-2 bg-white px-5 py-2.5 text-sm font-bold text-black transition-colors hover:bg-blue-500"
                >
                    전체 상품 보기
                </Link>
            </div>

            <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? '영상 소리 켜기' : '영상 소리 끄기'}
                className="absolute right-4 bottom-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:right-6 md:bottom-6"
            >
                {muted ? (
                    <FiVolumeX className="h-4 w-4" />
                ) : (
                    <FiVolume2 className="h-4 w-4" />
                )}
            </button>
        </div>
    );
}
