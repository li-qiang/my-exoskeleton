import {
    Action,
    ActionPanel,
    Icon,
    Form,
    Alert,
    confirmAlert,
    showToast,
    Toast,
    getPreferenceValues
} from "@raycast/api";
import {
    CONFIG_COLLECTION_NAME,
    CreateTrelloCard, DictionaryPreference,
    RequestDictIssue,
    SCHEMA_NAME, TrelloConfig,
    TrelloListCard
} from "../../constants/dictionary";
import {useEffect, useState} from "react";
import {TrelloApiClient} from "./client";
import {buildExpression, getCollection, Operator} from "../../utils/mysql";

function RequestIssueForm(props: { dictName: string }) {
    const [dictionaryName, setDictionaryName] = useState(() => props.dictName);
    const [dictionaryNameContext, setDictionaryNameContext] = useState<string | ''>();
    const [yourName, setYourName] = useState<string | ''>();
    const [trelloConfig, setTrelloConfig] = useState<TrelloConfig | any>();

    const onChangeDictionaryName = (value: string) => {
        setDictionaryName(value);
    }

    const onChangeDictionaryNameContext = (value: string) => {
        setDictionaryNameContext(value);
    }

    const onChangeYourName = (value: string) => {
        setYourName(value);
    }

    const { dictionaryUrl } = getPreferenceValues<DictionaryPreference>();


    useEffect(() => {
        const queryTrelloConfigData = async () => {
            const collection = await getCollection(dictionaryUrl, SCHEMA_NAME, CONFIG_COLLECTION_NAME);
            const operation = Operator.and(
                Operator.eq('configName', ':configName'),
            );

            const ex = buildExpression(operation);
            const rows = await collection.find(ex)
                .bind('configName', 'trello')
                .execute();
            const result = rows.fetchOne() as TrelloConfig;
            setTrelloConfig(result)
        };
        queryTrelloConfigData();
    }, [])

    const submitIssueToTrello = (values: RequestDictIssue) => {
        TrelloApiClient.getBoardListCards(
            trelloConfig.trelloBaseUrl,
            trelloConfig.apiKey,
            trelloConfig.apiToken,
            trelloConfig.boardId)
            .then((listCards: Array<TrelloListCard>) => {
                const defaultListCard =
                    listCards.find(listCard => listCard.name == trelloConfig.defaultListCardName) as TrelloListCard;
                const createTrelloCard: CreateTrelloCard = {
                    name: `???????????????????????????${values.dictName}`,
                    desc: `??????: ${values.dictName} \n?????????: ${values.context} \n?????????: ${values.yourName} `,
                    idList: defaultListCard.id,
                }
                TrelloApiClient.createTrelloCard(
                    trelloConfig.trelloBaseUrl,
                    trelloConfig.apiKey,
                    trelloConfig.apiToken,
                    createTrelloCard)
                    .then(() => {
                        showToast({
                            title: '??????????????????!',
                            style: Toast.Style.Success
                        });
                    })
                    .catch(() => {
                        showToast({
                            title: '??????????????????!',
                            style: Toast.Style.Failure
                        });
                    })
            })
            .catch(() => {
                showToast({
                    title: '??????????????????!',
                    style: Toast.Style.Failure
                });
            });
    }

    async function handleSubmit(values: RequestDictIssue) {
        if (dictionaryName && dictionaryNameContext && yourName) {
            const options: Alert.Options = {
                title: "????????????",
                message: `???????????????????????????????????? ${values.dictName}`,
                primaryAction: {
                    title: "OK",
                    onAction: () => {
                        submitIssueToTrello(values);
                    },
                },
            };
            await confirmAlert(options);
        } else {
            await showToast({
                title: '?????????????????????????????????!',
                style: Toast.Style.Failure
            })
        }
    }

    return (
        <Form
            actions={
                <ActionPanel>
                    <Action.SubmitForm title="????????????" onSubmit={handleSubmit} />
                </ActionPanel>
            }
        >
            <Form.TextField
                id="dictName"
                title="??????"
                placeholder='????????????????????????????????????'
                onChange={(value) => onChangeDictionaryName(value)}
                value={dictionaryName}
            />
            <Form.TextField
                id="context"
                title="???????????????"
                placeholder='????????????????????????'
                onChange={(value) => onChangeDictionaryNameContext(value)}
                value={dictionaryNameContext}
            />
            <Form.TextField
                id="yourName"
                title="????????????"
                placeholder='?????????????????????'
                onChange={(value) => onChangeYourName(value)}
                value={yourName}
            />
        </Form>
    );
}

export default function RequestIssue(props: { dictName: string }) {
    return (
        <Action.Push
            icon={Icon.QuestionMark}
            title="??????????????????"
            shortcut={{ modifiers: ["cmd"], key: "n" }}
            target={<RequestIssueForm dictName={props.dictName} />}
        />
    );
}
