import type { Queries, QueryNames } from '../queries/queries';
import type { TaskHandler } from '@agnoc/toolkit';

export abstract class QueryHandler implements TaskHandler {
  abstract forName: QueryNames;
  abstract handle(event: Queries[this['forName']]): void;
}
