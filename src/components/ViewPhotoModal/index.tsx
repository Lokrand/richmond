'use client';

import React, { FC, useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
    X,
    RotateCw,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useGesture } from '@use-gesture/react';
import { useSpring, animated, config } from 'react-spring';
import { TyCat } from '@/types';

type Props = {
    isOpen: boolean;
    onOpenChange: (value: boolean) => void;
    onClose: () => void;
    cat: TyCat;
    selectedImageIndex: number;
    setSelectedImageIndex: (value: React.SetStateAction<number>) => void;
    images?: Array<{ src: string; alt: string; label: string }>;
}

const ViewPhotoModal: FC<Props> = (props) => {
    const {
        isOpen,
        onOpenChange,
        onClose,
        cat,
        selectedImageIndex,
        setSelectedImageIndex,
        images,
    } = props;

    const [rotation, setRotation] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const isSwiping = useRef(false);
    const [swipeProgress, setSwipeProgress] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    const hasPreviewImages = Boolean(images?.length);

    const getImageSources = () => {
        if (hasPreviewImages) {
            return images?.map(img => img.src) || [];
        }
        const gallery = cat.gallery_original?.length ? cat.gallery_original : cat.gallery;
        return [cat.logo_original_path || cat.logo_path, ...gallery].filter(Boolean);
    };

    const allImages = getImageSources();
    const totalImages = allImages.length;

    const getImageUrl = (index: number) => {
        if (hasPreviewImages) {
            return images?.[index]?.src || '';
        }
        return allImages[index] || '';
    };

    const getImageLabel = (index: number) => {
        if (hasPreviewImages) {
            return images?.[index]?.label || '';
        }
        if (index === 0 && !hasPreviewImages) return 'Главное фото';
        return `${index + 1} / ${totalImages}`;
    };

    const currentIndex = hasPreviewImages 
        ? selectedImageIndex 
        : selectedImageIndex === -1 ? 0 : selectedImageIndex;

    const prevIndex = (currentIndex - 1 + totalImages) % totalImages;
    const nextIndex = (currentIndex + 1) % totalImages;

    const [{ scale, x, y }, api] = useSpring(() => ({
        scale: 1,
        x: 0,
        y: 0,
        config: config.gentle,
    }));

    useEffect(() => {
        api.start({ 
            scale: 1, 
            x: 0, 
            y: 0,
            config: config.gentle,
        });
        setRotation(0);
        isSwiping.current = false;
        setSwipeProgress(0);
        setIsZoomed(false);
    }, [selectedImageIndex, api]);

    const navigateImage = (direction: 'prev' | 'next') => {
        if (isZoomed) return;
        
        if (hasPreviewImages) {
            const imageCount = images?.length ?? 0;
            setSelectedImageIndex((prev) => (direction === 'prev'
                ? (prev === 0 ? imageCount - 1 : prev - 1)
                : (prev === imageCount - 1 ? 0 : prev + 1)));
        } else {
            if (totalImages === 0) return;
            setSelectedImageIndex((prev) => {
                const current = prev === -1 ? 0 : prev;
                return direction === 'prev'
                    ? (current === 0 ? totalImages - 1 : current - 1)
                    : (current === totalImages - 1 ? 0 : current + 1);
            });
        }
    };

    const bind = useGesture(
        {
            onDrag: ({ offset: [ox, oy], down, movement: [mx, my], velocity, first, last, cancel }) => {
                const isHorizontal = Math.abs(mx) > Math.abs(my);
                const isVertical = Math.abs(my) > Math.abs(mx);
                const isFastSwipe = Math.hypot(...velocity) > 0.5;

                if (first) {
                    isSwiping.current = false;
                }

                if (scale.get() === 1 && isHorizontal) {
                    if (!isSwiping.current) {
                        isSwiping.current = true;
                    }
                    
                    if (down) {
                        const progress = Math.min(Math.max(mx / window.innerWidth, -1), 1);
                        setSwipeProgress(progress);
                    }
                    
                    if (last && isSwiping.current) {
                        const shouldNavigate = Math.abs(mx) > 50 || isFastSwipe;
                        if (shouldNavigate) {
                            if (mx > 0) {
                                navigateImage('prev');
                            } else {
                                navigateImage('next');
                            }
                        }
                        setSwipeProgress(0);
                        isSwiping.current = false;
                        return;
                    }
                    return;
                }

                if (scale.get() > 1 || (scale.get() === 1 && isVertical && Math.abs(my) > 10)) {
                    setIsZoomed(down || scale.get() > 1);
                    api.start({ 
                        x: ox, 
                        y: oy,
                        immediate: down,
                        config: down ? config.default : config.gentle,
                    });
                    
                    if (last) {
                        setIsZoomed(scale.get() > 1);
                    }
                }
            },
            onPinch: ({ offset: [d], down, last }) => {
                const newScale = Math.min(Math.max(d, 0.5), 4);
                api.start({ 
                    scale: newScale,
                    immediate: down,
                    config: down ? config.default : config.gentle,
                });
                setIsZoomed(down || newScale > 1);
                if (last) {
                    setIsZoomed(newScale > 1);
                }
            },
            onWheel: ({ delta: [, dy] }) => {
                const newScale = Math.min(Math.max(scale.get() + dy * 0.01, 0.5), 4);
                api.start({ 
                    scale: newScale,
                    config: config.gentle,
                });
                setIsZoomed(newScale > 1);
            },
        },
        {
            drag: {
                from: () => [x.get(), y.get()],
                filterTaps: true,
                bounds: { 
                    left: -500 * scale.get(), 
                    right: 500 * scale.get(),
                    top: -500 * scale.get(), 
                    bottom: 500 * scale.get(),
                },
                rubberband: true,
                touchAction: 'none',
                preventDefault: true,
            },
            pinch: {
                scaleBounds: { min: 0.5, max: 4 },
                rubberband: true,
            },
        }
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'ArrowLeft':
                    navigateImage('prev');
                    break;
                case 'ArrowRight':
                    navigateImage('next');
                    break;
                case 'Escape':
                    onClose();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, navigateImage, onClose]);

    const handleRotateLeft = () => {
        setRotation((prev) => (prev - 90) % 360);
    };

    const handleRotateRight = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const resetTransform = () => {
        api.start({ 
            scale: 1, 
            x: 0, 
            y: 0,
            config: config.gentle,
        });
        setRotation(0);
        isSwiping.current = false;
        setSwipeProgress(0);
        setIsZoomed(false);
    };

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isSwipingActive = Math.abs(swipeProgress) > 0.001;
    const GAP = 8;

    const getImageStyle = (position: 'prev' | 'current' | 'next') => {
        const baseStyle = {
            position: 'absolute' as const,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none' as const,
            padding: `0 ${GAP}px`,
        };

        if (scale.get() === 1 && isSwipingActive && !isZoomed) {
            const progress = swipeProgress;
            const offset = progress * 100;
            
            switch (position) {
                case 'prev':
                    return {
                        ...baseStyle,
                        transform: `translateX(${-100 + offset - GAP}%)`,
                        opacity: Math.min(Math.abs(progress) * 3, 1),
                    };
                case 'next':
                    return {
                        ...baseStyle,
                        transform: `translateX(${100 + offset + GAP}%)`,
                        opacity: Math.min(Math.abs(progress) * 3, 1),
                    };
                case 'current':
                default:
                    return {
                        ...baseStyle,
                        transform: `translateX(${offset}%)`,
                        opacity: 1,
                    };
            }
        }

        switch (position) {
            case 'prev':
                return { ...baseStyle, transform: `translateX(-${100 + GAP}%)`, opacity: 0 };
            case 'next':
                return { ...baseStyle, transform: `translateX(${100 + GAP}%)`, opacity: 0 };
            case 'current':
            default:
                return { ...baseStyle, transform: 'translateX(0%)', opacity: 1 };
        }
    };

    const renderImage = (src: string, alt: string, position: 'prev' | 'current' | 'next') => {
        if (!src) return null;
        const style = getImageStyle(position);
        return (
            <div key={position} style={style}>
                <animated.img
                    src={src}
                    alt={alt}
                    className="max-w-full max-h-[90vh] object-contain touch-none select-none w-full h-full"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        scale: position === 'current' ? scale : 1,
                        x: position === 'current' ? x : 0,
                        y: position === 'current' ? y : 0,
                        touchAction: 'none',
                    }}
                    loading="eager"
                    decoding="async"
                    draggable={false}
                    onDoubleClick={resetTransform}
                />
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                hideCloseButton
                className="h-[100dvh] w-[100dvw] max-w-none border-0 bg-black/95 p-0 sm:rounded-none select-none touch-none"
            >
                <div 
                    ref={containerRef}
                    className="relative flex min-h-screen items-center justify-center overflow-hidden"
                    style={{ touchAction: 'none' }}
                    {...bind()}
                >
                    {renderImage(getImageUrl(prevIndex), 'prev', 'prev')}
                    {renderImage(getImageUrl(currentIndex), 'current', 'current')}
                    {renderImage(getImageUrl(nextIndex), 'next', 'next')}

                    <button
                        type="button"
                        className="absolute top-4 right-4 z-50 bg-black/50 text-white hover:bg-black/70 rounded-full p-2 transition-colors"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </button>

                    <div className="absolute top-4 left-4 z-50 bg-black/50 text-white px-3 py-1 rounded-full text-sm pointer-events-none">
                        {getImageLabel(currentIndex)}
                    </div>

                    {!isMobile && (
                        <>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-3 bg-black/50 rounded-full px-4 py-2">
                                <button 
                                    type="button" 
                                    className="text-white hover:text-primary transition-colors p-1"
                                    onClick={() => navigateImage('prev')}
                                    disabled={isZoomed}
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button 
                                    type="button" 
                                    className="text-white hover:text-primary transition-colors p-1"
                                    onClick={handleRotateLeft}
                                >
                                    <RotateCcw size={24} />
                                </button>
                                <button 
                                    type="button" 
                                    className="text-white hover:text-primary transition-colors p-1"
                                    onClick={handleRotateRight}
                                >
                                    <RotateCw size={24} />
                                </button>
                                <button 
                                    type="button" 
                                    className="text-white hover:text-primary transition-colors p-1"
                                    onClick={() => navigateImage('next')}
                                    disabled={isZoomed}
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>

                            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 text-white/50 text-xs bg-black/30 px-3 py-1 rounded-full pointer-events-none">
                                Колесико для зума • Двойной клик для сброса
                            </div>
                        </>
                    )}

                    {isMobile && scale.get() === 1 && !isZoomed && (
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-40 pointer-events-none flex justify-between px-4 opacity-50">
                            <div className="text-white/30 text-4xl">‹</div>
                            <div className="text-white/30 text-4xl">›</div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewPhotoModal;
