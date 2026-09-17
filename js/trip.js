// 정지 이미지 카드: 모바일 스와이프, 페이지 선택, 키보드 탐색.
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
function updateTripLayout() { tripTrack.tabIndex = tripMobile.matches ? 0 : -1; }
tripMobile.addEventListener('change', updateTripLayout);
updateTripLayout();
