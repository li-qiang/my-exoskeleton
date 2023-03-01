import fetch from "node-fetch";
import {CreateTrelloCard} from "./constants";

const trelloAPIBaseUrl = 'https://api.trello.com/1';
const apiKey = '78c8532ccf8ea1c9dd67dfb839de0327';
const apiToken = 'ed1073f504032ba6be68a45d747f91dc94fa5680f65cdd1d634f4d5ad864cb7e';
const boardId = 'giZXWam9';
export const defaultCreateCardListName = 'TODO';


const requestP = (url: string, options= {} ): Promise<any> => {
    console.log(Object.assign({}, options));
    return new Promise((res, rej) => {
        fetch(url, Object.assign({}, options))
            .then((r) => {
                if (r.ok) {
                    res(r.json())
                } else {
                    rej({
                        msg: `系统错误:${r.status}`,
                        detail: r
                    })
                }
            })
            .catch((error) => {
                rej(error);
            })
        })
};

const buildTrelloApiUrl = (url: string) => {
    return `${trelloAPIBaseUrl}${url}key=${apiKey}&token=${apiToken}`;
}

const getBoardListCards = () => {
    const url = `/boards/${boardId}/lists?`;
    return requestP(buildTrelloApiUrl(url));
}

const createTrelloCard = (createTrelloCard: CreateTrelloCard) => {
    const url = `/cards?idList=${createTrelloCard.idList}&`;
    return requestP(buildTrelloApiUrl(url), {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createTrelloCard)
    });
}

export const TrelloApiClient = {
    getBoardListCards,
    createTrelloCard
}
