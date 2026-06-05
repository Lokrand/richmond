/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { catsDB } from '../../../../lib/db';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
const catsImagesDir = path.join(process.cwd(), 'public', 'cats');

async function ensureDirs() {
    await Promise.all([
        fs.mkdir(uploadsDir, { recursive: true }),
        fs.mkdir(catsImagesDir, { recursive: true }),
    ]);
}

async function getNextCatId(): Promise<number> {
    const cats = catsDB.getAllCats();
    if (cats.length === 0) return 1;
    return Math.max(...cats.map((cat) => cat.id)) + 1;
}

async function saveCatImage(
    file: File,
    catId: number,
    imageType: 'logo' | 'gallery',
    imageIndex?: number,
): Promise<string> {
    await ensureDirs();

    const buffer = await file.arrayBuffer();

    let filename: string;
    if (imageType === 'logo') {
        filename = `cat-${catId}-logo.jpg`;
    } else {
        filename = `cat-${catId}-${imageIndex}.jpg`;
    }

    const filepath = path.join(catsImagesDir, filename);

    await sharp(Buffer.from(buffer))
        .resize(1200, 1200, {
            fit: 'inside',
            withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toFile(filepath);

    return `/cats/${filename}`;
}

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    try {
        const params = await context.params;
        const id = params.id;
        const numericId = parseInt(id, 10);

        if (Number.isNaN(numericId) || numericId <= 0) {
            console.error(`❌ Invalid cat ID: ${id}`);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Неверный ID кота',
                },
                { status: 400 },
            );
        }

        const cat = catsDB.getCatById(numericId);

        if (!cat) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Кот не найден',
                },
                { status: 404 },
            );
        }

        return NextResponse.json(cat);
    } catch (error) {
        console.error('❌ Error fetching cat:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Ошибка при получении кота',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const name = formData.get('name') as string;
        const age = formData.get('age') as string;
        const weight = formData.get('weight') as string;
        const breed = formData.get('breed') as string;
        const habits = formData.get('habits') as string;
        const description = formData.get('description') as string;
        const titlePhoto = formData.get('titlePhoto') as File;
        const galleryPhotos = formData.getAll('galleryPhotos') as File[];

        if (!name?.trim()) {
            return NextResponse.json(
                { error: 'Имя обязательно' },
                { status: 400 },
            );
        }

        if (!titlePhoto) {
            return NextResponse.json(
                { error: 'Главное фото обязательно' },
                { status: 400 },
            );
        }

        const catId = await getNextCatId();

        const logoPath = await saveCatImage(titlePhoto, catId, 'logo');

        const galleryPaths: string[] = [];
        for (let i = 0; i < galleryPhotos.length; i++) {
            const photo = galleryPhotos[i];
            if (photo.size > 0) {
                const galleryPath = await saveCatImage(photo, catId, 'gallery', i + 1);
                galleryPaths.push(galleryPath);
            }
        }

        const newCat = catsDB.createCat({
            name: name.trim(),
            age: parseInt(age, 10) || 0,
            weight: parseFloat(weight) || 0,
            breed: breed.trim(),
            description: (description || '').trim(),
            logo: logoPath,
            habits: habits ? habits.split(',').map((h) => h.trim()).filter((h) => h) : [],
            gallery: galleryPaths,
        });

        return NextResponse.json(
            {
                success: true,
                cat: newCat,
                message: `Кот создан с ID: ${catId}, картинки сохранены как: cat-${catId}-*`,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error('Error creating cat:', error);
        return NextResponse.json(
            { error: 'Ошибка при создании кота' },
            { status: 500 },
        );
    }
}
