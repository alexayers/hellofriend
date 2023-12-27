import console from "console";
import {PersonActor} from "../activityPub/actors/personActor";
import {tagRepository} from "../repository";
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

            let name: string = activityNote.tag[i].name.toLowerCase().replace("#", "").replace("@", "").replaceAll(":","");

            if (activityNote.tag[i].type == TagType.HASHTAG) {

                let tag: Tag = await tagRepository.getByPkey(name);

                if (!tag) {
                    console.info(`New tag found ${name} on Note.`)
                    try {
                        let tag: Tag = await tagRepository.persist({
                            objectName: "StatusTag",
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

    async saveAccountTags(person: PersonActor) {
        let tagMap = new Map();

        if (!person.tag) {
            return tagMap;
        }

        // Prepare all tag names and create promises for fetching tags
        const tagFetchPromises = person.tag.map(tagItem => {
            const name : string = tagItem.name.toLowerCase().replace("#", "").replaceAll(":", "");
            return tagRepository.getByPkey(name)
                .then(tag => ({ name, tag })) // Attach name for identification in the next step
                .catch(e => {
                    console.error(e);
                    return { name, tag: null };
                });
        });

        // Fetch all tags concurrently
        const fetchedTags = await Promise.all(tagFetchPromises);

        // Iterate over the results
        for (const { name, tag } of fetchedTags) {
            if (!tag) {
                console.info(`New tag found ${name} on Account.`);
                try {
                    const newTag = await tagRepository.persist({
                        objectName: "AccountTag",
                        pkey: name,
                        skey: `Tag#${name}`
                    });

                    tagMap.set(name, newTag.pkey);
                } catch (e) {
                    console.error(e);
                }
            } else {
                tagMap.set(name, tag.pkey);
            }
        }

        return tagMap;
    }


    async findMatch(tagSearch: string) {
        return await tagRepository.findMatch(tagSearch);
    }
}
