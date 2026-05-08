"""
Upload videos to VK (VKontakte) using vk_api library
This method is MUCH easier and handles OAuth automatically!
"""
import os
import vk_api
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def upload_to_vk(video_path, description="", title=""):
    """
    Upload video to VK community using vk_api library

    This is the EASY way - vk_api handles all the complex OAuth stuff!

    Args:
        video_path: Path to video file
        description: Video description/caption
        title: Video title

    Returns:
        dict: Upload result with video_id and post_id
    """
    # Get credentials from environment
    access_token = os.getenv('VK_ACCESS_TOKEN')
    group_id = os.getenv('VK_GROUP_ID')

    # Debug info (masked)
    def mask(s): return f"{s[:4]}...{s[-4:]}" if s and len(s) > 8 else ("PLACEHOLDER (***)" if s == "***" else "MISSING")
    print(f"[vk] Group ID: {group_id}")
    print(f"[vk] Access Token: {mask(access_token)}")

    if not access_token or access_token == "***":
        print("âš ï¸ [vk] Access token is missing or a placeholder. Skipping VK upload.")
        return {'status': 'skipped', 'reason': 'missing_credentials'}
    if not group_id or group_id == "***":
        print("âš ï¸ [vk] Group ID is missing or a placeholder. Skipping VK upload.")
        return {'status': 'skipped', 'reason': 'missing_credentials'}

    try:
        # Ensure group_id is positive for vk_api (it handles the negative conversion)
        group_id_clean = str(group_id).lstrip('-')
        group_id_int = int(group_id_clean)
    except ValueError:
        print(f"âš ï¸ [vk] Invalid Group ID format: '{group_id}'. Skipping VK upload.")
        return {'status': 'skipped', 'reason': 'invalid_group_id'}

    print(f"ðŸ‡·ðŸ‡º Starting VK upload using vk_api...")
    print(f"ðŸ“ Video: {video_path}")
    print(f"ðŸ‘¥ Group ID: {group_id}")

    try:
        # Initialize VK session
        print("\nðŸ” Initializing VK session...")
        vk_session = vk_api.VkApi(token=access_token)
        vk = vk_session.get_api()
        upload = vk_api.VkUpload(vk_session)

        # Prepare message
        message = description if description else "ðŸ’ Daily dating advice for you!\n\n#girlsdatingrules #datingrules #datingadvice #relationshiptips"

        # Ensure message is not empty (VK requirement)
        if not message.strip():
            message = "ðŸ’ New video!"

        # Upload video to community
        print("\nðŸ“¤ Uploading video to VK...")
        print("â³ This may take a few minutes depending on video size...")

        # vk_api handles everything: getting upload URL, uploading file, and saving
        video = upload.video(
            video_file=str(video_path),
            name=title or 'Dating Advice Video',
            description=description[:220] if description else '',  # VK 220 char limit
            group_id=group_id_int,
            wallpost=0  # Don't auto-post, we'll do it manually
        )

        print(f"âœ… Video uploaded successfully!")
        print(f"ðŸ“¹ Video ID: {video['video_id']}")
        print(f"ðŸ‘ Owner ID: {video['owner_id']}")

        # Post video to community wall
        print("\nðŸ“ Posting to community wall...")

        attachment = f"video{video['owner_id']}_{video['video_id']}"

        post_result = vk.wall.post(
            owner_id=-group_id_int,  # Negative for community
            from_group=1,  # Post on behalf of community
            message=message,
            attachments=attachment
        )

        post_id = post_result['post_id']
        post_url = f"https://vk.com/wall-{group_id_int}_{post_id}"

        print(f"âœ… Posted to wall successfully!")
        print(f"ðŸ“Œ Post ID: {post_id}")
        print(f"ðŸ”— View post: {post_url}")

        result = {
            'success': True,
            'video_id': video['video_id'],
            'owner_id': video['owner_id'],
            'post_id': post_id,
            'post_url': post_url,
            'message': 'Video uploaded and posted to VK successfully'
        }

        print(f"\nðŸŽ‰ VK Upload Complete!")

        return result

    except vk_api.exceptions.ApiError as e:
        error_msg = f"VK API Error: {e}"
        print(f"\nâŒ {error_msg}")

        # Provide helpful error messages
        if "Access denied" in str(e):
            print("\nðŸ’¡ Solution:")
            print("   Your token doesn't have the required permissions.")
            print("   You need a USER token with 'video', 'wall', and 'groups' permissions.")
            print("   See VK_SIMPLE_SOLUTION.md for the easiest way to get this!")

        raise Exception(error_msg)

    except FileNotFoundError:
        raise Exception(f"Video file not found: {video_path}")

    except Exception as e:
        raise Exception(f"Failed to upload to VK: {e}")


def main():
    """Test VK upload"""
    import sys

    if len(sys.argv) < 2:
        print("Usage: python upload_vk.py <video_path> [description] [title]")
        sys.exit(1)

    video_path = sys.argv[1]
    description = sys.argv[2] if len(sys.argv) > 2 else "Daily dating advice! ðŸ’"
    title = sys.argv[3] if len(sys.argv) > 3 else "Dating Advice"

    try:
        result = upload_to_vk(video_path, description, title)
        print("\nâœ… Success!")
        print(f"Post URL: {result['post_url']}")
    except Exception as e:
        print(f"\nâŒ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
