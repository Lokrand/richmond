'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Chip,
    Badge,
    Tip,
    CardContent,
} from '@/components/ui';
import {
    Heart,
    Sparkles,
    Zap,
    Coffee,
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
    const [dailyFact, setDailyFact] = useState<string>('');
    const [funFactIndex, setFunFactIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const randomFact = funCatFacts[Math.floor(Math.random() * funCatFacts.length)];
        setDailyFact(randomFact);
    }, []);

    useEffect(() => {
        setProgress(0);
        const duration = 10000;
        const intervalTime = 100;
        const step = (intervalTime / duration) * 100;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev + step >= 100) {
                    setFunFactIndex((i) => (i + 1) % funCatFacts.length);
                    return 0;
                }
                return prev + step;
            });
        }, intervalTime);

        return () => clearInterval(interval);
    }, [funFactIndex]);

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
        setFunFactIndex((prev) => (prev + 1) % funCatFacts.length);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-default-100 dark:via-default-200 dark:to-default-300 py-6 sm:py-8 px-3 sm:px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8 sm:mb-10">
                    <div className="inline-flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <Sparkles className="text-yellow-500" size={24} />
                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                            Мир кошачьих фактов
                        </h1>
                        <Sparkles className="text-yellow-500" size={24} />
                    </div>
                    <p className="text-sm sm:text-lg text-foreground/70 max-w-2xl mx-auto">
                        Узнай самые интересные, удивительные и забавные секреты наших пушистых друзей! 🐱
                    </p>
                </div>

                <Card className="mb-8 sm:mb-10 shadow-2xl rounded-3xl bg-gradient-to-r from-pink-100 to-blue-100 dark:from-pink-900/20 dark:to-blue-900/20 backdrop-blur-md border-2 border-white/50">
                    <CardContent className="p-5 sm:p-8">
                        <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-pink-300 to-blue-300 flex items-center justify-center animate-pulse">
                                        <BookOpen size={32} className="text-white sm:hidden" />
                                        <BookOpen size={48} className="text-white hidden sm:block" />
                                    </div>
                                    <Badge
                                        color="warning"
                                        variant="solid"
                                        className="absolute -top-2 -right-2 animate-bounce text-[10px] sm:text-xs"
                                    >
                                        СЕГОДНЯ
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex-grow w-full text-center md:text-left">
                                <div className="flex items-center gap-2 mb-2 sm:mb-3 justify-center md:justify-start">
                                    <Coffee className="text-amber-600" size={20} />
                                    <h2 className="text-lg sm:text-2xl font-bold text-foreground">Факт дня</h2>
                                </div>

                                <p className="text-base sm:text-xl italic text-foreground/80 mb-3">
                                    {`"${funCatFacts[funFactIndex]}"`}
                                </p>

                                {/* На десктопе: прогресс + кнопки в одну строку */}
                                <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                    {/* Прогресс-бар: на мобиле — полная ширина сверху, на десктопе — рядом с кнопками */}
                                    <div className="w-full md:flex-1 mb-3 md:mb-0 md:order-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] sm:text-xs text-foreground/60">
                                                Следующий факт через
                                            </span>
                                            <span className="text-[10px] sm:text-xs font-semibold text-foreground/70">
                                                {Math.ceil((100 - progress) / 10)} с
                                            </span>
                                        </div>
                                        <div className="h-1.5 sm:h-2 w-full bg-white/60 dark:bg-default-100/60 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full transition-[width] duration-100 ease-linear"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Кнопки: на мобиле — в один ряд по центру, на десктопе — слева */}
                                    <div className="flex flex-row gap-2 sm:gap-3 justify-center md:justify-start md:order-1">
                                        <Button
                                            color="primary"
                                            variant="shadow"
                                            size="sm"
                                            startContent={<Share2 size={16} />}
                                            onClick={handleShare}
                                            className="text-xs sm:text-sm"
                                        >
                                            Поделиться
                                        </Button>
                                        <Button
                                            color="default"
                                            variant="flat"
                                            size="sm"
                                            startContent={<RefreshCw size={16} />}
                                            onClick={handleNewFact}
                                            className="text-xs sm:text-sm"
                                        >
                                            Другой факт
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
                    {catFacts.map((category) => (
                        <Card
                            key={category.id}
                            className={`shadow-xl rounded-2xl backdrop-blur-md border-2 border-white/50 bg-gradient-to-br ${category.color} dark:bg-gradient-to-br dark:from-default-200 dark:to-default-300`}
                        >
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                    <span className="text-xl sm:text-2xl">{category.emoji}</span>
                                    <h3 className="text-lg sm:text-xl font-bold">{category.title}</h3>
                                </div>

                                <div className="px-0">
                                    {category.facts.map((fact, index) => (
                                        <div
                                            key={index}
                                            className="rounded-xl border border-default-200 dark:border-default-100 bg-white/60 dark:bg-default-100/60 mb-2 px-3 sm:px-4 py-2 sm:py-3"
                                        >
                                            <div className="flex items-start gap-2 min-w-0">
                                                <Badge
                                                    color="default"
                                                    variant="flat"
                                                    size="sm"
                                                    className="flex-shrink-0"
                                                >
                                                    #{index + 1}
                                                </Badge>
                                                <span className="font-semibold text-sm sm:text-base">{fact}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="shadow-2xl rounded-3xl bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-900/20 dark:to-amber-900/20 backdrop-blur-md border-2 border-white/50 overflow-hidden">
                    <CardContent className="p-5 sm:p-8">
                        <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-8">
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <img
                                        src="/25.jpg"
                                        alt="Милый котик"
                                        width={200}
                                        height={200}
                                        className="rounded-2xl shadow-lg w-32 h-32 sm:w-[200px] sm:h-[200px] object-cover"
                                    />
                                    <div className="absolute -bottom-3 -right-3 bg-pink-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold animate-bounce">
                                        Ми-ми-ми! 🥰
                                    </div>
                                </div>
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 justify-center md:justify-start">
                                    <Smile className="text-rose-500" size={22} />
                                    <h2 className="text-lg sm:text-2xl font-bold">Кошки делают нас счастливее!</h2>
                                </div>
                                <p className="text-sm sm:text-lg mb-3 sm:mb-4 text-center md:text-left">
                                    Научно доказано, что общение с кошками снижает стресс, нормализует давление
                                    и повышает уровень окситоцина — гормона счастья!
                                </p>
                                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start">
                                    <Chip color="success" variant="dot" size="sm">Снижение стресса на 30%</Chip>
                                    <Chip color="primary" variant="dot" size="sm">Улучшение настроения</Chip>
                                    <Chip color="warning" variant="dot" size="sm">Терапевтический эффект</Chip>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center mt-8 sm:mt-10 pt-6 border-t border-default-200">
                    <p className="mb-4 text-sm sm:text-base text-foreground/70">
                        Понравились факты? Расскажи друзьям о чудесном мире котиков!
                    </p>
                    <Button
                        color="warning"
                        variant="shadow"
                        size="lg"
                        startContent={<Share2 size={20} />}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-2xl"
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

            <div className="fixed top-20 left-4 opacity-10 pointer-events-none z-0 hidden sm:block">
                <span className="text-6xl">🐱</span>
            </div>
            <div className="fixed top-20 right-4 opacity-10 pointer-events-none z-0 hidden sm:block">
                <span className="text-6xl">🐾</span>
            </div>
            <div className="fixed bottom-24 left-4 opacity-10 pointer-events-none z-0 hidden sm:block">
                <span className="text-6xl">😻</span>
            </div>
        </div>
    );
};

export default CatFactsPage;
