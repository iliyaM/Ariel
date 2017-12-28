import { Pipe, PipeTransform } from '@angular/core';

/*
 * Enables the key/value pair of an item to be
 * visible within an ngFor
 * Usage:
 *   value of iteratable | keyValue
 * Example:
 * <ul>
 *   <li *ngFor='key of demo | keyValue'>
 *   Key: {{key.key}}, value: {{key.value}}
 *   </li>
 * </ul>
*/
@Pipe({ name: 'keyValue' })
export class KeyValuePipe implements PipeTransform {
    transform(value, args: string[]): any {
        const keys = [];
        for (const key in value) {
            keys.push({ key: key, value: value[key] });
        }
        return keys;
    }
}