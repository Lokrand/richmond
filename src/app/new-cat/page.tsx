/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
    Button,
    Input,
    Textarea,
} from '@/components/ui';
import { catApi } from '../../config';
import { auth } from '../../lib/auth';
import { InternalApiCatCreateCatRequest } from '../../client';

const NewCat = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        weight: '',
        breed: '',
        habits: '',
        description: '',
    });
    const [titlePhoto, setTitlePhoto] = useState<{ file: File; preview: string } | null>(null);
    const [galleryPhotos, setGalleryPhotos] = useState<Array<{ file: File; preview: string }>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const titlePhotoInputRef = useRef<HTMLInputElement>(null);
    const galleryPhotosInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError('');
        setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleTitlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setError('Файл слишком большой. Максимальный размер 5MB');
            return;
        }

        setTitlePhoto({
            file,
            preview: URL.createObjectURL(file),
        });
        setError('');
        setFieldErrors((prev) => ({ ...prev, titlePhoto: '' }));

        if (titlePhotoInputRef.current) {
            titlePhotoInputRef.current.value = '';
        }
    };

    const handleGalleryPhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        for (const file of files) {
            if (file.size > 5 * 1024 * 1024) {
                setError(`Файл ${file.name} слишком большой. Максимальный размер 5MB`);
                return;
            }
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
    };

    const removeTitlePhoto = () => {
        if (titlePhoto) {
            URL.revokeObjectURL(titlePhoto.preview);
            setTitlePhoto(null);
        }
    };

    const removeGalleryPhoto = (index: number) => {
        setGalleryPhotos((prev) => {
            const newPhotos = [...prev];
            URL.revokeObjectURL(newPhotos[index].preview);
            newPhotos.splice(index, 1);
            return newPhotos;
        });
    };

    const clearForm = () => {
        setFormData({
            name: '',
            age: '',
            weight: '',
            breed: '',
            habits: '',
            description: '',
        });
        setTitlePhoto(null);
        setGalleryPhotos([]);
        setError('');
        setFieldErrors({});
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) {
            errors.name = 'Введите имя пушистика';
        }
        if (!formData.age || parseInt(formData.age, 10) <= 0) {
            errors.age = 'Укажите возраст';
        }
        if (!formData.weight || parseFloat(formData.weight) <= 0) {
            errors.weight = 'Укажите вес';
        }
        if (!formData.breed.trim()) {
            errors.breed = 'Укажите породу';
        }
        if (!formData.habits.trim()) {
            errors.habits = 'Укажите привычки';
        }
        if (!formData.description.trim()) {
            errors.description = 'Добавьте описание';
        }
        if (!titlePhoto) {
            errors.titlePhoto = 'Добавьте главное фото';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError('');

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

            const data: InternalApiCatCreateCatRequest = {
                name: formData.name.trim(),
                birthDate: parseBirthDate(formData.age),
                weight: parseFloat(formData.weight),
                breed: formData.breed.trim(),
                habits: formData.habits,
                // @ts-ignore
                description: formData.description,
            };

            const files: Blob[] = [titlePhoto!.file];
            galleryPhotos.forEach((photo) => {
                files.push(photo.file);
            });

            const result = await catApi.apiV1CatNewPost({
                authorization: authHeader.Authorization,
                data: JSON.stringify(data),
                file: files,
            });

            if (result.catId) {
                console.info('New cat created', result);
                clearForm();
                router.push('/cats');
                router.refresh();
            } else {
                setError('Ошибка при сохранении');
            }
        } catch (error) {
            console.error('Submit error:', error);
            setError('Ошибка при отправке формы');
        } finally {
            setIsLoading(false);
        }
    };

    const triggerTitlePhotoInput = () => {
        titlePhotoInputRef.current?.click();
    };

    const triggerGalleryPhotosInput = () => {
        galleryPhotosInputRef.current?.click();
    };

    return (
        <div className="flex justify-center mt-8 px-4">
            <Card className="max-w-2xl w-full shadow-xl rounded-2xl bg-white/70 dark:bg-default-50 backdrop-blur-md border border-default-200 dark:border-default-100">
                <CardHeader className="flex flex-col items-center gap-2 py-6">
                    <div className="flex items-center gap-3">
                        <img src="/lapka.svg" width={16} height={16} alt="Лапка" />
                        <h1 className="text-3xl font-bold text-primary">Добавить нового пушистика</h1>
                        <img src="/lapka.svg" width={16} height={16} alt="Лапка" />
                    </div>
                    <p className="text-foreground/70 text-center">Заполните информацию о вашем любимце</p>
                </CardHeader>

                <CardContent>
                    <form id="new-cat-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Имя пушистика *"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                isInvalid={!!fieldErrors.name}
                                errorMessage={fieldErrors.name}
                            />
                            <Input
                                label="Возраст (лет) *"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleInputChange}
                                required
                                min="0"
                                max="30"
                                isInvalid={!!fieldErrors.age}
                                errorMessage={fieldErrors.age}
                            />
                            <Input
                                label="Вес (кг) *"
                                name="weight"
                                type="number"
                                step="0.1"
                                value={formData.weight}
                                onChange={handleInputChange}
                                required
                                min="0"
                                max="20"
                                isInvalid={!!fieldErrors.weight}
                                errorMessage={fieldErrors.weight}
                            />
                            <Input
                                label="Порода *"
                                name="breed"
                                value={formData.breed}
                                onChange={handleInputChange}
                                required
                                placeholder="Например: Британская, Сиамская..."
                                isInvalid={!!fieldErrors.breed}
                                errorMessage={fieldErrors.breed}
                            />
                        </div>

                        <Textarea
                            label="Описание *"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            placeholder="Расскажите о характере и особенностях вашего пушистика..."
                            minRows={3}
                            isInvalid={!!fieldErrors.description}
                            errorMessage={fieldErrors.description}
                        />

                        <Textarea
                            label="Привычки *"
                            name="habits"
                            value={formData.habits}
                            onChange={handleInputChange}
                            required
                            placeholder="Перечислите привычки через запятую (например: Мурлыкать, Играть, Спать...)"
                            minRows={2}
                            isInvalid={!!fieldErrors.habits}
                            errorMessage={fieldErrors.habits}
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
                                    onClick={triggerTitlePhotoInput}
                                    type="button"
                                >
                                    🏷️ Выбрать главное фото
                                </Button>
                                <input
                                    ref={titlePhotoInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleTitlePhotoUpload}
                                    className="hidden"
                                />
                            </div>
                            {fieldErrors.titlePhoto && (
                                <p className="text-danger text-sm">{fieldErrors.titlePhoto}</p>
                            )}

                            {titlePhoto && (
                                <div className="relative group">
                                    <div className="text-sm text-foreground/70 mb-2">
                                        Это фото будет отображаться на главной странице
                                    </div>
                                    <div className="relative inline-block">
                                        <img
                                            src={titlePhoto.preview}
                                            className="object-cover rounded-lg shadow-lg ring-4 ring-primary ring-opacity-50"
                                            width={300}
                                            height={300}
                                            alt="Главное фото"
                                        />
                                        <Button
                                            color="danger"
                                            size="sm"
                                            isIconOnly
                                            className="absolute -top-2 -right-2 z-10"
                                            onClick={removeTitlePhoto}
                                            type="button"
                                        >
                                            <img
                                                src="/lapka.svg"
                                                width={16}
                                                height={16}
                                                alt="lapka"
                                            />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-foreground">
                                    Фото галереи
                                    {' '}
                                    {galleryPhotos.length > 0 && `(${galleryPhotos.length})`}
                                </label>
                                <Button
                                    color="secondary"
                                    variant="flat"
                                    size="sm"
                                    onClick={triggerGalleryPhotosInput}
                                    type="button"
                                >
                                    📷 Добавить фото в галерею
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

                            {galleryPhotos.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {galleryPhotos.map((photo, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={photo.preview}
                                                className="object-cover rounded-lg shadow-md"
                                                width={170}
                                                height={170}
                                                alt={`Фото галереи ${index + 1}`}
                                            />
                                            <Button
                                                color="danger"
                                                size="sm"
                                                isIconOnly
                                                className="absolute -top-2 -right-2 z-10"
                                                onClick={() => removeGalleryPhoto(index)}
                                                type="button"
                                            >
                                                <img
                                                    src="/lapka.svg"
                                                    width={16}
                                                    height={16}
                                                    alt="lapka"
                                                />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center gap-4 px-6 pb-6">
                    <Button
                        color="primary"
                        variant="shadow"
                        size="lg"
                        type="submit"
                        form="new-cat-form"
                        className="min-w-32"
                        startContent={!isLoading && <img src="/lapka.svg" width={16} height={16} alt="Лапка" />}
                        isLoading={isLoading}
                        onPress={() => {
                            const form = document.getElementById('new-cat-form') as HTMLFormElement;
                            form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                        }}
                    >
                        {isLoading ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                    <Button
                        color="default"
                        variant="flat"
                        size="lg"
                        onClick={clearForm}
                        type="button"
                    >
                        Очистить
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default NewCat;
