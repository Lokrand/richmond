import assert from 'node:assert/strict';
import test from 'node:test';
import { getCatShareData } from './shareCat.ts';

test('builds share data for the cat page', () => {
    assert.deepEqual(getCatShareData('Барсик', 'https://example.com/cats/5'), {
        title: 'Барсик — Пушистик дня',
        text: 'Посмотри на пушистика по имени Барсик 😺🐾',
        url: 'https://example.com/cats/5',
    });
});
