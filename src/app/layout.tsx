import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Providers from './providers';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Пушистик дня',
    description: 'Приложение о любимых котиках',
    manifest: '/manifest.webmanifest',
    icons: {
        icon: [
            { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: [{ url: '/icons/icon-180.png', sizes: '180x180', type: 'image/png' }],
    },
    appleWebApp: {
        capable: true,
        title: 'Пушистик дня',
        statusBarStyle: 'default',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#7828c8',
};

const RootLayout = ({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
    <html lang="ru">
        <body className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen bg-background text-foreground`}>
            <Providers>
                <Header />
                <main className="flex-1 max-w-[1280px] w-full mx-auto px-0 sx:px-4 lg:px-0 py-0">
                    {children}
                </main>
                <Footer />
            </Providers>
        </body>
    </html>
);

export default RootLayout;
