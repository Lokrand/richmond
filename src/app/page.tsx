'use client';

import React, { useEffect, useState } from 'react';
import {
    Card, CardHeader, CardBody, CardFooter, Button, Image,
    Chip,
} from '@heroui/react';
import getCatYearNote from '@/utils/getCatAgeNote';
import { catApi } from '@/config';

const catOfTheDay = {
    name: 'Ричик',
    age: 3,
    weight: 5.1,
    habits: ['Кусать за ноги', 'Ловить лучики солнца', 'Мурчать по утрам', 'Есть вкусняшки'],
    description: 'Ричик любит уютные места и всегда встречает всех мурлыканьем.',
    image: '/rich.jpg',
    breed: 'Серый-полосатый',
};

const HomePage = () => {
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);

    const fetchCats = async () => {
        const res = await catApi.apiV1CatAllGet();
        console.log('cats', res.cats);
    };

    useEffect(() => {
        fetchCats();
    }, []);

    return (
        <div className="flex justify-center mt-8 px-4">
            <Card className="max-w-xl w-full shadow-xl rounded-2xl bg-white/70 dark:bg-default-50 backdrop-blur-md border border-default-200 dark:border-default-100">
                <CardHeader className="flex flex-col items-center gap-4">
                    <Image
                        src={catOfTheDay.image}
                        className="shadow-lg"
                        height={400}
                    />
                    <h1 className="text-3xl font-bold text-primary">{catOfTheDay.name}</h1>
                    <p className="text-foreground/70 text-center">{catOfTheDay.description}</p>
                </CardHeader>

                <CardBody className="flex flex-col gap-2 mt-2">
                    <div className="flex flex-row flex-wrap gap-4 mb-4 items-start justify-start">
                        <Chip color="primary">
                            <strong>Возраст:</strong>
                            {' '}
                            {catOfTheDay.age}
                            {' '}
                            {getCatYearNote(catOfTheDay.age)}
                        </Chip>
                        <Chip color="success">
                            <strong>Вес:</strong>
                            {' '}
                            {catOfTheDay.weight}
                            {' '}
                            кг
                        </Chip>
                        <Chip color="secondary">
                            <strong>Порода:</strong>
                            {' '}
                            {catOfTheDay.breed}
                        </Chip>
                    </div>
                    <p><strong>Любимые привычки:</strong></p>
                    <ul className="list-disc list-inside">
                        {catOfTheDay.habits.map((habit, i) => (
                            <li key={i}>{habit}</li>
                        ))}
                    </ul>
                </CardBody>

                <CardFooter className="flex justify-center gap-4 mt-4">
                    <Button
                        color="success"
                        variant="shadow"
                        onClick={() => setLikes(likes + 1)}
                    >
                        👍
                        {' '}
                        {likes}
                    </Button>
                    <Button
                        color="danger"
                        variant="shadow"
                        onClick={() => setDislikes(dislikes + 1)}
                    >
                        👎
                        {' '}
                        {dislikes}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default HomePage;
