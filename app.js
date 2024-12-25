const app = {
	eventBroadcast: eventBroadcast,
	fetcher: Fetcher,
	songs: Songs,
	uiHelper: uiHelper,
	player: Player,
	init: async function() {
		this.player.init(),
		this.uiHelper.init();
		this.songs.init();
		await this.fetcher.fetchSongs();
	}
}

app.init();

