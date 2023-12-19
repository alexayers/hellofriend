

export enum ActivityType {
    Follow = "Follow",
    Accept = "Accept"
}

export interface Activity {
    "@context": string | Array<any>
    id: string
    type:ActivityType
}


export interface FollowActivity extends Activity {
    actor: string
    object: string
}

export interface AcceptActivity extends Activity {
    actor: string
    object: {
        "@context": string
        id: string
        type: ActivityType
        actor: string
        object: string
    }
}
