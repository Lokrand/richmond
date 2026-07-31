'use client';

import React, { FC, useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
    X,
    RotateCw,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { TyCat } from '@/types';
import { getS3Path } from '@/config';

type Props = {
    isOpen: boolean;
    onOpenChange: (value: boolean) => void;
    onClose: () => void;
    cat: TyCat;
    selectedImageIndex: number;
    setSelectedImageIndex: (value: React.SetStateAction<number>) => void;
}

const ViewPhotoModal: FC<Props> = (props) => {
    const {
        isOpen,
        onOpenChange,
        onClose,
        cat,
        selectedImageIndex,
        setSelectedImageIndex,
    } = props;

    const [rotation, setRotation] = useState(0);

    const navigateImage = (direction: 'prev' | 'next') => {
        if (!cat) return;

        if (direction === 'prev') {
            setSelectedImageIndex((prev) => (prev === 0 ? cat.gallery.length - 1 : prev - 1));
        } else {
            setSelectedImageIndex((prev) => (prev === cat.gallery.length - 1 ? 0 : prev + 1));
        }
        setRotation(0);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen || !cat) return;

            switch (e.key) {
                case 'ArrowLeft':
                    navigateImage('prev');
                    break;
                case 'ArrowRight':
                    navigateImage('next');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, cat, selectedImageIndex]);

    const handleRotateLeft = () => {
        setRotation((prev) => (prev - 90) % 360);
    };

    const handleRotateRight = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const resetTransform = () => {
        setRotation(0);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                hideCloseButton
                className="h-[100dvh] w-[100dvw] max-w-none border-0 bg-black/95 p-0 sm:rounded-none"
            >
                <div className="relative flex min-h-screen items-center justify-center touch-none p-0">
                    <button
                        type="button"
                        className="absolute top-4 right-4 z-50 bg-black/50 text-white hover:bg-black/70 rounded-full p-2 transition-colors"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </button>

                    <div className="absolute top-4 left-4 z-50 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {selectedImageIndex === -1 ? 'Главное фото' : `${selectedImageIndex + 1} / ${cat.gallery.length}`}
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-3 bg-black/50 rounded-full px-4 py-2">
                        <button type="button" className="text-white hover:text-primary transition-colors p-1" onClick={() => navigateImage('prev')}>
                            <ChevronLeft size={24} />
                        </button>
                        <button type="button" className="text-white hover:text-primary transition-colors p-1" onClick={handleRotateLeft}>
                            <RotateCcw size={24} />
                        </button>
                        <button type="button" className="text-white hover:text-primary transition-colors p-1" onClick={handleRotateRight}>
                            <RotateCw size={24} />
                        </button>
                        <button type="button" className="text-white hover:text-primary transition-colors p-1" onClick={() => navigateImage('next')}>
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    {cat.gallery.length > 0 && (
                        <img
                            src={getS3Path(selectedImageIndex === -1 ? cat.logo_path : cat.gallery[selectedImageIndex])}
                            alt={`${cat.name}`}
                            className="max-w-full max-h-[90vh] object-contain transition-transform duration-200"
                            style={{ transform: `rotate(${rotation}deg)` }}
                            onDoubleClick={resetTransform}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewPhotoModal;
