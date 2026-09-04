import os
import shutil

source_dir = "/Users/apple/Downloads/INCLUDE_dataset"
demo_dir = "/Users/apple/Downloads/demo_dataset_v2"
max_videos_per_word = 10

demo_words = [
    "40._I", "41._you",
    "87._hot", "88._cold",
]

os.makedirs(demo_dir, exist_ok=True)
total_copied = 0

for word_folder in demo_words:
    src_path = os.path.join(source_dir, word_folder)
    if not os.path.isdir(src_path):
        print(f"Skipping (not found): {word_folder}")
        continue

    dest_path = os.path.join(demo_dir, word_folder)
    os.makedirs(dest_path, exist_ok=True)

    videos = [f for f in os.listdir(src_path) if f.lower().endswith(('.mp4', '.mov', '.avi'))]
    videos = videos[:max_videos_per_word]

    for v in videos:
        shutil.copy(os.path.join(src_path, v), os.path.join(dest_path, v))
        total_copied += 1

    print(f"Copied {len(videos)} videos for '{word_folder}' (available: had up to {max_videos_per_word} requested)")

print(f"\nDone! {total_copied} total videos copied into {demo_dir}")
