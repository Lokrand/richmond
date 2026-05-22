'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { catApi } from '@/config';
import { auth } from '@/lib/auth';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Image,
    Input,
    Textarea,
} from '@heroui/react';
import { InternalApiCatCreateCatRequest, InternalApiCatCreateCatRequestToJSONTyped } from '@/client';

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
    const titlePhotoInputRef = useRef<HTMLInputElement>(null);
    const galleryPhotosInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError('');
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
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!formData.name.trim()) {
            setError('Введите имя пушистика');
            setIsLoading(false);
            return;
        }

        if (!titlePhoto) {
            setError('Добавьте главное фото');
            setIsLoading(false);
            return;
        }

        try {
            const authHeader = auth.getAuthorizationHeader();
            if (!authHeader) {
                setError('Требуется авторизация');
                setIsLoading(false);
                return;
            }
            function parseBirthDate(age: string): string {
                const d = new Date();
                d.setFullYear(d.getFullYear() - parseInt(age, 10));
                return d.toISOString().split('T')[0];
            }
            const data: InternalApiCatCreateCatRequest = {
                name: formData.name.trim(),
                birthDate: parseBirthDate(formData.age),
                weight: parseFloat(formData.weight),
                breed: formData.breed.trim(),
                habits: formData.habits,
            };

            const files: Blob[] = [titlePhoto.file];
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
                        <Image src="/lapka.svg" width={16} height={16} alt="Лапка" />
                        <h1 className="text-3xl font-bold text-primary">Добавить нового пушистика</h1>
                        <Image src="/lapka.svg" width={16} height={16} alt="Лапка" />
                    </div>
                    <p className="text-foreground/70 text-center">Заполните информацию о вашем любимце</p>
                </CardHeader>

                <CardBody>
                    {error && (
                        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Имя пушистика"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                variant="bordered"
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
                                variant="bordered"
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
                                variant="bordered"
                            />
                            <Input
                                label="Порода"
                                name="breed"
                                value={formData.breed}
                                onChange={handleInputChange}
                                placeholder="Например: Британская, Сиамская..."
                                variant="bordered"
                            />
                        </div>

                        <Textarea
                            label="Описание"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Расскажите о характере и особенностях вашего пушистика..."
                            variant="bordered"
                            minRows={3}
                        />

                        <Textarea
                            label="Привычки"
                            name="habits"
                            value={formData.habits}
                            onChange={handleInputChange}
                            placeholder="Перечислите привычки через запятую (например: Мурлыкать, Играть, Спать...)"
                            variant="bordered"
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

                            {titlePhoto && (
                                <div className="relative group">
                                    <div className="text-sm text-foreground/70 mb-2">
                                        Это фото будет отображаться на главной странице
                                    </div>
                                    <div className="relative inline-block">
                                        <Image
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
                                            <Image
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
                                            <Image
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
                                                <Image
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

                        <CardFooter className="flex justify-center gap-4 px-0 pb-0 pt-6">
                            <Button
                                color="primary"
                                variant="shadow"
                                size="lg"
                                type="submit"
                                className="min-w-32"
                                startContent={!isLoading && <Image src="/lapka.svg" width={16} height={16} alt="Лапка" />}
                                isLoading={isLoading}
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
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};

export default NewCat;
