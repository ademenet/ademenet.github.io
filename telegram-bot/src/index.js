const GITHUB_REPO = "ademenet/ademenet.github.io";
const MICROPOSTS_PATH = "content/microposts";
const TIMEZONE = "Europe/Paris";
const BRANCH = "master";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // Verify Telegram webhook secret
    const secret = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
    if (secret !== env.TELEGRAM_WEBHOOK_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }

    const update = await request.json();
    const message = update.message;

    if (!message || !message.text) {
      return new Response("OK");
    }

    // Verify sender identity
    if (String(message.from.id) !== String(env.ALLOWED_USER_ID)) {
      return new Response("OK");
    }

    try {
      const now = new Date();
      const filename = formatFilename(now);
      const frontmatterDate = formatFrontmatterDate(now);
      const content = buildMicropost(frontmatterDate, message.text);
      const filePath = `${MICROPOSTS_PATH}/${filename}.md`;

      await createGitHubFile(env.GITHUB_TOKEN, filePath, content, filename);
      await sendTelegramMessage(
        env.TELEGRAM_BOT_TOKEN,
        message.chat.id,
        `Micropost published.`
      );
    } catch (error) {
      await sendTelegramMessage(
        env.TELEGRAM_BOT_TOKEN,
        message.chat.id,
        `Error: ${error.message}`
      );
    }

    return new Response("OK");
  },
};

// Format: YYYY-MM-DD-HH-MM
function formatFilename(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type).value;
  return `${get("year")}-${get("month")}-${get("day")}-${get("hour")}-${get("minute")}`;
}

// Format: YYYY-MM-DD HH:MM:SS+ZZZZ
function formatFrontmatterDate(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "longOffset",
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type).value;

  // timeZoneName gives "GMT+02:00" → we want "+0200"
  const tzName = get("timeZoneName");
  const offset = tzName.replace("GMT", "").replace(":", "");

  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}${offset}`;
}

function buildMicropost(frontmatterDate, text) {
  return `---\ndate: ${frontmatterDate}\n---\n\n${text}\n`;
}

async function createGitHubFile(token, path, content, filename) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`;
  const body = {
    message: `Micropost: ${filename} from Telegram`,
    content: btoa(unescape(encodeURIComponent(content))),
    branch: BRANCH,
  };

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "telegram-micropost-bot",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub API error (${response.status}): ${error}`);
  }
}

async function sendTelegramMessage(botToken, chatId, text) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}
