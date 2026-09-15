# 工程参考工具库 · Engineering Reference Hub

GB / ISO 机械与工程设计在线参考工具集。**纯静态站点**：无构建步骤、无后端、
无需任何依赖，上传即可运行。

## 目录结构

```
index.html            # 首页（枢纽），按分类汇总全部模块
styles.css
data.js               # 唯一需要维护的数据文件
app.js
favicon.svg
.nojekyll             # 让 GitHub Pages 跳过 Jekyll，文件原样发布
1-tolerance-fit/  # 公差配合
```

## 部署到 GitHub Pages

### 方式一：用户站（URL 最短，推荐）
1. 新建仓库，仓库名必须是 `<你的用户名>.github.io`
2. 把本目录里的**全部文件**上传到该仓库根目录
3. Settings → Pages → Source 选 `Deploy from a branch`，分支 `main`，目录 `/ (root)`
4. 稍等片刻，访问 `https://<你的用户名>.github.io/`

### 方式二：项目站
1. 新建任意名称的仓库，例如 `engineering-hub`
2. 同样把本目录全部文件上传到仓库根目录
3. Settings → Pages 做同样的设置
4. 访问 `https://<你的用户名>.github.io/engineering-hub/`

> 两种方式都能正常工作。模块链接统一使用**不带 `/` 开头、也不带 `../` 的相对路径**，
> 所以站点部署在域名根目录还是子目录下都能正确解析。

## 本地预览

直接双击 `index.html` 即可（`file://` 协议）。
或起一个本地服务：`python -m http.server 8000`，然后访问 <http://localhost:8000>

## 新增模块

1. 在工程库根目录（与 `0-主页面/` 同级）新建 `2-模块名/` 目录，把该模块的页面放进去
2. 编辑 `0-主页面/data.js`，把对应模块的 `url` 填成 `../2-模块名/index.html`
3. 重新运行打包脚本，生成新的上传包

## 重新打包

```
python 99-publish/build.py
```

脚本会自动发现工程库根目录下的所有 `N-xxx/` 模块目录（`0-主页面` 是枢纽、
`99-*` 是打包归档区，均跳过），把 `../X-模块/` 形式的链接改写掉，然后跑一遍自检：
先确认包内每个链接都指向真实存在的文件，再起本地 HTTP 服务模拟「用户站」和
「项目站」两种部署形态逐文件核对。
