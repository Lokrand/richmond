'use client';

import React from 'react';
import { Image } from '@heroui/react';

const IMAGES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

const Gallery = () => (
  <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
    {IMAGES.map((image) => (
      <div key={image} className="break-inside-avoid mb-4">
        <Image
          alt="HeroUI hero Image"
          src={`/${image}.jpg`}
          width={300}
          className="w-full rounded-xl"
        />
      </div>
    ))}
  </div>
);

export default Gallery;
