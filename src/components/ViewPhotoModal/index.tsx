'use client';

import React, { FC } from 'react';
import { PhotoSlider } from 'react-photo-view';
import { TyCat } from '@/types';

type Props = {
    isOpen: boolean;
    onOpenChange: (value: boolean) => void;
    onClose: () => void;
    cat: TyCat;
    selectedImageIndex: number;
    setSelectedImageIndex: (value: React.SetStateAction<number>) => void;
    images?: Array<{ src: string; alt: string; label: string }>;
};

const ViewPhotoModal: FC<Props> = ({
    isOpen,
    onOpenChange,
    onClose,
    cat,
    selectedImageIndex,
    setSelectedImageIndex,
    images,
}) => {
    const hasPreviewImages = Boolean(images?.length);

    const sources = hasPreviewImages
        ? (images ?? []).map((img) => img.src)
        : [
            cat.logo_original_path || cat.logo_path,
            ...(cat.gallery_original?.length ? cat.gallery_original : cat.gallery),
        ].filter(Boolean);

    const normalizedIndex = selectedImageIndex < 0 ? 0 : selectedImageIndex;

    return (
        <PhotoSlider
            images={sources.map((src, i) => ({
                src,
                key: `${src}-${i}`,
            }))}
            visible={isOpen}
            onClose={() => {
                onClose();
                onOpenChange(false);
            }}
            index={normalizedIndex}
            onIndexChange={(index) => setSelectedImageIndex(index)}
            maskOpacity={0.9}
            bannerVisible={false}
            photoClosable
            pullClosable
            loop={0}
        />
    );
};

export default ViewPhotoModal;
