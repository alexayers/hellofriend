import {ActivityTag} from "../objects/activityTag";

export enum ActivityType {
    Follow = "Follow",
    Accept = "Accept",
    Undo = "Undo",
    Create = "Create",
    Delete = "Delete",
    Announce = "Announce"
}

export enum CoreType {
    Collection = "Collection"
}

export interface Activity {
    "@context": string | Array<any>
    id: string
    type: ActivityType
    actor: string
}


export interface FollowActivity extends Activity {
    object: string
}

export interface AcceptActivity extends Activity {
    object: FollowActivity
}

export interface AnnounceActivity extends Activity {

}

export interface UndoFollowActivity extends Activity {
    object: FollowActivity
}

export enum CreateActivityType {
    Note = "Note"
}

export interface ActivityNote {
    id: string
    type: CreateActivityType
    summary?: string
    inReplyTo?: string
    published: string
    updated?: string
    url: string
    attributedTo: string
    to: Array<string>
    cc: Array<string>
    sensitive: boolean
    atomUri: string
    inReplyToAtomUri: null
    conversation: string
    content: string
    contentMap?: {
        en: string
    }
    attachment?: Array<any>
    tag?: Array<ActivityTag>
    replies?: {
        id: string,
        type: CoreType
        first?: Array<any>
    }

}

export interface CreateActivity extends Activity {
    published: string
    to: Array<string>
    cc: Array<string>
    object: ActivityNote
    signature: Signature
}

export interface Tombstone {
    id: string
    type: ActivityType
    atomUri: string
}

export interface DeleteActivity extends Activity {
    to: Array<string>
    object: Tombstone
    signature: Signature
}

export interface Signature {
    type: string
    creator: string
    created: string
    signatureValue: string
}

export interface AnnounceActivity extends Activity {
    published: string
    to: Array<string>
    cc: Array<string>
    object: string
}
