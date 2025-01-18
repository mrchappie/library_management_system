import { Book } from '../../types/types';

export function createUpdateBookQuery(book: Book) {
  const columns: string[] = [];
  const values: any[] = [];

  for (const [column, value] of Object.entries(book)) {
    if (column !== 'user_id' && column !== 'id') {
      columns.push('?? = ?');
      values.push(column, value);
    }
  }

  return [columns.join(', '), values];
}
