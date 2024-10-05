# @findhow/stubscli

> See [@findhow/stubs](https://github.com/zhorton34/stubs)

```ts
deno run --allow-read --allow-write --allow-net https://github.com/zhorton34/stubscli/stubscli.ts --help

  Usage:   stubscli
  Version: 0.0.1   

  Description:

    @findhow/stubscli intends to enhance the dev experience

  Options:

    -h, --help     - Show this help.                            
    -V, --version  - Show the version number for this program.  

  Commands:

    help                              - Show available commands       
    make:scraper     <name> [output]  - Generate a new scraper        
    make:config      <name> [output]  - Generate a new config file    
    make:logger      <name> [output]  - Generate a new logger file    
    make:schema      <name> [output]  - Generate a new schema file    
    make:interface   <name> [output]  - Generate a new interface file 
    make:enum        <name> [output]  - Generate a new enum file      
    make:command     <name> [output]  - Generate a new command file   
    make:controller  <name> [output]  - Generate a new controller file
    make:test        <name> [output]  - Generate a new test file
```

```ts
deno run --allow-read --allow-write --allow-net https://github.com/zhorton34/stubscli/stubscli.ts make:scraper Example
```

```ts
deno run --allow-read --allow-write --allow-net https://github.com/zhorton34/stubscli/stubscli.ts make:logger LoggerService
```

```ts
deno run --allow-read --allow-write --allow-net https://github.com/zhorton34/stubscli/stubscli.ts make:test ExampleTest ./example_test/
```

...etc

## Download Stub map and create your own repo with stubs

```ts
deno run --allow-read --allow-write --allow-net https://github.com/zhorton34/stubscli/stubscli.ts download:stubmap && cat ./.stubscli.json
```

### That will cat out the following from `./.stubscli.json`

> _Updating this .stubscli.json file with your own github repo will allow you to
> generate your own personal stubs_

<small>By default it uses some stubs I created at
[Stubs](https://github.com/zhorton34/stubs)</small>

```json
{
  "generators": [
    {
      "type": "scraper",
      "name": "make:scraper",
      "path": ["scrapers"],
      "info": "Generate a new scraper",
      "stub": "https://api.github.com/repos/zhorton34/stubs/contents/scrapers/minimal_crawlee.stub",
      "isFolder": true
    },
    {
      "type": "config",
      "name": "make:config",
      "path": ["config"],
      "info": "Generate a new config file",
      "stub": "https://raw.githubusercontent.com/zhorton34/stubs/main/config.stub.ts"
    },
    {
      "type": "logger",
      "name": "make:logger",
      "path": ["logger"],
      "info": "Generate a new logger file",
      "stub": "https://raw.githubusercontent.com/zhorton34/stubs/main/logger.stub.ts"
    },
    {
      "type": "schema",
      "name": "make:schema",
      "path": ["schemas"],
      "info": "Generate a new schema file",
      "stub": "https://raw.githubusercontent.com/zhorton34/stubs/main/schema.stub.ts"
    },
    {
      "type": "interface",
      "name": "make:interface",
      "path": ["interfaces"],
      "info": "Generate a new interface file",
      "stub": "https://raw.githubusercontent.com/zhorton34/stubs/main/interface.stub.ts"
    },
    {
      "type": "enum",
      "name": "make:enum",
      "path": ["enums"],
      "info": "Generate a new enum file",
      "stub": "https://raw.githubusercontent.com/zhorton34/stubs/main/enum.stub.ts"
    },
    {
      "type": "command",
      "name": "make:command",
      "path": ["commands"],
      "info": "Generate a new command file",
      "stub": "https://raw.githubusercontent.com/zhorton34/stubs/main/command.stub.ts"
    },
    {
      "type": "controller",
      "name": "make:controller",
      "path": ["controllers"],
      "info": "Generate a new controller file",
      "stub": "https://raw.githubusercontent.com/zhorton34/stubs/main/controller.stub.ts"
    },
    {
      "type": "test",
      "name": "make:test",
      "path": ["tests"],
      "info": "Generate a new test file",
      "stub": "https://raw.githubusercontent.com/zhorton34/stubs/main/test.stub.ts"
    }
  ]
}
```
