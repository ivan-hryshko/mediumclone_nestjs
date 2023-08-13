import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { ArticleEntity } from "./article.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
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

  async update(slug: string, currentUser: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug)

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND)
    }

    if (article.author.id !== currentUser.id) {
      throw new HttpException('You are not author', HttpStatus.FORBIDDEN)
    }

    if (article.title !== createArticleDto.title) {
      article.slug = this.getSlug(createArticleDto.title)
    }
    Object.assign(article, createArticleDto)

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

  async findBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({
      slug,
    })
  }

  async deleteArticle(slug: string, currentUserId: number): Promise<DeleteResult> {
    const article = await this.findBySlug(slug)

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND)
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not author', HttpStatus.FORBIDDEN)
    }

    return this.articleRepository.delete({
      slug,
    })
  }
}