import {JWT} from "google-auth-library";
import {getPreferenceValues} from "@raycast/api";
import {BookmarkPreference} from "./types";

const {BookmarkServiceAccountKey} = getPreferenceValues<BookmarkPreference>()

const keys = JSON.parse(BookmarkServiceAccountKey);

console.log(keys)
console.log(keys.private_key)
const jwtclient = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

export {
    jwtclient
}
