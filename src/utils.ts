export const pickRandomListItem = (items: Array<any>): any => {
    return items[Math.floor(Math.random() * items.length)];
}

export const removeItemByKey = (items: Array<any>, key: string): Array<any> => {
    return items.filter(item => item.key !== key);
}