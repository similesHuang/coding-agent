export interface ToolMessage {
    role: "tool";
    name: string;
    content: string;
    tool_call_id: string;
}
