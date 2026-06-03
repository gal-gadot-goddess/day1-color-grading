import os
import sys
import json
import hashlib
from pathlib import Path

# Add the root directory to sys.path
root_dir = Path(__file__).parent.parent
sys.path.append(str(root_dir))

from upload.upload_instagram import upload_to_instagram
from upload.upload_facebook import upload_to_facebook, upload_to_facebook_story
from upload.upload_threads import upload_to_threads
from upload.upload_twitter import upload_to_twitter
from upload.upload_to_youtube import upload_to_youtube
from upload.upload_vk import upload_to_vk
from upload.upload_telegram import upload_to_telegram

HISTORY_FILE = Path("upload_history.json")

def load_history():
    if not HISTORY_FILE.exists():
        return {}
    try:
        with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return {}

def save_history(history):
    with open(HISTORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(history, f, indent=2)

def get_content_hash(topic):
    return hashlib.md5(topic.encode('utf-8')).hexdigest()

def is_uploaded(history, content_hash, platform):
    if content_hash not in history:
        return False
    return platform in history[content_hash]

def mark_uploaded(history, content_hash, platform):
    if content_hash not in history:
        history[content_hash] = []
    if platform not in history[content_hash]:
        history[content_hash].append(platform)
    save_history(history)

def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/unified_uploader.py <video_path>")
        sys.exit(1)

    video_path = Path(sys.argv[1])
    metadata_path = Path('metadata.json')

    if not video_path.exists():
        print(f"âŒ Video not found at {video_path}")
        return

    if not metadata_path.exists():
        print("âŒ metadata.json not found. Run generate_ai_metadata.js first.")
        sys.exit(1)

    with open(metadata_path, 'r', encoding='utf-8') as f:
        metadata = json.load(f)

    title = metadata.get('title', 'Algorithm Visualization')
    ig_caption = metadata.get('ig_caption', '')
    fb_caption = metadata.get('fb_caption', '')
    threads_caption = metadata.get('threads_caption', '')
    yt_description = metadata.get('yt_description', '')
    hashtags = metadata.get('hashtags', '')

    if isinstance(hashtags, list):
        hashtags = " ".join(hashtags)

    instagram_full = f"{title}\n\n{ig_caption}\n\n{hashtags}"
    facebook_full = f"{title}\n\n{fb_caption}\n\n{hashtags}"
    threads_full = f"{title}\n\n{threads_caption}\n\n{hashtags}"

    content_hash = get_content_hash(f"UnifiedUpload_{title}")
    history = load_history()

    thumb_path = video_path.with_suffix('.jpg')
    has_thumb = thumb_path.exists()

    print(f"\n{'='*40}")
    print(f"ðŸš€ PUBLISHING VIZ: {title}")
    print(f"{'='*40}")
    print(f"ðŸ“‚ Video Path: {video_path}")
    if has_thumb:
        print(f"ðŸ–¼ï¸ Thumbnail Path: {thumb_path}")
    print(f"ðŸ”‘ Content Hash: {content_hash}\n")

    # 1. Instagram Reel
    if not is_uploaded(history, content_hash, 'instagram_reel'):
        print("ðŸ“¸ Starting Instagram Reel...")
        try:
            upload_to_instagram(str(video_path), instagram_full, is_story=False)
            mark_uploaded(history, content_hash, 'instagram_reel')
            print("âœ… Instagram Reel Success")
        except Exception as e: print(f"âŒ Instagram Reel failed: {e}")
    else: print("â­ï¸ Skipping Instagram Reel")

    # 2. Instagram Story
    if not is_uploaded(history, content_hash, 'instagram_story'):
        print("ðŸ“¸ Starting Instagram Story...")
        try:
            upload_to_instagram(str(video_path), title, is_story=True)
            mark_uploaded(history, content_hash, 'instagram_story')
            print("âœ… Instagram Story Success")
        except Exception as e: print(f"âŒ Instagram Story failed: {e}")
    else: print("â­ï¸ Skipping Instagram Story")

    # 3. Facebook Reel
    if not is_uploaded(history, content_hash, 'facebook_reel'):
        print("ðŸ“˜ Starting Facebook Reel...")
        try:
            upload_to_facebook(str(video_path), facebook_full, title=title[:100], thumb_path=str(thumb_path) if has_thumb else None)
            mark_uploaded(history, content_hash, 'facebook_reel')
            print("âœ… Facebook Reel Success")
        except Exception as e: print(f"âŒ Facebook Reel failed: {e}")
    else: print("â­ï¸ Skipping Facebook Reel")

    # 4. Facebook Story
    if not is_uploaded(history, content_hash, 'facebook_story'):
        print("ðŸ“˜ Starting Facebook Story...")
        try:
            res = upload_to_facebook_story(str(video_path))
            if isinstance(res, dict) and res.get('status') == 'success':
                mark_uploaded(history, content_hash, 'facebook_story')
                print("âœ… Facebook Story Success")
            else:
                # Some versions of script return string on success. Marking if no exception
                mark_uploaded(history, content_hash, 'facebook_story')
                print(f"âœ… Facebook Story Success (or warn: {res})")
        except Exception as e: print(f"âŒ Facebook Story failed: {e}")
    else: print("â­ï¸ Skipping Facebook Story")

    # 5. Twitter / X
    if not is_uploaded(history, content_hash, 'twitter'):
        print("ðŸ¦ Starting Twitter...")
        try:
            short_caption = f"{title}\n\n{hashtags}"
            if len(short_caption) > 280:
                short_caption = short_caption[:277] + "..."
            upload_to_twitter(str(video_path), short_caption)
            mark_uploaded(history, content_hash, 'twitter')
            print("âœ… Twitter Success")
        except Exception as e: print(f"âŒ Twitter failed: {e}")
    else: print("â­ï¸ Skipping Twitter")

    # 6. YouTube Shorts
    if not is_uploaded(history, content_hash, 'youtube'):
        print("ðŸŽ¥ Starting YouTube Shorts...")
        try:
            # extract clean tags list
            tags_list = [t.strip('#') for t in hashtags.split()] if hashtags else []
            upload_to_youtube(str(video_path), title[:100], yt_description, tags_list)
            mark_uploaded(history, content_hash, 'youtube')
            print("âœ… YouTube Success")
        except Exception as e: print(f"âŒ YouTube failed: {e}")
    else: print("â­ï¸ Skipping YouTube")

    # 7. Threads
    if not is_uploaded(history, content_hash, 'threads'):
        print("ðŸ§µ Starting Threads...")
        try:
            upload_to_threads(str(video_path), threads_full)
            mark_uploaded(history, content_hash, 'threads')
            print("âœ… Threads Success")
        except Exception as e: print(f"âŒ Threads failed: {e}")
    else: print("â­ï¸ Skipping Threads")

    # 8. VK
    if not is_uploaded(history, content_hash, 'vk'):
        print("ðŸ‡·ðŸ‡º Starting VK...")
        try:
            upload_to_vk(str(video_path), facebook_full, title=title[:128])
            mark_uploaded(history, content_hash, 'vk')
            print("âœ… VK Success")
        except Exception as e: print(f"âŒ VK failed: {e}")
    else: print("â­ï¸ Skipping VK")

    # 9. Telegram
    if not is_uploaded(history, content_hash, 'telegram'):
        print("âœˆï¸ Starting Telegram...")
        try:
            res = upload_to_telegram(str(video_path), f"<b>{title}</b>\n\n{yt_description}")
            if isinstance(res, dict) and res.get('status') != 'skipped':
                mark_uploaded(history, content_hash, 'telegram')
                print("âœ… Telegram Success")
            elif res is None:
                # sometimes it returns none on success
                mark_uploaded(history, content_hash, 'telegram')
                print("âœ… Telegram Success")
            else:
                 print(f"âŒ Telegram failed (skipped): {res}")
        except Exception as e: print(f"âŒ Telegram failed: {e}")
    else: print("â­ï¸ Skipping Telegram")

    print("\nâœ… All platforms processed!")

if __name__ == "__main__":
    main()
