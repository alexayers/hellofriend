import {Actor} from "./actor";
import {ActivityTag} from "../objects/activityTag";

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
    uri: string
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
    tag?: Array<ActivityTag>
    attachment?: Array<{ type: string, name: string, value: string }>
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
