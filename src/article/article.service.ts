import { Injectable } from "@nestjs/common";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { ArticleEntity } from "./article.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "@app/user/user.entity";
import { ArticleResponseInterface } from "./types/articleResponse.interface";
import slugify from "slugify";

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly  articleRepository: Repository<ArticleEntity>
  ) {}
  async create(currentUser: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    const article = new ArticleEntity()
    Object.assign(article, createArticleDto)
    if (article.tagList) {
      article.tagList = []
    }
    article.slug = this.getSlug(createArticleDto.title)
    article.author = currentUser

    return await this.articleRepository.save(article)
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return {
      article
    }
  }

  generateRandomId():string {
    return ((Math.random() * Math.pow(36, 6)) | 0).toString()
  }

  private getSlug(title: string): string {
    return (slugify(title, { lower: true }) + '-' + this.generateRandomId())
  }
}