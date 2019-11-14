import { Expression } from "./data_types";

export class SelectionMethod {

    static pickAnItem(items: Array<any>, expression?: Expression): any {
        if (!expression) {
            return this.uniformRandomSelector(items);
        }
        switch(expression.name) {
            case 'uniform':
                return this.uniformRandomSelector(items);
            case 'highesPriority':
                return this.selectHighestPriority(items);
            default:
                console.error('pickAnItem: expression name is not known: ' + expression.name);
                return this.uniformRandomSelector(items);
        }
    }

    private static uniformRandomSelector(items: Array<any>): any {
        if (items.length < 1) {
            return;
        }
        return items[Math.floor(Math.random() * items.length)];
    }

    private static selectHighestPriority(items: Array<any>): any {
        if (items.length < 1) {
            return;
        }
        const sorted = this.sortByPriority(items);
        return sorted[0];
    }

    private static sortByPriority(items: Array<any>): Array<any> {
        return items.sort((a, b) => a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0);
    }
}