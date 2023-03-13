import { useFetch } from "@raycast/utils";
import { environment, getPreferenceValues } from "@raycast/api"
import { DefaultVersion } from "../../constants/update-version";

const REPOSITORY_API = 'https://api.github.com/repos/li-qiang/my-exoskeleton';
const { githubToken } = getPreferenceValues()

export interface Author {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface Uploader {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface Asset {
  url: string;
  id: number;
  node_id: string;
  name: string;
  label: string;
  uploader: Uploader;
  content_type: string;
  state: string;
  size: number;
  download_count: number;
  created_at: Date;
  updated_at: Date;
  browser_download_url: string;
}

interface LatestReleaseResponse {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: Author;
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: Date;
  published_at: Date;
  assets: Asset[];
  tarball_url: string;
  zipball_url: string;
  body: string;
}

const fetchLatestRelease = () => useFetch<LatestReleaseResponse>(`${REPOSITORY_API}/releases/latest`, {
  headers: {
    'Authorization': `token ${githubToken}`
  }
});

const fetchLocalVersion = (): { version: string } => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(`${environment.assetsPath}/version.json`)
  } catch (error)  {
    return { version: DefaultVersion }
  }
}

export const UpdateVersionClient = {
  fetchLatestRelease,
  fetchLocalVersion
};