import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"
import cors from '@middy/http-cors';
import * as process from "process";

export const middyfy = (handler) => {
    return middy(handler).use(middyJsonBodyParser())
        .use(cors({
            origins: [
                `https://www.${process.env.DOMAIN}`,
                'http://localhost:4200'
            ]
        }));
}


