import { McpServer } from "@mcp/core";

import getComponentDocs from "./get-component-docs.js";
import listComponentExamples from "./list-component-examples.js";
import getComponentChangelog from "./get-component-changelog.js";
import listComponents from "./list-components.js";

export default function registryTools(server: McpServer) {
  [getComponentDocs, listComponentExamples, getComponentChangelog, listComponents].forEach((registryFn) => {
    registryFn(server)
  })
}
