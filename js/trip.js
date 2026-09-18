// 모델 카드: 모바일 스와이프, 페이지 선택, 키보드 탐색.
const tripTrack = document.querySelector('.tripbox');
const tripCards = [...document.querySelectorAll('.trip_item')];
const tripDots = [...document.querySelectorAll('.trip_controls button')];
const tripMobile = matchMedia('(max-width: 759px)');
let tripIndex = 0;
function selectTrip(index) {
  if (!tripMobile.matches) return;
  index = Math.max(0, Math.min(tripCards.length - 1, index));
  const card = tripCards[index];
  tripTrack.scrollTo({
    left: card.offsetLeft - (tripTrack.clientWidth - card.offsetWidth) / 2,
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
  });
}
tripDots.forEach((button, index) => button.addEventListener('click', () => selectTrip(index)));
tripTrack.addEventListener('scroll', () => {
  const middle = tripTrack.scrollLeft + tripTrack.clientWidth / 2;
  tripIndex = tripCards.reduce((best, card, index) =>
    Math.abs(card.offsetLeft + card.offsetWidth / 2 - middle) <
    Math.abs(tripCards[best].offsetLeft + tripCards[best].offsetWidth / 2 - middle) ? index : best, 0);
  tripDots.forEach((button, index) => button.setAttribute('aria-current', String(index === tripIndex)));
}, { passive: true });
tripTrack.addEventListener('keydown', event => {
  if (!tripMobile.matches || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  selectTrip(event.key === 'Home' ? 0 : event.key === 'End' ? 5 : tripIndex + (event.key === 'ArrowRight' ? 1 : -1));
});
function updateTripLayout() {
  tripTrack.tabIndex = tripMobile.matches ? 0 : -1;
  // 모바일에서 넘긴 가로 위치가 데스크톱 카드 전체를 밀지 않도록 초기화한다.
  tripTrack.scrollLeft = 0;
}
tripMobile.addEventListener('change', updateTripLayout);
updateTripLayout();

// 공식 CarRange의 스크롤 기준: 1000px 미만 3%/40%, 이상 5%/20%.
const tripSection = document.querySelector('.trip');
let tripScrollFrame = 0;
function updateTripTheme() {
  tripScrollFrame = 0;
  const { top, bottom, height } = tripSection.getBoundingClientRect();
  const smallScreen = window.innerWidth < 1000;
  const dark = top <= height * (smallScreen ? .03 : .05)
    && bottom >= height * (smallScreen ? .4 : .2);
  if (dark === document.body.classList.contains('trip_dark')) return;
  document.body.classList.toggle('trip_dark', dark);
  document.body.classList.toggle('trip_light', !dark);
}
function scheduleTripTheme() {
  if (!tripScrollFrame) tripScrollFrame = requestAnimationFrame(updateTripTheme);
}
window.addEventListener('scroll', scheduleTripTheme, { passive: true });
window.addEventListener('resize', scheduleTripTheme);
let tripResizeTimer;
window.addEventListener('resize', () => {
  tripTrack.classList.add('trip_resizing');
  clearTimeout(tripResizeTimer);
  tripResizeTimer = setTimeout(() => tripTrack.classList.remove('trip_resizing'), 150);
});
new ResizeObserver(scheduleTripTheme).observe(tripSection);
updateTripTheme();

const tripTitle = document.querySelector('.trip-title');
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  tripTitle.classList.add('trip_title_pending');
  const titleObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      tripTitle.classList.add('trip_title_visible');
      titleObserver.disconnect();
    }
  });
  titleObserver.observe(tripTitle);
}

// 원본처럼 300ms 호버 후 재생하고, 실제 재생이 시작된 뒤 포스터를 숨긴다.
const tripHover = matchMedia('(min-width: 760px) and (hover: hover)');
tripCards.forEach(card => {
  const video = card.querySelector('.trip_video');
  let timer;
  let active = false;
  video.muted = true;
  const stop = () => {
    active = false;
    clearTimeout(timer);
    video.pause();
    card.classList.remove('is_video_playing');
  };
  card.addEventListener('mouseenter', () => {
    if (!tripHover.matches) return;
    active = true;
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!active) return;
      video.currentTime = 0;
      video.play().catch(() => card.classList.remove('is_video_playing'));
    }, 300);
  });
  card.addEventListener('mouseleave', stop);
  video.addEventListener('playing', () => {
    if (active && tripHover.matches && !document.hidden) card.classList.add('is_video_playing');
    else stop();
  });
  video.addEventListener('error', stop);
  tripHover.addEventListener('change', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
});
