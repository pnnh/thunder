export interface PSNoteModel {
    uid: string
    create_time: string
    update_time: string
    description: string
    name: string
    image: string
    profile: string
    owner: string
    path: string
}

export interface PSNoteMetadataModel {
    uid: string
    image: string,
    description: string,
    name: string
}
