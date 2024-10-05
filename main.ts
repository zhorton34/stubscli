import { Command } from "@cliffy/command";

import { 
  type GenerateCommand, 
  BaseGenerateCommand 
} from "./make/make_command.ts";

import { makeStub } from "./make/make_stub.ts";

const { name, version, description, generators } = JSON.parse(Deno.readTextFileSync("./deno.json")) as {
  name: string;
  version: string;
  description: string;
  generators: GenerateCommand[];
};

const stubscli = new Command()
  .name(name)
  .version(version)
  .description(description);

generators.forEach(generator => {
  const cmd = BaseGenerateCommand.make(generator)
  stubscli.command(cmd.getName(), cmd);
});

const command = Deno.args[0];
const args = Deno.args.slice(1);

switch (command) {
  case "make:stub":
    await makeStub(args);
    break;
  case "make:command":
    await stubscli.parse(args);
    break;
  case "make:controller":
    await stubscli.parse(args);
    break;
  default:
    console.log("Unknown command");
    Deno.exit(1);
}

