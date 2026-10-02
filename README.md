# 4mple Lab website

ブランドトップ・製品紹介・ドキュメントを集約するAstro / Starlightサイト。

## ローカル開発

```sh
cd docs
npm ci
npm run dev
```

公開用ビルド: `npm run build`。ファームウェアのリリース情報取得にGitHub APIへの接続が必要です。

## ページ構成

- `/`: ブランドトップ
- `/LisM/`: LisM製品紹介（既存URLを維持）
- `/LisM/build_guides/`: ビルドガイド
- `/LisM/firmware/`, `/LisM/how2/`: 設定・使い方

`docs/src/content/docs/LisM/` にガイド、`docs/src/pages/` に製品・ブランドページを配置。大文字を含む既存URLの維持のため、ガイドはslugを明示。
共通テーマと配色見本は `docs/src/theme/` を参照。
3Dデータ・ファームウェアは元の各リポジトリで管理します。

## 公開切り替え

1. このリポジトリのPagesの公開元をGitHub Actionsに設定。
2. 旧 `4mplelab/LisM` のPagesを停止する。同じ `/LisM/` に旧プロジェクトサイトが残ると、新サイトの製品ページと競合するため。
3. 本リポジトリのmainへpushし、Deploy Astro to GitHub Pagesを実行。
4. `/`、`/LisM/`、ガイド・画像・検索を公開環境でも確認。

移行準備段階では元リポジトリのソース・公開を残しています。切り替え確認後、旧docsと旧deployワークフローを削除します。
