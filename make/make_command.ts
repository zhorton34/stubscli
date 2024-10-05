import { Command } from "@cliffy/command";
import { join } from "jsr:@std/path";
import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import { Confirm } from "https://deno.land/x/cliffy@v0.25.7/prompt/mod.ts";

export interface GenerateCommand {
  type: string;
  name: string;
  path: string[] | string;
  info: string;
  stub: string;
}

export class BaseGenerateCommand extends Command {
  private stub: string;
  private path: string[] | string;
  private type: string;

  static make(settings: GenerateCommand) {
    return new BaseGenerateCommand(settings);
  }

  constructor(settings: GenerateCommand) {
    super();
    this.setStub(settings.stub);
    this.setPath(settings.path);
    this.setType(settings.type);
    this
      .name(settings.name)
      .description(settings.info)
      .arguments("<name:string>")
      .action(async (_, name: string) => {
        await this.handle(name);
      });
  }

  protected setStub(stub: string) {
    this.stub = stub;
  }

  protected setPath(path: string[] | string) {
    this.path = path;
  }

  protected setType(type: string) {
    this.type = type;
  }

  protected async getStub(): Promise<string> {
    try {
      const response = await fetch(this.stub);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      throw new Error(`Failed to fetch stub: ${error.message}`);
    }
  }

  protected getFilePath(name: string): string {
    const pathParts = Array.isArray(this.path) ? this.path : this.path.split('/');
    return join(...pathParts, `${name}.ts`);
  }

  protected async handle(name: string): Promise<void> {
    const filePath = this.getFilePath(name);
    console.log(`Attempting to generate ${this.type} named ${name} at ${filePath}`);
    try {
      // Check if file already exists
      try {
        await Deno.stat(filePath);
        // File exists, prompt for confirmation
        const confirm = await Confirm.prompt(`File ${filePath} already exists. Do you want to overwrite it?`);
        if (!confirm) {
          console.log("Operation cancelled.");
          return;
        }
      } catch (error) {
        // File doesn't exist, continue with creation
        if (!(error instanceof Deno.errors.NotFound)) {
          throw error;
        }
      }

      const stub = await this.getStub();
      if (!stub) {
        throw new Error(`Stub file not found or empty: ${this.stub}`);
      }

      // Replace placeholders in stub with actual values
      const content = stub.replace(/{{name}}/g, name);

      // Ensure the directory exists
      await ensureDir(filePath.substring(0, filePath.lastIndexOf('/')));

      // Write the file
      await Deno.writeTextFile(filePath, content);

      console.log(`Successfully generated ${this.type} named ${name} at ${filePath}`);
    } catch (error) {
      console.error(`Failed to generate ${this.type}: ${error.message}`);
      if (error.message.includes('fetch')) {
        console.error(`Make sure the stub file exists at: ${this.stub}`);
      }
    }
  }
}



