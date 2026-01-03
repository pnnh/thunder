import sqlite3 from 'sqlite3'
import {Database, open} from 'sqlite'
import {serverGetAppConfig} from "@/services/server/config";
import {ensureDirectoryExistence} from "@pnnh/atom/nodejs";

const databaseMap: Map<string, Database<sqlite3.Database>> = new Map()

export async function openDatabase(filename: string): Promise<Database<sqlite3.Database>> {
    if (databaseMap.has(filename)) {
        return databaseMap.get(filename) as Database<sqlite3.Database>
    }
    const database = await open({
        filename: filename,
        driver: sqlite3.cached.Database
    })
    databaseMap.set(filename, database)
    return database
}

export async function openMainDatabase() {
    const serverConfig =  await serverGetAppConfig()
    const cachePath = `${serverConfig.DATA_PATH}/cache`
    ensureDirectoryExistence(cachePath)
    const mainDatabasePath = `${cachePath}/polaris.db`
    return openDatabase(mainDatabasePath)
}
