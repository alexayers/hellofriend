import fetch from "node-fetch";
import configuration from "../../../configuration"
import {v4 as uuidv4} from 'uuid';

(async() => {
    console.log("Creating system user...");

    const body = {
        "email": `system@${configuration.domain}`,
        "username": `$hello.system$`,
        "displayName": "Hello Friend",
        "password": `${Buffer.from(uuidv4()).toString("base64")}!`
    }

    fetch(`https://api.${configuration.domain}/public/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

})();
