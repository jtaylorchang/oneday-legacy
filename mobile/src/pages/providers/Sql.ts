import { Injectable } from "@angular/core";

const DB_NAME: string = "__ionicstorage";
const win: any = window;

@Injectable()
export class Sql {
  private _db: any;

  constructor() {
    if (win.sqlitePlugin) {
      this._db = win.sqlitePlugin.openDatabase({
        name: DB_NAME,
        location: 2,
        createFromLocation: 0,
      });
    } else {
      console.warn(
        "Storage: SQLite plugin not installed, falling back to WebSQL. Make sure to install cordova-sqlite-storage in production!"
      );

      this._db = win.openDatabase(DB_NAME, "1.0", "database", 5 * 1024 * 1024);
    }
    this._tryInit();
  }

  // Initialize the DB with our required tables
  _tryInit() {
    this.query(
      "CREATE TABLE IF NOT EXISTS kv (key text primary key, value text)"
    ).catch((err) => {
      console.error(
        "Storage: Unable to create initial storage tables",
        err.tx,
        err.err
      );
    });
  }

  /**
   * Perform an arbitrary SQL operation on the database. Use this method
   * to have full control over the underlying database through SQL operations
   * like SELECT, INSERT, and UPDATE.
   *
   * @param {string} query the query to run
   * @param {array} params the additional params to use for query placeholders
   * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
   */
  query(query: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this._db.transaction(
          (tx: any) => {
            tx.executeSql(
              query,
              params,
              (tx: any, res: any) => resolve({ tx: tx, res: res }),
              (tx: any, err: any) => reject({ tx: tx, err: err })
            );
          },
          (err: any) => reject({ err: err })
        );
      } catch (err) {
        reject({ err: err });
      }
    });
  }

  /**
   * Get the value in the database identified by the given key.
   * @param {string} key the key
   * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
   */
  get(key: string): Promise<any> {
    return this.query("select key, value from kv where key = ? limit 1", [
      key,
    ]).then((data) => {
      if (data.res.rows.length > 0) {
        return data.res.rows.item(0).value;
      }
    });
  }

  /**
   * Set the value in the database for the given key. Existing values will be overwritten.
   * @param {string} key the key
   * @param {string} value The value (as a string)
   * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
   */
  set(key: string, value: string): Promise<any> {
    return this.query("insert or replace into kv(key, value) values (?, ?)", [
      key,
      value,
    ]);
  }

  /**
   * Remove the value in the database for the given key.
   * @param {string} key the key
   * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
   */
  remove(key: string): Promise<any> {
    return this.query("delete from kv where key = ?", [key]);
  }

  /**
   * Clear all keys/values of your database.
   * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
   */
  clear(): Promise<any> {
    return this.query("delete from kv");
  }
}
