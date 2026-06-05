/* eslint-disable no-nested-ternary */

'use client';

import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Chip,
    Progress,
    RadioGroup,
    Radio,
    Badge,
    Tooltip,
    Modal,
    ModalContent,
    ModalBody,
    ModalFooter,
    CardBody,
} from '@heroui/react';
import {
    Brain,
    Trophy,
    Star,
    Heart,
    Zap,
    Clock,
    CheckCircle2,
    XCircle,
    HelpCircle,
    RefreshCw,
    Share2,
    Crown,
    Sparkles,
    Cat,
    Volume2,
    VolumeX,
} from 'lucide-react';
import confetti from 'canvas-confetti';

type QuizQuestion = {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
    funFact?: string;
    category: 'здоровье' | 'поведение' | 'физиология' | 'история' | 'разное';
};

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: 'Сколько часов в сутки в среднем спят взрослые кошки?',
        options: ['8-10 часов', '12-16 часов', '18-20 часов', '4-6 часов'],
        correctAnswer: 1,
        explanation: 'Взрослые кошки спят 12-16 часов в сутки, а котята могут спать до 22 часов!',
        difficulty: 'easy',
        funFact: 'За 9 лет жизни кошка бодрствует только около 3 лет!',
        category: 'поведение',
    },
    {
        id: 2,
        question: 'Зачем кошки трутся о ноги человека?',
        options: [
            'Чтобы пометить своей',
            'Просят еду',
            'Чешутся',
            'Проявляют агрессию',
        ],
        correctAnswer: 0,
        explanation: "У кошек на мордочке, хвосте и лапах есть железы, которые выделяют феромоны. Трусьясь, они помечают вас как 'своего'!",
        difficulty: 'medium',
        category: 'поведение',
    },
    {
        id: 3,
        question: 'Сколько зубов у взрослой кошки?',
        options: ['20', '26', '30', '32'],
        correctAnswer: 2,
        explanation: 'У взрослой кошки 30 зубов: 12 резцов, 10 премоляров, 4 клыка и 4 моляра.',
        difficulty: 'medium',
        funFact: 'Котята рождаются беззубыми, а молочные зубы появляются в 2-4 недели.',
        category: 'физиология',
    },
    {
        id: 4,
        question: 'Что означает медленное моргание кошки?',
        options: [
            'Она устала',
            "Кошачий 'поцелуй'",
            'Проблемы со зрением',
            'Признак болезни',
        ],
        correctAnswer: 1,
        explanation: "Медленное моргание или 'кошачий поцелуй' — это выражение доверия и любви. Можете ответить тем же!",
        difficulty: 'easy',
        category: 'поведение',
    },
    {
        id: 5,
        question: 'Какова нормальная температура тела кошки?',
        options: [
            '35-36°C',
            '37-38°C',
            '38-39°C',
            '40-41°C',
        ],
        correctAnswer: 2,
        explanation: 'Нормальная температура тела кошки — 38-39°C, что выше человеческой (36.6°C).',
        difficulty: 'hard',
        category: 'здоровье',
    },
    {
        id: 6,
        question: 'С какой максимальной высоты может безопасно упасть кошка?',
        options: [
            '3 метра',
            '5 метров',
            '10 метров',
            'Практически с любой',
        ],
        correctAnswer: 3,
        explanation: "Кошки обладают 'высотным рефлексом' и могут выжить при падении с больших высот благодаря гибкости и умению группироваться.",
        difficulty: 'hard',
        funFact: 'Рекорд выживания при падении — 32 этажа!',
        category: 'физиология',
    },
    {
        id: 7,
        question: 'Какой орган отвечает за равновесие у кошек?',
        options: [
            'Хвост',
            'Усы',
            'Вестибулярный аппарат',
            'Подушечки лап',
        ],
        correctAnswer: 2,
        explanation: 'Вестибулярный аппарат во внутреннем ухе отвечает за равновесие. Хвост лишь помогает балансировать.',
        difficulty: 'medium',
        category: 'физиология',
    },
    {
        id: 8,
        question: 'Сколько лет было самому старому коту в мире?',
        options: [
            '25 лет',
            '32 года',
            '38 лет',
            '45 лет',
        ],
        correctAnswer: 2,
        explanation: 'Кот по кличке Крем Пуф из Техаса прожил 38 лет и 3 дня (1967-2005)!',
        difficulty: 'hard',
        category: 'история',
    },
    {
        id: 9,
        question: "Почему кошки приносят 'подарки' в виде добычи?",
        options: [
            'Хвастаются',
            'Учат охотиться',
            'Просят похвалы',
            'Все варианты верны',
        ],
        correctAnswer: 1,
        explanation: "Кошки приносят добычу, чтобы научить своих 'неумелых' хозяев охотиться. Это проявление заботы!",
        difficulty: 'medium',
        category: 'поведение',
    },
    {
        id: 10,
        question: 'Какой процент ДНК совпадает у домашней кошки и тигра?',
        options: [
            '75%',
            '85%',
            '90%',
            '95%',
        ],
        correctAnswer: 3,
        explanation: 'Домашние кошки и тигры разделяют около 95.6% ДНК! Ваш пушистик — мини-тигр!',
        difficulty: 'hard',
        funFact: 'Мурлыкать умеют только мелкие кошки, большие (тигры, львы) — нет!',
        category: 'разное',
    },
];

const difficultyColors = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger',
} as const;

const difficultyPoints = {
    easy: 10,
    medium: 20,
    hard: 30,
};

const QuizPage = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
    const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const handleTimeUp = () => {
        setIsAnswered(true);
        setWrongAnswers((prev) => [...prev, quizQuestions[currentQuestion].id]);
        setStreak(0);
    };

    useEffect(() => {
        if (isAnswered || quizCompleted) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // eslint-disable-next-line consistent-return
        return () => clearInterval(timer);
    }, [isAnswered, quizCompleted]);

    const handleAnswerSelect = (value: string) => {
        if (isAnswered) return;

        const answerIndex = parseInt(value, 10);
        // setSelectedAnswer(answerIndex);
        setSelectedAnswer(null);
        setIsAnswered(true);

        const currentQ = quizQuestions[currentQuestion];
        const isCorrect = answerIndex === currentQ.correctAnswer;

        if (isCorrect) {
            setScore((prev) => prev + difficultyPoints[currentQ.difficulty]);
            setCorrectAnswers((prev) => [...prev, currentQ.id]);
            setStreak((prev) => {
                const newStreak = prev + 1;
                if (newStreak > maxStreak) setMaxStreak(newStreak);
                return newStreak;
            });

            if (!isMuted) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                });
            }
        } else {
            setWrongAnswers((prev) => [...prev, currentQ.id]);
            setStreak(0);
        }

        // setTimeout(() => {
        //     if (currentQuestion < quizQuestions.length - 1) {
        //         nextQuestion();
        //     } else {
        //         completeQuiz();
        //     }
        // }, 10000);
    };

    const nextQuestion = () => {
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
            setTimeLeft(30);
            setShowHint(false);
        }
    };

    const completeQuiz = () => {
        setQuizCompleted(true);
        if (!isMuted) {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
            });
        }
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setTimeLeft(30);
        setQuizCompleted(false);
        setCorrectAnswers([]);
        setWrongAnswers([]);
        setStreak(0);
        setMaxStreak(0);
        setShowResults(false);
        setShowHint(false);
    };

    const calculatePercentage = () => Math.round((score / (quizQuestions.length * 30)) * 100);

    const getRank = () => {
        const percentage = calculatePercentage();
        if (percentage >= 90) return { title: 'Кошачий Гений 👑', color: 'text-yellow-500' };
        if (percentage >= 70) return { title: 'Знаток Кошек 🎓', color: 'text-purple-500' };
        if (percentage >= 50) return { title: 'Любитель Кошек 😺', color: 'text-blue-500' };
        if (percentage >= 30) return { title: 'Начинающий 🐱', color: 'text-green-500' };
        return { title: 'Новичок 🐾', color: 'text-gray-500' };
    };

    const playSound = (type: 'correct' | 'wrong' | 'complete') => {
        if (isMuted) return;

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        switch (type) {
            case 'correct':
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                break;
            case 'wrong':
                oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                break;
            case 'complete':
                oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
                break;
            default:
                break;
        }

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    };

    useEffect(() => {
        if (isAnswered && selectedAnswer !== null) {
            const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correctAnswer;
            playSound(isCorrect ? 'correct' : 'wrong');
        }
    }, [isAnswered, selectedAnswer]);

    useEffect(() => {
        if (quizCompleted) {
            playSound('complete');
        }
    }, [quizCompleted]);

    const shareResults = async () => {
        const rank = getRank();
        const text = `Я только что прошёл викторину о котиках в приложении "Пушистик дня" и набрал ${score} баллов (${calculatePercentage()}%)!\nМой ранг: ${rank.title}\n\nПопробуй и ты! 😺`;

        if (navigator.share) {
            await navigator.share({
                title: 'Мои результаты викторины о котиках!',
                text,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(text);
        }
    };

    const currentQ = quizQuestions[currentQuestion];
    const rank = getRank();

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 dark:from-cyan-900/10 dark:via-purple-900/10 dark:to-pink-900/10 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center gap-3 mb-4">
                        <Brain className="text-purple-500" size={36} />
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Пушистая Викторина
                        </h1>
                        <Trophy className="text-yellow-500" size={36} />
                    </div>
                    <p className="text-lg text-foreground/70">
                        Проверь, насколько хорошо ты знаешь котиков! 🐱
                    </p>
                </div>

                {!quizCompleted ? (
                    <Card className="mb-6 shadow-xl rounded-2xl bg-white/70 dark:bg-default-50 backdrop-blur-md border border-white/50">
                        <CardBody className="p-6">
                            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                                <div className="flex items-center gap-4">
                                    <Chip color="primary" variant="flat" startContent={<Brain size={16} />}>
                                        Вопрос
                                        {' '}
                                        {currentQuestion + 1}
                                        {' '}
                                        из
                                        {' '}
                                        {quizQuestions.length}
                                    </Chip>
                                    <Chip color="success" variant="flat" startContent={<Star size={16} />}>
                                        Счёт:
                                        {' '}
                                        {score}
                                    </Chip>
                                    <Chip color="warning" variant="flat" startContent={<Zap size={16} />}>
                                        Серия:
                                        {' '}
                                        {streak}
                                    </Chip>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Tooltip content={isMuted ? 'Включить звук' : 'Выключить звук'}>
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            size="sm"
                                            onClick={() => setIsMuted(!isMuted)}
                                        >
                                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                        </Button>
                                    </Tooltip>
                                    <Chip
                                        color={difficultyColors[currentQ.difficulty]}
                                        variant="flat"
                                    >
                                        {currentQ.difficulty === 'easy' ? 'Лёгкий'
                                            : currentQ.difficulty === 'medium' ? 'Средний' : 'Сложный'}
                                    </Chip>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium">Время:</span>
                                    <span className={`text-lg font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : ''}`}>
                                        <Clock size={18} className="inline mr-1" />
                                        {timeLeft}
                                        {' '}
                                        сек
                                    </span>
                                </div>
                                <Progress
                                    value={(timeLeft / 30) * 100}
                                    color={timeLeft > 10 ? 'primary' : 'danger'}
                                    className="h-2"
                                />
                            </div>

                            <div className="flex justify-center mb-2">
                                <Badge color="default" variant="flat">
                                    Категория:
                                    {' '}
                                    {currentQ.category}
                                </Badge>
                            </div>
                        </CardBody>
                    </Card>
                ) : null}

                {!quizCompleted ? (
                    <Card className="shadow-2xl rounded-3xl bg-gradient-to-br from-white to-blue-50/50 dark:from-default-100 dark:to-default-200 backdrop-blur-md border-2 border-white/50">
                        <CardBody className="p-8">
                            <div className="mb-8">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="p-2 rounded-full bg-gradient-to-r from-cyan-100 to-purple-100 dark:from-cyan-900/30 dark:to-purple-900/30">
                                        <HelpCircle className="text-purple-500" size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-foreground flex-grow">
                                        {currentQ.question}
                                    </h2>
                                    <Tooltip content="Подсказка (стоит 5 очков)">
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            size="sm"
                                            disabled={isAnswered || showHint || score < 5}
                                            onClick={() => {
                                                setShowHint(true);
                                                setScore((prev) => prev - 5);
                                            }}
                                        >
                                            <Sparkles size={20} />
                                        </Button>
                                    </Tooltip>
                                </div>

                                {showHint && (
                                    <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200">
                                        <p className="text-amber-700 dark:text-amber-300">
                                            💡 Подсказка:
                                            {' '}
                                            {currentQ.funFact || 'Подумай внимательно!'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <RadioGroup
                                value={selectedAnswer?.toString()}
                                onValueChange={handleAnswerSelect}
                                isDisabled={isAnswered}
                                className="gap-4"
                            >
                                {currentQ.options.map((option, index) => {
                                    const isCorrect = index === currentQ.correctAnswer;
                                    const isSelected = selectedAnswer === index;
                                    let bgColor = 'bg-default-100';

                                    if (isAnswered) {
                                        if (isCorrect) {
                                            bgColor = 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300';
                                        } else if (isSelected && !isCorrect) {
                                            bgColor = 'bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300';
                                        }
                                    } else if (isSelected) {
                                        bgColor = 'bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300';
                                    }

                                    return (
                                        <div key={index} className={`p-0 rounded-xl transition-all ${bgColor}`}>
                                            <Radio
                                                value={index.toString()}
                                                classNames={{
                                                    base: 'inline-flex m-0 w-full max-w-full items-center gap-4 p-4 rounded-xl cursor-pointer',
                                                    label: 'w-full',
                                                }}
                                            >
                                                <div className="flex items-center gap-3 w-full">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                        isAnswered && isCorrect ? 'bg-green-500 text-white'
                                                            : isAnswered && isSelected && !isCorrect ? 'bg-red-500 text-white'
                                                                : 'bg-white/50 dark:bg-default-200'
                                                    }`}
                                                    >
                                                        {String.fromCharCode(65 + index)}
                                                    </div>
                                                    <span className="text-lg font-medium flex-grow">{option}</span>
                                                    {isAnswered && (
                                                        <div className="ml-2">
                                                            {isCorrect ? (
                                                                <CheckCircle2 className="text-green-500" size={24} />
                                                            ) : isSelected && !isCorrect ? (
                                                                <XCircle className="text-red-500" size={24} />
                                                            ) : null}
                                                        </div>
                                                    )}
                                                </div>
                                            </Radio>
                                        </div>
                                    );
                                })}
                            </RadioGroup>

                            {isAnswered && (
                                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                            <Cat className="text-purple-500" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground mb-2">
                                                {selectedAnswer === currentQ.correctAnswer ? 'Правильно! 🎉' : 'Почти угадал! 💡'}
                                            </h4>
                                            <p className="text-foreground/80">{currentQ.explanation}</p>
                                            {currentQ.funFact && (
                                                <div className="mt-3 p-3 bg-gradient-to-r from-yellow-50/50 to-amber-50/50 rounded-lg">
                                                    <p className="text-amber-700 dark:text-amber-300">
                                                        🐾 Интересный факт:
                                                        {' '}
                                                        {currentQ.funFact}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isAnswered && currentQuestion < quizQuestions.length - 1 && (
                                <div className="flex justify-center mt-6">
                                    <Button
                                        color="primary"
                                        variant="shadow"
                                        size="lg"
                                        onClick={nextQuestion}
                                        className="px-8 py-6 text-lg rounded-2xl"
                                    >
                                        Следующий вопрос →
                                    </Button>
                                </div>
                            )}

                            {currentQuestion === quizQuestions.length - 1 && (
                                <div className="flex justify-center mt-6">
                                    <Button
                                        color="primary"
                                        variant="shadow"
                                        size="lg"
                                        onClick={completeQuiz}
                                        className="px-8 py-6 text-lg rounded-2xl"
                                    >
                                        Посмотреть результат
                                    </Button>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                ) : (
                    <Card className="shadow-2xl rounded-3xl bg-gradient-to-br from-gradient-to-r from-yellow-100 via-pink-100 to-purple-100 dark:from-yellow-900/20 dark:via-pink-900/20 dark:to-purple-900/20 backdrop-blur-md border-2 border-white/50">
                        <CardBody className="p-8 text-center">
                            <div className="mb-6">
                                <div className="inline-block p-4 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 mb-4">
                                    <Trophy className="text-white" size={48} />
                                </div>
                                <h2 className="text-3xl font-bold mb-2">Викторина завершена! 🎊</h2>
                                <p className="text-foreground/70">Ты отлично справился с вопросами!</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="p-4 bg-white/50 dark:bg-default-100/50 rounded-2xl">
                                    <div className="text-3xl font-bold text-primary">{score}</div>
                                    <div className="text-sm text-foreground/70">Очков</div>
                                </div>
                                <div className="p-4 bg-white/50 dark:bg-default-100/50 rounded-2xl">
                                    <div className="text-3xl font-bold text-success">{correctAnswers.length}</div>
                                    <div className="text-sm text-foreground/70">Правильных</div>
                                </div>
                                <div className="p-4 bg-white/50 dark:bg-default-100/50 rounded-2xl">
                                    <div className="text-3xl font-bold text-danger">{wrongAnswers.length}</div>
                                    <div className="text-sm text-foreground/70">Ошибок</div>
                                </div>
                                <div className="p-4 bg-white/50 dark:bg-default-100/50 rounded-2xl">
                                    <div className="text-3xl font-bold text-warning">{maxStreak}</div>
                                    <div className="text-sm text-foreground/70">Лучшая серия</div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-lg font-bold">Твой результат:</span>
                                    <span className="text-2xl font-bold">
                                        {calculatePercentage()}
                                        %
                                    </span>
                                </div>
                                <Progress
                                    value={calculatePercentage()}
                                    color={calculatePercentage() >= 70 ? 'success' : calculatePercentage() >= 50 ? 'warning' : 'danger'}
                                    className="h-4"
                                />
                                <div className="mt-4">
                                    <div className={`text-2xl font-bold mb-2 ${rank.color}`}>
                                        <Crown className="inline mr-2" size={28} />
                                        {rank.title}
                                    </div>
                                    <p className="text-foreground/70">
                                        {calculatePercentage() >= 90
                                            ? 'Ты настоящий эксперт по кошкам! 🐈‍⬛'
                                            : calculatePercentage() >= 70
                                                ? 'Отличные знания! Ты хорошо разбираешься в котиках! 😺'
                                                : calculatePercentage() >= 50
                                                    ? 'Неплохой результат! Есть куда стремиться! 🐱'
                                                    : 'Попробуй ещё раз, у тебя получится лучше! 🐾'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 justify-center">
                                <Button
                                    color="primary"
                                    variant="shadow"
                                    size="lg"
                                    startContent={<RefreshCw size={22} />}
                                    onClick={restartQuiz}
                                    className="px-8 py-6 rounded-2xl"
                                >
                                    Пройти ещё раз
                                </Button>
                                <Button
                                    color="success"
                                    variant="shadow"
                                    size="lg"
                                    startContent={<Share2 size={22} />}
                                    onClick={shareResults}
                                    className="px-8 py-6 rounded-2xl"
                                >
                                    Поделиться результатом
                                </Button>
                                <Button
                                    color="default"
                                    variant="flat"
                                    size="lg"
                                    startContent={<Heart size={22} />}
                                    onClick={() => setShowResults(true)}
                                    className="px-8 py-6 rounded-2xl"
                                >
                                    Посмотреть ответы
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                )}

                <Modal isOpen={showResults} onClose={() => setShowResults(false)} size="3xl">
                    <ModalContent>
                        <ModalBody className="py-6">
                            <h3 className="text-2xl font-bold mb-4 text-center">Все ответы</h3>
                            <div className="space-y-4">
                                {quizQuestions.map((q, index) => {
                                    const isCorrect = correctAnswers.includes(q.id);
                                    const isWrong = wrongAnswers.includes(q.id);

                                    return (
                                        <Card
                                            key={q.id}
                                            className={`border-2 ${
                                                isCorrect ? 'border-green-200'
                                                    : isWrong ? 'border-red-200' : 'border-default-200'
                                            }`}
                                        >
                                            <CardBody className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold">
                                                            Вопрос
                                                            {index + 1}
                                                            :
                                                        </span>
                                                        <Chip size="sm" color={difficultyColors[q.difficulty]} variant="flat">
                                                            {q.difficulty === 'easy' ? 'Лёгкий'
                                                                : q.difficulty === 'medium' ? 'Средний' : 'Сложный'}
                                                        </Chip>
                                                    </div>
                                                    {isCorrect ? (
                                                        <CheckCircle2 className="text-green-500" size={20} />
                                                    ) : isWrong ? (
                                                        <XCircle className="text-red-500" size={20} />
                                                    ) : null}
                                                </div>
                                                <p className="font-medium mb-2">{q.question}</p>
                                                <div className="ml-4">
                                                    <p className="text-green-600 dark:text-green-400">
                                                        <strong>Правильный ответ:</strong>
                                                        {' '}
                                                        {q.options[q.correctAnswer]}
                                                    </p>
                                                    <p className="text-foreground/70 mt-1">{q.explanation}</p>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    );
                                })}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onPress={() => setShowResults(false)}>
                                Закрыть
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <div className="fixed bottom-4 right-4 z-10">
                    <Tooltip content="Сбросить викторину">
                        <Button
                            isIconOnly
                            color="warning"
                            variant="shadow"
                            className="rounded-full"
                            onClick={restartQuiz}
                        >
                            <RefreshCw size={24} />
                        </Button>
                    </Tooltip>
                </div>

                <div className="fixed top-20 left-4 opacity-20 pointer-events-none z-0 animate-bounce">
                    <span className="text-5xl">🐱</span>
                </div>
                <div className="fixed top-40 right-10 opacity-20 pointer-events-none z-0 animate-bounce" style={{ animationDelay: '0.5s' }}>
                    <span className="text-4xl">🎯</span>
                </div>
                <div className="fixed bottom-32 left-10 opacity-20 pointer-events-none z-0 animate-bounce" style={{ animationDelay: '1s' }}>
                    <span className="text-6xl">🌟</span>
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
