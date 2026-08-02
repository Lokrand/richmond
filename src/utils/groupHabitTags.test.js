const assert = require('node:assert/strict');
const test = require('node:test');
const groupHabitTags = require('./groupHabitTags.ts').default;

test('groups repeated habits regardless of case and ignores blanks', () => {
    assert.deepEqual(
        groupHabitTags(['Споть', ' споть ', '', 'Потом покушать', 'споть', 'Кусать за ноги']),
        [
            { label: 'Споть', occurrences: 3 },
            { label: 'Потом покушать', occurrences: 1 },
            { label: 'Кусать за ноги', occurrences: 1 },
        ],
    );
});
