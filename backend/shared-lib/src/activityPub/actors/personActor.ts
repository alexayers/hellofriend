import {Actor} from "./actor";
import {Tag} from "../objects/tag";

export interface PersonActor extends Actor {
    "@context": any
    following: string
    followers: string
    inbox: string
    outbox: string
    featured: string
    featuredTags: string
    preferredUsername: string
    name: string
    summary: string
    url: string
    manuallyApprovesFollowers: boolean
    discoverable: boolean
    indexable: boolean
    published: string
    memorial: boolean
    devices: string
    publicKey: {
        id: string
        owner: string
        publicKeyPem: string
    },
    tag?: Array<Tag>
    attachment?: Array<{type: string, name: string, value: string}>
    endpoints: {
        sharedInbox: string
    },
    icon: {
        type: string
        mediaType: string
        url: string
        filename?: string
        size: number
    },
    image: {
        type: string
        mediaType: string
        url: string
        filename?: string
        size: number
    }
}
