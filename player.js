const Player = {
	currentIndex: 0,
	currentSong: null,
	isPlaying: false,
	isRepeat: false,
	isRandom: false,
	songs: null,
	historySongs: [],
	unplayedSongs: [],
	playButton: document.querySelector(".btn-toggle-play"),
	repeatButton: document.querySelector(".btn-repeat"),
	prevButton: document.querySelector(".btn-prev"),
	nextButton: document.querySelector(".btn-next"),
	randomButton: document.querySelector(".btn-random"),
	audio: document.querySelector("#audio"),
	handleEvents: function() {
		// only when audio truly play/pause => set isPlaying accordingly, not by event click play/pause button
		this.audio.addEventListener("play", () => {
			this.isPlaying = true;
			eventBroadcast.parseEvent("playStateChanged", ({ isPlaying: this.isPlaying }));
		})
		this.audio.addEventListener("pause", () => {
			this.isPlaying = false;
			eventBroadcast.parseEvent("playStateChanged", ({ isPlaying: this.isPlaying }));
		})
		this.playButton.addEventListener("click", () => {
			if (this.isPlaying) {
				this.audio.pause();
			} else {
				this.audio.play();
			}
		})
		this.randomButton.addEventListener("click", () => {
			this.isRandom = !this.isRandom;
			eventBroadcast.parseEvent("randomStateChanged", ({ isRandom: this.isRandom }));
		})
		this.repeatButton.addEventListener("click", () => {
			this.isRepeat = !this.isRepeat;
			eventBroadcast.parseEvent("repeatStateChanged", ({ isRepeat: this.isRepeat }));
		})
		this.nextButton.addEventListener("click", () => {
			this.saveHistorySongs();
			if (this.isRandom) {
				this.randomSong();
			} else {
				this.nextSong();
			}
			this.audio.play();
		})
		this.prevButton.addEventListener("click", () => {
			if (this.audio.currentTime > 5) {
				this.loadCurrentSong();
			} else {
				this.prevSong();
			}
			this.audio.play();
		})
		this.audio.addEventListener("timeupdate", () => {
			if (this.audio.currentTime) {
				const progressPercent =
				(this.audio.currentTime / this.audio.duration) * 100;
				eventBroadcast.parseEvent("songTimeUpdated", {
					parsedFrom: "Player",
					progressPercent: progressPercent,
				});
			}
		})
		this.audio.addEventListener("ended", () => {
			if (this.isRepeat) {
				this.audio.play();
			} else {
				this.nextButton.click();
			}
		})
		
	},
	prevSong: function () {
		if (this.historySongs.length > 0) {
			this.currentIndex = this.historySongs.pop();
		} else {
			alert("No more songs in history");
		}
		this.loadCurrentSong();
	},
	loadCurrentSong: function() {
		this.currentSong = this.songs[this.currentIndex]
		this.audio.src = this.currentSong.path;
		eventBroadcast.parseEvent("songChanged", Player.songs, Player.currentIndex);
	},
	saveHistorySongs: function () {
		this.historySongs.push(this.currentIndex);
	},
	initUnplayedSongs: function () {
		this.unplayedSongs = this.songs
			.map((_, index) => index)
			.filter((index) => index != this.currentIndex);
			this.unplayedSongs = this.unplayedSongs.filter(indexSong => indexSong != this.currentIndex);
	},

	updateUnplayedSongs: function() {
		this.unplayedSongs = this.unplayedSongs.filter(indexSong => indexSong != this.currentIndex);
	},
	nextSong: function () {
		this.currentIndex++;
		if (this.currentIndex > this.songs.length - 1) {
			this.currentIndex = 0;
		}
		this.loadCurrentSong();
	},
	randomSong: function () {
		if (this.unplayedSongs.length == 0) {
			this.initUnplayedSongs();
		}
		const randomIndexUnplayed = Math.floor(
			 Math.random() * this.unplayedSongs.length
		   );
		const newIndex = this.unplayedSongs[randomIndexUnplayed];
		this.currentIndex = newIndex;
		this.loadCurrentSong();
		this.updateUnplayedSongs();
	},
	init: function() {
		this.handleEvents();
		eventBroadcast.addListener("songsAdded", (Songs) => {
			Player.songs = Songs.songList;
			Player.loadCurrentSong();
		})
		eventBroadcast.addListener("songTimeUpdated", ({ parsedFrom, progressValue }) => {
			if (parsedFrom === "uiHelper") {
				audio.currentTime = (progressValue / 100) * audio.duration;
			} else {
				return;
			}
		})
		eventBroadcast.addListener("songSelected", (indexSelected) => {
			Player.saveHistorySongs();
			Player.currentIndex = indexSelected;
			Player.loadCurrentSong();
			Player.audio.play();
		})
	}
}