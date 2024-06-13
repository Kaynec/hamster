const fs = require("fs");

const dailyCipher = fs.readFileSync("cipher.txt").toString().trim();

const urls = fs
  .readFileSync("urls.txt")
  .toString()
  .replaceAll("\r", "")
  .trim()
  .split("\n")
  .map((el) => ({ path: el, token: "" }));

async function initTokens() {
  const resposne = [];

  for (let url of urls) {
    const QUERY = [...new URLSearchParams(url.path)][0][1];

    const res = await fetch(
      "https://api.hamsterkombat.io/auth/auth-by-telegram-webapp",
      {
        headers: {
          accept: "application/json",
          "accept-language": "en-US,en;q=0.9",
          authorization: "authToken is empty, store token null",
          "content-type": "application/json",
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": '"Android"',
        },
        body: JSON.stringify({ initDataRaw: QUERY }),
        method: "POST",
      }
    );

    const json = await res.json();

    if (!json.authToken) return;
    url.token = `Bearer ${json.authToken}`;
    syncAccount(url.token);
    resposne.push(json);
  }

  return resposne;
}

async function syncAccount(token) {
  const url = "https://api.hamsterkombat.io/clicker/sync";
  const res = await fetch(url, {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      authorization: token,
      "sec-ch-ua": '"Chromium";v="124", "Opera";v="110", "Not-A.Brand";v="99"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      Referer: "https://hamsterkombat.io/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: null,
    method: "POST",
  });

  const json = await res.json();

  if (Boolean(await checkCipher(token))) return;
  claimCipher(token);
  return json;
}

async function checkCipher(token) {
  const res = await fetch("https://api.hamsterkombat.io/clicker/config", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      authorization: token,
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      Referer: "https://hamsterkombat.io/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: null,
    method: "POST",
  });

  const json = await res.json();
  return json.dailyCipher.isClaimed;
}

function claimCipher(token) {
  fetch("https://api.hamsterkombat.io/clicker/claim-daily-cipher", {
    headers: {
      accept: "application/json",
      "accept-language": "en-US,en;q=0.9",
      authorization: token,
      "content-type": "application/json",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      Referer: "https://hamsterkombat.io/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: JSON.stringify({ cipher: dailyCipher }),
    method: "POST",
  })
    .then((r) => r.json())
    .then((r) => {
      console.log(r);
    });
}

// Initial Request Just For Convinience
initTokens();

const http = require("http");
const port = process.env.PORT || 80;
const requestListener = async function (req, res) {
  // console.log(result, "lol");
  const result = await initTokens();
  console.log(result);
  // res.writeHead(200);
  // res.end(result);
  res.end("lol");
};
const server = http.createServer(requestListener);
server.listen(port, (req, res) => {
  console.log(`Server is running on PORT:${port}`);
});
