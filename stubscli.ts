import { Command } from "@cliffy/command";
import { makeStub } from "./make/make_stub.ts";
import { join } from "jsr:@std/path";

async function readGeneratorsConfig() {
  try {
    const cwd = Deno.cwd();
    const configPath = join(cwd, ".stubscli.json");
    const content = await Deno.readTextFile(configPath);
    return JSON.parse(content).generators;
  } catch (error) {
    console.error("Error reading .stubscli.json:", error);
    return [];
  }
}

const stubscli = new Command()
  .name("stubscli")
  .version("0.0.1")
  .description("@findhow/stubscli intends to enhance the dev experience");

// Add a help command
stubscli.command("help", "Show available commands")
  .action(async () => {
    console.log("Available commands:");
    const generators = await readGeneratorsConfig();
    generators.forEach((gen: any) => {
      console.log(`  ${gen.name.padEnd(20)} ${gen.info}`);
    });
  });

// Add generator commands
const generators = await readGeneratorsConfig();
generators.forEach((generator: any) => {
  stubscli.command(generator.name, generator.info)
    .arguments("<name:string> [output:string]")
    .action(async (_, name, output) => {
      await makeStub([generator.type, name, output || "."]);
    });
});

// Parse command line arguments
await stubscli.parse(Deno.args);
