const clientId = "24c303dab722406ab76d272fed625f6e"; // Insert client ID here.
const redirectUri = "http://joonbiespotify.surge.sh/"; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
let accessToken = "";

const Spotify = {
  // First check whether the user of my applicatioon has a valid access token.
  // if an accessToken exists, return it.
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    // Second, check the access token and its expiry are valid
    // and return the access token
    // otherwise, we will need to send an autorisation request to access the application
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/"); // This clears the parameters, allowing us to grab a new access token when it expires.
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  // When a search is performed in App.js
  // function search will be invoeked with the access token to make a request to perfomr
  // the search on Spotify
  search(term) {
    // first obtain the spotify accessToken
    const accessToken = Spotify.getAccessToken();
    // make a fetch request to Spotify's search api
    // pass in the accessToken of the user for this application (Bearer token)
    // the 1st then statement is a pormise that is returned after the api request returns the data
    // the 2nd then statement is a promise that returns the tracks from the previous promise
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));
      });
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;

    return fetch("https://api.spotify.com/v1/me", { headers: headers })
      .then((response) => response.json())
      .then((jsonResponse) => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({ name: name }),
        })
          .then((response) => response.json())
          .then((jsonResponse) => {
            const playlistId = jsonResponse.id;
            return fetch(
              `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
              {
                headers: headers,
                method: "POST",
                body: JSON.stringify({ uris: trackUris }),
              },
            );
          });
      });
  },
};

export default Spotify;
