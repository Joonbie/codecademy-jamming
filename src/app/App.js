import "./App.css";
import React, { useState, useEffect } from "react";
import SearchBar from "../components/searchbar/SearchBar.jsx";
import SearchResults from "../components/searchresults/SearchResults.jsx";
import Playlist from "../components/playlist/Playlist.jsx";
import Spotify from "../util/Spotify.js";

function App() {
  // Create state hook that manages the characteristics of our application
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);

  // at the start of this app componenet, provide default values for searchResults
  // lifecycle hook
  useEffect(() => {
    // When the application first starts, request that the user logs in first
    // eslint-disable-next-line no-unused-vars
    const token = Spotify.getAccessToken();

    setSearchResults([
      {
        id: 1,
        name: "Track 1",
        artist: "Artist 1",
        album: "Track 1 Album",
      },
      {
        id: 2,
        name: "Track 2",
        artist: "Artist 2",
        album: "Track 2 Album",
      },
      {
        id: 3,
        name: "Track 3",
        artist: "Artist 3",
        album: "Track 3 Album",
      },
    ]);
  }, []);

  // function addTrack will be passed to component searchResults
  function addTrack(track) {
    // Check whether track is found in state called playlistTracks
    const existTrack = playlistTracks.find(
      (currentTrack) => track.id === currentTrack,
    );
    // Store track is only track  is NOT found in state playlistTracks
    if (!existTrack) setPlaylistTracks([track, ...playlistTracks]); // setPlaylistTracks.concat(track);

    return;
  }

  // function removeTrack will be passed to component playlist
  function removeTrack(track) {
    // Filter the playlistTracks to return only those that are not one of the tracks passed in
    const filteredTracks = playlistTracks.filter(
      (currentTrack) => track.id !== currentTrack.id,
    );

    // store the remaining / filtered tracks
    setPlaylistTracks(filteredTracks);
  }

  // Function updatePlaylistName to store a new playlist name
  function updatePlaylistName(name) {
    // Store the name in playlistName
    setPlaylistName(name);
  }

  // Function savePlaylist to send the searched playlist to spotify
  // pass the function itself tp component Playlist
  function savePlaylist(e) {
    e.preventDefault();
    e.stopPropagation();
    const trackURIs = playlistTracks.map((track) => track.uri);
    console.log(trackURIs);

    // Once spotify has captured the new playlist, we reset the playlistName and playlistTracks
    Spotify.savePlaylist(playlistName, trackURIs).then(() => {
      updatePlaylistName("New Playlist");
      setPlaylistTracks([]);
    });
  }

  // Function search calls Spotify Api search request in Spotify.js
  // which return the results and later store dd in state search results
  function search(term) {
    Spotify.search(term).then((result) => setSearchResults(result));
  }

  return (
    <div>
      <h1>
        Ja<span className="highlight">mmm</span>ing
      </h1>
      <div className="App">
        {/* <!-- Add a SearchBar component --> */}
        <SearchBar onSearch={search} />
        <div className="App-playlist">
          {/* <!-- Add a SearchResults component --> */}
          <SearchResults searchResults={searchResults} onAdd={addTrack} />
          {/* <!-- Add a Playlist component --> */}
          <Playlist
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onRemove={removeTrack}
            onNameChange={updatePlaylistName}
            onSave={savePlaylist}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
