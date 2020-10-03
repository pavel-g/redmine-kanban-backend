import { Board } from './board';
import { KanbanConfig } from './jkanban/kanban-config';

/**
 * Полная информация о доске
 *
 * Включает в себя как информацию из БД, так и полный набор данных для отображения доски на фронтенде
 */
export type BoardFullInfo = {
  id: number
  name: string
  config: Board
  kanban: KanbanConfig[]
}