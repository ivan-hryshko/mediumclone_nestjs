import { Injectable } from "@nestjs/common";

@Injectable()
export class ArticleService {
  async create() {
    return 'Create article from service'
  }
}