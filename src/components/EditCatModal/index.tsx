/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from 'react';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    catApi,
    fileApi,
    getS3Path,
    updateCatImages,
    updateCatTitlePhoto,
} from '../../config';
import { auth } from '../../lib/auth';
import { TyCat } from '../../types';

interface EditCatModalProps {
    cat: TyCat;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => Promise<void>;
}

const INITIAL_FORM_DATA = {
    name: '',
    age: '',
    weight: '',
    breed: '',
    habits: '',
    description: '',
};

const customScrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #9ca3af;
        border-radius: 4px;
    }
    
    .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: #9ca3af transparent;
    }
`;

const EditCatModal = ({
    cat, isOpen, onClose, onUpdate,
}: EditCatModalProps) => {
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [titlePhoto, setTitlePhoto] = useState<{ file: File; preview: string } | null>(null);
    const [existingTitlePhoto, setExistingTitlePhoto] = useState('');
    const [galleryPhotos, setGalleryPhotos] = useState<Array<{ file: File; preview: string }>>([]);
    const [existingGalleryPhotos, setExistingGalleryPhotos] = useState<string[]>([]);
    const [removedGalleryPhotos, setRemovedGalleryPhotos] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const titlePhotoInputRef = useRef<HTMLInputElement>(null);
    const galleryPhotosInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && cat) {
            requestAnimationFrame(() => {
                setFormData({
                    name: cat.name || '',
                    age: cat.age?.toString() || '',
                    weight: cat.weight?.toString() || '',
                    breed: cat.breed || '',
                    habits: cat.habits?.join(', ') || '',
                    description: cat.description || '',
                });
                setExistingTitlePhoto(cat.logo_path || '');
                setExistingGalleryPhotos(cat.gallery || []);
                setTitlePhoto(null);
                setGalleryPhotos([]);
                setRemovedGalleryPhotos([]);
                setError('');
            });
        }
    }, [isOpen, cat.id]);

    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.textContent = customScrollbarStyles;
        document.head.appendChild(styleElement);

        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    useEffect(() => {
        if (!isOpen) {
            if (titlePhoto) {
                URL.revokeObjectURL(titlePhoto.preview);
            }
            galleryPhotos.forEach((photo) => {
                URL.revokeObjectURL(photo.preview);
            });
        }

        return () => {
            if (titlePhoto) {
                URL.revokeObjectURL(titlePhoto.preview);
            }
            galleryPhotos.forEach((photo) => {
                URL.revokeObjectURL(photo.preview);
            });
        };
    }, [isOpen]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    }, []);

    const handleTitlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setError('Файл слишком большой. Максимальный размер 5MB');
            return;
        }

        if (titlePhoto) {
            URL.revokeObjectURL(titlePhoto.preview);
        }

        setTitlePhoto({
            file,
            preview: URL.createObjectURL(file),
        });
        setExistingTitlePhoto('');
        setError('');

        if (titlePhotoInputRef.current) {
            titlePhotoInputRef.current.value = '';
        }
    }, [titlePhoto]);

    const handleGalleryPhotosUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        const oversizedFile = files.find((file) => file.size > 5 * 1024 * 1024);
        if (oversizedFile) {
            setError(`Файл ${oversizedFile.name} слишком большой. Максимальный размер 5MB`);
            return;
        }

        const newPhotos = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setGalleryPhotos((prev) => [...prev, ...newPhotos]);
        setError('');

        if (galleryPhotosInputRef.current) {
            galleryPhotosInputRef.current.value = '';
        }
    }, []);

    const removeTitlePhoto = useCallback(() => {
        if (titlePhoto) {
            URL.revokeObjectURL(titlePhoto.preview);
            setTitlePhoto(null);
        }
        setExistingTitlePhoto('');
    }, [titlePhoto]);

    const removeExistingGalleryPhoto = useCallback((photoUrl: string) => {
        setExistingGalleryPhotos((prev) => prev.filter((p) => p !== photoUrl));
        setRemovedGalleryPhotos((prev) => [...prev, photoUrl]);
    }, []);

    const removeNewGalleryPhoto = useCallback((index: number) => {
        setGalleryPhotos((prev) => {
            const newPhotos = [...prev];
            URL.revokeObjectURL(newPhotos[index].preview);
            newPhotos.splice(index, 1);
            return newPhotos;
        });
    }, []);

    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!formData.name.trim()) {
            setError('Введите имя пушистика');
            setIsLoading(false);
            return;
        }

        if (!titlePhoto && !existingTitlePhoto) {
            setError('Добавьте главное фото');
            setIsLoading(false);
            return;
        }

        try {
            const authHeader = await auth.getAuthorizationHeader();
            if (!authHeader) {
                setError('Требуется авторизация');
                setIsLoading(false);
                return;
            }

            const parseBirthDate = (age: string): string => {
                const d = new Date();
                d.setFullYear(d.getFullYear() - parseInt(age, 10));
                return d.toISOString().split('T')[0];
            };

            await catApi.apiV1CatIdPut({
                id: cat.id,
                authorization: authHeader.Authorization,
                data: {
                    name: formData.name.trim(),
                    birthDate: formData.age ? parseBirthDate(formData.age) : undefined,
                    weight: formData.weight ? parseFloat(formData.weight) : undefined,
                    breed: formData.breed.trim(),
                    habits: formData.habits,
                    description: formData.description,
                },
            });

            const galleryChanged = galleryPhotos.length > 0 || removedGalleryPhotos.length > 0;
            if (galleryChanged) {
                const fetchPhoto = (url: string) => fileApi.apiV1FileKeyGet({
                    key: new URL(url).pathname.replace(/^\/main\//, ''),
                });
                const files: Blob[] = [titlePhoto?.file ?? await fetchPhoto(existingTitlePhoto)];
                files.push(...await Promise.all(existingGalleryPhotos.map(fetchPhoto)));
                files.push(...galleryPhotos.map((photo) => photo.file));
                await updateCatImages(cat.id, authHeader.Authorization, files);
            } else if (titlePhoto) {
                await updateCatTitlePhoto(cat.id, authHeader.Authorization, titlePhoto.file);
            }

            await onUpdate();
            onClose();
        } catch (error) {
            console.error('Update error:', error);
            setError('Ошибка при обновлении данных');
        } finally {
            setIsLoading(false);
        }
    }, [formData, titlePhoto, existingTitlePhoto, galleryPhotos, existingGalleryPhotos, removedGalleryPhotos, cat.id, onUpdate, onClose]);

    const totalGalleryCount = useMemo(
        () => existingGalleryPhotos.length + galleryPhotos.length,
        [existingGalleryPhotos, galleryPhotos],
    );

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="sm:max-w-3xl bg-white/95 dark:bg-default-50 custom-scrollbar max-h-[90vh] overflow-y-auto p-0">
                <div className="flex flex-col items-center gap-2 py-4 text-center border-b border-default-200 dark:border-default-100">
                    <div className="flex items-center gap-3">
                        <img
                            src="/lapka.svg"
                            width={16}
                            height={16}
                            alt="Лапка"
                            loading="eager"
                            className="w-4 h-4"
                        />
                        <h2 className="text-2xl font-bold text-primary">
                            Редактировать пушистика
                        </h2>
                        <img
                            src="/lapka.svg"
                            width={16}
                            height={16}
                            alt="Лапка"
                            loading="eager"
                            className="w-4 h-4"
                        />
                    </div>
                    <p className="text-foreground/70 text-center text-sm">
                        Измените информацию о
                        {' '}
                        {cat.name}
                    </p>
                </div>

                <div className="overflow-y-auto p-6">
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Имя пушистика"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                isInvalid={!!error && !formData.name.trim()}
                            />
                            <Input
                                label="Возраст (лет)"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleInputChange}
                                min="0"
                                max="30"
                            />
                            <Input
                                label="Вес (кг)"
                                name="weight"
                                type="number"
                                step="0.1"
                                value={formData.weight}
                                onChange={handleInputChange}
                                min="0"
                                max="20"
                            />
                            <Input
                                label="Порода"
                                name="breed"
                                value={formData.breed}
                                onChange={handleInputChange}
                                placeholder="Например: Британская, Сиамская..."
                            />
                        </div>

                        <Textarea
                            label="Описание"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Расскажите о характере и особенностях вашего пушистика..."
                            minRows={3}
                        />

                        <Textarea
                            label="Привычки"
                            name="habits"
                            value={formData.habits}
                            onChange={handleInputChange}
                            placeholder="Перечислите привычки через запятую (например: Мурлыкать, Играть, Спать...)"
                            minRows={2}
                        />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-foreground">
                                    Главное фото *
                                </label>
                                <Button
                                    color="primary"
                                    variant="flat"
                                    size="sm"
                                    onClick={() => titlePhotoInputRef.current?.click()}
                                    type="button"
                                    className="text-xs"
                                >
                                    🏷️
                                    {' '}
                                    {existingTitlePhoto || titlePhoto ? 'Заменить' : 'Выбрать'}
                                </Button>
                                <input
                                    ref={titlePhotoInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleTitlePhotoUpload}
                                    className="hidden"
                                />
                            </div>

                            {titlePhoto && (
                                <div className="relative group">
                                    <div className="text-xs text-foreground/70 mb-2">
                                        Новое главное фото
                                    </div>
                                    <div className="relative inline-block">
                                        <img
                                            src={titlePhoto.preview}
                                            className="object-cover rounded-lg shadow-lg ring-2 ring-primary w-52 h-52"
                                            width={200}
                                            height={200}
                                            alt="Новое главное фото"
                                            loading="lazy"
                                        />
                                        <Button
                                            color="danger"
                                            size="sm"
                                            isIconOnly
                                            className="absolute -top-2 -right-2 z-10 w-6 h-6 min-w-0"
                                            onClick={removeTitlePhoto}
                                            type="button"
                                        >
                                            ✕
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {!titlePhoto && existingTitlePhoto && (
                                <div className="relative group">
                                    <div className="text-xs text-foreground/70 mb-2">
                                        Текущее главное фото
                                    </div>
                                    <div className="relative inline-block">
                                        <img
                                            src={getS3Path(existingTitlePhoto)}
                                            className="object-cover rounded-lg shadow-lg ring-2 ring-primary/50 w-52 h-52"
                                            width={200}
                                            height={200}
                                            alt="Текущее главное фото"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-foreground">
                                    Фото галереи
                                    {totalGalleryCount > 0 && ` (${totalGalleryCount})`}
                                </label>
                                <Button
                                    color="secondary"
                                    variant="flat"
                                    size="sm"
                                    onClick={() => galleryPhotosInputRef.current?.click()}
                                    type="button"
                                    className="text-xs"
                                >
                                    📷 Добавить
                                </Button>
                                <input
                                    ref={galleryPhotosInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleGalleryPhotosUpload}
                                    className="hidden"
                                />
                            </div>

                            {(existingGalleryPhotos.length > 0 || galleryPhotos.length > 0) && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                    {existingGalleryPhotos.map((photo, index) => (
                                        <div key={`existing-${index}`} className="relative group aspect-square">
                                            <img
                                                src={getS3Path(photo)}
                                                className="w-full h-full object-cover rounded-lg shadow-md"
                                                alt={`Фото ${index + 1}`}
                                                loading="lazy"
                                            />
                                            <Button
                                                color="danger"
                                                size="sm"
                                                isIconOnly
                                                className="absolute -top-1 -right-1 z-10 w-5 h-5 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeExistingGalleryPhoto(photo)}
                                                type="button"
                                            >
                                                ✕
                                            </Button>
                                        </div>
                                    ))}
                                    {galleryPhotos.map((photo, index) => (
                                        <div key={`new-${index}`} className="relative group aspect-square">
                                            <img
                                                src={photo.preview}
                                                className="w-full h-full object-cover rounded-lg shadow-md ring-2 ring-secondary"
                                                alt={`Новое фото ${index + 1}`}
                                                loading="lazy"
                                            />
                                            <Button
                                                color="danger"
                                                size="sm"
                                                isIconOnly
                                                className="absolute -top-1 -right-1 z-10 w-5 h-5 min-w-0"
                                                onClick={() => removeNewGalleryPhoto(index)}
                                                type="button"
                                            >
                                                ✕
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-2 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center gap-4 py-4 border-t border-default-200 dark:border-default-100">
                    <Button
                        color="primary"
                        variant="shadow"
                        size="lg"
                        onClick={handleSubmit}
                        className="min-w-32"
                        isLoading={isLoading}
                    >
                        {isLoading ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                    <Button
                        color="default"
                        variant="flat"
                        size="lg"
                        onClick={onClose}
                        type="button"
                    >
                        Отмена
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default React.memo(EditCatModal);
