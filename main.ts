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
  generators: Array<{
    type: string;
    name: string;
    path: string[];
    info: string;
    stub: string;
    isFolder?: boolean;
  }>;
};

const stubscli = new Command()
  .name(name)
  .version(version)
  .description(description);

// Add a help command
stubscli.command("help", "Show available commands")
  .action(() => {
    console.log("Available commands:");
    generators.forEach(gen => {
      console.log(`  ${gen.name.padEnd(20)} ${gen.info}`);
    });
  });

// Add generator commands
generators.forEach(generator => {
  stubscli.command(generator.name, generator.info)
    .arguments("<name:string> [output:string]")
    .action(async (_, name, output) => {
      await makeStub([generator.type, name, output || '.']);
    });
});

// Parse command line arguments
if (import.meta.main) {
  await stubscli.parse(Deno.args);
}

