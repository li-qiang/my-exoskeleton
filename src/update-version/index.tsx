import semver from 'semver'
import moment from 'moment';
import { useState } from 'react';
import { Action, ActionPanel, Color, Detail, environment, Icon, showToast, Toast } from "@raycast/api";
import { useExec } from '@raycast/utils';
import { UpdateVersionClient } from './client'
import { DefaultVersion } from "./constant";

const ExtensionsDirectory = environment.assetsPath + '/../../';

export default function UpdateVersion() {
  const { data: latestRelease } = UpdateVersionClient.fetchLatestRelease()
  const { version: localVersion } = UpdateVersionClient.fetchLocalVersion()
  const remoteVersion = latestRelease?.tag_name || DefaultVersion
  const shouldUpdate = latestRelease ? semver.gt(remoteVersion, localVersion) : false;

  const [output, setOutput] = useState<{
      stdout: string;
      stderr: string;
      error?: Error | undefined;
      exitCode: number | null;
      signal: NodeJS.Signals | null;
      timedOut: boolean;
      command: string;
      options?: any
  }>()

  const { revalidate } = useExec('bash', ['my-exoskeleton/assets/shell/updateVersion.sh', remoteVersion], {
    shell: true,
    cwd: ExtensionsDirectory,
    parseOutput: (output) => {
      setOutput(output)
    },
    execute: false,
    onData: () => {
      showToast({ style: Toast.Style.Success, title: '版本更新成功！' })
    },
    onError: () => {
      showToast({ style: Toast.Style.Failure, title: '版本更新失败，请查看日志。' })
    },
    onWillExecute: () => {
      showToast({ style: Toast.Style.Animated, title: '正在更新...' })
    }
  })

  function renderMarkdown(): string | null | undefined {
    return output ? output.stdout : null
  }

  function renderVersionUpdateTips() {
    const item = shouldUpdate ? {
      value: `发现新版本，请更新至 ${remoteVersion}`,
      color: Color.Yellow,
      icon: {
        source: Icon.Warning, tintColor: Color.Yellow
      }
    } : {
      value: '已是目前最新版本!',
      color: Color.Green,
      icon: {
        source: Icon.CheckCircle, tintColor: Color.Green
      }
    }

    return <Detail.Metadata.TagList title="更新提示:">
      <Detail.Metadata.TagList.Item text={item.value} icon={item.icon} color={item.color} />
    </Detail.Metadata.TagList>
  }

  return <Detail
    actions={
      <ActionPanel>
        {shouldUpdate && <Action title="一键自动更新" shortcut={{ modifiers: ['cmd'], key: 'enter' }} onAction={revalidate}></Action>}
      </ActionPanel>
    }
    markdown={renderMarkdown()}
    metadata={
    <Detail.Metadata>
      {renderVersionUpdateTips()}
      {
        latestRelease && (
          <>
            <Detail.Metadata.Separator />
            <Detail.Metadata.Label title='' text={{ value: shouldUpdate ? '最新版本信息' : '当前版本信息', color: Color.PrimaryText }} />
            <Detail.Metadata.Label title='版本号:' text={{ value: remoteVersion, color: Color.SecondaryText }} />
            <Detail.Metadata.Label title='发布时间:' text={{ value: moment(latestRelease?.published_at).format('YYYY-MM-DD HH:mm:ss'), color: Color.SecondaryText }} />
            <Detail.Metadata.Link title="链接:" target={latestRelease.html_url} text={latestRelease.html_url} />
          </>
        )
      }
    </Detail.Metadata>
  } />
}
