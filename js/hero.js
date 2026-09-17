const hero = document.querySelector('.hero');
const heroVideo = hero.querySelector('.hero_video');

// 원본은 playing 직후가 아니라, 재생 중 timeupdate가 발생할 때 숨긴다.
heroVideo.addEventListener('timeupdate', () => {
  if (!heroVideo.paused && !heroVideo.ended && heroVideo.readyState >= 3) {
    hero.classList.add('is-playing');
  }
});

// 영상 로딩에 실패하면 썸네일을 대신 보여준다.
heroVideo.addEventListener('error', () => {
  hero.classList.remove('is-playing');
});

const playbackButton = hero.querySelector('.hero_playback_button');
const pauseIcon = playbackButton.querySelector('.hero_pause_icon');
const playIcon = playbackButton.querySelector('.hero_play_icon');

function updatePlaybackButton() {
  const playing = !heroVideo.paused && !heroVideo.ended && !heroVideo.error;
  playbackButton.setAttribute('aria-label', playing ? '비디오 일시 중지' : '비디오 재생');
  pauseIcon.toggleAttribute('hidden', !playing);
  playIcon.toggleAttribute('hidden', playing);
}

playbackButton.addEventListener('click', async () => {
  if (heroVideo.paused) {
    try {
      await heroVideo.play();
    } catch {
      // 재생이 거절되면 현재 상태에 맞춰 재생 버튼을 유지한다.
    }
  } else {
    heroVideo.pause();
  }
  updatePlaybackButton();
});

['playing', 'pause', 'ended', 'error'].forEach(event => {
  heroVideo.addEventListener(event, updatePlaybackButton);
});
updatePlaybackButton();

// 페이지 진입 시 Enter로 재생·일시정지 버튼을 바로 조작할 수 있게 한다.
playbackButton.focus({ preventScroll: true });
