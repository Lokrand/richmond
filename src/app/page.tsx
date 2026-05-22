'use client';

import React from 'react';
import { Card, CardHeader, CardBody, Image, Chip } from '@heroui/react';
import getCatYearNote from '@/utils/getCatAgeNote';

const catOfTheDay = {
    name: 'Ричик',
    age: 3,
    weight: 5.1,
    habits: ['Кусать за ноги', 'Ловить лучики солнца', 'Мурчать по утрам', 'Есть вкусняшки', 'Точить коготки', 'Играть с попрыгунчиками'],
    description: 'Ричик любит уютные места и всегда встречает всех мурлыканьем. Вообще он немного толстенький, но очень активный котик!',
    image: '/rich.jpg',
    breed: 'Серый-полосатый',
};

const HomePage = () => (
    <div className="flex justify-center mt-8 px-4">
        <Card className="max-w-xl w-full shadow-xl rounded-2xl bg-white/70 dark:bg-default-50 backdrop-blur-md border border-default-200 dark:border-default-100">
            <CardHeader className="flex flex-col items-center gap-4">
                <Image
                    src={catOfTheDay.image}
                    className="shadow-lg"
                    height={400}
                />

                <h1 className="text-3xl font-bold text-primary">{catOfTheDay.name}</h1>
                <div className="flex items-center justify-center flex-wrap gap-1 sm:gap-4 text-foreground/70">
                    <span className="flex items-center gap-1.5">
                        <span className="text-primary">🎂</span>
                        <span>
                            {catOfTheDay.age}
                            {' '}
                            {getCatYearNote(catOfTheDay.age)}
                        </span>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-default-300 hidden sm:block" />
                    <span className="flex items-center gap-1.5">
                        <span className="text-success">⚖️</span>
                        <span>
                            {catOfTheDay.weight}
                            {' '}
                            кг
                        </span>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-default-300 hidden sm:block" />
                    <span className="flex items-center gap-1.5">
                        <span className="text-secondary">🐱</span>
                        <span>{catOfTheDay.breed}</span>
                    </span>
                </div>
                <p className="text-foreground/70 text-center">{catOfTheDay.description}</p>
            </CardHeader>

            <CardBody className="flex flex-col gap-2 mt-2 pb-4">
                <div className="space-y-3">
                    <p className="font-semibold text-foreground flex items-center justify-center gap-2">
                        <span>🌟</span>
                        {' '}
                        Любимые привычки
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {catOfTheDay.habits.map((habit, i) => (
                            <Chip
                                key={i}
                                variant="flat"
                                color="primary"
                                className="px-3 py-1"
                            >
                                {habit}
                            </Chip>
                        ))}
                    </div>
                </div>
            </CardBody>
        </Card>
    </div>
);

export default HomePage;
