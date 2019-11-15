import { SelectionMethod } from "../selection-method";

describe('testing selection methods', () =>{
    test('without method definition', () => {
        const items = [
            { key: 'q1' },
            { key: 'q2' },
            { key: 'q3' },
        ];

        const item = SelectionMethod.pickAnItem(items);
        expect(item).toBeDefined();
        console.log('selected item is: ' + item.key);
    });

    test('with uniform random selection', () => {
        const items = [
            { key: 'q1' },
            { key: 'q2' },
            { key: 'q3' },
        ];

        const item = SelectionMethod.pickAnItem(items, { name: 'uniform' });
        expect(item).toBeDefined();
        console.log('selected item is: ' + item.key);
    });

    test('with highestPriority selection - missing priorities', () => {
        const items = [
            { key: 'q1' },
            { key: 'q2' },
            { key: 'q3' },
        ];

        const item = SelectionMethod.pickAnItem(items, { name: 'highestPriority' });
        expect(item).toBeDefined();
        expect(item.key).toBe('q1');
        console.log('selected item is: ' + item.key);
    });

    test('with highestPriority selection', () => {
        const items = [
            { key: 'q1', priority: 2 },
            { key: 'q2', priority: 3 },
            { key: 'q3', priority: 1 },
            { key: 'q4' },
        ];

        const item = SelectionMethod.pickAnItem(items, { name: 'highestPriority' });
        expect(item).toBeDefined();
        expect(item.key).toBe('q2');
        console.log('selected item is: ' + item.key);
    });

    test('with exponential distribution selection missing data argument', () => {
        const items = [
            { key: 'q1', priority: 2 },
            { key: 'q2', priority: 3 },
            { key: 'q3', priority: 1 },
            { key: 'q4' },
        ];

        const item = SelectionMethod.pickAnItem(items, { name: 'exponential' });
        expect(item).toBeUndefined();
    });

    test('with exponential distribution selection with wrong data argmument type', () => {
        const items = [
            { key: 'q1', priority: 2 },
            { key: 'q2', priority: 3 },
            { key: 'q3', priority: 1 },
            { key: 'q4' },
        ];

        const item = SelectionMethod.pickAnItem(items, { name: 'exponential', data: '2' });
        expect(item).toBeUndefined();
    });

    test('with exponential distribution selection', () => {
        const items = [
            { key: 'q1', priority: 2 },
            { key: 'q2', priority: 3 },
            { key: 'q3', priority: 1 },
            { key: 'q4' },
        ];

        const item = SelectionMethod.pickAnItem(items, { name: 'exponential', data: 0.5 });
        expect(item).toBeDefined();
        console.log('selected item is: ' + item.key);
    });
});

