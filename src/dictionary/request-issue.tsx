import { Action, ActionPanel, Icon, Form } from "@raycast/api";
import {RequestDictIssue} from "./constants";

function RequestIssueForm(props: { dictName: string }) {
    function handleSubmit(values: RequestDictIssue) {
        console.log(values.dictName);
    }

    return (
        <Form
            actions={
                <ActionPanel>
                    <Action.SubmitForm title="Request question" onSubmit={handleSubmit} />
                </ActionPanel>
            }
        >
            <Form.TextField id="dictName" title="Dictionary Name" defaultValue={props.dictName}/>
            <Form.TextField id="description" title="Question Description" />
            <Form.TextField id="yourName" title="Your Name" />
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
