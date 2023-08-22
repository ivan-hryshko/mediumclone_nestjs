import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { User } from "@app/user/decorators/user.decorator";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { UserEntity } from "@app/user/user.entity";
import { ArticleResponseInterface } from "./types/articleResponse.interface";
import { ArticleEntity } from "./article.entity";
import { DeleteResult, UpdateResult } from "typeorm";
import { ArticlesResponseInterface } from "./types/articlesResponse.interface";

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(
    @User('id') currrentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    // return await this.articleService.findAll(currrentUserId, query)
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.create(currentUser, createArticleDto)
    return this.articleService.buildArticleResponse(article)
  }

  @Get(':slug')
  @UseGuards(AuthGuard)
  async getSingleArticle(@Param('slug') slug:string):Promise<ArticleResponseInterface> {
    const article = await this.articleService.findBySlug(slug)
    return this.articleService.buildArticleResponse(article)

  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug:string
  ):Promise<DeleteResult> {
    return await this.articleService.deleteArticle(slug, currentUserId)
    // return this.articleService.buildArticleResponse(article)

  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async update(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
    @Param('slug') slug: string
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.update(slug, currentUser, createArticleDto)
    // return await this.articleService.update(slug, currentUser, createArticleDto)
    return this.articleService.buildArticleResponse(article)
  }
}