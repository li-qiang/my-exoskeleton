import {Action, ActionPanel, Icon, Form, Alert, confirmAlert, showToast, Toast} from "@raycast/api";
import {RequestDictIssue} from "./constants";
import {useState} from "react";

function RequestIssueForm(props: { dictName: string }) {
    const [dictionaryName, setDictionaryName] = useState(() => props.dictName);
    const [dictionaryNameContext, setDictionaryNameContext] = useState<string | ''>();
    const [yourName, setYourName] = useState<string | ''>();

    function onChangeDictionaryName(value: string) {
        setDictionaryName(value);
    }

    function onChangeDictionaryNameContext(value: string) {
        setDictionaryNameContext(value);
    }

    function onChangeYourName(value: string) {
        setYourName(value);
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
                        // while you can register a handler for an action, it's more elegant
                        // to use the `if (await confirmAlert(...)) { ... }` pattern
                        console.log("The alert action has been triggered");
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
                defaultValue={props.dictName}/>
            <Form.TextField
                id="description"
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
