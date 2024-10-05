

import { GeneratorCommand } from "./command.ts";
import { join } from "jsr:@std/path";

export class MakeController extends GeneratorCommand {
  protected type = "Controller";

  constructor() {
    super();
    this.description("Generate a new controller");
    this.action(async () => {
      await this.handle(this.getRawArgs()[0])
    });
  }

  protected async getStub(): Promise<string> {
    const response = await fetch(
      "https://raw.githubusercontent.com/zhorton34/stubs/main/controller.stub.ts",
    );
    return await response.text();
  }

  protected getFilePath(name: string): string {
    return join("app", "Http", "Controllers", `${name}.ts`);
  }
}

export const command = new MakeController()
  .name("make:controller")
  .description("Generate a new controller")
  .action(function () {
    this.handle(this.getArgs()[0])

  });

