export const getCatShareData = (catName: string, url: string): ShareData => ({
    title: `${catName} — Пушистик дня`,
    text: `Посмотри на пушистика по имени ${catName} 😺🐾`,
    url,
});
