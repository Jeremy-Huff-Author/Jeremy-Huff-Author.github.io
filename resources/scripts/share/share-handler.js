const shareButton = document.querySelectorAll('.share-btn')[0];

if(shareButton) {
  shareButton.addEventListener('click', event => {
    event.preventDefault();
    if (/Mobi|Android/i.test(navigator.userAgent) && navigator.canShare && navigator.canShare({ url: window.location.href })) {
      console.log("Native share");
      navigator.share({
        title: document.title,
        text: "Check out this author's site!",
        url: window.location.href
      });
    } else {
      console.log("Fallback share");
      const sharingModalElement = document.getElementById('shareModal');
      const modal = bootstrap.Modal.getOrCreateInstance(sharingModalElement);
      if (modal) {
          console.log("Open Share Modal");
          modal.show();
      }
    }
  });
}

document.querySelectorAll('.share-icon').forEach(el => {
    el.addEventListener('click', event => {
        event.preventDefault();  // Prevent the default '#' navigation
        const platform = el.dataset.platform;  // "reddit", "twitter", etc.
        handleShare(platform);  
        const sharingModalElement = document.getElementById('shareModal');
        const modal = bootstrap.Modal.getInstance(sharingModalElement);
        if (modal) {
            modal.hide();
        }
    });
});

const handleShare= platform => {
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);
  
    switch (platform) {
      case 'reddit':
        shareToReddit(pageUrl, pageTitle);
        break;
      case 'twitter':
        shareToTwitter(pageUrl, pageTitle);
        break;
      case 'facebook':
        shareToFacebook(pageUrl);
        break;
      case 'email':
        shareToEmail(pageUrl, pageTitle);
        break;
      case 'copy':
        copyLink(pageUrl);
        break;
      default:
        console.warn('Unknown sharing platform:', platform);
    }
}

const shareToReddit = (pageUrl, pageTitle) => {
    const redditUrl = `https://www.reddit.com/submit?url=${pageUrl}&title=${pageTitle}`;
    window.open(redditUrl, '_blank', 'noopener,noreferrer');
  }

const shareToTwitter = (pageUrl, pageTitle) => {
    const tweetUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  }

const shareToFacebook = (pageUrl) => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  }

const shareToEmail = (pageUrl, pageTitle) => {
  const subject = encodeURIComponent(`Check this out: ${decodeURIComponent(pageTitle)}`);
  const body = encodeURIComponent(`I wanted to share this author's website:\n\n${decodeURIComponent(pageTitle)}\n${decodeURIComponent(pageUrl)}`);
  const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
  window.location.href = mailtoLink;
}
 

const copyLink = (pageUrl) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(decodeURIComponent(pageUrl))
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch(err => {
          console.error('Clipboard write failed:', err);
          fallbackCopy(pageUrl);
        });
    } else {
      // Fallback for older browsers
      fallbackCopy(pageUrl);
    }
  }
  
const fallbackCopy = (pageUrl) => {
    const textArea = document.createElement('textarea');
    textArea.value = decodeURIComponent(pageUrl);
    textArea.style.position = 'fixed';  // Avoid scrolling to bottom
    textArea.style.left = '-9999px';    // Hide off-screen
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('execCommand copy failed:', err);
      prompt('Copy this URL manually:', decodeURIComponent(pageUrl));
    }
    document.body.removeChild(textArea);
  }
  
  