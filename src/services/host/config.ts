// 解析配置信息
import dotenv from "dotenv";
import {IAppConfig} from "../common/config";
import {resolvePath} from "@pnnh/atom/nodejs";

const result = dotenv.config({path: `.env.${process.env.NODE_ENV ?? 'development'}`})
if (result.error) {
    throw new Error(`解析配置出错: ${result.error}`)
}

function parseConfig(): IAppConfig {
    const config = {
        ENV: process.env.NODE_ENV ?? 'development',
        DATA_PATH: process.env.DATA_PATH ?? './data',
    }
    if (!config.ENV) {
        throw new Error('ENV is required')
    }
    config.DATA_PATH = resolvePath(config.DATA_PATH)
    if (!config.DATA_PATH) {
        throw new Error('DATA_PATH is required')
    }

    return config
}

export async function hostGetAppConfig(): Promise<IAppConfig> {
    return parseConfig()
}
