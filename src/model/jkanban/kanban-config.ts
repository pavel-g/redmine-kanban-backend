import {BoardConfig} from "./board-config";

/**
 * Параметры для отдельного виджета jKanban
 */
export type KanbanConfig = {
    /**
     * Массив колонок одной доски
     */
    boards: BoardConfig[]

    id: number

    number?: number

    /**
     * id для div-контейнера на html странице, например - #issue_123
     */
    element: string

    title: string
}
