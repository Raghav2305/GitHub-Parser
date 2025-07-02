# utils/output_writer.py

def save_as_text(data: dict, filename: str = "repo_structure.txt"):
    with open(filename, "w", encoding="utf-8") as f:
        f.write("📁 Categorized Repository Files\n\n")
        for category, files in data.items():
            f.write(f"🔹 {category.upper()}:\n")
            if not files:
                f.write("  (none)\n")
            else:
                for file in files:
                    f.write(f"  - {file}\n")
            f.write("\n")
