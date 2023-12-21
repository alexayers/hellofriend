import console from "console";
import {PersonActor} from "../activityPub/actors/personActor";
import {tagRepository} from "../repository";
import {v4 as uuidv4} from 'uuid';
import {Tag} from "../model/tag";
import {TagType} from "../activityPub/objects/activityTag";
import {ActivityNote} from "../activityPub/activity/activities";


export class TagService {


    async saveNoteTags(activityNote: ActivityNote): Promise<Map<string, string>> {
        let tagMap: Map<string, string> = new Map();

        for (let i: number = 0; i < activityNote.tag.length; i++) {

            if (!activityNote.tag[i].name) {
                continue;
            }

            let name: string = activityNote.tag[i].name.toLowerCase().replace("#", "").replace("@", "");

            if (activityNote.tag[i].type == TagType.HASHTAG) {

                let tag: Tag = await tagRepository.getByPkey(name);

                if (!tag) {
                    console.info(`New tag found ${name} on Note.`)
                    try {
                        let tag: Tag = await tagRepository.persist({
                            pkey: name,
                            skey: `Tag#${name}`
                        });

                        tagMap.set(name, tag.pkey);
                    } catch (e) {
                        console.error(e);
                    }
                } else {
                    tagMap.set(name, tag.pkey);
                }
            }

        }

        return tagMap;
    }

    async saveAccountTags(person: PersonActor): Promise<Map<string, string>> {
        let tagMap: Map<string, string> = new Map();

        if (!person.tag) {
            return tagMap;
        }

        for (let i: number = 0; i < person.tag.length; i++) {
            let name: string = person.tag[i].name.toLowerCase().replace("#", "");

            let tag: Tag = await tagRepository.getByPkey(name);

            if (!tag) {
                console.info(`New tag found ${name} on Account.`)
                try {
                    let tag: Tag = await tagRepository.persist({
                        pkey: name,
                        skey: `Tag#${name}`
                    });

                    tagMap.set(name, tag.pkey);
                } catch (e) {
                    console.error(e);
                }
            } else {
                tagMap.set(name, tag.pkey);
            }
        }

        return tagMap;
    }



}
