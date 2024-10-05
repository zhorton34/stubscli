import { Command } from "@cliffy/command";
import { join } from "jsr:@std/path";
import { exists } from "jsr:@std/fs";
import { dirname } from "jsr:@std/path";

export abstract class GeneratorCommand extends Command {
  protected abstract type: string;
  protected abstract getStub(): Promise<string>;
  protected abstract getFilePath(name: string): string;
  protected abstract setStub(stub: string): void;
  protected abstract setPath(path: string): void;
  protected abstract setType(type: string): void;


  protected reservedNames = [
    "abstract", "await", "boolean", "break", "byte", "case", "catch", "char", "class", "const",
    "continue", "debugger", "default", "delete", "do", "double", "else", "enum", "export", "extends",
    "false", "final", "finally", "float", "for", "function", "goto", "if", "implements", "import",
    "in", "instanceof", "int", "interface", "let", "long", "native", "new", "null", "package",
    "private", "protected", "public", "return", "short", "static", "super", "switch", "synchronized",
    "this", "throw", "throws", "transient", "true", "try", "typeof", "var", "void", "volatile",
    "while", "with", "yield"
  ];

  constructor() {
    super();
    this.name(`make:${this.type}`)
    this.description(`Generate a new ${this.type}`);
    this.arguments("<name:string>");
  }

  public async handle(name: string): Promise<void> {
    if (this.isReservedName(name)) {
      console.error(`The name "${name}" is reserved.`);
      Deno.exit(1);
    }

    const filePath = this.getFilePath(name);

    if (await exists(filePath)) {
      console.error(`${this.type} already exists at ${filePath}.`);
      Deno.exit(1);
    }

    await this.makeDirectory(dirname(filePath));

    const stubContent = await this.getStub();
    const content = this.replacePlaceholders(stubContent, { name });

    await Deno.writeTextFile(filePath, content);

    console.log(`${this.type} created at ${filePath}.`);
  }

  protected isReservedName(name: string): boolean {
    const reservedNames = [
      "abstract", "await", "boolean", "break", "byte", "case", "catch", "char", "class", "const",
      // ... add all other reserved names
    ];


    if (!name || name.length === 0) {
      console.error("Name is required");
      Deno.exit(1);
    }

    const [ControllerName] = this.getRawArgs()
    return reservedNames.includes(ControllerName.toLowerCase());
  }

  protected async makeDirectory(path: string): Promise<void> {
    await Deno.mkdir(path, { recursive: true });
  }

  protected replacePlaceholders(
    content: string,
    data: Record<string, string>,
  ): string {
    return content.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || "");
  }
}
