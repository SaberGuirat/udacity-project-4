import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosIndex = process.env.INDEX_NAME
  ) {}
  async getTodosForUser(userId: string): Promise<TodoItem[]> {
    try {
      logger.info('Getting todos for specific user')
      const result = await this.docClient
        .query({
          TableName: this.todosTable,
          IndexName: this.todosIndex,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId
          }
        })
        .promise()
      const items = result.Items
      return items as TodoItem[]
    } catch (error) {
      logger.error(error.message)
    }
  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    try {
      logger.info('Creating a new todo')
      await this.docClient
        .put({
          TableName: this.todosTable,
          Item: todoItem
        })
        .promise()

      return todoItem
    } catch (error) {
      logger.error(error.message)
    }
  }
}

const createDynamoDBClient = () => new XAWS.DynamoDB.DocumentClient()
