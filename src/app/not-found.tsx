'use client';

import React from 'react';
import {
    Button, Card, CardHeader, CardContent,
} from '@/components/ui';
import Link from 'next/link';

const NotFound = () => (
    <div className="flex flex-col items-center justify-center text-center px-4 pt-20">
        <Card className="max-w-lg w-full p-6 shadow-2xl rounded-2xl bg-white/70 dark:bg-default-50 backdrop-blur-md border border-default-200">
            <CardHeader className="flex flex-col items-center justify-center gap-4">
                <img
                    alt="Lost cat illustration"
                    src="/lost-cat.jpg"
                    width={180}
                    height={180}
                    className="rounded-full shadow-lg"
                />
                <h1 className="text-5xl font-bold text-primary">404</h1>
                <h2 className="text-2xl font-semibold text-foreground/80">
                    Ой! Кот убежал 🐾
                </h2>
            </CardHeader>

            <CardContent className="flex flex-col items-center justify-center gap-6">
                <p className="text-lg text-foreground/70 max-w-md">
                    Кажется, страница потерялась где-то среди пушистиков.
                    Попробуй вернуться на главную и найди своего кота снова!
                </p>

                <Button
                    as={Link}
                    href="/"
                    color="primary"
                    size="lg"
                    variant="shadow"
                    className="rounded-xl mt-4"
                >
                    Вернуться домой 🏠
                </Button>
            </CardContent>
        </Card>
    </div>
);

export default NotFound;
