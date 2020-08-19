import {ItemConfig} from "./item-config";

/**
 * Описание отдельной колонки на kanban-доске
 */
export type BoardConfig = {
    id: string
    title: string
    item: ItemConfig[]
}