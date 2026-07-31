/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */

'use client';

import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Badge,
    Tip,
    Dialog,
    DialogContent,
    Separator,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Input,
    Textarea,
    Switch,
    ScrollArea,
    Progress,
    CardContent,
    Select,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from '@/components/ui';
import {
    Calendar as CalendarIcon,
    PartyPopper,
    Heart,
    Bell,
    BellOff,
    Plus,
    Trash2,
    Edit2,
    Share2,
    Cat,
    Globe,
    Home,
    Trophy,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Target,
    Clock,
    Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

type CatHoliday = {
    id: number;
    title: string;
    date: string;
    type: 'international' | 'national' | 'personal' | 'fun';
    country?: string;
    description: string;
    traditions?: string[];
    emoji: string;
    color: string;
    importance: 'high' | 'medium' | 'low';
    repeating: boolean;
    reminder?: boolean;
    userCreated?: boolean;
};

type UserEvent = {
    id: number;
    title: string;
    date: string;
    description: string;
    catId?: number;
    catName?: string;
    reminder: boolean;
    color: string;
};

const catHolidays: CatHoliday[] = [
    {
        id: 1,
        title: 'День кошек в России',
        date: '03-01',
        type: 'national',
        country: 'Россия',
        description: 'Праздник любителей кошек, отмечаемый с 2004 года по инициативе Московского музея кошки.',
        traditions: ['Угощение любимцев', 'Фотографии с котиками', 'Благотворительные акции'],
        emoji: '🐱',
        color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
        importance: 'high',
        repeating: true,
    },
    {
        id: 2,
        title: 'Всемирный день кошек',
        date: '08-08',
        type: 'international',
        description: 'Международный день кошек, отмечаемый по инициативе Международного фонда по защите животных.',
        traditions: ['Поздравления котикам', 'Пожертвования в приюты', 'Образовательные мероприятия'],
        emoji: '🌍',
        color: 'bg-gradient-to-r from-green-500 to-emerald-500',
        importance: 'high',
        repeating: true,
    },
    {
        id: 3,
        title: 'День чёрных кошек',
        date: '11-17',
        type: 'international',
        description: 'День борьбы с предрассудками против чёрных кошек и повышения их популярности.',
        traditions: ['Фотосессии с чёрными котиками', 'Истории спасения', 'Просвещение о суевериях'],
        emoji: '🐈‍⬛',
        color: 'bg-gradient-to-r from-gray-800 to-gray-900',
        importance: 'medium',
        repeating: true,
    },
    {
        id: 4,
        title: 'День рыжих котов',
        date: '09-01',
        type: 'international',
        description: 'Праздник всех солнечных и огненных котиков, приносящих радость в дом.',
        traditions: ['Конкурсы на самого рыжего', 'Тёплые посты в соцсетях', 'Угощение рыжиков'],
        emoji: '🦊',
        color: 'bg-gradient-to-r from-orange-500 to-amber-500',
        importance: 'medium',
        repeating: true,
    },
    {
        id: 5,
        title: 'День бездомных животных',
        date: '08-21',
        type: 'international',
        description: 'День привлечения внимания к проблеме бездомных животных и помощи приютам.',
        traditions: ['Волонтёрство в приютах', 'Сбор кормов', 'Пропаганда ответственного отношения'],
        emoji: '🏠',
        color: 'bg-gradient-to-r from-purple-500 to-pink-500',
        importance: 'high',
        repeating: true,
    },
    {
        id: 6,
        title: 'День мурлыканья',
        date: '04-23',
        type: 'fun',
        description: 'День, когда все кошки мира особенно громко мурлычут от счастья.',
        traditions: ['Запись мурлыканья', 'Сеансы релаксации', 'Конкурсы на самое громкое мурлыканье'],
        emoji: '😻',
        color: 'bg-gradient-to-r from-pink-500 to-rose-500',
        importance: 'low',
        repeating: true,
    },
    {
        id: 7,
        title: 'День охоты на солнечных зайчиков',
        date: '06-15',
        type: 'fun',
        description: 'Неофициальный праздник, посвящённый любимому развлечению всех котиков.',
        traditions: ['Игры с лазерными указками', 'Солнечные ванны', 'Фото охотящихся котов'],
        emoji: '🔦',
        color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        importance: 'low',
        repeating: true,
    },
    {
        id: 8,
        title: 'День коробок',
        date: '12-22',
        type: 'fun',
        description: 'Праздник в честь любимого места всех кошек — картонных коробок.',
        traditions: ['Строительство крепостей из коробок', 'Конкурсы на лучшую коробку', 'Подарок-коробка коту'],
        emoji: '📦',
        color: 'bg-gradient-to-r from-brown-500 to-amber-800',
        importance: 'low',
        repeating: true,
    },
    {
        id: 9,
        title: 'День растяжки',
        date: '02-17',
        type: 'fun',
        description: 'День, когда кошки демонстрируют свои лучшие позы для растяжки.',
        traditions: ['Фото растягивающихся котов', 'Йога с котами', 'Конкурсы на самую грациозную растяжку'],
        emoji: '🧘',
        color: 'bg-gradient-to-r from-teal-500 to-cyan-500',
        importance: 'low',
        repeating: true,
    },
    {
        id: 10,
        title: 'День рождения Гарфилда',
        date: '06-19',
        type: 'fun',
        description: 'День рождения самого известного ленивого и любящего лазанью кота в мире.',
        traditions: ['Просмотр мультфильмов', 'Приготовление лазаньи', 'Конкурсы на лучшего Гарфилда'],
        emoji: '🍝',
        color: 'bg-gradient-to-r from-orange-600 to-red-500',
        importance: 'medium',
        repeating: true,
    },
    {
        id: 11,
        title: 'День рождения Hello Kitty',
        date: '11-01',
        type: 'fun',
        description: 'День рождения культового персонажа Hello Kitty, созданного в 1974 году.',
        traditions: ['Просмотр аниме', 'Коллекционирование мерча', 'Тематические вечеринки'],
        emoji: '🎀',
        color: 'bg-gradient-to-r from-pink-400 to-red-400',
        importance: 'medium',
        repeating: true,
    },
];

const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

const getHolidaysForMonth = (month: number) => catHolidays.filter((holiday) => {
    const holidayMonth = parseInt(holiday.date.split('-')[0], 10);
    return holidayMonth === month + 1;
});

const holidayCategories = [
    {
        key: 'international', label: 'Международные', color: '#3b82f6', icon: <Globe size={14} />,
    },
    {
        key: 'national', label: 'Национальные', color: '#10b981', icon: <Home size={14} />,
    },
    {
        key: 'fun', label: 'Весёлые', color: '#ec4899', icon: <PartyPopper size={14} />,
    },
    {
        key: 'personal', label: 'Личные', color: '#8b5cf6', icon: <Heart size={14} />,
    },
];

const CatHolidaysCalendarPage = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<UserEvent | null>(null);
    const [newEvent, setNewEvent] = useState<Partial<UserEvent>>({
        title: '',
        date: '',
        description: '',
        reminder: true,
        color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    });
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [upcomingHolidays, setUpcomingHolidays] = useState<CatHoliday[]>([]);
    const [userCats, setUserCats] = useState<Array<{id: number, name: string}>>([]);
    const [celebratedToday, setCelebratedToday] = useState<number[]>([]);

    useEffect(() => {
        const savedEvents = localStorage.getItem('catHolidayEvents');
        if (savedEvents) {
            setUserEvents(JSON.parse(savedEvents));
        }

        setUserCats([
            { id: 1, name: 'Ричик' },
            { id: 2, name: 'Барсик' },
            { id: 3, name: 'Мурка' },
        ]);

        const savedCelebrated = localStorage.getItem('celebratedHolidays');
        if (savedCelebrated) {
            setCelebratedToday(JSON.parse(savedCelebrated));
        }

        if ('Notification' in window) {
            setNotificationsEnabled(Notification.permission === 'granted');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('catHolidayEvents', JSON.stringify(userEvents));
    }, [userEvents]);

    useEffect(() => {
        const today = new Date();
        const upcoming = catHolidays
            .filter((holiday) => {
                const [month, day] = holiday.date.split('-').map(Number);
                const holidayDate = new Date(currentYear, month - 1, day);
                return holidayDate >= today;
            })
            .sort((a, b) => {
                const [aMonth, aDay] = a.date.split('-').map(Number);
                const [bMonth, bDay] = b.date.split('-').map(Number);
                const aDate = new Date(currentYear, aMonth - 1, aDay);
                const bDate = new Date(currentYear, bMonth - 1, bDay);
                return aDate.getTime() - bDate.getTime();
            })
            .slice(0, 5);

        setUpcomingHolidays(upcoming);
    }, [currentMonth, currentYear]);

    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
        setSelectedDate(`${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
    };

    const getHolidaysForDate = (date: string) => {
        const [month, day] = date.split('-').map(Number);

        const holidays = catHolidays.filter((holiday) => {
            const [hMonth, hDay] = holiday.date.split('-').map(Number);
            return hMonth === month && hDay === day;
        });

        const events = userEvents.filter((event) => event.date === date);

        return { holidays, events };
    };

    const handleAddEvent = () => {
        if (!newEvent.title || !newEvent.date) return;

        const event: UserEvent = {
            id: Date.now(),
            title: newEvent.title!,
            date: newEvent.date!,
            description: newEvent.description || '',
            catId: newEvent.catId,
            catName: userCats.find((cat) => cat.id === newEvent.catId)?.name,
            reminder: newEvent.reminder || true,
            color: newEvent.color || 'bg-gradient-to-r from-purple-500 to-pink-500',
        };

        setUserEvents([...userEvents, event]);
        setNewEvent({
            title: '',
            date: '',
            description: '',
            reminder: true,
            color: 'bg-gradient-to-r from-purple-500 to-pink-500',
        });
        setShowAddModal(false);

        confetti({
            particleCount: 30,
            spread: 60,
            origin: { y: 0.6 },
        });
    };

    const handleDeleteEvent = (id: number) => {
        setUserEvents(userEvents.filter((event) => event.id !== id));
        setShowEventModal(false);
    };

    const handleCelebrateHoliday = (holidayId: number) => {
        if (!celebratedToday.includes(holidayId)) {
            setCelebratedToday([...celebratedToday, holidayId]);
            localStorage.setItem('celebratedHolidays', JSON.stringify([...celebratedToday, holidayId]));

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        }
    };

    const requestNotificationPermission = () => {
        if ('Notification' in window) {
            Notification.requestPermission().then((permission) => {
                setNotificationsEnabled(permission === 'granted');
            });
        }
    };

    const generateCalendarDays = () => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

        const days = [];

        for (let i = 0; i < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1); i += 1) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day += 1) {
            const date = `${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const { holidays, events } = getHolidaysForDate(date);
            const isToday = new Date().getDate() === day
                           && new Date().getMonth() === currentMonth
                           && new Date().getFullYear() === currentYear;

            days.push({
                day,
                date,
                holidays,
                events,
                isToday,
            });
        }

        return days;
    };

    const days = generateCalendarDays();

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 dark:from-amber-900/10 dark:via-orange-900/10 dark:to-pink-900/10 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center gap-3 mb-4">
                        <CalendarIcon className="text-orange-500" size={36} />
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                            Кошачий Календарь
                        </h1>
                        <PartyPopper className="text-pink-500" size={36} />
                    </div>
                    <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                        Отмечай важные даты и праздники для своих пушистиков! 🎉🐾
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card className="shadow-2xl rounded-3xl bg-gradient-to-br from-white to-orange-50/50 dark:from-default-100 dark:to-orange-900/10 backdrop-blur-md border-2 border-white/50">
                            <CardContent className="p-8">
                                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            onClick={goToPreviousMonth}
                                        >
                                            <ChevronLeft size={20} />
                                        </Button>
                                        <h2 className="text-2xl font-bold text-center">
                                            {months[currentMonth]}
                                            {' '}
                                            {currentYear}
                                        </h2>
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            onClick={goToNextMonth}
                                        >
                                            <ChevronRight size={20} />
                                        </Button>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            color="primary"
                                            variant="shadow"
                                            startContent={<Target size={18} />}
                                            onClick={goToToday}
                                            className="rounded-xl"
                                        >
                                            Сегодня
                                        </Button>
                                        <Button
                                            color="success"
                                            variant="shadow"
                                            startContent={<Plus size={18} />}
                                            onClick={() => setShowAddModal(true)}
                                            className="rounded-xl"
                                        >
                                            Добавить событие
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-7 gap-2 mb-4">
                                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
                                        <div key={day} className="text-center font-bold py-2 text-foreground/70">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-2">
                                    {days.map((dayData, index) => {
                                        if (!dayData) {
                                            return <div key={`empty-${index}`} className="aspect-square" />;
                                        }

                                        const {
                                            day, date, holidays, events, isToday,
                                        } = dayData;
                                        const hasHolidays = holidays.length > 0;
                                        const hasEvents = events.length > 0;
                                        const isSelected = selectedDate === date;

                                        return (
                                            <Popover key={date}>
                                                <PopoverTrigger asChild>
                                                    <button
                                                        onClick={() => setSelectedDate(date)}
                                                        className={`aspect-square rounded-xl p-2 flex flex-col items-center justify-start transition-all relative
                                                            ${isToday ? 'ring-2 ring-orange-500 ring-offset-2' : ''}
                                                            ${isSelected ? 'bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-300' : 'bg-white/50 hover:bg-white/80'}
                                                            ${hasHolidays || hasEvents ? 'cursor-pointer' : ''}
                                                        `}
                                                    >
                                                        <span className={`text-lg font-semibold ${isToday ? 'text-orange-600' : 'text-foreground'}`}>
                                                            {day}
                                                        </span>

                                                        <div className="flex flex-wrap justify-center gap-1 mt-1">
                                                            {holidayCategories.slice(0, 2).map((cat) => {
                                                                const catHolidays = holidays.filter((h) => h.type === cat.key);
                                                                if (catHolidays.length === 0) return null;
                                                                return (
                                                                    <div
                                                                        key={cat.key}
                                                                        className="w-2 h-2 rounded-full"
                                                                        style={{ backgroundColor: cat.color }}
                                                                        title={`${catHolidays.length} ${cat.label.toLowerCase()} праздника`}
                                                                    />
                                                                );
                                                            })}
                                                            {events.length > 0 && (
                                                                <div
                                                                    className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                                                                    title={`${events.length} событий`}
                                                                />
                                                            )}
                                                        </div>

                                                        {(holidays.length > 0 || events.length > 0) && (
                                                            <div className="absolute top-1 right-1">
                                                                <Badge
                                                                    size="sm"
                                                                    color="primary"
                                                                    variant="solid"
                                                                    className="text-xs"
                                                                >
                                                                    {holidays.length + events.length}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80 p-0">
                                                    <div className="px-1 py-2">
                                                        <div className="text-small font-bold mb-2">
                                                            {day}
                                                            {' '}
                                                            {months[currentMonth]}
                                                            {' '}
                                                            {currentYear}
                                                        </div>
                                                        <div className="space-y-2">
                                                            {holidays.map((holiday) => (
                                                                <div
                                                                    key={holiday.id}
                                                                    className="p-2 rounded-lg text-white"
                                                                    style={{
                                                                        background: holiday.color.replace('bg-gradient-to-r', 'linear-gradient(to right'),
                                                                    }}
                                                                >
                                                                    <div className="flex justify-between items-start">
                                                                        <div>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-lg">{holiday.emoji}</span>
                                                                                <span className="font-bold">{holiday.title}</span>
                                                                            </div>
                                                                            <p className="text-sm opacity-90 mt-1">{holiday.description}</p>
                                                                        </div>
                                                                        {!celebratedToday.includes(holiday.id) && (
                                                                            <Button
                                                                                isIconOnly
                                                                                size="sm"
                                                                                variant="flat"
                                                                                className="bg-white/20"
                                                                                onClick={() => handleCelebrateHoliday(holiday.id)}
                                                                            >
                                                                                <PartyPopper size={16} />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            {events.map((event) => (
                                                                <div
                                                                    key={event.id}
                                                                    className="p-2 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100"
                                                                >
                                                                    <div className="flex justify-between items-center">
                                                                        <div>
                                                                            <div className="font-bold text-purple-700">{event.title}</div>
                                                                            {event.catName && (
                                                                                <div className="text-sm text-purple-600">
                                                                                    Для:
                                                                                    {event.catName}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <Button
                                                                            isIconOnly
                                                                            size="sm"
                                                                            variant="light"
                                                                            onClick={() => {
                                                                                setSelectedEvent(event);
                                                                                setShowEventModal(true);
                                                                            }}
                                                                        >
                                                                            <Edit2 size={16} />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        );
                                    })}
                                </div>

                                <div className="mt-8 pt-4 border-t border-default-200">
                                    <h3 className="font-bold mb-3 flex items-center gap-2">
                                        <BookOpen size={18} />
                                        Легенда:
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                                            <span className="text-sm">Международные</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500" />
                                            <span className="text-sm">Национальные</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-pink-500" />
                                            <span className="text-sm">Весёлые</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-purple-500" />
                                            <span className="text-sm">Личные</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <Card className="shadow-xl rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-md border border-white/50">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                    <Clock className="text-green-500" />
                                    Ближайшие праздники
                                </h3>
                                <ScrollArea className="h-64">
                                    <div className="space-y-3">
                                        {upcomingHolidays.map((holiday) => {
                                            const [month, day] = holiday.date.split('-').map(Number);
                                            const date = new Date(currentYear, month - 1, day);
                                            const daysLeft = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                                            return (
                                                <div
                                                    key={holiday.id}
                                                    className="p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-colors cursor-pointer"
                                                    onClick={() => {
                                                        setCurrentMonth(month - 1);
                                                        setSelectedDate(holiday.date);
                                                    }}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${holiday.color}`}>
                                                            <span className="text-lg">{holiday.emoji}</span>
                                                        </div>
                                                        <div className="flex-grow">
                                                            <div className="font-bold">{holiday.title}</div>
                                                            <div className="text-sm text-foreground/70">
                                                                {day}
                                                                {' '}
                                                                {months[month - 1]}
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge color="primary" variant="flat" size="sm">
                                                                    Через
                                                                    {' '}
                                                                    {daysLeft}
                                                                    {' '}
                                                                    {daysLeft === 1 ? 'день' : daysLeft < 5 ? 'дня' : 'дней'}
                                                                </Badge>
                                                                {holiday.type === 'international' && <Globe size={12} />}
                                                                {holiday.type === 'national' && holiday.country === 'Россия' && <Home size={12} />}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        <Card className="shadow-xl rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 backdrop-blur-md border border-white/50">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                    <Trophy className="text-blue-500" />
                                    Статистика праздников
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm">Праздников в этом месяце:</span>
                                            <span className="font-bold">{getHolidaysForMonth(currentMonth).length}</span>
                                        </div>
                                        <Progress
                                            value={(getHolidaysForMonth(currentMonth).length / 10) * 100}
                                            color="primary"
                                            className="h-2"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm">Отмечено праздников:</span>
                                            <span className="font-bold">{celebratedToday.length}</span>
                                        </div>
                                        <Progress
                                            value={(celebratedToday.length / catHolidays.length) * 100}
                                            color="success"
                                            className="h-2"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm">Ваших событий:</span>
                                            <span className="font-bold">{userEvents.length}</span>
                                        </div>
                                        <Progress
                                            value={(userEvents.length / 20) * 100}
                                            color="secondary"
                                            className="h-2"
                                        />
                                    </div>
                                </div>
                                <Separator className="my-4" />
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary mb-2">
                                        {userEvents.filter((e) => e.reminder).length}
                                    </div>
                                    <div className="text-sm text-foreground/70">
                                        событий с напоминаниями
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-xl rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-md border border-white/50">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                    {notificationsEnabled ? (
                                        <Bell className="text-purple-500" />
                                    ) : (
                                        <BellOff className="text-foreground/50" />
                                    )}
                                    Уведомления
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">Напоминания о праздниках</div>
                                            <div className="text-sm text-foreground/70">
                                                Получать уведомления за день до события
                                            </div>
                                        </div>
                                        <Switch
                                            checked={notificationsEnabled}
                                            onCheckedChange={requestNotificationPermission}
                                            className="data-[state=checked]:bg-secondary"
                                        />
                                    </div>
                                    {!notificationsEnabled && (
                                        <Button
                                            color="primary"
                                            variant="flat"
                                            size="sm"
                                            onClick={requestNotificationPermission}
                                            className="w-full"
                                        >
                                            Включить уведомления
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-xl rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 backdrop-blur-md border border-white/50">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                    <Zap className="text-amber-500" />
                                    Быстрые действия
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        color="primary"
                                        variant="shadow"
                                        startContent={<Plus size={18} />}
                                        onClick={() => setShowAddModal(true)}
                                        className="h-14 rounded-xl"
                                    >
                                        Новое событие
                                    </Button>
                                    <Button
                                        color="success"
                                        variant="shadow"
                                        startContent={<Share2 size={18} />}
                                        className="h-14 rounded-xl"
                                    >
                                        Поделиться
                                    </Button>
                                    <Button
                                        color="warning"
                                        variant="shadow"
                                        startContent={<Trash2 size={18} />}
                                        className="h-14 rounded-xl"
                                    >
                                        Очистить
                                    </Button>
                                    <Button
                                        color="default"
                                        variant="shadow"
                                        startContent={<CalendarIcon size={18} />}
                                        onClick={goToToday}
                                        className="h-14 rounded-xl"
                                    >
                                        Сегодня
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Dialog open={showAddModal} onOpenChange={(o) => setShowAddModal(o)}>
                    <DialogContent className="p-0 gap-0">
                        <div className="px-6 py-6 max-h-[75vh] overflow-y-auto">
                            <h3 className="text-xl font-bold mb-4 text-center">Добавить событие</h3>
                            <div className="space-y-4">
                                <Input
                                    label="Название события"
                                    placeholder="День рождения Мурки"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    startContent={<Edit2 size={20} />}
                                />
                                <Input
                                    label="Дата"
                                    type="date"
                                    value={newEvent.date ? `${currentYear}-${newEvent.date}` : ''}
                                    onChange={(e) => {
                                        const date = new Date(e.target.value);
                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                        const day = String(date.getDate()).padStart(2, '0');
                                        setNewEvent({ ...newEvent, date: `${month}-${day}` });
                                    }}
                                    startContent={<CalendarIcon size={20} />}
                                />
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-sm font-medium text-foreground/80">Для котика</span>
                                    <Select
                                        value={newEvent.catId ? String(newEvent.catId) : undefined}
                                        onValueChange={(v) => setNewEvent({ ...newEvent, catId: parseInt(v, 10) })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Выберите котика" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {userCats.map((cat) => (
                                                <SelectItem key={cat.id} value={String(cat.id)}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Textarea
                                    label="Описание"
                                    placeholder="Описание события..."
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Bell size={18} />
                                        <span>Напоминание</span>
                                    </div>
                                    <Switch
                                        checked={newEvent.reminder || false}
                                        onCheckedChange={(val) => setNewEvent({ ...newEvent, reminder: val })}
                                    />
                                </div>
                                <div>
                                    <span className="text-sm font-medium mb-2 block">Цвет события:</span>
                                    <div className="flex gap-2">
                                        {[
                                            'bg-gradient-to-r from-purple-500 to-pink-500',
                                            'bg-gradient-to-r from-blue-500 to-cyan-500',
                                            'bg-gradient-to-r from-green-500 to-emerald-500',
                                            'bg-gradient-to-r from-orange-500 to-amber-500',
                                            'bg-gradient-to-r from-red-500 to-pink-500',
                                        ].map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setNewEvent({ ...newEvent, color })}
                                                className={`w-8 h-8 rounded-full ${color} ${newEvent.color === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-6 pb-6">
                            <Button color="default" variant="light" onClick={() => setShowAddModal(false)}>
                                Отмена
                            </Button>
                            <Button color="primary" onClick={handleAddEvent}>
                                Добавить
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={showEventModal} onOpenChange={(o) => setShowEventModal(o)}>
                    <DialogContent className="p-0 gap-0">
                        <div className="px-6 py-6 max-h-[75vh] overflow-y-auto">
                            {selectedEvent && (
                                <>
                                    <div className={`w-full h-32 rounded-xl mb-4 ${selectedEvent.color}`} />
                                    <h3 className="text-xl font-bold mb-2">{selectedEvent.title}</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="text-sm text-foreground/70">Дата:</div>
                                            <div className="font-medium">
                                                {selectedEvent.date.split('-')[1]}
                                                {' '}
                                                {months[parseInt(selectedEvent.date.split('-')[0], 10) - 1]}
                                            </div>
                                        </div>
                                        {selectedEvent.catName && (
                                            <div>
                                                <div className="text-sm text-foreground/70">Для котика:</div>
                                                <div className="font-medium flex items-center gap-2">
                                                    <Cat size={16} />
                                                    {selectedEvent.catName}
                                                </div>
                                            </div>
                                        )}
                                        {selectedEvent.description && (
                                            <div>
                                                <div className="text-sm text-foreground/70">Описание:</div>
                                                <div className="font-medium">{selectedEvent.description}</div>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Bell size={16} />
                                            <span>
                                                Напоминание:
                                                {selectedEvent.reminder ? 'Включено' : 'Выключено'}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex justify-between gap-2 px-6 pb-6">
                            <Button color="danger" variant="light" onClick={() => handleDeleteEvent(selectedEvent!.id)}>
                                Удалить
                            </Button>
                            <Button color="primary" onClick={() => setShowEventModal(false)}>
                                Закрыть
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="fixed bottom-4 right-4 z-10">
                    <Tip content="Добавить событие" side="left">
                        <Button
                            isIconOnly
                            color="primary"
                            variant="shadow"
                            className="rounded-full"
                            onClick={() => setShowAddModal(true)}
                        >
                            <Plus size={24} />
                        </Button>
                    </Tip>
                </div>

                <div className="fixed top-20 left-4 opacity-10 pointer-events-none z-0">
                    <span className="text-6xl">🎉</span>
                </div>
                <div className="fixed top-40 right-10 opacity-10 pointer-events-none z-0 animate-bounce">
                    <span className="text-5xl">🐱</span>
                </div>
                <div className="fixed bottom-40 left-10 opacity-10 pointer-events-none z-0 animate-pulse">
                    <span className="text-7xl">📅</span>
                </div>
                <div className="fixed bottom-20 right-20 opacity-10 pointer-events-none z-0 animate-bounce" style={{ animationDelay: '0.5s' }}>
                    <span className="text-4xl">🎂</span>
                </div>
            </div>
        </div>
    );
};

export default CatHolidaysCalendarPage;
