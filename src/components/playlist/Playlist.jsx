// import React from "react";
import "./Playlist.css";
import Tracklist from "../tracklist/Tracklist.jsx";

function Playlist({
  playlistTracks,
  onRemove,
  playlistName,
  onNameChange,
  onSave,
}) {
  // Function handleNameChange trackes the changes from the input
  function handleNameChange(e) {
    onNameChange(e.target.value);
  }

  return (
    <div className="Playlist">
      <input value={playlistName} onChange={handleNameChange} />
      {/* <!-- Add a TrackList component --> */}
      <Tracklist searchResults={playlistTracks} onRemove={onRemove} />
      <button className="Playlist-save" onClick={onSave}>
        SAVE TO SPOTIFY
      </button>
    </div>
  );
}

export default Playlist;
