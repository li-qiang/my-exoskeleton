import {Action, ActionPanel, Icon, Form, Alert, confirmAlert, showToast, Toast} from "@raycast/api";
import {CreateTrelloCard, RequestDictIssue, TrelloListCard} from "./constants";
import {useState} from "react";
import {TrelloApiClient, defaultCreateCardListName} from "./client";

function RequestIssueForm(props: { dictName: string }) {
    const [dictionaryName, setDictionaryName] = useState(() => props.dictName);
    const [dictionaryNameContext, setDictionaryNameContext] = useState<string | ''>();
    const [yourName, setYourName] = useState<string | ''>();

    const onChangeDictionaryName = (value: string) => {
        setDictionaryName(value);
    }

    const onChangeDictionaryNameContext = (value: string) => {
        setDictionaryNameContext(value);
    }

    const onChangeYourName = (value: string) => {
        setYourName(value);
    }

    const submitIssueToTrello = (values: RequestDictIssue) => {
        TrelloApiClient.getBoardListCards()
            .then((listCards: Array<TrelloListCard>) => {
                const defaultListCard =
                    listCards.find(listCard => listCard.name == defaultCreateCardListName) as TrelloListCard;
                const createTrelloCard: CreateTrelloCard = {
                    name: `request dictionary name issue of ${values.dictName}`,
                    desc: `dictionary name: ${values.dictName} \ncontext: ${values.context} \nsubmitter: ${values.yourName} `,
                    idList: defaultListCard.id,
                }
                TrelloApiClient.createTrelloCard(createTrelloCard)
                    .then(() => {
                        showToast({
                            title: 'Submit Successful!',
                            style: Toast.Style.Success
                        });
                    })
                    .catch(() => {
                        showToast({
                            title: 'Submit Failure!',
                            style: Toast.Style.Failure
                        });
                    })
            })
            .catch(() => {
                showToast({
                    title: 'Submit Failure!',
                    style: Toast.Style.Failure
                });
            });
    }

    async function handleSubmit(values: RequestDictIssue) {
        if (dictionaryName && dictionaryNameContext && yourName) {
            console.log(values.dictName);
            const options: Alert.Options = {
                title: "Confirm Submit",
                message: `confirm submit your dictionary issue of ${values.dictName}`,
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
                title: 'Please input dictionary name, context and your name!',
                style: Toast.Style.Failure
            })
        }
    }

    return (
        <Form
            actions={
                <ActionPanel>
                    <Action.SubmitForm title="Submit Issue" onSubmit={handleSubmit} />
                </ActionPanel>
            }
        >
            <Form.TextField
                id="dictName"
                title="Dictionary Name"
                placeholder='Please input the dictionary Name'
                onChange={(value) => onChangeDictionaryName(value)}
                value={dictionaryName}
            />
            <Form.TextField
                id="context"
                title="Dictionary Name Issue Context"
                placeholder='Please input the issue context'
                onChange={(value) => onChangeDictionaryNameContext(value)}
                value={dictionaryNameContext}
            />
            <Form.TextField
                id="yourName"
                title="Your Name"
                placeholder='Please input your name'
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
            title="input your issue"
            shortcut={{ modifiers: ["cmd"], key: "n" }}
            target={<RequestIssueForm dictName={props.dictName} />}
        />
    );
}
