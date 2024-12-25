const Songs = {
	songList : [],
	addSongs: function(dataSongs) {
		this.songList = this.songList.concat(dataSongs);
	},
	init: function() {
		eventBroadcast.addListener("songsFetched", (dataSongs) => {
			Songs.addSongs(dataSongs);
			eventBroadcast.parseEvent("songsAdded", Songs);
		})
	},
}