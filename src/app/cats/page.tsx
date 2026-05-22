'use client';

import React, { useState, useEffect } from 'react';
import {
    Card, Image, Button, Chip,
} from '@heroui/react';
import Link from 'next/link';
import getCatYearNote from '@/utils/getCatAgeNote';
import { catApi, getS3Path } from '@/config';
import { InternalApiCatCatResponse } from '@/client/models';
import { TyCat } from '@/types';

const mapToTyCat = (cat: InternalApiCatCatResponse): TyCat => {
    const birthDate = cat.birthDate ? new Date(cat.birthDate) : new Date();
    const now = new Date();
    const age = cat.birthDate
        ? Math.floor((now.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : 0;

    return {
        id: cat.catId ?? 0,
        name: cat.name ?? '',
        age,
        weight: cat.weight ?? 0,
        breed: cat.breed ?? '',
        habits: cat.habits ? cat.habits.split(',').map((h) => h.trim()) : [],
        description: '',
        logo_path: cat.titlePhoto?.url ?? '',
        gallery: cat.galleryPhotos?.map((p) => p?.url ?? '').filter(Boolean) ?? [],
    };
};

interface CatsData {
    cats: TyCat[];
}

const Gallery = () => {
    const [cats, setCats] = useState<TyCat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                setIsLoading(true);
                const response = await catApi.apiV1CatAllGet();
                const cats = (response.cats ?? []).map(mapToTyCat);
                setCats(cats);
            } catch (err) {
                console.error('Error fetching cats:', err);
                setError('Не удалось загрузить пушистиков');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCats();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 dark:from-default-100 dark:to-default-200 py-8 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                    </div>
                    <p className="text-foreground/70">Загружаем пушистиков...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 dark:from-default-100 dark:to-default-200 py-8 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="bg-danger-50 border border-danger-200 text-danger-700 px-6 py-4 rounded-lg mb-4">
                        {error}
                    </div>
                    <Button
                        color="primary"
                        variant="shadow"
                        onClick={() => window.location.reload()}
                    >
                        Попробовать снова
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 dark:from-default-100 dark:to-default-200 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">
                        Наши Пушистики&nbsp;🐱
                    </h1>
                    <p className="text-foreground/70 text-lg">
                        Выберите котика, чтобы увидеть его галерею и узнать больше
                    </p>

                    <Link href="/new-cat">
                        <Button color="success" variant="shadow" className="mt-4">
                            + Добавить нового пушистика
                        </Button>
                    </Link>
                </div>

                {cats.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-white/70 dark:bg-default-50 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-default-200 dark:border-default-100">
                            <p className="text-foreground/70 text-lg mb-4">Пока нет пушистиков 😿</p>
                            <Link href="/new-cat">
                                <Button color="primary" variant="shadow">
                                    Добавить первого пушистика
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cats.map((cat) => (
                            <Link key={cat.id} href={`/cats/${cat.id}`}>
                                <Card className="flex flex-row w-full p-2 shadow-lg rounded-2xl bg-white/70 dark:bg-default-50 backdrop-blur-md border border-default-200 dark:border-default-100 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                                    <Image
                                        // @ts-expect-error
                                        src={cat.logo || getS3Path(cat.logo_path) || '/default-cat.jpg'}
                                        className="shadow-md rounded-xl object-cover w-48 h-48"
                                        width={200}
                                        height={200}
                                        alt={cat.name}
                                    />
                                    <div className="flex flex-col gap-4 ml-4">

                                        <h2 className="text-xl font-bold text-primary">{cat.name}</h2>
                                        <div className="flex flex-wrap gap-2 text-xs text-foreground/60">
                                            <Chip color="primary">
                                                {cat.age}
                                                {' '}
                                                {getCatYearNote(cat.age)}
                                            </Chip>
                                            <Chip color="success">
                                                {cat.weight}
                                                {' '}
                                                кг
                                            </Chip>
                                            <Chip color="secondary">
                                                {cat.breed}
                                            </Chip>
                                        </div>
                                        <p className="text-foreground/70 text-sm">{cat.description}</p>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;
