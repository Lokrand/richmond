/* eslint-disable import/no-unresolved */

'use client';

import React, { useEffect, useState, use } from 'react';
import {
    Card,
    Button,
    Image,
    Chip,
    Modal,
    ModalContent,
    ModalBody,
    useDisclosure,
} from '@heroui/react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    X,
    Camera,
    Trash2,
    Pencil,
    RotateCw,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import getCatYearNote from '../../../utils/getCatAgeNote';
import { TyCat } from '../../../types';
import { catApi, getS3Path } from '../../../config';
import { InternalApiCatCatResponse } from '../../../client/models';
import { auth } from '../../../lib/auth';

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
        habits: cat.habits ? cat.habits.split(',').map((h: string) => h.trim()) : [],
        description: '',
        logo_path: cat.titlePhoto?.url ?? '',
        gallery: cat.galleryPhotos?.map((p) => p?.url ?? '').filter(Boolean) ?? [],
    };
};

interface CatPageProps {
    params: { id: string };
}

const CatPage = ({ params }: CatPageProps) => {
    // @ts-expect-error
    const { id } = use(params);
    const [cat, setCat] = useState<TyCat | null>(null);
    const [loading, setLoading] = useState(true);

    const {
        isOpen, onOpen, onOpenChange, onClose,
    } = useDisclosure();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const fetchCat = async () => {
            try {
                const response = await catApi.apiV1CatIdGet({ id: parseInt(id, 10) });
                setCat(mapToTyCat(response));
            } catch {
                notFound();
            } finally {
                setLoading(false);
            }
        };

        fetchCat();
    }, [id]);

    useEffect(() => {
        if (cat) {
            document.title = cat.name;
        }
    }, [cat]);

    const openImageModal = (index: number) => {
        setSelectedImageIndex(index);
        setRotation(0);
        onOpen();
    };

    const navigateImage = (direction: 'prev' | 'next') => {
        if (!cat) return;

        if (direction === 'prev') {
            setSelectedImageIndex((prev) => (prev === 0 ? cat.gallery.length - 1 : prev - 1));
        } else {
            setSelectedImageIndex((prev) => (prev === cat.gallery.length - 1 ? 0 : prev + 1));
        }
        setRotation(0);
    };

    const handleRotateLeft = () => {
        setRotation((prev) => (prev - 90) % 360);
    };

    const handleRotateRight = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const resetTransform = () => {
        setRotation(0);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen || !cat) return;

            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    navigateImage('prev');
                    break;
                case 'ArrowRight':
                    navigateImage('next');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, cat, selectedImageIndex]);

    if (loading) {
        return (
            <div className="text-center text-xl py-20">
                Загружаем пушистика... 🐾
            </div>
        );
    }

    if (!cat) {
        notFound();
    }

    const hasGallery = cat.gallery.length > 0;
    const hasLogo = cat.logo_path !== '';

    const removeCat = async () => {
        const authHeader = auth.getAuthorizationHeader();
        if (!authHeader) {
            // setError('Требуется авторизация');
            // setIsLoading(false);
            return;
        }
        await catApi.apiV1CatIdDelete({
            id,
            authorization: authHeader.Authorization,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 dark:from-default-100 dark:to-default-200 py-4 px-1">
            <div className="max-w-6xl mx-auto">
                <Link href="/cats">
                    <Button color="primary" variant="shadow" className="mb-4 ml-4">
                        ← Назад к всем пушистикам
                    </Button>
                </Link>

                <Card className="flex flex-col items-center sm:items-start sm:flex-row gap-4 p-4 mb-8 shadow-xl rounded-2xl bg-white/70 dark:bg-default-50 backdrop-blur-md border border-default-200 dark:border-default-100">
                    {hasLogo ? (
                        <Image
                            src={getS3Path(cat.logo_path)}
                            className="shadow-lg rounded-xl object-cover w-100 cursor-pointer hover:opacity-90 transition-opacity"
                            height={400}
                            alt={cat.name}
                            onClick={() => openImageModal(-1)}
                        />
                    ) : (
                        <div className="shadow-lg rounded-xl w-full h-100 bg-default-100 dark:bg-default-200 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-default-300 dark:border-default-100">
                            <Camera size={64} className="text-default-400" />
                            <p className="text-default-500 text-lg font-medium">
                                Нет главного фото
                            </p>
                            <p className="text-default-400 text-sm">
                                Пушистик пока не загрузил свою фотографию 😿
                            </p>
                        </div>
                    )}
                    <div className="flex flex-col w-full p-0 sm:p-4 ml-0 sm:ml-4 gap-2">
                        <div className="flex flex-nowrap justify-between">
                            <h1 className="text-3xl font-bold text-primary text-center sm:text-left">
                                {cat.name}
                            </h1>
                            <div className="flex flex-nowrap gap-2">
                                <Button
                                    color="primary"
                                    variant="shadow"
                                    className="p-2 min-w-10"
                                >
                                    <Pencil size={20} />
                                </Button>
                                <Button
                                    color="danger"
                                    onClick={removeCat}
                                    className="p-2 min-w-10"
                                >
                                    <Trash2 size={20} />
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-start flex-wrap gap-1 sm:gap-4 text-foreground/70">
                            <span className="flex items-center gap-1.5">
                                <span className="text-primary">🎂</span>
                                <span>
                                    {cat.age}
                                    {' '}
                                    {getCatYearNote(cat.age)}
                                </span>
                            </span>
                            <span className="w-1 h-1 rounded-full bg-default-300 hidden sm:block" />
                            <span className="flex items-center gap-1.5">
                                <span className="text-success">⚖️</span>
                                <span>
                                    {cat.weight}
                                    {' '}
                                    кг
                                </span>
                            </span>
                            <span className="w-1 h-1 rounded-full bg-default-300 hidden sm:block" />
                            <span className="flex items-center gap-1.5">
                                <span className="text-secondary">🐱</span>
                                <span>{cat.breed}</span>
                            </span>
                        </div>
                        <p className="text-foreground/70 mt-4 mb-4">{cat.description}</p>
                        <p className="text-foreground/70 mt-4 mb-4">Ричик такой котик короче вообще какой-то турбо пушка пушистый еще он хвостом своим умеет делать так вжух-вжух и все полетели за ноги всех хватать в квартире, чтобы они испугались и прятались от великого короля Ричарда! Ахахахаха</p>
                        <div className="space-y-3">
                            <p className="font-semibold text-foreground flex items-center justify-start gap-2">
                                <span>🌟</span>
                                {' '}
                                Любимые привычки
                            </p>
                            <div className="flex flex-wrap justify-start gap-2">
                                {cat.habits.map((habit, i) => (
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
                    </div>
                </Card>

                <div className="bg-white/70 dark:bg-default-50 backdrop-blur-md rounded-2xl py-6 px-1 shadow-xl border border-default-200 dark:border-default-100">
                    <h2 className="text-2xl font-bold text-center mb-6 text-primary">
                        Галерея
                        {' '}
                        {cat.name}
                        {' '}
                        🐾
                    </h2>

                    {hasGallery ? (
                        <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-1">
                            {cat.gallery.map((image, index) => (
                                <div key={image} className="break-inside-avoid mb-1">
                                    <Image
                                        alt={`${cat.name} фото ${index + 1}`}
                                        src={getS3Path(image)}
                                        width={400}
                                        className="w-full rounded-xl cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                                        isZoomed
                                        onClick={() => openImageModal(index)}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="bg-default-100 dark:bg-default-200 rounded-2xl p-8 max-w-md w-full text-center border-2 border-dashed border-default-300 dark:border-default-100">
                                <Camera size={80} className="text-default-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-default-600 mb-2">
                                    Галерея пуста
                                </h3>
                                <p className="text-default-500 mb-4">
                                    {cat.name}
                                    {' '}
                                    ещё не загрузил ни одной фотографии в галерею
                                </p>
                                <div className="flex flex-col gap-2 text-sm text-default-400">
                                    <p>🐱 Пушистик стесняется фотокамеры</p>
                                    <p>📸 Фотограф ещё не добрался до котика</p>
                                    <p>😴 Кот спит и не позирует</p>
                                </div>
                                <div className="mt-6">
                                    <Link href="/new-cat">
                                        <Button
                                            color="primary"
                                            variant="shadow"
                                            startContent={<Camera size={18} />}
                                        >
                                            Добавить фото пушистика
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <Modal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    size="full"
                    placement="center"
                    scrollBehavior="inside"
                    className="bg-black/90 backdrop-blur-sm"
                    hideCloseButton
                    classNames={{
                        base: 'max-w-full max-h-full',
                        wrapper: 'p-0',
                        body: 'p-0',
                    }}
                >
                    <ModalContent>
                        <ModalBody className="relative p-0 flex items-center justify-center touch-none">
                            <Button
                                isIconOnly
                                color="default"
                                variant="flat"
                                className="absolute top-4 right-4 z-50 bg-black/50 text-white hover:bg-black/70"
                                onClick={onClose}
                            >
                                <X size={24} />
                            </Button>

                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-4 bg-black/50 backdrop-blur-sm rounded-full p-2 touch-none">
                                <Button
                                    isIconOnly
                                    color="default"
                                    variant="flat"
                                    className="text-white hover:bg-white/20"
                                    onClick={() => navigateImage('prev')}
                                    title="Предыдущее фото (←)"
                                >
                                    <ChevronLeft size={24} />
                                </Button>

                                <Button
                                    isIconOnly
                                    color="default"
                                    variant="flat"
                                    className="text-white hover:bg-white/20"
                                    onClick={handleRotateLeft}
                                    title="Повернуть влево"
                                >
                                    <RotateCcw size={24} />
                                </Button>

                                <Button
                                    isIconOnly
                                    color="default"
                                    variant="flat"
                                    className="text-white hover:bg-white/20"
                                    onClick={handleRotateRight}
                                    title="Повернуть вправо"
                                >
                                    <RotateCw size={24} />
                                </Button>

                                <Button
                                    isIconOnly
                                    color="default"
                                    variant="flat"
                                    className="text-white hover:bg-white/20"
                                    onClick={() => navigateImage('next')}
                                    title="Следующее фото (→)"
                                >
                                    <ChevronRight size={24} />
                                </Button>
                            </div>

                            <div className="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                                <span className="text-sm font-medium">
                                    {selectedImageIndex === -1 ? 'Главное фото' : `${selectedImageIndex + 1} / ${cat.gallery.length}`}
                                </span>
                            </div>

                            {cat.gallery.length > 0 && (
                                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                                    <img
                                        src={getS3Path(selectedImageIndex === -1 ? cat.logo_path : cat.gallery[selectedImageIndex])}
                                        alt={`${cat.name} ${selectedImageIndex === -1 ? 'главное фото' : `фото ${selectedImageIndex + 1}`}`}
                                        className="max-w-full max-h-full object-contain transition-transform duration-200"
                                        style={{ transform: `rotate(${rotation}deg)` }}
                                        onDoubleClick={resetTransform}
                                    />
                                </div>
                            )}
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </div>
        </div>
    );
};

export default CatPage;
