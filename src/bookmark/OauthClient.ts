import {OAuth2Client} from "google-auth-library";
import {getPreferenceValues} from "@raycast/api";
import {BookmarkPreference} from "./types";
import {Credentials} from "google-auth-library/build/src/auth/credentials";


const {BookmarkOauthToken, BookmarkOauthClientKey} = getPreferenceValues<BookmarkPreference>()


const getOauth = () => {
    try {
        const clientInfo = JSON.parse(BookmarkOauthClientKey)
        const keys: Credentials = JSON.parse(BookmarkOauthToken);
        const client = new OAuth2Client(clientInfo);
        client.setCredentials(keys)

        return client

    } catch (e) {
        console.log(e)
        return new OAuth2Client()
    }
}

const OauthClient = getOauth()

export {
    OauthClient
}
