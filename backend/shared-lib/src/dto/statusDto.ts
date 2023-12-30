export class StatusDto {

    id: string
    text?: string
    spoilerText?: string
    published: string
    uri: string
    totalLikes: number
    isFavorite: boolean
    isBookmark: boolean
    replies?: Array<StatusDto>
    boosted?: StatusDto
    account: {
        id: string
        username: string
        displayName: string
        domain: string
        avatarFilename: string
    }

}
