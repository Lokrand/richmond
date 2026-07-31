'use client';

import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Chip,
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
    Badge,
    Tip,
    CardContent,
} from '@/components/ui';
import {
    Heart,
    Sparkles,
    Zap,
    Moon,
    Coffee,
    Brain,
    PawPrint,
    RefreshCw,
    Share2,
    BookOpen,
    AlertCircle,
    Smile,
} from 'lucide-react';

const catFacts = [
    {
        id: 1,
        title: 'Сон и отдых',
        emoji: '😴',
        icon: <Moon className="text-purple-500" />,
        facts: [
            'Кошки спят 12-16 часов в сутки — это почти 70% их жизни!',
            'Новорожденные котята спят до 22 часов в сутки.',
            'У кошек есть фаза быстрого сна, как у людей, и они видят сны!',
            'Положение сна показывает настроение: клубочком — холодно, на спине — полное доверие.',
        ],
        color: 'from-purple-100 to-pink-100',
        badgeColor: 'secondary',
    },
    {
        id: 2,
        title: 'Суперспособности',
        emoji: '⚡',
        icon: <Zap className="text-yellow-500" />,
        facts: [
            'Кошки могут прыгать на высоту в 5-6 раз больше своего роста!',
            'Усы (вибриссы) помогают определять расстояние и чувствовать малейшие движения воздуха.',
            'Слух в 3 раза лучше человеческого — слышат ультразвук, который издают грызуны.',
            'В темноте видят в 6-8 раз лучше человека благодаря тапетуму — отражающему слою в глазах.',
        ],
        color: 'from-yellow-100 to-orange-100',
        badgeColor: 'warning',
    },
    {
        id: 3,
        title: 'Общение и язык',
        emoji: '💬',
        icon: <Brain className="text-blue-500" />,
        facts: [
            'Мурлыканье — не только от удовольствия, но и от боли или стресса (самолечение).',
            'Кошки мяукают в основном для общения с людьми, а не друг с другом.',
            'Медленное моргание — «кошачий поцелуй», выражение любви и доверия.',
            'Поднятый вертикально хвост — знак дружелюбия и хорошего настроения.',
        ],
        color: 'from-blue-100 to-cyan-100',
        badgeColor: 'primary',
    },
    {
        id: 4,
        title: 'Здоровье и уход',
        emoji: '❤️',
        icon: <Heart className="text-red-500" />,
        facts: [
            'Нос кошки уникален, как отпечатки пальцев у человека.',
            'Температура тела кошек — 38-39°C, поэтому они любят тепло.',
            'Кошки потеют только через подушечки лап.',
            'Частое вылизывание — не только гигиена, но и снятие стресса.',
        ],
        color: 'from-red-100 to-pink-100',
        badgeColor: 'danger',
    },
    {
        id: 5,
        title: 'Интересные особенности',
        emoji: '🐾',
        icon: <PawPrint className="text-green-500" />,
        facts: [
            'У кошек 230 костей (у человека 206), а позвоночник очень гибкий.',
            'Передние лапы имеют 5 пальцев, задние — 4, но бывают и многопалые!',
            'Кошки не чувствуют сладкий вкус из-за отсутствия нужных рецепторов.',
            'Сердцебиение — 110-140 ударов в минуту (в 2 раза быстрее человеческого).',
        ],
        color: 'from-green-100 to-emerald-100',
        badgeColor: 'success',
    },
];

const funCatFacts = [
    'Коты проводят около 70% жизни во сне 😴',
    'У кошек может быть как праволапость, так и леволапость 🐾',
    'Кошки трутся о вас, чтобы пометить своей 🎀',
    'Мозг кошки на 90% похож на человеческий 🧠',
    'Кошка может издавать около 100 различных звуков 🎵',
    'Усы помогают кошке определить, пролезет ли она в отверстие 📏',
    'Кошки пьют воду, загибая кончик языка назад 🥤',
    'У каждой кошки уникальный рисунок носа, как отпечатки пальцев 👃',
];

const CatFactsPage = () => {
    const [likedFacts, setLikedFacts] = useState<number[]>([]);
    const [dailyFact, setDailyFact] = useState<string>('');
    const [funFactIndex, setFunFactIndex] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const randomFact = funCatFacts[Math.floor(Math.random() * funCatFacts.length)];
        setDailyFact(randomFact);

        const interval = setInterval(() => {
            setFunFactIndex((prev) => (prev + 1) % funCatFacts.length);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const handleLikeFact = (factId: number) => {
        if (likedFacts.includes(factId)) {
            setLikedFacts(likedFacts.filter((id) => id !== factId));
        } else {
            setLikedFacts([...likedFacts, factId]);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 1500);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: 'Интересный факт о котиках!',
                text: dailyFact,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(`${dailyFact}\n\nУзнай больше на сайте Пушистик дня!`);
        }
    };

    const handleNewFact = () => {
        const newIndex = (funFactIndex + 1) % funCatFacts.length;
        setFunFactIndex(newIndex);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-default-100 dark:via-default-200 dark:to-default-300 py-8 px-4">
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 animate-bounce"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                backgroundColor: ['#ff6b8b', '#ffd166', '#06d6a0', '#118ab2', '#ef476f'][Math.floor(Math.random() * 5)],
                                borderRadius: '50%',
                                animationDelay: `${Math.random() * 1}s`,
                                animationDuration: `${1 + Math.random() * 2}s`,
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center gap-3 mb-4">
                        <Sparkles className="text-yellow-500" size={32} />
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                            Мир кошачьих фактов
                        </h1>
                        <Sparkles className="text-yellow-500" size={32} />
                    </div>
                    <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                        Узнай самые интересные, удивительные и забавные секреты наших пушистых друзей! 🐱
                    </p>
                </div>

                <Card className="mb-10 shadow-2xl rounded-3xl bg-gradient-to-r from-pink-100 to-blue-100 dark:from-pink-900/20 dark:to-blue-900/20 backdrop-blur-md border-2 border-white/50">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-300 to-blue-300 flex items-center justify-center animate-pulse">
                                        <BookOpen size={48} className="text-white" />
                                    </div>
                                    <Badge
                                        color="warning"
                                        variant="solid"
                                        className="absolute -top-2 -right-2 animate-bounce"
                                    >
                                        СЕГОДНЯ
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex-grow text-center md:text-left">
                                <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
                                    <Coffee className="text-amber-600" />
                                    <h2 className="text-2xl font-bold text-foreground">Факт дня</h2>
                                </div>
                                <p className="text-xl italic text-foreground/80 mb-4">
                                    {`"${dailyFact}"`}
                                </p>
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    <Button
                                        color="primary"
                                        variant="shadow"
                                        startContent={<Share2 size={20} />}
                                        onClick={handleShare}
                                    >
                                        Поделиться
                                    </Button>
                                    <Button
                                        color="default"
                                        variant="flat"
                                        startContent={<RefreshCw size={20} />}
                                        onClick={handleNewFact}
                                    >
                                        Другой факт
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="mb-10 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl shadow-xl border-2 border-emerald-100 dark:border-emerald-800/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Zap className="text-emerald-500" />
                            <h3 className="text-xl font-bold">Быстрый факт</h3>
                        </div>
                        <Badge color="success" variant="flat">
                            Обновляется каждые 10 сек
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-lg flex-grow mr-4">
                            {funCatFacts[funFactIndex]}
                        </p>
                        <Button
                            isIconOnly
                            color="success"
                            variant="light"
                            onClick={handleNewFact}
                        >
                            <RefreshCw size={20} />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    {catFacts.map((category) => (
                        <Card
                            key={category.id}
                            className={`shadow-xl rounded-2xl backdrop-blur-md border-2 border-white/50 bg-gradient-to-br ${category.color} dark:bg-gradient-to-br dark:from-default-200 dark:to-default-300`}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-full bg-white/50 dark:bg-default-100">
                                        {category.icon}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{category.emoji}</span>
                                            <h3 className="text-xl font-bold">{category.title}</h3>
                                        </div>
                                        <Chip
                                            color={category.badgeColor as any}
                                            variant="flat"
                                            size="sm"
                                            className="mt-1"
                                        >
                                            {category.facts.length}
                                            {' '}
                                            фактов
                                        </Chip>
                                    </div>
                                    <Button
                                        isIconOnly
                                        color={likedFacts.includes(category.id) ? 'danger' : 'default'}
                                        variant="light"
                                        onClick={() => handleLikeFact(category.id)}
                                        className="self-start"
                                    >
                                        <Heart
                                            size={20}
                                            fill={likedFacts.includes(category.id) ? 'currentColor' : 'none'}
                                        />
                                    </Button>
                                </div>

                                <Accordion type="single" collapsible className="px-0">
                                    {category.facts.map((fact, index) => (
                                        <AccordionItem
                                            key={index}
                                            value={`fact-${index}`}
                                            className="rounded-xl border border-default-200 dark:border-default-100 bg-white/60 dark:bg-default-100/60 mb-2 px-0 overflow-hidden"
                                        >
                                            <AccordionTrigger className="py-3 px-4">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <Badge
                                                        color="default"
                                                        variant="flat"
                                                        size="sm"
                                                    >
                                                        #
                                                        {index + 1}
                                                    </Badge>
                                                    <span className="line-clamp-1">{fact}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-4 text-foreground/70">
                                                <div className="pl-6">
                                                    <p className="text-foreground/80">
                                                        {index === 0 && 'Интересно, что...'}
                                                        {index === 1 && 'Знаете ли вы...'}
                                                        {index === 2 && 'А ещё...'}
                                                        {index === 3 && 'И напоследок...'}
                                                    </p>
                                                    <p className="mt-2">{fact}</p>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="shadow-2xl rounded-3xl bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-900/20 dark:to-amber-900/20 backdrop-blur-md border-2 border-white/50 overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <img
                                        src="/cat-facts-illustration.png"
                                        alt="Милый котик"
                                        width={200}
                                        height={200}
                                        className="rounded-2xl shadow-lg"
                                    />
                                    <div className="absolute -bottom-3 -right-3 bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-bounce">
                                        Ми-ми-ми! 🥰
                                    </div>
                                </div>
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-4">
                                    <Smile className="text-rose-500" size={28} />
                                    <h2 className="text-2xl font-bold">Кошки делают нас счастливее!</h2>
                                </div>
                                <p className="text-lg mb-4">
                                    Научно доказано, что общение с кошками снижает стресс, нормализует давление
                                    и повышает уровень окситоцина — гормона счастья!
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Chip color="success" variant="dot">Снижение стресса на 30%</Chip>
                                    <Chip color="primary" variant="dot">Улучшение настроения</Chip>
                                    <Chip color="warning" variant="dot">Терапевтический эффект</Chip>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center mt-10 pt-6 border-t border-default-200">
                    <p className="mb-4 text-foreground/70">
                        Понравились факты? Расскажи друзьям о чудесном мире котиков!
                    </p>
                    <Button
                        color="warning"
                        variant="shadow"
                        size="lg"
                        startContent={<Share2 size={22} />}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold px-8 py-6 text-lg rounded-2xl"
                        onClick={handleShare}
                    >
                        Поделиться фактами с друзьями
                    </Button>
                </div>

                <div className="fixed bottom-4 right-4 z-10">
                    <Tip content="Нашли ошибку? Сообщите нам!" side="left">
                        <Button
                            isIconOnly
                            color="warning"
                            variant="shadow"
                            className="rounded-full"
                        >
                            <AlertCircle size={24} />
                        </Button>
                    </Tip>
                </div>
            </div>

            <div className="fixed top-4 left-4 opacity-10 pointer-events-none z-0">
                <span className="text-6xl">🐱</span>
            </div>
            <div className="fixed top-4 right-4 opacity-10 pointer-events-none z-0">
                <span className="text-6xl">🐾</span>
            </div>
            <div className="fixed bottom-4 left-4 opacity-10 pointer-events-none z-0">
                <span className="text-6xl">😻</span>
            </div>
        </div>
    );
};

export default CatFactsPage;
