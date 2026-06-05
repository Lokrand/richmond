/* eslint-disable no-console, no-restricted-syntax, no-await-in-loop */
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { catsDB } from '../../../lib/db';

export async function POST(request: Request): Promise<Response> {
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

        console.log('📋 Получены данные:', {
            name,
            age,
            weight,
            breed,
            titlePhotoSize: titlePhoto?.size || 0,
            galleryPhotosCount: galleryPhotos.length,
        });

        if (!name || !name.trim()) {
            return Response.json({ success: false, error: 'Имя обязательно' });
        }

        if (!titlePhoto || titlePhoto.size === 0) {
            return Response.json({ success: false, error: 'Главное фото обязательно' });
        }

        const tempCat = catsDB.createCat({
            name: name.trim(),
            age: parseInt(age, 10) || 0,
            weight: parseFloat(weight) || 0,
            breed: breed.trim(),
            description: (description || '').trim(),
            logo: '',
            habits: habits ? habits.split(',').map((h) => h.trim()).filter((h) => h) : [],
            gallery: [],
        });

        console.log(`✅ Кот создан в базе с ID: ${tempCat.id}`);

        const catId = tempCat.id;
        const catsImagesDir = path.join(process.cwd(), 'public', 'cats');

        await fs.mkdir(catsImagesDir, { recursive: true });

        let logoPath = '';
        try {
            const buffer = await titlePhoto.arrayBuffer();
            const logoFilename = `cat-${catId}-logo.jpg`;
            const logoFilepath = path.join(catsImagesDir, logoFilename);

            await sharp(Buffer.from(buffer))
                .resize(1200, 1200, {
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                .jpeg({ quality: 80 })
                .toFile(logoFilepath);

            logoPath = `/cats/${logoFilename}`;
            console.log(`✅ Логотип сохранен: ${logoPath}`);
        } catch (error) {
            console.error('❌ Ошибка сохранения логотипа:', error);
            catsDB.deleteCat(catId);
            return Response.json({
                success: false,
                error: 'Ошибка при сохранении главного фото',
            });
        }

        const galleryPaths: string[] = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < galleryPhotos.length; i++) {
            const photo = galleryPhotos[i];
            if (photo.size > 0) {
                try {
                    const buffer = await photo.arrayBuffer();
                    const galleryFilename = `cat-${catId}-${i + 1}.jpg`;
                    const galleryFilepath = path.join(catsImagesDir, galleryFilename);

                    await sharp(Buffer.from(buffer))
                        .resize(1200, 1200, {
                            fit: 'inside',
                            withoutEnlargement: true,
                        })
                        .jpeg({ quality: 80 })
                        .toFile(galleryFilepath);

                    galleryPaths.push(`/cats/${galleryFilename}`);
                    console.log(`✅ Фото галереи сохранено: /cats/${galleryFilename}`);
                } catch (error) {
                    console.error(`❌ Ошибка сохранения фото галереи ${i + 1}:`, error);
                }
            }
        }

        const updatedCat = catsDB.updateCat(catId, {
            logo: logoPath,
            gallery: galleryPaths,
        });

        return Response.json({
            success: true,
            cat: updatedCat,
            message: `Кот создан с ID: ${catId}`,
        });
    } catch (error) {
        console.error('❌ Error saving cat:', error);
        return Response.json({
            success: false,
            error: `Ошибка сервера: ${error instanceof Error ? error.message : String(error)}`,
        });
    }
}

export async function GET(): Promise<Response> {
    try {
        const cats = catsDB.getAllCats();
        console.log(`📊 Запрошены коты: ${cats.length} шт`);
        return Response.json(cats);
    } catch (error) {
        console.error('❌ Error reading cats data:', error);
        return Response.json({
            success: false,
            error: 'Ошибка загрузки данных',
            cats: [],
        });
    }
}
