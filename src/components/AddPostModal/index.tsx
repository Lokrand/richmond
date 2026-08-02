'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, ImagePlus, X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { postApi } from '@/config';
import { auth } from '@/lib/auth';
import { InternalApiPostPostResponse } from '@/client/models';

interface AddPostModalProps {
    catId: number;
    catName: string;
    isOpen: boolean;
    onClose: () => void;
    onCreated: (post: InternalApiPostPostResponse) => void;
}

type Photo = { file: File; preview: string };

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_UPLOAD_SIZE = 32 * 1024 * 1024;

const AddPostModal = ({
    catId, catName, isOpen, onClose, onCreated,
}: AddPostModalProps) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);
    const photosRef = useRef<Photo[]>([]);

    useEffect(() => {
        photosRef.current = photos;
    }, [photos]);

    useEffect(() => () => {
        photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.preview));
    }, []);

    const reset = () => {
        setTitle('');
        setBody('');
        setError('');
        setPhotos((currentPhotos) => {
            currentPhotos.forEach((photo) => URL.revokeObjectURL(photo.preview));
            return [];
        });
    };

    const close = () => {
        reset();
        onClose();
    };

    const addPhotos = (files: File[]) => {
        const invalidFile = files.find((file) => !file.type.startsWith('image/') || file.size > MAX_FILE_SIZE);
        if (invalidFile) {
            setError(`Файл ${invalidFile.name} должен быть изображением до 10 МБ`);
            return;
        }

        const totalSize = photos.reduce((total, photo) => total + photo.file.size, 0)
            + files.reduce((total, file) => total + file.size, 0);
        if (totalSize > MAX_UPLOAD_SIZE) {
            setError('Общий размер фотографий не должен превышать 32 МБ');
            return;
        }

        setPhotos((currentPhotos) => [
            ...currentPhotos,
            ...files.map((file) => ({ file, preview: URL.createObjectURL(file) })),
        ]);
        setError('');
    };

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.currentTarget;
        addPhotos(Array.from(input.files ?? []));
        input.value = '';
    };

    const removePhoto = (index: number) => {
        setPhotos((currentPhotos) => {
            const photo = currentPhotos[index];
            URL.revokeObjectURL(photo.preview);
            return currentPhotos.filter((_, photoIndex) => photoIndex !== index);
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!title.trim()) {
            setError('Добавьте заголовок записи');
            return;
        }
        if (!photos.length) {
            setError('Добавьте хотя бы одну фотографию');
            return;
        }

        setIsSaving(true);
        setError('');

        try {
            const authorization = await auth.getAuthorizationHeader();
            if (!authorization) {
                setError('Войдите, чтобы добавить запись');
                return;
            }

            const post = await postApi.apiV1PostNewPost({
                authorization: authorization.Authorization,
                data: JSON.stringify({
                    catId: String(catId),
                    title: title.trim(),
                    body: body.trim(),
                }),
                file: photos.map((photo) => photo.file),
            });
            onCreated(post);
            close();
        } catch (submitError) {
            console.error('Create post error:', submitError);
            setError('Не удалось добавить запись. Попробуйте ещё раз');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) close(); }}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-primary">Новая запись</DialogTitle>
                        <DialogDescription>
                            Поделитесь новостями о
                            {' '}
                            {catName}
                        </DialogDescription>
                    </DialogHeader>

                    <Input
                        label="Заголовок *"
                        value={title}
                        onValueChange={(value) => { setTitle(value); setError(''); }}
                        placeholder="Например: Прогулка во дворе"
                        maxLength={200}
                        isRequired
                        autoFocus
                    />
                    <Textarea
                        label="Текст"
                        value={body}
                        onChange={(event) => setBody(event.target.value)}
                        placeholder="Расскажите, что произошло..."
                        maxLength={5000}
                        minRows={3}
                    />

                    <div className="space-y-3">
                        <p className="text-sm font-medium text-foreground/80">Фотографии *</p>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                color="primary"
                                variant="flat"
                                type="button"
                                startContent={<Camera size={18} />}
                                onClick={() => cameraInputRef.current?.click()}
                            >
                                Снять фото
                            </Button>
                            <Button
                                color="secondary"
                                variant="flat"
                                type="button"
                                startContent={<ImagePlus size={18} />}
                                onClick={() => photoInputRef.current?.click()}
                            >
                                Выбрать фото
                            </Button>
                        </div>
                        <input
                            ref={cameraInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handlePhotoChange}
                            className="hidden"
                        />
                        <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoChange}
                            className="hidden"
                        />
                        <p className="text-xs text-foreground/50">До 10 МБ на фото, до 32 МБ всего</p>

                        {photos.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                                {photos.map((photo, index) => (
                                    <div key={photo.preview} className="relative aspect-square">
                                        <img
                                            src={photo.preview}
                                            alt={`Новое фото ${index + 1}`}
                                            className="size-full rounded-lg object-cover shadow"
                                        />
                                        <button
                                            type="button"
                                            aria-label={`Удалить фото ${index + 1}`}
                                            onClick={() => removePhoto(index)}
                                            className="absolute -right-2 -top-2 rounded-full bg-danger p-1 text-white shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {error && <p role="alert" className="rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">{error}</p>}

                    <DialogFooter>
                        <Button color="default" variant="flat" type="button" onClick={close}>Отмена</Button>
                        <Button color="primary" type="submit" isLoading={isSaving}>
                            {isSaving ? 'Публикуем...' : 'Опубликовать'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddPostModal;
