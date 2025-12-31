import {CodeNotFound, CodeOk, PLGetResult, PLSelectResult} from "@pnnh/atom";
import {openMainDatabase} from "@/services/server/database/database";
import {createPaginationByPage} from "@pnnh/atom";
import {PSNotebookModel} from "@/services/common/notebook";

async function findNotebookFromDatabase(uid: string): Promise<PLGetResult<PSNotebookModel | undefined>> {
    const db = await openMainDatabase()
    const result = await db.all<PSNotebookModel[]>(
        `select * from notebooks where uid = :uid limit 1`, {
            ':uid': uid,
        })
    if (!result || result.length === 0) {
    return {
        code: CodeNotFound,
        message: '',
        data: undefined
    }
}
return {
    code: CodeOk,
    message: '',
    data: result[0]
}
}


export async function selectNotebooksFromDatabase(page: number, size: number): Promise<PLSelectResult<PSNotebookModel>> {

    const db = await openMainDatabase();
    const {limit, offset} = createPaginationByPage(page, size);

    let selectSql = `SELECT * FROM notebooks WHERE 1 = 1 `;
    let selectParams: any = {}

    const count = await db.get<{ total: number }>(
        `SELECT COUNT(*) AS total FROM (${selectSql}) as temp`, selectParams
    );
    if (!count) {
        throw new Error("查询count失败");
    }
    selectSql += ` LIMIT :limit OFFSET :offset`;
    selectParams[":limit"] = limit;
    selectParams[":offset"] = offset;
    const result = await db.all<PSNotebookModel[]>(
        selectSql, selectParams,
    );
    return {
        code: CodeOk,
        message: '',
        data: {
            range: result,
            count: count.total,
            page: page,
            size: result.length
        }
    }
}
