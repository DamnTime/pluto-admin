const Controller = require('egg').Controller;
const categoryModel = require('@database/category');
const { toInt } = require('@utils/share');

class CategoryController extends Controller {
  async index() {
    // 分页查询
    const { ctx, app } = this;
    const query = {
      ...ctx.helper.handlePageQuery(),
      include: {
        model: app.model.Article,
        limit: 5,
      },
    };
    ctx.body = ctx.helper.handlePagenationRes(
      await ctx.model.Category.findAndCountAll(query)
    );
  }

  // 搜索文章分类
  async searchCategory() {
    const { ctx } = this;
    const query = {
      ...ctx.helper.handleConditionSearch([{ key: 'name', fuzzy: true }]),
    };
    ctx.helper.successRes('文章分类', await ctx.model.Category.findAll(query));
  }

  async show() {
    const ctx = this.ctx;
    ctx.helper.successRes(
      '',
      await ctx.model.Category.findByPk(toInt(ctx.params.id))
    );
  }

  async create() {
    const ctx = this.ctx;

    const params = ctx.helper.getBodyParams(categoryModel());

    const hasCategory = await ctx.model.Category.findOne({
      where: { name: params.name },
    });

    if (hasCategory) {
      return ctx.helper.generalExceptionRes('文章分类已存在');
    }
    const category = await ctx.model.Category.create(params);

    ctx.helper.successRes('新增分类成功', category);
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const category = await ctx.model.Category.findByPk(id);
    if (!category) {
      return ctx.helper.generalExceptionRes('分类不存在');
    }
    await category.update(ctx.helper.getBodyParams(categoryModel()));
    ctx.helper.successRes();
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const category = await ctx.model.Category.findByPk(id);
    if (!category) {
      return ctx.helper.generalExceptionRes('用户标签不存在');
    }
    await category.destroy();
    ctx.helper.successRes();
  }
}

module.exports = CategoryController;
