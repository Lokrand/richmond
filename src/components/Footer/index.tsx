'use client';

import React from 'react';
import Link from 'next/link';
import { Divider } from '@heroui/react';

const Footer = () => (
    <footer
        className="
        mt-auto
        w-full
        bg-white/70 dark:bg-default-50
        backdrop-blur-md
        border-t border-default-200 dark:border-default-100
        shadow-inner
        text-center
        px-6 py-8
      "
    >
        <div className="text-sm text-foreground/50">
            ©
            {' '}
            {new Date().getFullYear()}
            {' '}
            Пушистик дня.
            Все коты любимы ❤️
        </div>
    </footer>
);

export default Footer;
