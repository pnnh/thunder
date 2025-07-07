// 解析配置信息
import dotenv from "dotenv";
import {IAppConfig} from "../common/config";
import {resolvePath} from "@/atom/server/filesystem/path";

const result = dotenv.config({path: `.env.${process.env.NODE_ENV ?? 'development'}`})
if (result.error) {
    throw new Error(`解析配置出错: ${result.error}`)
}

function parseConfig(): IAppConfig {
    const config = {
        ENV: process.env.NODE_ENV ?? 'development',
        DATA_PATH: process.env.DATA_PATH ?? './data',
        BLOG_PATH: process.env.BLOG_PATH ?? '',
        PUBLIC_POLARIS_URL: process.env.PUBLIC_POLARIS_URL ?? '',
        PUBLIC_PORTAL_URL: process.env.PUBLIC_PORTAL_URL ?? ''
    }
    if (!config.ENV) {
        throw new Error('ENV is required')
    }
    config.DATA_PATH = resolvePath(config.DATA_PATH)
    if (!config.DATA_PATH) {
        throw new Error('DATA_PATH is required')
    }
    if (!config.BLOG_PATH) {
        throw new Error('BLOG_PATH is required')
    }
    if (!config.PUBLIC_POLARIS_URL) {
        throw new Error('PUBLIC_POLARIS_URL is required')
    }
    if (!config.PUBLIC_PORTAL_URL) {
        throw new Error('PUBLIC_PORTAL_URL is required')
    }

    return config
}

export async function serverGetAppConfig(): Promise<IAppConfig> {
    return parseConfig()
}
