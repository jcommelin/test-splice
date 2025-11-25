  retryDelay: number;
/**
 * Database utilities for data persistence
 */

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  poolSize: number;
  timeout: number;
}

export interface QueryResult<T> {
  rows: T[];
  rowCount: number;
  duration: number;
}

export interface Transaction {
  id: string;
  queries: string[];
  startTime: Date;
  committed: boolean;
}

const defaultConfig: DatabaseConfig = {
  host: 'localhost',
  port: 5432,
  database: 'app',
  username: 'user',
  password: 'password',
  poolSize: 10,
  timeout: 30000,
};

/**
 * Build a connection string from config
 */
export function buildConnectionString(config = defaultConfig): string {
  return `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
}

/**
 * Escape a value for SQL queries
 */
export function escapeValue(value: unknown): string {
  if (value === null || value === undefined) {
    return 'NULL';
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }

  if (value instanceof Date) {
    return `'${value.toISOString()}'`;
  }

  if (typeof value === 'string') {
    return `'${value.replace(/'/g, "''")}'`;
  }

  return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
}

/**
 * Build an INSERT query
 */
export function buildInsertQuery(table: string, data: Record<string, unknown>): string {
  const columns = Object.keys(data);
  const values = Object.values(data).map(escapeValue);

  return `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values.join(', ')})`;
}

/**
 * Build an UPDATE query
 */
export function buildUpdateQuery(
  table: string,
  data: Record<string, unknown>,
  whereClause: string
): string {
  const sets = Object.entries(data)
    .map(([key, value]) => `${key} = ${escapeValue(value)}`)
    .join(', ');

  return `UPDATE ${table} SET ${sets} WHERE ${whereClause}`;
}

/**
 * Build a SELECT query
 */
export function buildSelectQuery(
  table: string,
  columns: string[] = ['*'],
  whereClause?: string,
  orderBy?: string,
  limit?: number
): string {
  let query = `SELECT ${columns.join(', ')} FROM ${table}`;

  if (whereClause) {
    query += ` WHERE ${whereClause}`;
  }

  if (orderBy) {
    query += ` ORDER BY ${orderBy}`;
  }

  if (limit) {
    query += ` LIMIT ${limit}`;
  }

  return query;
}

/**
 * Build a DELETE query
 */
export function buildDeleteQuery(table: string, whereClause: string): string {
  return `DELETE FROM ${table} WHERE ${whereClause}`;
}

/**
 * Validate a table name to prevent SQL injection
 */
export function isValidTableName(name: string): boolean {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
}

/**
 * Format query results for logging
 */
export function formatQueryResult<T>(result: QueryResult<T>): string {
  return `Query returned ${result.rowCount} rows in ${result.duration}ms`;
}
