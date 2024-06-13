async function startGamePlay(token) {
  return new Promise(async (resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append("accept-language", "en-US,en;q=0.9");
    myHeaders.append("authorization", `Bearer ${token}`);
    myHeaders.append("origin", "https://telegram.blum.codes");
    myHeaders.append("priority", "u=1, i");
    myHeaders.append("sec-ch-ua-mobile", "?1");
    myHeaders.append("sec-ch-ua-platform", '"Android"');
    myHeaders.append("sec-fetch-dest", "empty");
    myHeaders.append("sec-fetch-mode", "cors");
    myHeaders.append("sec-fetch-site", "same-site");
    myHeaders.append("content-type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
    };

    try {
      const res = await fetch(
        "https://game-domain.blum.codes/api/v1/game/play",
        requestOptions
      );

      resolve(await res.json());
    } catch (error) {
      reject(error);
    }
  });
}

async function claimGamePlay(token, gameId) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const myHeaders = new Headers();
      myHeaders.append("accept-language", "en-US,en;q=0.9");
      myHeaders.append("authorization", `Bearer ${token}`);
      myHeaders.append("origin", "https://telegram.blum.codes");
      myHeaders.append("priority", "u=1, i");
      myHeaders.append("sec-ch-ua-mobile", "?1");
      myHeaders.append("sec-ch-ua-platform", '"Android"');
      myHeaders.append("sec-fetch-dest", "empty");
      myHeaders.append("sec-fetch-mode", "cors");
      myHeaders.append("sec-fetch-site", "same-site");
      myHeaders.append("content-type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          gameId,
          points: Math.random() * 100 + 200,
        }),
      };

      try {
        const res = await fetch(
          "https://game-domain.blum.codes/api/v1/game/claim",
          requestOptions
        );

        resolve(await res.text());
      } catch (error) {
        reject(error);
      }
    }, 30000);
  });
}

const http = require("http");
const { URLSearchParams } = require("url");
const port = process.env.PORT || 80;
const requestListener = async function (req, res) {
  if (req.method !== "GET")
    return res.end(JSON.stringify({ detail: "ERROR : WRONG METHOD" }, null, 3));
  const token = new URLSearchParams(req.url).get("/?token");
  if (!token) {
    return res.end(JSON.stringify({ detail: "ERROR : GIVE TOKEN" }, null, 3));
  }
  const result = await startGamePlay(token);
  const claim = await claimGamePlay(token, result.gameId);
  res.end(JSON.stringify({ result, claim }, null, 3));
};
const server = http.createServer(requestListener);
server.listen(port, (req, res) => {
  console.log(`Server is running on PORT:${port}`);
});
