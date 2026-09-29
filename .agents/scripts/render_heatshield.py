import fitz
from pathlib import Path
pdf = Path("attached_assets/HeatShield-X_(1).pdf_(1)_1789240101832.pdf")
out = Path(".agents/outputs/heatshield-pages")
out.mkdir(parents=True, exist_ok=True)
doc = fitz.open(pdf)
print("pages", doc.page_count)
for i, page in enumerate(doc):
    pix = page.get_pixmap(matrix=fitz.Matrix(1.6, 1.6), alpha=False)
    dest = out / f"page-{i+1}.png"
    pix.save(dest)
    print(dest)
