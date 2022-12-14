import { ArticleModule } from '@api/article/article.module';
import { CreateArticleRequestDto } from '@api/article/dto/request/create-article-request.dto';
import { FindAllArticleRequestDto } from '@api/article/dto/request/find-all-article-request.dto';
import { UpdateArticleRequestDto } from '@api/article/dto/request/update-article-request.dto';
import { CreateArticleResponseDto } from '@api/article/dto/response/create-article-response.dto';
import { FindOneArticleResponseDto } from '@api/article/dto/response/find-one-article-response.dto';
import { ArticleRepository } from '@api/article/repositories/article.repository';
import { AuthModule } from '@api/auth/auth.module';
import { AuthService } from '@api/auth/auth.service';
import { CategoryModule } from '@api/category/category.module';
import { CategoryRepository } from '@api/category/repositories/category.repository';
import { CommentModule } from '@api/comment/comment.module';
import { CommentRepository } from '@api/comment/repositories/comment.repository';
import { UserRepository } from '@api/user/repositories/user.repository';
import { ANONY_USER_CHARACTER, ANONY_USER_ID, ANONY_USER_NICKNAME } from '@api/user/user.constant';
import { UserModule } from '@api/user/user.module';
import { Article } from '@app/entity/article/article.entity';
import { Comment } from '@app/entity/comment/comment.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { E2eTestBaseModule } from './e2e-test.base.module';
import * as dummy from './utils/dummy';
import { clearDB, createTestApp } from './utils/utils';
import { testDto } from './utils/validate-test';

describe('Article', () => {
  let httpServer: INestApplication;

  let userRepository: UserRepository;
  let articleRepository: ArticleRepository;
  let categoryRepository: CategoryRepository;
  let commentRepository: CommentRepository;

  let authService: AuthService;
  let JWT: string;

  let users: dummy.DummyUsers;
  let categories: dummy.DummyCategories;
  let articles: dummy.DummyArticles;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [E2eTestBaseModule, UserModule, AuthModule, ArticleModule, CategoryModule, CommentModule],
    }).compile();

    const app = createTestApp(moduleFixture);
    await app.init();

    userRepository = moduleFixture.get(UserRepository);
    articleRepository = moduleFixture.get(ArticleRepository);
    categoryRepository = moduleFixture.get(CategoryRepository);
    commentRepository = moduleFixture.get(CommentRepository);
    authService = moduleFixture.get(AuthService);

    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await getConnection().close();
    await httpServer.close();
  });

  beforeEach(async () => {
    await clearDB();
  });

  describe('/articles', () => {
    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      categories = await dummy.createDummyCategories(categoryRepository);
      articles = await dummy.createDummyArticles(articleRepository, users, categories);
      JWT = dummy.jwt(users.cadet[0], authService);
    });

    test('[??????] POST - ?????????', async () => {
      const createArticlRequesteDto: CreateArticleRequestDto = {
        title: 'test title',
        content: 'test content',
        categoryId: categories.free.id,
      };

      const response = await request(httpServer)
        .post('/articles')
        .send(createArticlRequesteDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.CREATED);

      const result = response.body as CreateArticleResponseDto;
      expect(result.title).toBe(createArticlRequesteDto.title);
      expect(result.content).toBe(createArticlRequesteDto.content);
      expect(result.categoryId).toBe(createArticlRequesteDto.categoryId);
      expect(result.writerId).toBe(users.cadet[0].id);
      expect(result.viewCount).toBe(0);
      expect(result.likeCount).toBe(0);
      expect(result.commentCount).toBe(0);
    });

    test('[??????] POST - unauthorized', async () => {
      const response = await request(httpServer).post('/articles');

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[??????] POST - ????????? ?????? ????????????', async () => {
      const createArticlRequesteDto: CreateArticleRequestDto = {
        title: 'test title',
        content: 'test content',
        categoryId: categories.free.id,
      };

      JWT = dummy.jwt(users.admin[0], authService);
      const response = await request(httpServer)
        .post('/articles')
        .send(createArticlRequesteDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.CREATED);
    });

    test('[??????] POST - ????????? ?????? ????????????', async () => {
      const createArticlRequesteDto: CreateArticleRequestDto = {
        title: 'test title',
        content: 'test content',
        categoryId: categories.free.id,
      };

      JWT = dummy.jwt(users.novice[0], authService);
      const response = await request(httpServer)
        .post('/articles')
        .send(createArticlRequesteDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    test('[??????] POST - ????????? ???????????? ?????? ????????????', async () => {
      const createArticlRequesteDto = {
        title: 'test title',
        content: 'test content',
        categoryId: 99,
      };

      const response = await request(httpServer)
        .post('/articles')
        .send(createArticlRequesteDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    testDto<CreateArticleRequestDto>([
      ['title', undefined],
      ['title', 123],
      ['title', 'a'.repeat(50), '42?????? ??????'],
      ['content', undefined],
      ['content', 123],
      ['content', 'a'.repeat(5000), '4242?????? ??????'],
      ['categoryId', undefined],
      ['categoryId', 'abc'],
      ['categoryId', -1],
    ])('[??????] POST - ????????? dto??? %s??? ??????', async (_, buildDto) => {
      const createArticlRequesteDto = buildDto({
        title: 'test title',
        content: 'test content',
        categoryId: categories.free.id,
      });

      const response = await request(httpServer)
        .post('/articles')
        .send(createArticlRequesteDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test('[??????] GET - ????????? ?????? ??????', async () => {
      const findArticleRequestDto = {
        categoryId: categories.free.id,
      };

      const response = await request(httpServer)
        .get('/articles')
        .query(findArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const responseArticles = response.body.data as Article[];
      expect(responseArticles.length).toBe(4);
      expect(responseArticles[0].id).toBe(articles.first.id);
      expect(responseArticles[0].title).toBe(articles.first.title);
      expect(responseArticles[0].content).toBe(articles.first.content);
      expect(responseArticles[0].writerId).toBe(articles.first.writerId);
      expect(responseArticles[0].writer.id).toBe(articles.first.writerId);
      expect(responseArticles[0].writer.nickname).toBe(users.cadet[0].nickname);
      expect(responseArticles[0].viewCount).toBe(articles.first.viewCount);
      expect(responseArticles[0].likeCount).toBe(articles.first.likeCount);
      expect(responseArticles[0].commentCount).toBe(articles.first.commentCount);
      expect(responseArticles[0].categoryId).toBe(findArticleRequestDto.categoryId);
      expect(responseArticles[1].id).toBe(articles.second.id);
      expect(responseArticles[1].categoryId).toBe(findArticleRequestDto.categoryId);
    });

    test('[??????] GET - GUEST ????????? ?????? ??????', async () => {
      const findArticleRequestDto = {
        categoryId: categories.free.id,
      };

      const response = await request(httpServer).get('/articles').query(findArticleRequestDto);

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    test('[??????] GET - ?????? ????????? ?????? ??????', async () => {
      const findArticleRequestDto = {
        categoryId: categories.anony.id,
      };

      const response = await request(httpServer)
        .get('/articles')
        .query(findArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const responseArticles = response.body.data as Article[];
      expect(responseArticles[0].id).toBe(articles.anony.id);
      expect(responseArticles[0].title).toBe(articles.anony.title);
      expect(responseArticles[0].content).toBe(articles.anony.content);
      expect(responseArticles[0].writerId).toBe(ANONY_USER_ID);
      expect(responseArticles[0].writer.id).toBe(ANONY_USER_ID);
      expect(responseArticles[0].writer.role).toBeUndefined();
      expect(responseArticles[0].writer.createdAt).toBeUndefined();
      expect(responseArticles[0].writer.updatedAt).toBeUndefined();
      expect(responseArticles[0].writer.nickname).toBe(ANONY_USER_NICKNAME);
      expect(responseArticles[0].writer.character).toBe(ANONY_USER_CHARACTER);
    });

    test('[??????] GET - ????????? ?????? ?????? ?????? ????????????', async () => {
      const findArticleRequestDto = {
        categoryId: categories.free.id,
      };

      JWT = dummy.jwt(users.admin[0], authService);
      const response = await request(httpServer)
        .get('/articles')
        .query(findArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.OK);
    });

    test('[??????] GET - ????????? ?????? ?????? ?????? ????????????', async () => {
      const findArticleRequestDto = {
        categoryId: categories.free.id,
      };

      JWT = dummy.jwt(users.novice[0], authService);
      const response = await request(httpServer)
        .get('/articles')
        .query(findArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    test('[??????] GET - ????????? ?????? ?????? ???????????? ?????? ????????????', async () => {
      const findArticleRequestDto = {
        categoryId: 99,
      };

      const response = await request(httpServer)
        .get('/articles')
        .query(findArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    testDto<FindAllArticleRequestDto>([
      ['categoryId', 'abc'],
      ['categoryId', -1],
    ])('[??????] GET - ????????? ?????? ?????? dto??? %s??? ??????', async (_, buildDto) => {
      const findArticleRequestDto = buildDto({
        categoryId: categories.free.id,
      });

      const response = await request(httpServer)
        .get('/articles')
        .query(findArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/articles/{id}/comments', () => {
    let comments: dummy.DummyComments;

    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      categories = await dummy.createDummyCategories(categoryRepository);
      articles = await dummy.createDummyArticles(articleRepository, users, categories);
      comments = await dummy.createDummyComments(commentRepository, users, articles);
      JWT = dummy.jwt(users.cadet[0], authService);
    });

    test('[??????] GET - ????????? ?????? ?????? ??????', async () => {
      const articleId = articles.first.id;

      const response = await request(httpServer)
        .get(`/articles/${articleId}/comments`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toBe(HttpStatus.OK);

      const responseComments = response.body.data as Comment[];
      expect(responseComments.length).toBe(2);
      expect(responseComments[0].id).toBe(comments.second.id);
      expect(responseComments[0].content).toBe(comments.second.content);
      expect(responseComments[0].writerId).toBe(comments.second.writerId);
      expect(responseComments[0].writer.id).toBe(comments.second.writerId);
      expect(responseComments[0].writer.nickname).toBe(users.cadet[1].nickname);
      expect(responseComments[0].articleId).toBe(comments.second.articleId);
      expect(responseComments[0].likeCount).toBe(comments.second.likeCount);
      expect(responseComments[1].id).toBe(comments.first.id);
    });

    // TODO: ?????? ????????? ?????? ????????????
    test.skip('[??????] GET - ?????? ????????? ?????? ?????? ??????', async () => {
      const articleId = articles.second.id;

      const response = await request(httpServer)
        .get(`/articles/${articleId}/comments`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toBe(HttpStatus.OK);

      const responseComments = response.body.data as Comment[];
      expect(responseComments.length).toBe(2);
      expect(responseComments[0].id).toBe(comments[1].id);
      expect(responseComments[0].content).toBe(comments[1].content);
      expect(responseComments[0].writerId).toBe(ANONY_USER_ID);
      expect(responseComments[0].writer.id).toBe(ANONY_USER_ID);
      expect(responseComments[0].writer.nickname).toBe(ANONY_USER_NICKNAME);
      expect(responseComments[0].writer.character).toBe(ANONY_USER_CHARACTER);
      expect(responseComments[0].articleId).toBe(comments[1].articleId);
      expect(responseComments[0].likeCount).toBe(comments[1].likeCount);
      expect(responseComments[1].id).toBe(comments[0].id);
    });

    test('[??????] GET - GUEST ?????? ?????? ??????', async () => {
      const articleId = articles.first.id;

      const response = await request(httpServer).get(`/articles/${articleId}/comments`);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    test('[??????] GET - ????????? ?????? ?????? ?????? ?????? ????????????', async () => {
      const articleId = articles.first.id;

      JWT = dummy.jwt(users.admin[0], authService);
      const response = await request(httpServer)
        .get(`/articles/${articleId}/comments`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toBe(HttpStatus.OK);
    });

    test('[??????] GET - ????????? ?????? ?????? ?????? ?????? ????????????', async () => {
      const articleId = articles.first.id;

      JWT = dummy.jwt(users.novice[0], authService);
      const response = await request(httpServer)
        .get(`/articles/${articleId}/comments`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    test('[??????] GET - ????????? ?????? ?????? ???????????? ?????? ?????????', async () => {
      const articleId = 99;

      const response = await request(httpServer)
        .get(`/articles/${articleId}/comments`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    testDto<{ articleId: number }>([
      ['articleId', undefined],
      ['articleId', 'abc'],
    ])('[??????] GET - ????????? ?????? ?????? %s??? ??????', async (_, buildDto) => {
      const articleId = buildDto({
        articleId: articles.first.id,
      }).articleId;

      const response = await request(httpServer)
        .get(`/articles/${articleId}/comments`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/articles/{id}', () => {
    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      categories = await dummy.createDummyCategories(categoryRepository);
      articles = await dummy.createDummyArticles(articleRepository, users, categories);
      JWT = dummy.jwt(users.cadet[0], authService);
    });

    test('[??????] GET - ????????? ?????? ??????', async () => {
      const articleId = articles.first.id;

      const response = await request(httpServer)
        .get(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const result = response.body as FindOneArticleResponseDto;
      expect(result.title).toBe(articles.first.title);
      expect(result.content).toBe(articles.first.content);
      expect(result.categoryId).toBe(articles.first.categoryId);
      expect(result.writerId).toBe(articles.first.writerId);
      expect(result.viewCount).toBe(0);
      expect(result.likeCount).toBe(0);
      expect(result.commentCount).toBe(0);
      expect(result.isLike).toBe(false);
      expect(result.category.id).toBe(categories.free.id);
      expect(result.category.name).toBe(categories.free.name);
      expect(result.writer.id).toBe(users.cadet[0].id);
      expect(result.writer.nickname).toBe(users.cadet[0].nickname);
    });

    test('[??????] GET - GUEST ????????? ?????? ??????', async () => {
      const articleId = articles.first.id;

      const response = await request(httpServer).get(`/articles/${articleId}`);

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    test('[??????] GET - ?????? ????????? ?????? ??????', async () => {
      const articleId = articles.anony.id;

      const response = await request(httpServer)
        .get(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const result = response.body;
      expect(result.title).toBe(articles.anony.title);
      expect(result.content).toBe(articles.anony.content);
      expect(result.categoryId).toBe(articles.anony.categoryId);
      expect(result.writerId).toBe(ANONY_USER_ID);
      expect(result.category.id).toBe(categories.anony.id);
      expect(result.writer.id).toBe(ANONY_USER_ID);
      expect(result.writer.role).toBeUndefined();
      expect(result.writer.createdAt).toBeUndefined();
      expect(result.writer.updatedAt).toBeUndefined();
      expect(result.writer.nickname).toContain(ANONY_USER_NICKNAME);
      expect(result.writer.character).toBe(ANONY_USER_CHARACTER);
    });

    test('[??????] GET - ????????? ?????? ?????? ?????? ????????????', async () => {
      const articleId = articles.first.id;

      JWT = dummy.jwt(users.admin[0], authService);
      const response = await request(httpServer)
        .get(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.OK);
    });

    test('[??????] GET - ????????? ?????? ?????? ?????? ????????????', async () => {
      const articleId = articles.first.id;

      JWT = dummy.jwt(users.novice[0], authService);
      const response = await request(httpServer)
        .get(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    test('[??????] GET - ????????? ?????? ?????? ???????????? ?????? ?????????', async () => {
      const articleId = 99;

      const response = await request(httpServer)
        .get(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    testDto<{ articleId: number }>([
      ['articleId', undefined],
      ['articleId', 'abc'],
    ])('[??????] GET - ????????? ?????? ?????? %s??? ??????', async (_, buildDto) => {
      const articleId = buildDto({
        articleId: articles.first.id,
      }).articleId;

      const response = await request(httpServer)
        .get(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    // TODO: novice ??? ????????? ??????/?????? ???????????? ??????
    test('[??????] PUT - ????????? ??????', async () => {
      const articleId = articles.first.id;
      const updateArticleRequestDto: UpdateArticleRequestDto = {
        title: 'title2',
        content: 'content2',
      };

      const response = await request(httpServer)
        .put(`/articles/${articleId}`)
        .send(updateArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const result = await articleRepository.findOne(articleId);
      expect(result.title).toBe(updateArticleRequestDto.title);
      expect(result.content).toBe(updateArticleRequestDto.content);
      expect(result.writerId).toBe(users.cadet[0].id);
    });

    test('[??????] PUT - unauthorized', async () => {
      const articleId = articles.first.id;

      const response = await request(httpServer).put(`/articles/${articleId}`);

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[??????] PUT - ????????? ?????? ?????? ????????? ????????????', async () => {
      const articleId = articles.second.id;
      const updateArticleRequestDto: UpdateArticleRequestDto = {
        title: 'title2',
        content: 'content2',
      };

      const response = await request(httpServer)
        .put(`/articles/${articleId}`)
        .send(updateArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.NOT_FOUND);

      const result = await articleRepository.findOne(articleId);
      expect(result.title).toBe(articles.second.title);
      expect(result.content).toBe(articles.second.content);
      expect(result.categoryId).toBe(articles.second.categoryId);
    });

    test('[??????] PUT - ????????? ?????? ???????????? ?????? ?????????', async () => {
      const articleId = 99;
      const updateArticleRequestDto: UpdateArticleRequestDto = {
        title: 'title2',
        content: 'content2',
        categoryId: categories.free.id,
      };

      const response = await request(httpServer)
        .put(`/articles/${articleId}`)
        .send(updateArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    testDto<{ articleId: number }>([
      ['articleId', undefined],
      ['articleId', 'abc'],
    ])('[??????] PUT - ????????? ?????? ?????????id??? %s??? ??????', async (_, buildDto) => {
      const articleId = buildDto({
        articleId: articles.first.id,
      }).articleId;
      const updateArticleRequestDto: UpdateArticleRequestDto = {
        title: 'title2',
        content: 'content2',
      };

      const response = await request(httpServer)
        .put(`/articles/${articleId}`)
        .send(updateArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    testDto<UpdateArticleRequestDto>([
      ['title', 123],
      ['title', 'a'.repeat(50), '42?????? ??????'],
      ['content', 123],
      ['content', 'a'.repeat(5000), '4242?????? ??????'],
      ['categoryId', 'abc'],
      ['categoryId', -1],
    ])('[??????] PUT - ????????? ?????? dto??? %s??? ??????', async (_, buildDto) => {
      const articleId = articles.first.id;
      const updateArticleRequestDto = buildDto({
        title: 'title2',
        content: 'content2',
      });

      const response = await request(httpServer)
        .put(`/articles/${articleId}`)
        .send(updateArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test('[??????] DELETE - ????????? ??????', async () => {
      const articleId = articles.first.id;

      const response = await request(httpServer)
        .delete(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const result = await articleRepository.findOne(articleId);
      expect(result).toBeFalsy();
    });

    test('[??????] DELETE - unauthorized', async () => {
      const articleId = articles.first.id;

      const response = await request(httpServer).delete(`/articles/${articleId}`);

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[??????] DELETE - ????????? ?????? ?????? ????????? ????????????', async () => {
      const articleId = articles.second.id;

      const response = await request(httpServer)
        .delete(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.NOT_FOUND);

      const result = await articleRepository.findOne(articleId);
      expect(result).toBeTruthy();
    });

    test('[??????] DELETE - ????????? ?????? ???????????? ?????? ?????????', async () => {
      const articleId = 99;

      const response = await request(httpServer)
        .delete(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.NOT_FOUND);

      const result = await articleRepository.findOne(articleId);
      expect(result).toBeFalsy();
    });

    testDto<{ articleId: number }>([
      ['articleId', undefined],
      ['articleId', 'abc'],
    ])('[??????] DELETE - ????????? ?????? dto??? %s??? ??????', async (_, buildDto) => {
      const articleId = buildDto({
        articleId: articles.first.id,
      }).articleId;

      const response = await request(httpServer)
        .delete(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/articles/search', () => {
    const searchWord = '42';
    const titleWithSearchWord = 'aaa42aaa';
    const titleWithoutSearchWord = 'aaaaaa';
    const contentWithSearchWord = 'bbb42bbb';
    const contentWithoutSearchWord = 'bbbbbb';
    const SearchArticleRequestDto = {
      q: searchWord,
    };
    let cadetJWT: string;
    let noviceJWT: string;

    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      categories = await dummy.createDummyCategories(categoryRepository);
      cadetJWT = dummy.jwt(users.cadet[0], authService);
      noviceJWT = dummy.jwt(users.novice[0], authService);
    });

    test('[??????] GET - ???????????? ?????? ??????', async () => {
      const response = await request(httpServer)
        .get('/articles/search')
        .query(SearchArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${cadetJWT}`);

      expect(response.status).toEqual(HttpStatus.OK);
      const responseArticles = response.body.data as Article[];
      expect(responseArticles.length).toBe(0);
    });

    test('[??????] GET - ???????????? ?????? ?????? ??????', async () => {
      await articleRepository.save(
        dummy.article(categories.free.id, users.cadet[0].id, titleWithoutSearchWord, contentWithoutSearchWord),
      );

      const response = await request(httpServer)
        .get('/articles/search')
        .query(SearchArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${cadetJWT}`);

      expect(response.status).toEqual(HttpStatus.OK);
      const responseArticles = response.body.data as Article[];
      expect(responseArticles.length).toBe(0);
    });

    test('[??????] GET - ????????? ???????????? ??????', async () => {
      await articleRepository.save(
        dummy.article(categories.free.id, users.cadet[0].id, titleWithSearchWord, contentWithoutSearchWord),
      );

      const response = await request(httpServer)
        .get('/articles/search')
        .query(SearchArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${cadetJWT}`);

      expect(response.status).toEqual(HttpStatus.OK);
      const responseArticles = response.body.data as Article[];
      expect(responseArticles.length).toBe(1);
      expect(responseArticles[0].title).toBe(titleWithSearchWord);
    });

    test('[??????] GET - ????????? ???????????? ??????', async () => {
      await articleRepository.save(
        dummy.article(categories.free.id, users.cadet[0].id, titleWithoutSearchWord, contentWithSearchWord),
      );

      const response = await request(httpServer)
        .get('/articles/search')
        .query(SearchArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${cadetJWT}`);

      expect(response.status).toEqual(HttpStatus.OK);
      const responseArticles = response.body.data as Article[];
      expect(responseArticles.length).toBe(1);
      expect(responseArticles[0].content).toBe(contentWithSearchWord);
    });

    test('[??????] GET - ???????????? ???????????? ????????? ?????? ??????', async () => {
      await articleRepository.save(
        dummy.article(categories.free.id, users.cadet[0].id, titleWithSearchWord, contentWithSearchWord),
      );

      const response = await request(httpServer)
        .get('/articles/search')
        .query(SearchArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${noviceJWT}`);

      expect(response.status).toEqual(HttpStatus.OK);
      const responseArticles = response.body.data as Article[];
      expect(responseArticles.length).toBe(0);
    });

    test('[??????] GET - ???????????? ????????? ??? ??????', async () => {
      await articleRepository.save(
        dummy.article(categories.free.id, users.cadet[0].id, titleWithoutSearchWord, contentWithSearchWord),
      );
      await articleRepository.save(
        dummy.article(categories.free.id, users.cadet[0].id, titleWithoutSearchWord, contentWithoutSearchWord),
      );

      const response = await request(httpServer)
        .get('/articles/search')
        .query(SearchArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${cadetJWT}`);

      expect(response.status).toEqual(HttpStatus.OK);
      const responseArticles = response.body.data as Article[];
      expect(responseArticles.length).toBe(1);
      expect(responseArticles[0].content).toBe(contentWithSearchWord);
    });
  });

  // ???????????? ??? ??????
  describe('/articles/search/$categoryId', () => {
    const searchWord = '42';
    const freeCategoryId = 1;
    const titleWithSearchWord = 'aaa42aaa';
    const titleWithoutSearchWord = 'aaaaaa';
    const contentWithSearchWord = 'bbb42bbb';
    const contentWithoutSearchWord = 'bbbbbb';
    const SearchArticleRequestDto = {
      q: searchWord,
      categoryId: freeCategoryId,
    };
    let cadetJWT: string;
    let noviceJWT: string;

    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      categories = await dummy.createDummyCategories(categoryRepository);
      cadetJWT = dummy.jwt(users.cadet[0], authService);
      noviceJWT = dummy.jwt(users.novice[0], authService);
    });

    test('[??????] GET - ???????????? ?????? ??????', async () => {
      const response = await request(httpServer)
        .get(`/articles/search`)
        .query(SearchArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${cadetJWT}`);

      expect(response.status).toEqual(HttpStatus.OK);
      const responseArticles = response.body.data as Article[];
      expect(responseArticles.length).toBe(0);
    });

    test('[??????] GET - ???????????? ?????? ?????? ??????', async () => {
      await articleRepository.save(
        dummy.article(categories.free.id, users.cadet[0].id, titleWithoutSearchWord, contentWithoutSearchWord),
      );

      const response = await request(httpServer)
        .get(`/articles/search`)
        .query(SearchArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${cadetJWT}`);

      expect(response.status).toEqual(HttpStatus.OK);
      const responseArticles = response.body.data as Article[];
      expect(responseArticles.length).toBe(0);
    });

    test('[??????] GET - ????????? ???????????? ??????', async () => {
      await articleRepository.save(
        dummy.article(categories.free.id, users.cadet[0].id, titleWithSearchWord, contentWithoutSearchWord),
      );

      const response = await request(httpServer)
        .get(`/articles/search`)
        .query(SearchArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${cadetJWT}`);

      expect(response.status).toEqual(HttpStatus.OK);
      const responseArticles = response.body.data as Article[];
      expect(responseArticles.length).toBe(1);
      expect(responseArticles[0].title).toBe(titleWithSearchWord);
    });

    test('[??????] GET - ????????? ???????????? ??????', async () => {
      await articleRepository.save(
        dummy.article(categories.free.id, users.cadet[0].id, titleWithoutSearchWord, contentWithSearchWord),
      );

      const response = await request(httpServer)
        .get(`/articles/search`)
        .query(SearchArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${cadetJWT}`);

      expect(response.status).toEqual(HttpStatus.OK);
      const responseArticles = response.body.data as Article[];
      expect(responseArticles.length).toBe(1);
      expect(responseArticles[0].content).toBe(contentWithSearchWord);
    });

    test('[??????] GET - ?????? ?????? ??????????????? ???????????? ??????', async () => {
      await articleRepository.save(
        dummy.article(categories.free.id, users.cadet[0].id, titleWithSearchWord, contentWithSearchWord),
      );

      const response = await request(httpServer)
        .get(`/articles/search`)
        .query(SearchArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${noviceJWT}`);

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });
  });
});
