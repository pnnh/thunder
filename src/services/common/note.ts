export interface PSNoteModel {
    title: string
    header: string
    body: string
    create_time: string
    update_time: string
    creator: string
    keywords: string
    description: string
    cover: string
    coverUrl: string
    discover: number
    owner: string
    channel: string
    partition: string
    path: string
    uid: string
    lang: string
    channel_name: string
    name: string
    url: string
    repo_url: string
    full_repo_url: string
    full_repo_path: string
}

export function NewNoteModel(): PSNoteModel {
    return {
        body: "",
        channel: "",
        channel_name: "",
        cover: "",
        coverUrl: "",
        creator: "",
        discover: 0,
        full_repo_path: "",
        full_repo_url: "",
        header: "",
        keywords: "",
        lang: "",
        partition: "",
        repo_url: "",
        title: "",
        url: "",
        create_time: "", update_time: "",
        uid: '',
        name: '',
        description: '',
        owner: '',
        path: ''
    }
}

export interface PSNoteMetadataModel {
    uid: string
    image: string
    description: string
    title: string
    tags: string
}

export interface PSNoteFileModel {
    title: string
    path: string
    is_dir: boolean
    is_text: boolean
    is_image: boolean
    storage_path: string
    full_repo_path: string
}
