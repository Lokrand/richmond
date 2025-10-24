'use client';

import React, { useState, useRef } from 'react';
import {
    Card, CardHeader, CardBody, CardFooter, Button, Image, Input, Textarea,
} from '@heroui/react';

const NewCat = () => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        weight: '',
        habits: '',
        description: '',
    });
    const [photos, setPhotos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setPhotos((prev) => [...prev, ...newPhotos]);
    };

    const removePhoto = (index) => {
        setPhotos((prev) => {
            const newPhotos = [...prev];
            URL.revokeObjectURL(newPhotos[index].preview);
            newPhotos.splice(index, 1);
            return newPhotos;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('age', formData.age);
            submitData.append('weight', formData.weight);
            submitData.append('habits', formData.habits);
            submitData.append('description', formData.description);

            // Добавляем файлы
            photos.forEach((photo) => {
                submitData.append('photos', photo.file);
            });

            const response = await fetch('/api/cats', {
                method: 'POST',
                body: submitData,
            });

            const result = await response.json();

            if (result.success) {
                alert('Пушистик успешно добавлен!');
                // Очищаем форму
                setFormData({
                    name: '',
                    age: '',
                    weight: '',
                    habits: '',
                    description: '',
                });
                setPhotos([]);
            } else {
                alert(`Ошибка при сохранении: ${result.error}`);
            }
        } catch (error) {
            alert('Ошибка при отправке формы');
        } finally {
            setIsLoading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex justify-center mt-8 px-4">
            <Card className="max-w-2xl w-full shadow-xl rounded-2xl bg-white/70 dark:bg-default-50 backdrop-blur-md border border-default-200 dark:border-default-100">
                <CardHeader className="flex flex-col items-center gap-2 py-6">
                    <div className="flex items-center gap-3">
                        <Image src="/lapka.svg" width={16} height={16} />
                        <h1 className="text-3xl font-bold text-primary">Добавить нового пушистика</h1>
                        <Image src="/lapka.svg" width={16} height={16} />
                    </div>
                    <p className="text-foreground/70 text-center">Заполните информацию о вашем любимце</p>
                </CardHeader>

                <CardBody>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Имя пушистика"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                variant="bordered"
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
                                <label className="text-sm font-medium text-foreground">Фотографии</label>
                                <Button
                                    color="primary"
                                    variant="flat"
                                    size="sm"
                                    onClick={triggerFileInput}
                                >
                                    📷 Добавить фото
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                />
                            </div>

                            {photos.length > 0 && (
                                <div className="flex gap-8 flex-wrap mt-8">
                                    {photos.map((photo, index) => (
                                        <div key={index} className="relative group size-fit">
                                            <Image
                                                src={photo.preview}
                                                className="w-32 h-32 object-cover rounded-lg shadow-md"
                                                alt={`Preview ${index + 1}`}
                                            />
                                            <Button
                                                color="danger"
                                                size="sm"
                                                isIconOnly
                                                className="absolute -top-4 z-10 -right-4"
                                                onClick={() => removePhoto(index)}
                                            >
                                                <Image src="/lapka.svg" width={16} height={16} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>
                </CardBody>

                <CardFooter className="flex justify-center gap-4 py-6">
                    <Button
                        color="primary"
                        variant="shadow"
                        size="lg"
                        onClick={handleSubmit}
                        className="min-w-32"
                        startContent={<Image src="/lapka.svg" width={16} height={16} />}
                        isLoading={isLoading}
                    >
                        {isLoading ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                    <Button
                        color="default"
                        variant="flat"
                        size="lg"
                        onClick={() => {
                            setFormData({
                                name: '',
                                age: '',
                                weight: '',
                                habits: '',
                                description: '',
                            });
                            setPhotos([]);
                        }}
                    >
                        Очистить
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default NewCat;
