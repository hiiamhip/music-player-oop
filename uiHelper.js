// render ui and handle event from users
const uiHelper = {
	playlist: document.querySelector('.playlist'),
	player: document.querySelector(".player"),
	heading: document.querySelector("header h2"),
	cdThumb: document.querySelector(".cd-thumb"),
	cd: document.querySelector(".cd"),
	repeatButton: document.querySelector(".btn-repeat"),
	playButton: document.querySelector(".btn-toggle-play"),
	randomButton: document.querySelector(".btn-random"),
	progress: document.querySelector("#progress"),
	cdThumbAnimate: null,
	renderPlaylist: function(songList, currentIndex) {
		const html = songList.map((song, index) => {
			return `
				<div class="song ${
					index == currentIndex ? "active" : ""
				}" data-index="${index}">
					<div class="thumb"
						style="
							background-image: url('${song.image}');
						"
					></div>
					<div class="body">
						<h3 class="title">${song.name}</h3>
						<p class="author">${song.singer}</p>
					</div>
					<div class="option">
						<i class="fas fa-ellipsis-h"></i>
					</div>
				</div>
			`;
		});
		this.playlist.innerHTML = html.join("");
	},
	handleEvents: function() {
		// handle scroll
		const cdWidth = this.cd.offsetWidth;
		document.onscroll = function () {
			const scrollTop =
				window.scrollY ||
				document.documentElement.scrollTop;
			const newCdWidth = cdWidth - scrollTop;

			uiHelper.cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
			uiHelper.cd.style.opacity = newCdWidth / cdWidth;
		};

		// cd animation
		this.cdThumbAnimate = this.cdThumb.animate(
			[{ transform: "rotate(360deg)" }],
			{
				duration: 10000,
				iterations: Infinity,
			}
		);
		this.cdThumbAnimate.pause();

		// progress input/change
		this.progress.addEventListener("input", () => {
			eventBroadcast.parseEvent("songTimeUpdated", {
				parsedFrom: "uiHelper",
				progressValue: uiHelper.progress.value
			})
		})

		// playlist click
		this.playlist.addEventListener("click", (e) => {
			const song = e.target.closest(".song:not(.active)");
			const option = e.target.closest(".option");
			if (option) {
				console.log("option");
			} else {
				if (song) {
					indexSelected = song.dataset.index;
					eventBroadcast.parseEvent("songSelected", indexSelected);
				}
			}
		})
	},
	init: function() {
		this.handleEvents();
		// when songsAdded => render playlist, thumb and title
		eventBroadcast.addListener("songChanged", (songList, currentIndex) => {
			uiHelper.renderPlaylist(songList, currentIndex);
			currentSong = songList[currentIndex];
			uiHelper.heading.innerText = currentSong.name;
			uiHelper.cdThumb.style.backgroundImage = `url("${currentSong.image}")`
		})
		// when playStateChanged => toggle play/pause button
		eventBroadcast.addListener("playStateChanged", ({ isPlaying }) => {
			if (isPlaying) {
				uiHelper.player.classList.add("playing");
				uiHelper.cdThumbAnimate.play();
			} else {
				uiHelper.player.classList.remove("playing");
				uiHelper.cdThumbAnimate.pause();
			}
		})
		// when randomStateChanged => toggle random button
		eventBroadcast.addListener("randomStateChanged", ({ isRandom }) => {
			if (isRandom) {
				uiHelper.randomButton.classList.add("active");
			} else {
				uiHelper.randomButton.classList.remove("active");
			}
		})
		// when repeatStateChanged => toggle repeat button
		eventBroadcast.addListener("repeatStateChanged", ({ isRepeat }) => {
			if (isRepeat) {
				uiHelper.repeatButton.classList.add("active");
			} else {
				uiHelper.repeatButton.classList.remove("active");
			}
		})

		eventBroadcast.addListener("songTimeUpdated", ({ parsedFrom, progressPercent }) => {
			if (parsedFrom === "Player") {
				uiHelper.progress.value = progressPercent;
			} else {
				return;
			}
		})
		
	}
}