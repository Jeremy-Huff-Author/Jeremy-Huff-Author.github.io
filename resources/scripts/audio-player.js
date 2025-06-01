const audio = document.getElementById('audio-player');

if (audio) {
audio.addEventListener('play', function() {
    gtag('event', 'audio_play', {
    'event_category': 'Media',
    'event_label': 'Main Audio Player',
    'value': 1
    });
});
}