# 4Real.

## セットアップ
1. `npm i`
2. `.env.local` を `.env.local.example` をもとに作成
3. Supabase で:
   - Auth: Email/Magic Link を ON
   - Storage: バケット `photos` 作成
   - SQL エディタで `supabase.sql` を実行
4. コマンドで、

    ```sh
    node -e "const wp=require('web-push');console.log(wp.generateVAPIDKeys())"
    ```

   生成キーを `.env.local` に設定
5. `npm run dev`

## 運用フロー
- 管理者ページ `/admin` で「イベント開始」→「Push送信」
- 参加者は `/push-setup` で通知購読 → 24時間以内に `/capture` から投稿
- 投稿済みのユーザーだけ `/feed` が閲覧可能

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Next.js

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
