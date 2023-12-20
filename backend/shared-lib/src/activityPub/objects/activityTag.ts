

export interface ActivityTag {
    id?: number
    type?: TagType
    href?: string
    name: string
}

export enum TagType {
    HASHTAG = "Hashtag",
    MENTION = "Mention",
    EMOJI = "Emoji"
}
