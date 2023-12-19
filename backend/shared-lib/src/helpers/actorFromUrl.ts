

export function actorFromUrl(url: string) : { username: string, domain: string } {

    if (!url) {
        throw new Error(`url has no value`);
    }

    let urlTokens: string [] = url.split("/");
    const theUrl : URL = new URL(url);
    return {
        domain:  theUrl.hostname,
        username: urlTokens[urlTokens.length - 1].replace("@","")
    };
}
