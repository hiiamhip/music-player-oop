const Fetcher = {
	apiUrl: './data.json',
	fetchSongs: async function(Songs) {
		try {
			const response = await fetch(this.apiUrl);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			eventBroadcast.parseEvent("songsFetched", data);
		} catch (error) {
			console.log("Error fetching songs: ", error);
			return [];
		}
	},
}
