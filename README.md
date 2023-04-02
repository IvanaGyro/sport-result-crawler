# Traffic Accient Analyzer

## 資料夾結構

- /data：存放原始資料，例如 `.csv`
- /outputs：產生的檔案，包含圖檔、快取、中介格式的 `.json` 等
- /src/crawlers：爬取資料公開平台上的資料的爬蟲
- /src/parsers：解析和清理原始資料的解析器

## 編譯

```
yarn tsc
```

為了未來部屬方便，請把編譯產生的 `.js` 檔加入 Git 追蹤


## 執行

需要編譯之後才能執行

```
yarn start {file_path}
```

範例

```
# execute ./index.js
yarn start .
```
## 寫作風格

此專案採用 Airbnb 風格，並使用 VS Code 外掛 [Prettier ESLint (Pre-Release)](https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint) 自動排版。

程式碼，包含註解，請以英文撰寫，Git 的 commit 風格請遵守 [Tim Pope 使用的規範](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)。標題限制 50 字元，標題與內文間空一行，內文每行最多 72 字元，特長變數名稱和網址等可例外。

例外：
```
this_is_a_super_looooooooooooooooooooooooooooooooooooooooooooooooooooooooong_variable
https://our.subdomain.contains.a.lot.of.words.and.exceeds.seventy.two.characters.fmra.org/
```

請在 Git commit 訊息中標註 issue 編號，格式見 [GitHub 官方文件](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/autolinked-references-and-urls#issues-and-pull-requests)。

## 分支管理

目前暫時不需要 pull request，直接在 `main` 分支上開發，然後 push 上去即可。

## 里程碑

- [ ] 使用 Git hook 檢查 commit 訊息和程式碼格式
- [ ] 依照道路交通事故調查報告表設計資料格式
- [ ] 設計 SQL schema 並暫時使用 sqlite 做資料庫
- [ ] 台北資料爬蟲
- [ ] 台中資料爬蟲
- [ ] 台南資料爬蟲
- [ ] 警政署資料爬蟲
- [ ] 台北 CSV 解析器（從 Python 重寫）
- [ ] 桃園 CSV 解析器
- [ ] 台中 CSV 解析器
- [ ] 台南 CSV 解析器
- [ ] 警政署資料解析器（從 Python 重寫）
- [ ] 前端報表
- [ ] docker compose 打包開發與部屬環境
- [ ] 部屬到 AWS 或 Azure
