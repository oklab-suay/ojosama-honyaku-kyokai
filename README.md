# お嬢様翻訳協会

荒ぶる感情を、優雅な言葉で覆い隠すツール。Netlify Functions経由でClaude API（Haiku 4.5）を呼び出します。

## デプロイ手順（Netlify + GitHub）

1. このフォルダ（`ojosama/`）をGitHubリポジトリにpushする
2. [Netlify](https://app.netlify.com) にログインし、「Add new site」→「Import an existing project」からそのGitHubリポジトリを選択
3. ビルド設定はそのままでOK（`netlify.toml` が自動で読み込まれます）
4. デプロイ後、Netlifyの管理画面 → Site configuration → Environment variables で以下を追加
   - `ANTHROPIC_API_KEY` = あなたのAnthropic APIキー
5. 再デプロイすれば完了

## ローカル動作確認

```bash
npm install
npx netlify dev
```

`ANTHROPIC_API_KEY` を `.env` ファイルに書いておくと `netlify dev` が読み込みます。

```
ANTHROPIC_API_KEY=sk-ant-...
```
