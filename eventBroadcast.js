const eventBroadcast = {
	listeners: {
		"songsFetched": [],
		"songsAdded": [],
		"songsChanged": [],
		"playStateChanged": [],
		"randomStateChanged": [],
		"repeatStateChanged": [],
		"songTimeUpdated": [],
		"songSelected": []
	},
	addListener: function(event, callback) {
		if (!this.listeners[event]) {
			this.listeners[event] = []
		}
		this.listeners[event].push(callback);
	},
	parseEvent: function(event, ...arg) {
		if (this.listeners[event]) {
			this.listeners[event].forEach((callback) => callback(...arg));
		}
	}
}