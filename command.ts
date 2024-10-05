import { Command } from "@cliffy/command";

export interface IPioneerCommand extends Command {
  command: string;
  summary: string;
  description: string;
}

/**
 * @title Pioneer Command
 * @description The base command for Pioneer.
 */
export class Pioneer extends Command implements IPioneerCommand {
  static run(signature: string, callback: (actionable: Command) => void) {
    const instance = new Pioneer(signature);
    instance.name(signature);

    instance.setAction(callback.bind(instance));

    return instance;
  }

  private actionHandler: (handler: Command) => void;

  constructor() {
    super();
  }

  setAction(callback: (handler: Command) => void) {
    this.actionHandler = () => callback(this);
  }

  builder() {
    this.actionHandler();

    return this;
  }

  name(name: string) {
    super.name(name);

    return this;
  }

  about(description: string) {
    super.description(description);

    return this;
  }

  usage(usage: string) {
    super.usage(usage);

    return this;
  }
}


const cmd = Pioneer.run('pioneer:install', function () {
  this.getOption('name')
  this.getOption('version')
  this.getOption('branch')
  this.getOption('path')
  this.getOption('force')
  this.getOption('debug')
  this.getOption('verbose')
  this.getOption('silent')
  this.getOption('dry-run')
  this.getOption('help')

  console.log(this.getOption('name'))
}).name('pioneer:install').about(
  'Install Pioneer'
).usage(
  'pioneer:install'
).builder()


console.log({ cmd: await cmd.parse(process.argv) })