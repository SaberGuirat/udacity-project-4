import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('TodosBusinessLogic')

const todosAccess = new TodosAccess()

export const getTodosForUser = (userId: string): Promise<TodoItem[]> => {
  logger.info('Getting todos for specific user')
  return todosAccess.getTodosForUser(userId)
}
export const createTodo = async (
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> => {
  logger.info('Creating a new todo')
  const todoId: string = uuid.v4()
  const newItem: TodoItem = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    done: false,
    ...createTodoRequest
  }

  return await todosAccess.createTodo(newItem)
}
