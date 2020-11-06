const Controller = require('egg').Controller;
const articleTagsModel = require('@database/article_tag');
const { toInt } = require('@utils/share');

class ArticleTagController extends Controller {
  async index() {
    // 分页查询
    const { ctx } = this;
    const query = {
      ...ctx.helper.handlePageQuery(),
      ...ctx.helper.handleConditionSearch([{ key: 'name', fuzzy: true }]),
    };
    const articleTags = await ctx.model.ArticleTag.findAndCountAll(query);
    ctx.helper.successRes(
      '获取文章标签列表成功',
      ctx.helper.handlePagenationRes(articleTags)
    );
  }

  // 搜索文章标签
  async searchArticleTag() {
    const { ctx } = this;
    const query = {
      ...ctx.helper.handleConditionSearch([{ key: 'name', fuzzy: true }]),
    };
    ctx.helper.successRes(
      '文章标签',
      await ctx.model.ArticleTag.findAll(query)
    );
  }

  async show() {
    const ctx = this.ctx;
    ctx.helper.successRes(
      '获取文章标签详情',
      await ctx.model.ArticleTag.findByPk(toInt(ctx.params.id))
    );
  }

  async create() {
    const ctx = this.ctx;

    const params = ctx.helper.getBodyParams(articleTagsModel());

    const hasArticleTag = await ctx.model.ArticleTag.findOne({
      where: { name: params.name },
    });

    if (hasArticleTag) {
      return ctx.helper.generalExceptionRes('文章标签已存在');
    }

    const articleTags = await ctx.model.ArticleTag.create(params);

    ctx.helper.successRes('新增文章标签成功', articleTags);
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const articleTag = await ctx.model.ArticleTag.findByPk(id);
    if (!articleTag) {
      return ctx.helper.generalExceptionRes('文章标签不存在');
    }
    await articleTag.update(ctx.helper.getBodyParams(articleTagsModel()));
    ctx.helper.successRes();
  }

  // 删除文章标签的之前 检查article表是否有关联数据 有则提示并阻断 否则直接删除
  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const articleTag = await ctx.model.ArticleTag.findByPk(id);
    if (!articleTag) {
      return ctx.helper.generalExceptionRes('用户标签不存在');
    }
    const hasTagInArticle = await ctx.model.Article.findAll({
      where: {
        articleTagId: id,
      },
    });
    if ((hasTagInArticle || []).length > 0) {
      const ids = hasTagInArticle.map((i) => i.id);
      return ctx.helper.generalExceptionRes(
        `该文章标签正在被id为 ${ids.join('、')} 的文章使用, 不能删除`
      );
    }

    await articleTag.destroy();
    ctx.helper.successRes();
  }
}

module.exports = ArticleTagController;
