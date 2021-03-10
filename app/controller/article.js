const Controller = require('egg').Controller;
const { Op } = require('sequelize');
const { defaultTimeSearch } = require('@core/config');
const articleModel = require('@database/article');
const { toInt } = require('@utils/share');

class ArticleController extends Controller {
  async index() {
    await this.handleSearchArticle();
  }

  // web前端-分页获取对应分类下的文章
  async getArticleByCateForWeb() {
    const { ctx, app } = this;
    const query = {
      ...ctx.helper.handlePageQuery(),
      ...ctx.helper.handleConditionSearch(['categoryId', { key: 'status', value: 1 }]),
      include: {
        model: app.model.ArticleTag,
      },
    };
    const articles = await ctx.model.Article.findAndCountAll(query);
    ctx.helper.successRes('获取文章列表成功', ctx.helper.handlePagenationRes(articles));
  }

  // 获取最新的文章
  async getArticlesLatesForWeb() {
    const { ctx, app } = this;
    const query = {
      ...ctx.helper.handlePageQuery(),
      where: {
        publishTime: {
          [Op.lte]: defaultTimeSearch.startTime,
          [Op.gte]: defaultTimeSearch.endTime,
        },
        status: 1,
      },
      include: {
        model: app.model.ArticleTag,
      },
    };
    const articles = await ctx.model.Article.findAndCountAll(query);
    ctx.helper.successRes('获取文章列表成功', ctx.helper.handlePagenationRes(articles));
  }

  // web端获取文章详情
  async fetchArticleDetailForWeb() {
    const { ctx, app } = this;
    const result = await ctx.model.Article.findOne({
      where: {
        id: toInt(ctx.params.id || ctx.query.id),
      },
      include: [
        {
          model: app.model.User,
          attributes: { exclude: ['passWord'] },
        },
        {
          model: app.model.ArticleTag,
        },
      ],
    });
    ctx.helper.successRes('获取文章详情', result);
  }

  // web端分页搜索文章列表
  async fetchSearchArticleForWeb() {
    await this.handleSearchArticle([{ key: 'status', value: 1 }]);
  }

  // web端更新文章阅读数
  async updataArticlePreviewNumber() {
    const { body } = this.ctx.request;
    await this.ctx.model.Article.update(
      {
        pageView: body.pageView,
      },
      {
        where: {
          id: body.id,
        },
      }
    );
    this.ctx.helper.successRes('更新文章阅读数', null);
  }

  async handleSearchArticle(condition = []) {
    const { ctx, app } = this;
    const query = {
      ...ctx.helper.handlePageQuery(),
      ...ctx.helper.handleConditionSearch([{ key: 'title', fuzzy: true }].concat(condition)),
      include: {
        model: app.model.ArticleTag,
      },
      order: [['publishTime']],
    };
    const articles = await ctx.model.Article.findAndCountAll(query);
    const result = ctx.helper.handlePagenationRes(articles);
    ctx.helper.successRes('获取文章列表成功', result);
  }

  async show() {
    const { ctx, app } = this;
    const result = await ctx.model.Article.findOne({
      where: {
        id: toInt(ctx.params.id || ctx.query.id),
      },
      include: {
        model: app.model.ArticleTag,
      },
    });
    ctx.helper.successRes('', result);
  }

  // 校验参数
  async validateParams() {
    const { ctx } = this;
    const bodyParams = {
      ...ctx.request.body,
      ...ctx.helper.getBodyParams(articleModel()),
    };
    const validateResult = await ctx.validate('article', {
      wordsNumber: bodyParams.wordsNumber,
      articleTags: bodyParams.articleTags,
    });
    if (!validateResult) return null;
    return bodyParams;
  }

  // 创建
  async create() {
    const { ctx, app } = this;

    const bodyParams = await this.validateParams();

    if (!bodyParams) return;

    // 创建事务
    let transaction = null;

    try {
      transaction = await this.ctx.model.transaction();
      const userInfo = JSON.parse(await app.redis.get('userInfo'));

      const createArticleParmas = {
        ...bodyParams,
        authorName: userInfo.nickName,
        authorId: userInfo.id,
      };

      const article = await ctx.model.Article.create(createArticleParmas, {
        transaction,
      });
      // 批量创建 article_compose_tag中间表
      await ctx.model.ArticleComposeTag.bulkCreate(
        createArticleParmas.articleTags.map((tag) => ({
          articleId: article.id,
          articleTagId: tag.id,
        })),
        {
          transaction,
        }
      );
      await transaction.commit();
      ctx.helper.successRes('新增文章成功', null);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const article = await ctx.model.Article.findByPk(id);
    if (!article) {
      return ctx.helper.generalExceptionRes('文章不存在');
    }

    const bodyParams = await this.validateParams();

    if (!bodyParams) return;

    let t = null;
    try {
      t = await this.ctx.model.transaction();
      await article.update(bodyParams, { transaction: t });
      await this.deleteArticleTagRows(bodyParams.id, t);
      await ctx.model.ArticleComposeTag.bulkCreate(
        bodyParams.articleTags.map((tag) => ({
          articleId: article.id,
          articleTagId: tag.id,
        })),
        {
          transaction: t,
        }
      );
      await t.commit();
      ctx.helper.successRes('编辑文章成功', null);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  // 删除 article_compose_article-tag表对应的tag行
  async deleteArticleTagRows(id, transaction) {
    return this.ctx.model.ArticleComposeTag.destroy({
      where: {
        articleId: id,
      },
      force: true,
      transaction,
    });
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const article = await ctx.model.Article.findByPk(id);
    if (!article) {
      return ctx.helper.generalExceptionRes('文章不存在');
    }

    // 创建事务
    let transaction = null;
    try {
      transaction = await this.ctx.model.transaction();
      await this.deleteArticleTagRows(article.id, transaction);
      await article.destroy();
      await transaction.commit();
      ctx.helper.successRes('删除文章成功');
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = ArticleController;
