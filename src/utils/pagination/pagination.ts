import { Expose, plainToInstance } from "class-transformer";
import { IsArray, IsNumber, Max, Min } from "class-validator";
import { IPaginatedOptions, IPaginatedQuery } from "./paginated.interfaces";

export class Paginated<T> {
    @IsArray()
    readonly items: T[];

    @Min(1)
    @IsNumber()
    readonly page: number;

    @Min(1)
    @Max(500)
    readonly limit: number;

    @IsNumber()
    readonly totalItems: number;

    @Expose()
    get totalPages(): number {
        return Math.ceil(this.totalItems / this.limit);
    }

    @Expose()
    get hasNextPage(): boolean {
        return this.page < this.totalPages;
    }

    @Expose()
    get hasPreviousPage(): boolean {
        return this.page > 1;
    }

    get skip(): number {
        return (this.page - 1) * this.limit;
    }

    map<R>(fn: (item: T, index: number, items: T[]) => R): Paginated<R> {
        return Paginated.from({
            items: this.items.map(fn),
            page: this.page,
            limit: this.limit,
            totalItems: this.totalItems
        });
    }

    static from<T>(
        data: [items: T[], totalItems: number],
        query?: IPaginatedQuery,
    ): Paginated<T>;
    
    static from<T>(options: IPaginatedOptions<T>): Paginated<T>;

    static from<T>(
        optionsOrTuple: IPaginatedOptions<T> | [items: T[], totalItems: number],
        query?: IPaginatedQuery,
    ): Paginated<T> {
        if (Array.isArray(optionsOrTuple)) {
            const [items, totalItems] = optionsOrTuple;
            const { page = 1, limit = Math.max(100, totalItems) } = query || {};
            return Paginated.from({
                items,
                page,
                limit,
                totalItems
            });
        }
        return plainToInstance(Paginated<T>, optionsOrTuple, {
            exposeDefaultValues: true,
        });
    }
}