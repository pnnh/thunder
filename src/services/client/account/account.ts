import {clientMakeHttpGet} from "@/services/client/http";
import {CodeOk, PLGetResult} from "@/atom/common/models/protocol";
import {AccountModel} from "@/atom/common/models/account";
import {photonFillUserinfo} from "@/photon/common/models/account/account";

export async function checkLoginStatus(linkId: string) {
    try {
        const appConfig = await window.serverAPI.getAppConfig()
        const checkUrl = `${appConfig.PUBLIC_PORTAL_URL}/account/session?app=thunder&link=${linkId}`
        const response = await clientMakeHttpGet<PLGetResult<AccountModel>>(checkUrl);
        if (response.code !== CodeOk || !response.data) {
            throw new Error(`Failed to check login status: ${response.code}`);
        }
        const userInfo = photonFillUserinfo(appConfig.PUBLIC_PORTAL_URL, response.data);
        return userInfo;
    } catch (error) {
        console.warn('Error checking login status:', error);
    }
    return null;
}

