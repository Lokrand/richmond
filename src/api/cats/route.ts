import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

interface Cat {
    id: number;
    name: string;
    age: number;
    weight: number;
    habits: string[];
    description: string;
    gallery: string[];
}

interface CatsData {
    cats: Cat[];
}

const dataFilePath = path.join(process.cwd(), 'data', 'cats.json');
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

const ensureDirectories = async (): Promise<void> => {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.mkdir(uploadsDir, { recursive: true });
};

export async function POST(request: Request): Promise<Response> {
    try {
        await ensureDirectories();

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const age = formData.get('age') as string;
        const weight = formData.get('weight') as string;
        const habits = formData.get('habits') as string;
        const description = formData.get('description') as string;
        const photos = formData.getAll('photos') as File[];

        if (!name || photos.length === 0) {
            return Response.json({ success: false, error: 'Имя и фото обязательны' });
        }

        let jsonData: CatsData;
        try {
            const data = await fs.readFile(dataFilePath, 'utf8');
            jsonData = JSON.parse(data);
        } catch {
            jsonData = { cats: [] };
        }

        const galleryPaths: string[] = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const photo of photos) {
            if (photo.size > 5 * 1024 * 1024) {
                return Response.json({ success: false, error: 'Файл слишком большой' });
            }

            // eslint-disable-next-line no-await-in-loop
            const buffer = await photo.arrayBuffer();
            const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
            const filepath = path.join(uploadsDir, filename);

            // eslint-disable-next-line no-await-in-loop
            await sharp(Buffer.from(buffer))
                .resize(1200, 1200, {
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                .jpeg({ quality: 80 })
                .toFile(filepath);

            galleryPaths.push(`/uploads/${filename}`);
        }

        const newCat: Cat = {
            id: Date.now(),
            name,
            age: parseInt(age) || 0,
            weight: parseFloat(weight) || 0,
            habits: habits ? habits.split(',').map((h) => h.trim()).filter((h) => h) : [],
            description: description || '',
            gallery: galleryPaths,
        };

        jsonData.cats.push(newCat);
        await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2));

        return Response.json({ success: true, cat: newCat });
    } catch (error) {
        console.error('Error saving cat:', error);
        return Response.json({ success: false, error: 'Server error' });
    }
}

export async function GET(): Promise<Response> {
    try {
        await ensureDirectories();
        const data = await fs.readFile(dataFilePath, 'utf8');
        return Response.json(JSON.parse(data));
    } catch (error) {
        return Response.json({ cats: [] });
    }
}