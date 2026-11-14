import { open } from 'react-native-nitro-sqlite';
import { Repository, type Database } from './repository';

export function openRepository(): Repository {
  const connection = open({ name: 'orbia.sqlite' });
  const database: Database = {
    async execute(sql, params) {
      return (
        (
          await connection.executeAsync<Record<string, string | number | null>>(
            sql,
            params,
          )
        ).rows?._array ?? []
      );
    },
    transaction(work) {
      return connection.transaction(tx =>
        work({
          async execute(sql, params) {
            return (
              (
                await tx.executeAsync<Record<string, string | number | null>>(
                  sql,
                  params,
                )
              ).rows?._array ?? []
            );
          },
        }),
      );
    },
  };
  return new Repository(database);
}
