import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
import { makeStub } from "./make/make_stub.ts";
import { join } from "jsr:@std/path";
import { exists } from "jsr:@std/fs/exists";

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

async function downloadStubscliSchema() {
  const url = "https://raw.githubusercontent.com/zhorton34/stubscli/main/.stubscli.json";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download schema: ${response.statusText}`);
  }
  return await response.text();
}

const stubscli = new Command()
  .name("stubscli")
  .version("0.0.1")
  .description("@findhow/stubscli intends to enhance the dev experience");

// Add init command
stubscli.command("download:stubmap", "Initialize stubscli in the current directory")
  .action(async () => {
    const configPath = join(Deno.cwd(), ".stubscli.json");
    if (await exists(configPath)) {
      console.log(".stubscli.json already exists in the current directory.");
      return;
    }
    try {
      const schema = await downloadStubscliSchema();
      await Deno.writeTextFile(configPath, schema);
      console.log("Successfully initialized stubscli. .stubscli.json has been created in the current directory.");
    } catch (error) {
      console.error("Failed to initialize stubscli:", error.message);
    }
  });

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
