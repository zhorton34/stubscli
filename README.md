# @findhow/stubscli

> See [@findhow/stubs](https://github.com/zhorton34/stubs)

```ts
(base)  zhorton@MacBookPro  ~/findhow/stubscli   main ±  deno run --allow-read --allow-write --allow-net ./stubscli.ts --help

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

> **@findhow/stubscli**! This command-line interface (CLI) tool is designed to
> enhance your development experience by providing a streamlined way to generate
> various code stubs for your projects.

## Features

- **Easy Stub Generation**: Quickly create boilerplate code for different types
  of components such as scrapers, configurations, loggers, schemas, interfaces,
  enums, commands, and controllers.
- **GitHub Integration**: Seamlessly download stubs directly from a GitHub
  repository.
- **Customizable**: Modify the generated stubs to fit your specific needs.

## Installation

To get started with **@findhow/stubscli**, you need to have
[Deno](https://deno.land/) installed. Once you have Deno set up, you can clone
this repository and run the CLI commands.
