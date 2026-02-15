# Telegram Micropost Bot

A Cloudflare Worker that receives Telegram messages and publishes them as microposts on the Hugo blog.

## Architecture

```
Telegram message → Cloudflare Worker (webhook) → GitHub API (file creation) → Push to master → GitHub Actions → Hugo deploy
```

## Prerequisites

- A [Cloudflare](https://cloudflare.com) account (free tier works)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed (`npm install -g wrangler`)
- A Telegram account

## Setup

### 1. Create a Telegram bot

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` and follow the prompts
3. Save the **bot token** (format: `123456789:ABCdefGHI...`)

### 2. Get your Telegram user ID

1. Search for [@userinfobot](https://t.me/userinfobot) on Telegram
2. Send `/start` — it will reply with your user ID (a number like `123456789`)

### 3. Create a GitHub Personal Access Token

1. Go to [GitHub Settings > Fine-grained tokens](https://github.com/settings/tokens?type=beta)
2. Click **Generate new token**
3. Set a name (e.g., `telegram-micropost-bot`)
4. Under **Repository access**, select **Only select repositories** → choose `ademenet.github.io`
5. Under **Permissions > Repository permissions**, set **Contents** to **Read and write**
6. Generate and copy the token

### 4. Configure secrets

```sh
cd telegram-bot
wrangler login
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put TELEGRAM_WEBHOOK_SECRET    # choose any random string
wrangler secret put GITHUB_TOKEN
wrangler secret put ALLOWED_USER_ID
```

### 5. Deploy the Worker

```sh
wrangler deploy
```

Note the deployed URL (e.g., `https://telegram-micropost-bot.<your-subdomain>.workers.dev`).

### 6. Register the Telegram webhook

Replace `<BOT_TOKEN>`, `<WORKER_URL>`, and `<WEBHOOK_SECRET>` with your values:

```sh
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "<WORKER_URL>",
    "secret_token": "<WEBHOOK_SECRET>"
  }'
```

You should get `{"ok":true,"result":true,"description":"Webhook was set"}`.

### 7. Test

Send a message to your bot on Telegram. It should:

1. Reply with "Micropost published."
2. Create a new file in `content/microposts/` on GitHub
3. Trigger the Hugo deployment workflow

## Local development

```sh
cp .dev.vars.example .dev.vars
# Fill in your actual values in .dev.vars
wrangler dev
```

Then use a tool like [ngrok](https://ngrok.com) to expose the local server and register it as webhook for testing.
