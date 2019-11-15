import { Expression } from "./data_types";

export class SelectionMethod {

    static pickAnItem(items: Array<any>, expression?: Expression): any {
        if (!expression) {
            return this.uniformRandomSelector(items);
        }
        switch(expression.name) {
            case 'uniform':
                return this.uniformRandomSelector(items);
            case 'highestPriority':
                return this.selectHighestPriority(items);
            case 'exponential':
                return this.exponentialRandomSelector(items, expression);
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

    private static exponentialRandomSelector(items: Array<any>, expression?: Expression): any {
        if (items.length < 1 || !expression || typeof(expression.data) !== 'number') {
            return;
        }
        // TODO: rate is pointless right now - adapt formula if necessary
        const rate = expression.data;
        const scaling = -Math.log(0.002) / rate;

        const sorted = this.sortByPriority(items);
        const uniform = Math.random();

        let exp = (-1/rate) * Math.log(uniform) / scaling;
        if (exp > 1) {
            exp = 1;
        }
        let index =  Math.floor(exp * items.length);
        if (index >= items.length) {
            index = items.length - 1;
        }
        return sorted[index];
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