'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ROUTE_TITLES: Record<string, string> = {
    '/': 'Пушистик дня',
    '/new-cat': 'Добавить пушистика',
    '/cats': 'Наши Пушистики',
};

const DEFAULT_TITLE = 'Пушистик дня';

export const usePageTitle = () => {
    const pathname = usePathname();

    useEffect(() => {
        let pageTitle = DEFAULT_TITLE;

        const matchingRoutes = Object.entries(ROUTE_TITLES)
            .filter(([route]) => pathname.startsWith(route))
            .sort(([a], [b]) => b.length - a.length);

        if (matchingRoutes.length > 0) {
            pageTitle = matchingRoutes[0][1];
        }

        document.title = `${pageTitle} 🐱`;
    }, [pathname]);
};

export default usePageTitle;
