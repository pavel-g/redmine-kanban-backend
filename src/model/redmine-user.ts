/**
 * Пользователь из redmine
 *
 * Такая структура возвращается при запросах https://redmine.org/users/123.json
 */
export type RedmineUser = {
  id: number,
  firstname: string,
  lastname: string,
  mail: string,
  created_on: string
  last_login_on: string
}