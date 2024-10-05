import { Command } from "@cliffy/command";
import { dotenv } from "jsr:@std/dotenv";

import { GenerateCommand, BaseGenerateCommand } from "./make/make_command.ts";

const { name, version, description, generators } = JSON.parse(Deno.readTextFileSync("./deno.json")) as {
  name: string;
  version: string;
  description: string;
  generators: GenerateCommand[];
};

const pioneer = new Command()
  .name(name)
  .version(version)
  .description(description);

generators.forEach(generator => {
  const command = BaseGenerateCommand.make(generator);
  pioneer.command(command.getName(), command);
});

if (import.meta.main) {
  await pioneer.parse(Deno.args);
}

