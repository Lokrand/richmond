export interface HabitTag {
    label: string;
    occurrences: number;
}

const groupHabitTags = (habits: string[]): HabitTag[] => {
    const tags = new Map<string, HabitTag>();

    habits.forEach((habit) => {
        const label = habit.trim();
        if (!label) return;

        const key = label.toLocaleLowerCase('ru-RU');
        const tag = tags.get(key);

        if (tag) {
            tag.occurrences += 1;
        } else {
            tags.set(key, { label, occurrences: 1 });
        }
    });

    return Array.from(tags.values());
};

export default groupHabitTags;
