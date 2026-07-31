/* eslint-disable react/button-has-type */

'use client';

import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Chip,
    Input,
    Slider,
    Select,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectItem,
    Badge,
    Tip,
    Dialog,
    DialogContent,
    Separator,
    Switch,
    ScrollArea,
    CardContent,
} from '@/components/ui';
import {
    Sparkles,
    Search,
    Shuffle,
    Heart,
    Copy,
    Volume2,
    VolumeX,
    Filter,
    Cat,
    Zap,
    Palette,
    TrendingUp,
    RefreshCw,
    Share2,
    Bookmark,
    Check,
    Hash,
    Languages,
    Sparkle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

type CatName = {
    id: number;
    name: string;
    meaning: string;
    origin: string;
    gender: 'мужское' | 'женское' | 'универсальное';
    popularity: 'редкое' | 'среднее' | 'популярное';
    length: 'короткое' | 'среднее' | 'длинное';
    category: 'милое' | 'смешное' | 'классическое' | 'оригинальное' | 'по цвету' | 'по характеру';
    tags: string[];
    favorite?: boolean;
};

const catNames: CatName[] = [
    {
        id: 1, name: 'Пушок', meaning: 'Мягкий и пушистый', origin: 'Русское', gender: 'мужское', popularity: 'популярное', length: 'короткое', category: 'милое', tags: ['пушистый', 'милый'],
    },
    {
        id: 2, name: 'Марсик', meaning: 'Маленький мартовский кот', origin: 'Русское', gender: 'мужское', popularity: 'среднее', length: 'среднее', category: 'милое', tags: ['весенний', 'ласковый'],
    },
    {
        id: 3, name: 'Снежинка', meaning: 'Белая и нежная как снег', origin: 'Русское', gender: 'женское', popularity: 'популярное', length: 'среднее', category: 'милое', tags: ['белый', 'зимний', 'нежный'],
    },
    {
        id: 4, name: 'Бусинка', meaning: 'Маленькая и блестящая', origin: 'Русское', gender: 'женское', popularity: 'среднее', length: 'среднее', category: 'милое', tags: ['маленький', 'блестящий'],
    },
    {
        id: 5, name: 'Пуфик', meaning: 'Мягкий и уютный', origin: 'Русское', gender: 'мужское', popularity: 'редкое', length: 'короткое', category: 'милое', tags: ['уютный', 'мягкий'],
    },
    {
        id: 6, name: 'Сырник', meaning: 'Любитель сыра', origin: 'Русское', gender: 'мужское', popularity: 'редкое', length: 'среднее', category: 'смешное', tags: ['еда', 'забавный'],
    },
    {
        id: 7, name: 'Багет', meaning: 'Длинный и хрустящий', origin: 'Французское', gender: 'мужское', popularity: 'редкое', length: 'среднее', category: 'смешное', tags: ['еда', 'длинный'],
    },
    {
        id: 8, name: 'Кексик', meaning: 'Сладкий и мягкий', origin: 'Русское', gender: 'мужское', popularity: 'среднее', length: 'среднее', category: 'смешное', tags: ['сладкий', 'выпечка'],
    },
    {
        id: 9, name: 'Вжик', meaning: 'Быстрый и энергичный', origin: 'Русское', gender: 'универсальное', popularity: 'редкое', length: 'короткое', category: 'смешное', tags: ['быстрый', 'энергичный'],
    },
    {
        id: 10, name: 'Бублик', meaning: 'Круглый и с дыркой', origin: 'Русское', gender: 'мужское', popularity: 'редкое', length: 'среднее', category: 'смешное', tags: ['круглый', 'еда'],
    },
    {
        id: 11, name: 'Барсик', meaning: 'Маленький барс', origin: 'Русское', gender: 'мужское', popularity: 'популярное', length: 'среднее', category: 'классическое', tags: ['классика', 'хищник'],
    },
    {
        id: 12, name: 'Мурка', meaning: 'Мурчащая кошка', origin: 'Русское', gender: 'женское', popularity: 'популярное', length: 'короткое', category: 'классическое', tags: ['мурчащий', 'классика'],
    },
    {
        id: 13, name: 'Васька', meaning: 'Царственный', origin: 'Русское', gender: 'мужское', popularity: 'популярное', length: 'короткое', category: 'классическое', tags: ['царственный', 'классика'],
    },
    {
        id: 14, name: 'Мурзик', meaning: 'Мурчащий друг', origin: 'Русское', gender: 'мужское', popularity: 'среднее', length: 'среднее', category: 'классическое', tags: ['друг', 'мурчащий'],
    },
    {
        id: 15, name: 'Матроскин', meaning: 'Морской кот', origin: 'Русское', gender: 'мужское', popularity: 'среднее', length: 'длинное', category: 'классическое', tags: ['мультяшный', 'умный'],
    },
    {
        id: 16, name: 'Альбирео', meaning: 'Звезда в созвездии Лебедя', origin: 'Латинское', gender: 'мужское', popularity: 'редкое', length: 'длинное', category: 'оригинальное', tags: ['космос', 'звезда'],
    },
    {
        id: 17, name: 'Фиалка', meaning: 'Нежный цветок', origin: 'Русское', gender: 'женское', popularity: 'среднее', length: 'среднее', category: 'оригинальное', tags: ['цветок', 'нежный'],
    },
    {
        id: 18, name: 'Цезарь', meaning: 'Император', origin: 'Латинское', gender: 'мужское', popularity: 'редкое', length: 'среднее', category: 'оригинальное', tags: ['император', 'величественный'],
    },
    {
        id: 19, name: 'Луна', meaning: 'Ночное светило', origin: 'Латинское', gender: 'женское', popularity: 'среднее', length: 'короткое', category: 'оригинальное', tags: ['ночь', 'таинственный'],
    },
    {
        id: 20, name: 'Зефир', meaning: 'Лёгкий ветерок', origin: 'Греческое', gender: 'мужское', popularity: 'редкое', length: 'среднее', category: 'оригинальное', tags: ['легкий', 'воздушный'],
    },
    {
        id: 21, name: 'Снежок', meaning: 'Белоснежный', origin: 'Русское', gender: 'мужское', popularity: 'среднее', length: 'среднее', category: 'по цвету', tags: ['белый', 'зимний'],
    },
    {
        id: 22, name: 'Рыжик', meaning: 'Солнечный и яркий', origin: 'Русское', gender: 'мужское', popularity: 'популярное', length: 'короткое', category: 'по цвету', tags: ['рыжий', 'солнечный'],
    },
    {
        id: 23, name: 'Черныш', meaning: 'Тёмный и загадочный', origin: 'Русское', gender: 'мужское', popularity: 'среднее', length: 'среднее', category: 'по цвету', tags: ['черный', 'таинственный'],
    },
    {
        id: 24, name: 'Серёжа', meaning: 'Серый и мудрый', origin: 'Русское', gender: 'мужское', popularity: 'среднее', length: 'среднее', category: 'по цвету', tags: ['серый', 'мудрый'],
    },
    {
        id: 25, name: 'Персик', meaning: 'Нежно-розовый', origin: 'Русское', gender: 'мужское', popularity: 'среднее', length: 'среднее', category: 'по цвету', tags: ['розовый', 'фрукт'],
    },
    {
        id: 26, name: 'Шалопай', meaning: 'Непоседливый', origin: 'Русское', gender: 'мужское', popularity: 'редкое', length: 'длинное', category: 'по характеру', tags: ['активный', 'шаловливый'],
    },
    {
        id: 27, name: 'Лентяй', meaning: 'Любитель поспать', origin: 'Русское', gender: 'мужское', popularity: 'редкое', length: 'среднее', category: 'по характеру', tags: ['спокойный', 'ленивый'],
    },
    {
        id: 28, name: 'Забияка', meaning: 'Любитель подраться', origin: 'Русское', gender: 'универсальное', popularity: 'редкое', length: 'длинное', category: 'по характеру', tags: ['боевой', 'активный'],
    },
    {
        id: 29, name: 'Лапуля', meaning: 'Ласковый и нежный', origin: 'Русское', gender: 'женское', popularity: 'среднее', length: 'среднее', category: 'по характеру', tags: ['ласковый', 'нежный'],
    },
    {
        id: 30, name: 'Шустрик', meaning: 'Быстрый и проворный', origin: 'Русское', gender: 'мужское', popularity: 'редкое', length: 'среднее', category: 'по характеру', tags: ['быстрый', 'энергичный'],
    },
    {
        id: 31, name: 'Luna', meaning: 'Луна', origin: 'Испанское/Итальянское', gender: 'женское', popularity: 'популярное', length: 'короткое', category: 'оригинальное', tags: ['луна', 'международное'],
    },
    {
        id: 32, name: 'Simba', meaning: 'Лев', origin: 'Суахили', gender: 'мужское', popularity: 'популярное', length: 'короткое', category: 'оригинальное', tags: ['лев', 'король'],
    },
    {
        id: 33, name: 'Chloe', meaning: 'Молодая зелень', origin: 'Греческое', gender: 'женское', popularity: 'среднее', length: 'короткое', category: 'оригинальное', tags: ['зеленый', 'свежий'],
    },
    {
        id: 34, name: 'Leo', meaning: 'Лев', origin: 'Латинское', gender: 'мужское', popularity: 'среднее', length: 'короткое', category: 'оригинальное', tags: ['лев', 'сильный'],
    },
    {
        id: 35, name: 'Mochi', meaning: 'Японское рисовое тесто', origin: 'Японское', gender: 'универсальное', popularity: 'среднее', length: 'короткое', category: 'милое', tags: ['еда', 'японский'],
    },
    {
        id: 36, name: 'Nala', meaning: 'Удачливая', origin: 'Африканское', gender: 'женское', popularity: 'среднее', length: 'короткое', category: 'оригинальное', tags: ['удача', 'африканский'],
    },
    {
        id: 37, name: 'Oreo', meaning: 'Печенье', origin: 'Английское', gender: 'мужское', popularity: 'среднее', length: 'короткое', category: 'смешное', tags: ['печенье', 'черно-белый'],
    },
    {
        id: 38, name: 'Ginger', meaning: 'Имбирь', origin: 'Английское', gender: 'универсальное', popularity: 'среднее', length: 'среднее', category: 'по цвету', tags: ['рыжий', 'пряный'],
    },
    {
        id: 39, name: 'Loki', meaning: 'Бог хитрости', origin: 'Скандинавское', gender: 'мужское', popularity: 'среднее', length: 'короткое', category: 'по характеру', tags: ['хитрый', 'бог'],
    },
    {
        id: 40, name: 'Willow', meaning: 'Ива', origin: 'Английское', gender: 'женское', popularity: 'среднее', length: 'среднее', category: 'оригинальное', tags: ['дерево', 'гибкий'],
    },
];

const categories = [
    { key: 'all', label: 'Все имена', icon: '🌟' },
    { key: 'милое', label: 'Милые', icon: '🥰' },
    { key: 'смешное', label: 'Смешные', icon: '😂' },
    { key: 'классическое', label: 'Классика', icon: '👑' },
    { key: 'оригинальное', label: 'Оригинальные', icon: '✨' },
    { key: 'по цвету', label: 'По цвету', icon: '🎨' },
    { key: 'по характеру', label: 'По характеру', icon: '😸' },
];

const origins = [
    { key: 'all', label: 'Все языки' },
    { key: 'Русское', label: 'Русские' },
    { key: 'Английское', label: 'Английские' },
    { key: 'Японское', label: 'Японские' },
    { key: 'Латинское', label: 'Латинские' },
    { key: 'Греческое', label: 'Греческие' },
    { key: 'Другие', label: 'Другие' },
];

const NameGeneratorPage = () => {
    // Состояния
    const [generatedNames, setGeneratedNames] = useState<CatName[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
    const [selectedGender, setSelectedGender] = useState<string>('all');
    const [nameCount, setNameCount] = useState(5);
    const [isMuted, setIsMuted] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showSavedModal, setShowSavedModal] = useState(false);
    const [savedCombinations, setSavedCombinations] = useState<{id: number, names: string[], date: string}[]>([]);

    const generateRandomNames = () => {
        let filtered = catNames;

        if (selectedCategory !== 'all') {
            filtered = filtered.filter((name) => name.category === selectedCategory);
        }

        if (selectedOrigin !== 'all') {
            if (selectedOrigin === 'Другие') {
                filtered = filtered.filter((name) => !['Русское', 'Английское', 'Японское', 'Латинское', 'Греческое'].includes(name.origin));
            } else {
                filtered = filtered.filter((name) => name.origin === selectedOrigin);
            }
        }

        if (selectedGender !== 'all') {
            filtered = filtered.filter((name) => name.gender === selectedGender);
        }

        if (searchQuery) {
            filtered = filtered.filter((name) => name.name.toLowerCase().includes(searchQuery.toLowerCase())
                || name.meaning.toLowerCase().includes(searchQuery.toLowerCase())
                || name.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
        }

        if (!showFavorites) {
            filtered = filtered.filter((name) => !favorites.includes(name.id));
        } else {
            filtered = filtered.filter((name) => favorites.includes(name.id));
        }

        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(nameCount, shuffled.length));

        setGeneratedNames(selected);

        if (!isMuted && selected.length > 0) {
            confetti({
                particleCount: Math.min(selected.length * 10, 50),
                spread: 70,
                origin: { y: 0.6 },
            });
        }
    };

    useEffect(() => {
        generateRandomNames();
        const saved = localStorage.getItem('catNameFavorites');
        if (saved) {
            setFavorites(JSON.parse(saved));
        }
        const savedCombs = localStorage.getItem('catNameCombinations');
        if (savedCombs) {
            setSavedCombinations(JSON.parse(savedCombs));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('catNameFavorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (id: number) => {
        if (favorites.includes(id)) {
            setFavorites(favorites.filter((favId) => favId !== id));
        } else {
            setFavorites([...favorites, id]);
            if (!isMuted) {
                confetti({
                    particleCount: 20,
                    spread: 40,
                    origin: { y: 0.8 },
                });
            }
        }
    };

    const copyToClipboard = (name: string) => {
        navigator.clipboard.writeText(name);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const saveCombination = () => {
        const newCombination = {
            id: Date.now(),
            names: generatedNames.map((n) => n.name),
            date: new Date().toLocaleDateString('ru-RU'),
        };
        const updated = [newCombination, ...savedCombinations].slice(0, 5); // Храним только 5 последних
        setSavedCombinations(updated);
        localStorage.setItem('catNameCombinations', JSON.stringify(updated));
        setShowSavedModal(true);
    };

    const loadCombination = (combination: typeof savedCombinations[0]) => {
        const names = combination.names.map((name) => catNames.find((n) => n.name === name)).filter(Boolean) as CatName[];
        setGeneratedNames(names);
        setShowSavedModal(false);
    };

    const shareResults = async () => {
        const text = `Я нашёл отличные имена для котика в приложении "Пушистик дня"!\n\n${generatedNames.map((n, i) => `${i + 1}. ${n.name} — ${n.meaning}`).join('\n')}\n\nПопробуй и ты! 🐱`;

        if (navigator.share) {
            await navigator.share({
                title: 'Классные имена для котика!',
                text,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(text);
        }
    };

    const toggleFavoritesView = () => {
        setShowFavorites(!showFavorites);
        if (!showFavorites) {
            const favNames = catNames.filter((name) => favorites.includes(name.id));
            setGeneratedNames(favNames);
        } else {
            generateRandomNames();
        }
    };

    const resetFilters = () => {
        setSelectedCategory('all');
        setSelectedOrigin('all');
        setSelectedGender('all');
        setSearchQuery('');
        setNameCount(5);
        generateRandomNames();
    };

    const getPopularityColor = (popularity: CatName['popularity']) => {
        switch (popularity) {
            case 'редкое': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'среднее': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'популярное': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            default: return '';
        }
    };

    const getGenderIcon = (gender: CatName['gender']) => {
        switch (gender) {
            case 'мужское': return '♂️';
            case 'женское': return '♀️';
            case 'универсальное': return '⚥';
            default: return '';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/10 dark:via-purple-900/10 dark:to-pink-900/10 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center gap-3 mb-4">
                        <Sparkles className="text-pink-500" size={36} />
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Генератор имён для котиков
                        </h1>
                        <Cat className="text-indigo-500" size={36} />
                    </div>
                    <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                        Найди идеальное имя для своего пушистого друга! 🐾✨
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <Card className="shadow-xl rounded-2xl bg-white/70 dark:bg-default-50 backdrop-blur-md border border-white/50 sticky top-6">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <Filter className="text-purple-500" />
                                        <h2 className="text-xl font-bold">Фильтры</h2>
                                    </div>
                                    <Tip content="Сбросить фильтры">
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            size="sm"
                                            onClick={resetFilters}
                                        >
                                            <RefreshCw size={18} />
                                        </Button>
                                    </Tip>
                                </div>

                                <div className="mb-6">
                                    <Input
                                        placeholder="Поиск по имени или значению..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        startContent={<Search size={20} />}
                                        endContent={
                                            searchQuery && (
                                                <Button
                                                    isIconOnly
                                                    variant="light"
                                                    size="sm"
                                                    onClick={() => setSearchQuery('')}
                                                >
                                                    ✕
                                                </Button>
                                            )
                                        }
                                        className="mb-2"
                                    />
                                    <p className="text-xs text-foreground/50">
                                        Ищите по имени, значению или тегам
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <Palette size={18} />
                                        Категория
                                    </h3>
                                    <ScrollArea className="h-40">
                                        <div className="space-y-2">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.key}
                                                    onClick={() => setSelectedCategory(cat.key)}
                                                    className={`w-full text-left p-3 rounded-xl transition-all ${
                                                        selectedCategory === cat.key
                                                            ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-2 border-purple-300'
                                                            : 'bg-default-100 hover:bg-default-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xl">{cat.icon}</span>
                                                        <span className="font-medium">{cat.label}</span>
                                                        {selectedCategory === cat.key && (
                                                            <Check size={16} className="ml-auto text-purple-500" />
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <Languages size={18} />
                                        Происхождение
                                    </h3>
                                    <Select
                                        value={selectedOrigin}
                                        onValueChange={(v) => setSelectedOrigin(v)}
                                    >
                                        <SelectTrigger className="mb-2">
                                            <SelectValue placeholder="Выберите происхождение" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {origins.map((origin) => (
                                                <SelectItem key={origin.key} value={origin.key}>
                                                    {origin.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        {getGenderIcon('универсальное')}
                                        Пол
                                    </h3>
                                    <div className="flex gap-2">
                                        {[
                                            { key: 'all', label: 'Любой', icon: '⚥' },
                                            { key: 'мужское', label: 'Мужской', icon: '♂️' },
                                            { key: 'женское', label: 'Женский', icon: '♀️' },
                                            { key: 'универсальное', label: 'Универсальное', icon: '⚥' },
                                        ].map((gender) => (
                                            <button
                                                key={gender.key}
                                                onClick={() => setSelectedGender(gender.key)}
                                                className={`flex-1 p-3 rounded-xl text-center transition-all ${
                                                    selectedGender === gender.key
                                                        ? 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 border-2 border-blue-300'
                                                        : 'bg-default-100 hover:bg-default-200'
                                                }`}
                                            >
                                                <div className="text-xl mb-1">{gender.icon}</div>
                                                <div className="text-sm font-medium">{gender.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <Hash size={18} />
                                            Количество имён
                                        </h3>
                                        <span className="text-lg font-bold text-primary">{nameCount}</span>
                                    </div>
                                    <Slider
                                        value={[nameCount]}
                                        onValueChange={(value) => setNameCount(value[0])}
                                        min={1}
                                        max={10}
                                        step={1}
                                        color="secondary"
                                        className="max-w-md"
                                    />
                                </div>

                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                        <span className="font-medium">Звуковые эффекты</span>
                                    </div>
                                    <Switch
                                        checked={!isMuted}
                                        onCheckedChange={(val) => setIsMuted(!val)}
                                        className="data-[state=checked]:bg-secondary"
                                    />
                                </div>

                                <Button
                                    color="primary"
                                    variant="shadow"
                                    size="lg"
                                    startContent={<Shuffle size={22} />}
                                    onClick={generateRandomNames}
                                    className="w-full py-6 text-lg rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold"
                                >
                                    Сгенерировать имена
                                </Button>

                                <Button
                                    color={showFavorites ? 'warning' : 'default'}
                                    variant="flat"
                                    size="lg"
                                    startContent={<Heart size={22} fill={showFavorites ? 'currentColor' : 'none'} />}
                                    onClick={toggleFavoritesView}
                                    className="w-full mt-4 py-6 text-lg rounded-2xl"
                                >
                                    {showFavorites ? 'Показать все' : `Избранное (${favorites.length})`}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="shadow-xl rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 backdrop-blur-md border border-white/50 mt-6">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <TrendingUp size={20} />
                                    Статистика
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-foreground/70">Всего имён в базе:</span>
                                        <span className="font-bold">{catNames.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-foreground/70">В избранном:</span>
                                        <span className="font-bold text-purple-600">{favorites.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-foreground/70">Сохранённые наборы:</span>
                                        <span className="font-bold text-cyan-600">{savedCombinations.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-foreground/70">Сгенерировано сейчас:</span>
                                        <span className="font-bold text-green-600">{generatedNames.length}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Card className="shadow-2xl rounded-3xl bg-gradient-to-br from-white to-pink-50/50 dark:from-default-100 dark:to-pink-900/10 backdrop-blur-md border-2 border-white/50 mb-6">
                            <CardContent className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold flex items-center gap-3">
                                            <Zap className="text-yellow-500" />
                                            {showFavorites ? 'Избранные имена' : 'Сгенерированные имена'}
                                            <Badge color="primary" variant="flat" size="lg">
                                                {generatedNames.length}
                                            </Badge>
                                        </h2>
                                        <p className="text-foreground/70 mt-1">
                                            {showFavorites
                                                ? 'Ваши любимые имена для котиков'
                                                : 'Нажмите на сердечко, чтобы добавить в избранное'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Tip content="Сохранить этот набор">
                                            <Button
                                                isIconOnly
                                                color="success"
                                                variant="light"
                                                onClick={saveCombination}
                                                isDisabled={generatedNames.length === 0}
                                            >
                                                <Bookmark size={20} />
                                            </Button>
                                        </Tip>
                                        <Tip content="Поделиться">
                                            <Button
                                                isIconOnly
                                                color="primary"
                                                variant="light"
                                                onClick={shareResults}
                                                isDisabled={generatedNames.length === 0}
                                            >
                                                <Share2 size={20} />
                                            </Button>
                                        </Tip>
                                    </div>
                                </div>

                                {generatedNames.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="inline-block p-6 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
                                            <Search size={48} className="text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">Имена не найдены</h3>
                                        <p className="text-foreground/70">
                                            Попробуйте изменить фильтры или сгенерировать новые имена
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {generatedNames.map((name) => (
                                            <Card
                                                key={name.id}
                                                className={`border-2 transition-all hover:scale-[1.02] ${
                                                    favorites.includes(name.id)
                                                        ? 'border-pink-300 bg-gradient-to-r from-pink-50 to-rose-50'
                                                        : 'border-default-200'
                                                }`}
                                            >
                                                <CardContent className="p-5">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="text-xl font-bold">{name.name}</h3>
                                                                <span className="text-lg">{getGenderIcon(name.gender)}</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-1 mb-2">
                                                                <Chip size="sm" color="default" variant="flat">
                                                                    {name.origin}
                                                                </Chip>
                                                                <Chip
                                                                    size="sm"
                                                                    className={getPopularityColor(name.popularity)}
                                                                >
                                                                    {name.popularity}
                                                                </Chip>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Tip content={favorites.includes(name.id) ? 'Убрать из избранного' : 'Добавить в избранное'}>
                                                                <Button
                                                                    isIconOnly
                                                                    variant="light"
                                                                    size="sm"
                                                                    onClick={() => toggleFavorite(name.id)}
                                                                >
                                                                    <Heart
                                                                        size={18}
                                                                        fill={favorites.includes(name.id) ? 'currentColor' : 'none'}
                                                                        className={favorites.includes(name.id) ? 'text-pink-500' : ''}
                                                                    />
                                                                </Button>
                                                            </Tip>
                                                            <Tip content="Скопировать">
                                                                <Button
                                                                    isIconOnly
                                                                    variant="light"
                                                                    size="sm"
                                                                    onClick={() => copyToClipboard(name.name)}
                                                                >
                                                                    <Copy size={18} />
                                                                </Button>
                                                            </Tip>
                                                        </div>
                                                    </div>

                                                    <p className="text-foreground/70 mb-3">{name.meaning}</p>

                                                    <div className="flex flex-wrap gap-1">
                                                        {name.tags.map((tag, i) => (
                                                            <Badge
                                                                key={i}
                                                                color="default"
                                                                variant="flat"
                                                                size="sm"
                                                            >
                                                                #
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}

                                {copied && (
                                    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full animate-fade-out">
                                        Скопировано! 📋
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-xl rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 backdrop-blur-md border border-white/50">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                    <Sparkle className="text-amber-500" />
                                    Советы по выбору имени
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/50 rounded-xl">
                                        <div className="text-2xl mb-2">🐱</div>
                                        <h4 className="font-bold mb-2">По характеру</h4>
                                        <p className="text-sm text-foreground/70">
                                            Подождите несколько дней, чтобы понять характер питомца
                                        </p>
                                    </div>
                                    <div className="p-4 bg-white/50 rounded-xl">
                                        <div className="text-2xl mb-2">🎨</div>
                                        <h4 className="font-bold mb-2">По внешности</h4>
                                        <p className="text-sm text-foreground/70">
                                            Цвет, рисунок шерсти, глаза — отличные источники вдохновения
                                        </p>
                                    </div>
                                    <div className="p-4 bg-white/50 rounded-xl">
                                        <div className="text-2xl mb-2">🔊</div>
                                        <h4 className="font-bold mb-2">По звучанию</h4>
                                        <p className="text-sm text-foreground/70">
                                            Имя должно быть легким для произношения и содержать шипящие звуки
                                        </p>
                                    </div>
                                    <div className="p-4 bg-white/50 rounded-xl">
                                        <div className="text-2xl mb-2">❤️</div>
                                        <h4 className="font-bold mb-2">По душе</h4>
                                        <p className="text-sm text-foreground/70">
                                            Выбирайте имя, которое нравится именно вам — вы будете произносить его каждый день!
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Dialog open={showSavedModal} onOpenChange={(o) => setShowSavedModal(o)}>
                    <DialogContent className="sm:max-w-md p-0 gap-0">
                        <div className="px-6 py-6">
                            <h3 className="text-xl font-bold mb-4 text-center">Сохранённый набор!</h3>
                            <div className="text-center mb-6">
                                <div className="inline-block p-4 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 mb-4">
                                    <Bookmark className="text-green-500" size={32} />
                                </div>
                                <p>Набор имён сохранён в историю!</p>
                            </div>

                            {savedCombinations.length > 0 && (
                                <>
                                    <Separator className="my-4" />
                                    <h4 className="font-bold mb-3">Предыдущие наборы:</h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {savedCombinations.map((combo) => (
                                            <Card
                                                key={combo.id}
                                                className="cursor-pointer hover:bg-default-100"
                                                onClick={() => loadCombination(combo)}
                                            >
                                                <CardContent className="p-3">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-medium">
                                                                {combo.names.slice(0, 3).join(', ')}
                                                                ...
                                                            </p>
                                                            <p className="text-xs text-foreground/50">{combo.date}</p>
                                                        </div>
                                                        <Button size="sm" variant="light">
                                                            Загрузить
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex justify-end px-6 pb-6">
                            <Button color="primary" onClick={() => setShowSavedModal(false)}>
                                Продолжить
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="fixed bottom-4 right-4 z-10">
                    <Tip content="Сохранить текущий набор" side="left">
                        <Button
                            isIconOnly
                            color="success"
                            variant="shadow"
                            className="rounded-full"
                            onClick={saveCombination}
                            isDisabled={generatedNames.length === 0}
                        >
                            <Bookmark size={24} />
                        </Button>
                    </Tip>
                </div>

                <div className="fixed top-20 left-4 opacity-10 pointer-events-none z-0">
                    <span className="text-6xl">😺</span>
                </div>
                <div className="fixed top-40 right-10 opacity-10 pointer-events-none z-0 animate-bounce">
                    <span className="text-5xl">✨</span>
                </div>
                <div className="fixed bottom-40 left-10 opacity-10 pointer-events-none z-0 animate-pulse">
                    <span className="text-7xl">🐾</span>
                </div>
                <div className="fixed bottom-20 right-20 opacity-10 pointer-events-none z-0 animate-bounce" style={{ animationDelay: '1s' }}>
                    <span className="text-4xl">💝</span>
                </div>
            </div>
        </div>
    );
};

export default NameGeneratorPage;
