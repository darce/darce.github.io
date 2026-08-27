#!/usr/bin/env python3
"""Concept plates for the WorkBay project page.

Same contract as generate-memory-diagrams.py: site tokens, hard-edge SVG,
labels only (captions live in the MDX Diagram components).
"""

from __future__ import annotations

from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "images" / "projects"

PAPER = "#ffffff"
INK = "#171920"
INK2 = "#464c5c"
CORAL = "#d9253f"
FONT = "ui-monospace, GeistMonoVariableVF, Helvetica, monospace"


def svg(w: float, h: float, prefix: str, body: str) -> str:
    defs = (
        "<defs>"
        f'<marker id="{prefix}-ink" viewBox="0 0 10 10" refX="9" refY="5" '
        'markerWidth="6.5" markerHeight="6.5" orient="auto">'
        f'<path d="M0,0 L10,5 L0,10 z" fill="{INK}"/></marker>'
        f'<marker id="{prefix}-coral" viewBox="0 0 10 10" refX="9" refY="5" '
        'markerWidth="6.5" markerHeight="6.5" orient="auto">'
        f'<path d="M0,0 L10,5 L0,10 z" fill="{CORAL}"/></marker>'
        "</defs>"
    )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
        f'width="{w}" height="{h}" role="img">\n'
        f'<rect x="0" y="0" width="{w}" height="{h}" fill="{PAPER}"/>\n'
        f"{defs}\n{body}\n</svg>\n"
    )


def text(x, y, s, *, size=13, fill=INK, anchor="start") -> str:
    return (
        f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" '
        f'fill="{fill}" text-anchor="{anchor}">{s}</text>'
    )


def line(x1, y1, x2, y2, *, stroke=INK, width=1.5, end=None, dash=None) -> str:
    extra = f' marker-end="url(#{end})"' if end else ""
    extra += f' stroke-dasharray="{dash}"' if dash else ""
    return (
        f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" '
        f'stroke="{stroke}" stroke-width="{width}" fill="none"{extra}/>'
    )


def box(x, y, w, h, *, stroke=INK, width=1.5, dash=None) -> str:
    extra = f' stroke-dasharray="{dash}"' if dash else ""
    return (
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="none" '
        f'stroke="{stroke}" stroke-width="{width}"{extra}/>'
    )


def workbay_journey() -> str:
    b = []
    stages = ["plan", "task", "work", "review", "gate", "merge"]
    bw, bh, gap, y = 84, 44, 26, 96
    x = 24
    for i, s in enumerate(stages):
        coral = s == "gate"
        b.append(box(x, y, bw, bh, stroke=CORAL if coral else INK, width=2 if coral else 1.5))
        b.append(text(x + bw / 2, y + 27, s, anchor="middle", fill=CORAL if coral else INK))
        if i < len(stages) - 1:
            b.append(line(x + bw, y + bh / 2, x + bw + gap - 4, y + bh / 2, end="jny-ink"))
        x += bw + gap
    # sessions end mid-journey; the state does not
    for sx in (24 + bw + gap / 2, 24 + 3 * (bw + gap) - gap / 2):
        b.append(line(sx, 34, sx, 200, stroke=INK2, width=1, dash="4 4"))
    b.append(text(24, 24, "sessions end", size=12, fill=INK2))
    b.append(text(24, 40, "mid-journey", size=12, fill=INK2))
    # findings feed the gate from below
    fb_x, fb_y = 24 + 3 * (bw + gap), 180
    b.append(box(fb_x - 10, fb_y, bw + 20, bh))
    b.append(text(fb_x + bw / 2, fb_y + 20, "findings", anchor="middle", size=12))
    b.append(text(fb_x + bw / 2, fb_y + 35, "persist", anchor="middle", size=12))
    gate_cx = 24 + 4 * (bw + gap) + bw / 2
    b.append(line(fb_x + bw + 12, fb_y + bh / 2, gate_cx, y + bh + 6, stroke=CORAL, width=1.5, end="jny-coral"))
    # the record underneath, spanning every stage
    b.append(line(24, 236, x - gap, 236, width=2))
    b.append(text((24 + x - gap) / 2, 258, "one durable record under every stage", size=12, fill=INK2, anchor="middle"))
    return svg(700, 276, "jny", "".join(b))


def workbay_uxmap() -> str:
    b = []
    # inventory in, artifacts out
    b.append(box(24, 92, 160, 96))
    b.append(text(104, 118, "inventory", anchor="middle"))
    for i, s in enumerate(["jobs", "screens", "states", "flows"]):
        b.append(text(104, 136 + i * 14, s, size=11, fill=INK2, anchor="middle"))
    b.append(line(184, 140, 232, 140, end="uxm-ink"))
    b.append(box(236, 116, 150, 48))
    b.append(text(311, 136, "deterministic", size=12, anchor="middle"))
    b.append(text(311, 152, "render", size=12, anchor="middle"))
    for i, s in enumerate(["ASCII wireframes", "Mermaid flows", "Markdown tables"]):
        yy = 74 + i * 52
        b.append(line(386, 140, 430, yy + 20, end="uxm-ink", width=1))
        b.append(box(434, yy, 172, 40))
        b.append(text(520, yy + 24, s, size=12, anchor="middle"))
    # artifacts meet the ruler before any code exists
    b.append(line(520, 222, 520, 262, stroke=CORAL, width=2, end="uxm-coral"))
    b.append(box(384, 266, 222, 44, stroke=CORAL, width=2))
    b.append(text(495, 292, "critique by canon rule ID", size=12, fill=CORAL, anchor="middle"))
    b.append(text(24, 300, "all before implementation", size=12, fill=INK2))
    return svg(640, 330, "uxm", "".join(b))


PLATES = {
    "workbay-journey.svg": workbay_journey,
    "workbay-uxmap.svg": workbay_uxmap,
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, fn in PLATES.items():
        path = OUT / name
        path.write_text(fn())
        print(f"wrote {path.relative_to(OUT.parents[1])}")


if __name__ == "__main__":
    main()
