import { getClientSchema } from './getClientSchema';
import { jsonSchema } from 'uuidv4';
import { Schema } from '../elements/Schema';

const getItemIdentifierWithClientSchema = function (): Schema {
  return {
    type: 'object',
    properties: {
      contextIdentifier: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, format: 'alphanumeric' }
        },
        required: [ 'name' ],
        additionalProperties: false
      },
      aggregateIdentifier: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, format: 'alphanumeric' },
          id: jsonSchema.v4 as Schema
        },
        required: [ 'name', 'id' ],
        additionalProperties: false
      },
      id: jsonSchema.v4 as Schema,
      name: { type: 'string', minLength: 1, format: 'alphanumeric' },
      client: getClientSchema()
    },
    required: [
      'contextIdentifier',
      'aggregateIdentifier',
      'id',
      'name',
      'client'
    ],
    additionalProperties: false
  };
};

export { getItemIdentifierWithClientSchema };
