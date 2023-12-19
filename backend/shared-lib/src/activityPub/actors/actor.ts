export enum ActorType {
    Person = "Person"
}

export interface Actor {
    id: string
    type: ActorType
}
