from repo_scanner.cloneRepo import clone_repo
from repo_scanner.categorizer import get_categorized_files
from repo_scanner.summarizer import generate_summary_with_gemini
from utils.output_writer import save_as_text
from rich.table import Table
from rich.console import Console

def print_table(data: dict):
    console = Console()
    table = Table(title="📦 Categorized Repository Files")

    table.add_column("Category", style="cyan", no_wrap=True)
    table.add_column("Files", style="magenta")

    for category, files in data.items():
        if files:
            file_list = "\n".join(f"  - {file}" for file in files[:10])
            if len(files) > 10:
                file_list += f"\n  ...({len(files) - 10} more)"
        else:
            file_list = "  (none)"

        table.add_row(category, file_list)

    console.print(table)

def scan_repo(url: str):
    path = clone_repo(url)
    categorized_files = get_categorized_files(path)

    print_table(categorized_files)
    save_as_text(categorized_files)

    print("\n🧠 Generating repo summary using Gemini...")
    summary = generate_summary_with_gemini(categorized_files)
    print("\n📄 Summary:\n")
    print(summary)

    with open("repo_summary.txt", "w", encoding="utf-8") as f:
        f.write(summary)

    print("\n✅ Summary saved to 'repo_summary.txt'")

if __name__ == "__main__":
    import sys

    if len(sys.argv) != 2:
        print("❗ Usage: python main.py <github_repo_url>")
    else:
        scan_repo(sys.argv[1])
