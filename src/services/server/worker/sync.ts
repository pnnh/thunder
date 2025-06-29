
import {SystemChannelService} from "@/services/server/system/channel";
import {serverGetAppConfig} from "@/services/server/config";

// 由定时任务调用，同步文章数据到本地数据库
export async function runSync() {
    const serverConfig = await serverGetAppConfig()
    const domainUrl = serverConfig.BLOG_PATH
    const channelService = new SystemChannelService(domainUrl)
    await channelService.runSync()
}
