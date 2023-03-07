import {JWT} from "google-auth-library";
import {getPreferenceValues} from "@raycast/api";
import {BookmarkPreference} from "./types";

const {BookmarkServiceAccountKey} = getPreferenceValues<BookmarkPreference>()


const getJwt = () => {
    try {
        const keys = JSON.parse(BookmarkServiceAccountKey);
        return new JWT({
            email: keys.client_email,
            key: keys.private_key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
    } catch (e) {
        return new JWT()
    }
}

const jwtclient = getJwt()

export {
    jwtclient
}
