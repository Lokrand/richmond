/* eslint-disable import/no-unresolved */

'use client';

import React, { useEffect, useState, use } from 'react';
import {
    Card,
    Button,
    Chip,
} from '@/components/ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { toast } from 'sonner';
import {
    Camera, Trash2, Pencil, ImagePlus,
} from 'lucide-react';
import AddPostModal from '@/components/AddPostModal';
import EditCatModal from '@/components/EditCatModal';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ViewPhotoModal from '@/components/ViewPhotoModal';
import makeFirstCharUppercase from '@/utils/makeFirstCharUppercase';
import groupHabitTags from '@/utils/groupHabitTags';
import getCatYearNote from '../../../utils/getCatAgeNote';
import { auth } from '../../../lib/auth';
import { catApi, getS3Path, postApi } from '../../../config';
import {
    InternalApiCatCatResponse,
    InternalApiPostPostResponse,
} from '../../../client/models';
import { TyCat } from '../../../types';

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
        // @ts-expect-error
        description: cat.description,
        logo_path: cat.titlePhoto?.url ?? '',
        gallery: cat.galleryPhotos?.map((p) => p?.url ?? '').filter(Boolean) ?? [],
    };
};

interface CatPageProps {
    params: { id: string };
}

type PreviewImage = {
    src: string;
    alt: string;
    label: string;
};

const getPostPreviewImages = (post: InternalApiPostPostResponse): PreviewImage[] => {
    const photoUrls = (post.photos ?? []).flatMap((photo) => (photo.url ? [photo.url] : []));

    return photoUrls.map((url, index) => ({
        src: getS3Path(url),
        alt: `${post.title} — фото ${index + 1}`,
        label: `${index + 1} / ${photoUrls.length}`,
    }));
};

const CatPage = ({ params }: CatPageProps) => {
    // @ts-expect-error
    const { id } = use(params);
    const [cat, setCat] = useState<TyCat | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
    const [posts, setPosts] = useState<InternalApiPostPostResponse[]>([]);
    const [editingPost, setEditingPost] = useState<InternalApiPostPostResponse | null>(null);
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState('');
    const [postError, setPostError] = useState('');
    const [isPostSaving, setIsPostSaving] = useState(false);
    const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
    const [isPhotoOpen, setIsPhotoOpen] = useState(false);
    const [postPreviewImages, setPostPreviewImages] = useState<PreviewImage[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
        const fetchPosts = async () => {
            try {
                const response = await postApi.apiV1PostAllGet({ limit: 100 });
                setPosts((response.posts ?? []).filter((post) => post.catId === id));
            } catch {
                setPosts([]);
            }
        };

        fetchPosts();
    }, [id]);

    useEffect(() => {
        if (cat) {
            document.title = cat.name;
        }
    }, [cat]);

    const openImageModal = (index: number) => {
        setPostPreviewImages([]);
        setSelectedImageIndex(index);
        setIsPhotoOpen(true);
    };

    const openPostImageModal = (images: PreviewImage[], index: number) => {
        setPostPreviewImages(images);
        setSelectedImageIndex(index);
        setIsPhotoOpen(true);
    };

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
    const habitTags = groupHabitTags(cat.habits);

    const removeCat = async () => {
        const authHeader = await auth.getAuthorizationHeader();
        if (!authHeader) {
            return;
        }
        await catApi.apiV1CatIdDelete({
            id,
            authorization: authHeader.Authorization,
        });
    };

    const handleCatUpdate = async () => {
        try {
            const response = await catApi.apiV1CatIdGet(
                { id: parseInt(id, 10) },
                { cache: 'no-store' },
            );
            setCat(mapToTyCat(response));
        } catch {
            notFound();
        }
    };

    const handlePostCreated = (post: InternalApiPostPostResponse) => {
        setPosts((currentPosts) => [post, ...currentPosts]);
    };

    const openPostEditor = (post: InternalApiPostPostResponse) => {
        setEditingPost(post);
        setPostTitle(post.title ?? '');
        setPostBody(post.body ?? '');
        setPostError('');
    };

    const closePostEditor = () => {
        setEditingPost(null);
        setPostError('');
    };

    const updatePost = async (event: React.FormEvent) => {
        event.preventDefault();
        const postId = Number(editingPost?.postId);
        if (!postTitle.trim()) {
            setPostError('Добавьте заголовок записи');
            return;
        }
        if (!Number.isInteger(postId)) {
            setPostError('Не удалось определить запись');
            return;
        }

        setIsPostSaving(true);
        setPostError('');
        try {
            const authorization = await auth.getAuthorizationHeader();
            if (!authorization) {
                setPostError('Войдите, чтобы редактировать запись');
                return;
            }

            await postApi.apiV1PostIdPut({
                id: postId,
                authorization: authorization.Authorization,
                data: { title: postTitle.trim(), body: postBody.trim() },
            });
            setPosts((currentPosts) => currentPosts.map((post) => (
                post.postId === editingPost?.postId
                    ? { ...post, title: postTitle.trim(), body: postBody.trim() }
                    : post
            )));
            closePostEditor();
        } catch (error) {
            console.error('Update post error:', error);
            setPostError('Не удалось обновить запись. Попробуйте ещё раз');
        } finally {
            setIsPostSaving(false);
        }
    };

    const deletePost = async (post: InternalApiPostPostResponse) => {
        const postId = Number(post.postId);
        // eslint-disable-next-line no-alert
        if (!Number.isInteger(postId) || !window.confirm(`Удалить запись «${post.title ?? ''}»?`)) {
            return;
        }

        setDeletingPostId(postId);
        try {
            const authorization = await auth.getAuthorizationHeader();
            if (!authorization) {
                toast.error('Войдите, чтобы удалить запись');
                return;
            }

            await postApi.apiV1PostIdDelete({ id: postId, authorization: authorization.Authorization });
            setPosts((currentPosts) => currentPosts.filter((currentPost) => currentPost.postId !== post.postId));
        } catch (error) {
            console.error('Delete post error:', error);
            toast.error('Не удалось удалить запись. Попробуйте ещё раз');
        } finally {
            setDeletingPostId(null);
        }
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
                        <button
                            type="button"
                            onClick={() => openImageModal(-1)}
                            className="shrink-0 cursor-pointer"
                        >
                            <img
                                src={getS3Path(cat.logo_path)}
                                className="shadow-lg rounded-xl object-cover w-100 h-100 hover:opacity-90 transition-opacity"
                                height={400}
                                alt={cat.name}
                            />
                        </button>
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
                                    color="success"
                                    variant="shadow"
                                    className="p-2 min-w-10"
                                    onClick={() => setIsAddPostModalOpen(true)}
                                    aria-label="Добавить запись"
                                >
                                    <ImagePlus size={20} />
                                </Button>
                                <Button
                                    color="primary"
                                    variant="shadow"
                                    className="p-2 min-w-10"
                                    onClick={() => setIsEditModalOpen(true)}
                                    aria-label="Редактировать кота"
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
                        <p className="text-foreground/70 mt-4 mb-4">{cat.description || `Пушистик ${cat.name} пока не добавил описание, может быть ему дать вкусняшку, чтобы он рассказал о себе?`}</p>
                        <div className="space-y-3">
                            <p className="font-semibold text-foreground flex items-center justify-start gap-2">
                                <span>🌟</span>
                                {' '}
                                Любимые привычки
                            </p>
                            <div className="flex flex-wrap justify-start gap-2 rounded-xl border border-primary/10 bg-primary/5 p-3">
                                {habitTags.length ? habitTags.map((habit) => (
                                    <Chip
                                        key={habit.label.toLocaleLowerCase('ru-RU')}
                                        variant="flat"
                                        color="primary"
                                        size="sm"
                                        startContent={<span aria-hidden="true">🐾</span>}
                                        className="h-auto max-w-full whitespace-normal break-words px-3 py-1.5 text-left leading-5"
                                    >
                                        <span>{makeFirstCharUppercase(habit.label)}</span>
                                        {habit.occurrences > 1 && (
                                            <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold leading-none">
                                                ×
                                                {habit.occurrences}
                                            </span>
                                        )}
                                    </Chip>
                                )) : (
                                    <p className="text-sm text-foreground/60">Пока нет привычек</p>
                                )}
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
                                    <button
                                        type="button"
                                        onClick={() => openImageModal(index)}
                                        className="w-full cursor-pointer"
                                    >
                                        <img
                                            alt={`${cat.name} фото ${index + 1}`}
                                            src={getS3Path(image)}
                                            width={400}
                                            className="w-full rounded-xl hover:scale-[1.02] transition-transform duration-200"
                                        />
                                    </button>
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
                                    <Button
                                        color="primary"
                                        variant="shadow"
                                        startContent={<Camera size={18} />}
                                        onClick={() => setIsAddPostModalOpen(true)}
                                    >
                                        Добавить фото пушистика
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <section className="mt-8 rounded-2xl border border-default-200 bg-white/70 p-4 shadow-xl backdrop-blur-md dark:border-default-100 dark:bg-default-50 sm:p-6">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-2xl font-bold text-primary">
                            Записи о
                            {' '}
                            {cat.name}
                        </h2>
                        <Button
                            color="success"
                            variant="shadow"
                            startContent={<ImagePlus size={18} />}
                            onClick={() => setIsAddPostModalOpen(true)}
                        >
                            Добавить запись
                        </Button>
                    </div>

                    {posts.length ? (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <Card key={post.postId} className="bg-background/80 p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="text-lg font-semibold">{post.title}</h3>
                                        <div className="flex shrink-0 items-center gap-2">
                                            {post.createdAt && (
                                                <time dateTime={post.createdAt} className="text-sm text-foreground/50">
                                                    {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                                                </time>
                                            )}
                                            <Button
                                                type="button"
                                                color="primary"
                                                variant="flat"
                                                size="sm"
                                                isIconOnly
                                                aria-label="Редактировать запись"
                                                onClick={() => openPostEditor(post)}
                                                isDisabled={deletingPostId !== null}
                                            >
                                                <Pencil size={16} />
                                            </Button>
                                            <Button
                                                type="button"
                                                color="danger"
                                                variant="flat"
                                                size="sm"
                                                isIconOnly
                                                aria-label="Удалить запись"
                                                onClick={() => deletePost(post)}
                                                isLoading={deletingPostId === Number(post.postId)}
                                                isDisabled={deletingPostId !== null}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                    {post.body && <p className="mt-2 whitespace-pre-wrap text-foreground/75">{post.body}</p>}
                                    {post.photos?.length ? (() => {
                                        const postImages = getPostPreviewImages(post);
                                        return postImages.length > 0 && (
                                            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                                {postImages.map((photo, index) => (
                                                    <button
                                                        key={`${photo.src}-${index}`}
                                                        type="button"
                                                        className="aspect-square w-full"
                                                        onClick={() => openPostImageModal(postImages, index)}
                                                    >
                                                        <img
                                                            src={photo.src}
                                                            alt={photo.alt}
                                                            className="size-full rounded-lg object-cover"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        );
                                    })() : null}
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="py-8 text-center text-foreground/60">Записей пока нет. Добавьте первую фотографию!</p>
                    )}
                </section>

                <AddPostModal
                    catId={cat.id}
                    catName={cat.name}
                    isOpen={isAddPostModalOpen}
                    onClose={() => setIsAddPostModalOpen(false)}
                    onCreated={handlePostCreated}
                />
                <Dialog open={!!editingPost} onOpenChange={(open) => { if (!open) closePostEditor(); }}>
                    <DialogContent className="sm:max-w-xl">
                        <form onSubmit={updatePost} className="space-y-5">
                            <DialogHeader>
                                <DialogTitle className="text-2xl text-primary">Редактировать запись</DialogTitle>
                                <DialogDescription>Измените заголовок или текст записи</DialogDescription>
                            </DialogHeader>
                            <Input
                                label="Заголовок *"
                                value={postTitle}
                                onValueChange={(value) => { setPostTitle(value); setPostError(''); }}
                                maxLength={200}
                                isRequired
                                autoFocus
                            />
                            <Textarea
                                label="Текст"
                                value={postBody}
                                onChange={(event) => { setPostBody(event.target.value); setPostError(''); }}
                                maxLength={5000}
                                minRows={4}
                            />
                            {postError && <p role="alert" className="rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">{postError}</p>}
                            <DialogFooter>
                                <Button color="default" variant="flat" type="button" onClick={closePostEditor}>Отмена</Button>
                                <Button color="primary" type="submit" isLoading={isPostSaving}>
                                    {isPostSaving ? 'Сохраняем...' : 'Сохранить'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                <ViewPhotoModal
                    cat={cat}
                    isOpen={isPhotoOpen}
                    onClose={() => setIsPhotoOpen(false)}
                    onOpenChange={setIsPhotoOpen}
                    selectedImageIndex={selectedImageIndex}
                    setSelectedImageIndex={setSelectedImageIndex}
                    images={postPreviewImages}
                />
                <EditCatModal
                    cat={cat}
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onUpdate={handleCatUpdate}
                />
            </div>
        </div>
    );
};

export default CatPage;
