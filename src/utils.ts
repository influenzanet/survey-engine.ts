export const pickRandomListItem = (items: Array<any>): any => {
    return items[Math.floor(Math.random() * items.length)];
}