import { McpServer } from "@mcp/core";
import systemDescription from "./system-description.js";
import systemPageGenerate from './system-page-generate.js'

export default function registryPrompts(server: McpServer) {
  [systemDescription, systemPageGenerate].forEach((registryFn) => {
    registryFn(server)
  })
}


