import { Context } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import { TestService } from "../services/TestService.ts";

export class TestController {
  private service: TestService;

  constructor() {
    this.service = new TestService();
  }

  public async getAll(context: Context) {
    const data = await this.service.getAll();
    context.response.body = data;
  }

  public async getById(context: Context) {
    const id = context.params.id;
    const data = await this.service.getById(id);
    context.response.body = data;
  }

  public async create(context: Context) {
    const body = await context.request.body().value;
    const data = await this.service.create(body);
    context.response.status = 201;
    context.response.body = data;
  }

  public async update(context: Context) {
    const id = context.params.id;
    const body = await context.request.body().value;
    const data = await this.service.update(id, body);
    context.response.body = data;
  }

  public async delete(context: Context) {
    const id = context.params.id;
    await this.service.delete(id);
    context.response.status = 204;
  }
}
