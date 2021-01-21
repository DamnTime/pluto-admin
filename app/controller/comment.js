const Controller = require('egg').Controller;
const { toInt } = require('@utils/share');
const commentModel = require('@database/comment');

// 生成评论树形结构
// const generateTreeData = (array = '[]') => {
//   array = JSON.parse(array);
//   const map = {};
//   const root = [];
//   const length = array.length;
//   for (let index = 0; index < length; index++) {
//     const element = array[index];
//     map[element.id] = index;
//   }
//   for (let index = 0; index < length; index++) {
//     const node = array[index];
//     const currentInMap = map[node.pId];
//     if (isNotEmpty(currentInMap)) {
//       !array[currentInMap].children && (array[currentInMap].children = []);
//       array[currentInMap].children.push(node);
//     } else {
//       root.push(node);
//     }
//   }
//   return root;
// };

const generateTreeData = (arr = '{}') => {
  arr = JSON.parse(arr);
  const map = {};
  const root = [];
  arr.forEach((item) => {
    if (item.pId === 0) {
      // 根节点
      map[item.id] = Object.assign(item, map[item.id]);
      root.push(map[item.id]);
    } else {
      // 叶子节点
      if (map[item.pId]) {
        // map中存在上级节点，则添加到上级节点的children中
        map[item.pId].children = map[item.pId].children || [];
        map[item.pId].children.push(item);
      } else {
        // 不存在上级节点，则创造一个上级节点，ps:循环到上级节点时，直接替换。
        map[item.pId] = { ...item, id: item.pId, pId: null, children: [item] };
      }
      map[item.id] = Object.assign(item, { ...map[item.id], pId: item.pId || map[item.id].pId }); // 设置当前id的map，若存在创造的节点，则合并
    }
  });
  return root;
};

class CommentController extends Controller {
  async getComments(condition = {}) {
    const { ctx, app } = this;
    const comments = await ctx.model.Comment.findAll({
      attributes: {
        exclude: ['articleId'],
      },
      include: [
        {
          attributes: ['id', 'title', 'authorId'],
          model: app.model.Article,
        },
      ],
      ...condition,
    });
    ctx.helper.successRes('获取评论成功', generateTreeData(JSON.stringify(comments || [])));
  }

  // 获取所有评论
  async index() {
    await this.getComments();
  }

  // 根据文章id查找评论列表
  async getCommentsByArticleId() {
    await this.getComments({
      where: {
        articleId: this.ctx.request.query.articleId,
      },
    });
  }

  // 创建评论
  async create() {
    const { ctx, app } = this;

    const bodyParams = ctx.helper.getBodyParams(commentModel());

    const article = await ctx.model.Article.findOne({
      where: {
        id: bodyParams.articleId,
      },
    });

    if (!article) {
      return ctx.helper.generalExceptionRes('评论文章不存在');
    }

    // 当前登录人信息
    const { id, nickName, headImg } = JSON.parse(await app.redis.get('clientUserInfo'));

    bodyParams.commentUserId = id;
    bodyParams.nickName = nickName;
    bodyParams.headImg = headImg;
    bodyParams.pId = bodyParams.pId || 0;

    const comment = await ctx.model.Comment.create(bodyParams);

    ctx.helper.successRes('新增评论成功', comment);
  }

  // 删除评论
  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const hasChildComment = await ctx.model.Comment.findOne({
      where: {
        pId: id,
      },
    });
    if (hasChildComment) {
      return ctx.helper.generalExceptionRes('存在子级评论，不能删除');
    }
    const comment = await ctx.model.Comment.findByPk(id);
    if (!comment) {
      return ctx.helper.generalExceptionRes('该评论不存在');
    }
    await comment.destroy();
    ctx.helper.successRes('删除评论成功');
  }
}

module.exports = CommentController;
