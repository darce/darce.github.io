#!/usr/bin/env python3
"""Concept plates for The Economics of Remembering.

Same contract as generate-memory-diagrams.py: site tokens, hard-edge SVG,
labels only (captions live in the MDX Diagram components). No absolute
counts in labels; the record's numbers change daily, the shapes do not.
"""

from __future__ import annotations

from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "images" / "research"

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


def sq(x, y, side, fill) -> str:
    return f'<rect x="{x}" y="{y}" width="{side}" height="{side}" fill="{fill}"/>'


def econ_scale() -> str:
    # Absolute log10 axis. Only the two reported aggregates are plotted;
    # unverified task-range endpoints are not invented as coordinates.
    from math import log10

    def at(tokens: float) -> float:
        return 44 + 62 * (log10(tokens) - 2)

    b = [line(at(100), 124, at(1_000_000_000), 124)]
    for exponent in range(2, 10):
        x = at(10 ** exponent)
        b.append(line(x, 118, x, 130, width=1))
    for value, label in [(100, "100"), (10_000, "10k"),
                         (1_000_000, "1M"), (100_000_000, "100M")]:
        b.append(text(at(value), 154, label, size=14, anchor="middle"))
    for value, label, color in [(300, "mean packet ≈300", CORAL),
                                (300_000, "median task ≈300k", INK)]:
        x = at(value)
        b.append(sq(x - 5, 104, 10, color))
        label_y = 56 if value == 300 else 82
        b.append(line(x, 104, x, label_y + 8, stroke=color, width=1))
        b.append(text(x, label_y, label, size=14, fill=color,
                      anchor="start" if value == 300 else "middle"))
    b.append(text(44, 190, "Tokens · logarithmic scale · each tick ×10", size=14))
    b.append(text(44, 218, "Author-reported aggregates; not measured savings", size=14))
    return svg(520, 244, "scale", "".join(b))


def econ_gap() -> str:
    b = []
    panels = [
        (34, "interactive sessions", "packet: supplied", "no audited task meter", True),
        (304, "orchestrated lanes", "meter: audited", "packet: not supplied", False),
    ]
    for px, title, ink_note, coral_note, packet_side in panels:
        cx = px + 91
        b.append(text(cx, 42, title, anchor="middle"))
        b.append(box(px, 54, 182, 158))
        for i in range(8):
            y = 64 + 18 * i
            b.append(box(px + 16, y, 150, 12, width=1))
            if packet_side:
                b.append(sq(px + 22, y + 2, 8, CORAL))
            else:
                b.append(sq(px + 152, y + 2, 8, INK))
        b.append(text(cx, 238, ink_note, size=12, fill=INK2, anchor="middle"))
        b.append(text(cx, 256, coral_note, size=12, fill=CORAL, anchor="middle"))
    # the join that returns nothing
    b.append(line(216, 133, 304, 133, width=1, dash="4 4"))
    b.append(line(254, 127, 266, 139, stroke=CORAL, width=2))
    b.append(line(254, 139, 266, 127, stroke=CORAL, width=2))
    b.append(text(260, 115, "no overlap", size=12, fill=CORAL, anchor="middle"))
    b.append(sq(34, 278, 8, CORAL))
    b.append(text(50, 286, "packet injected", size=12, fill=INK2))
    b.append(sq(304, 278, 8, INK))
    b.append(text(320, 286, "tokens metered", size=12, fill=INK2))
    return svg(520, 300, "gap", "".join(b))


def econ_design() -> str:
    stages = [
        (20, 30, "A/A pairs", ["two cold runs", "estimate variation"], INK),
        (230, 30, "content probe", ["relevant vs", "unrelated packet"], INK),
        (230, 218, "paired trial", ["memory vs cold", "randomized order"], CORAL),
        (20, 218, "readout", ["token effect", "+ blinded quality"], INK),
    ]
    b = []
    for i, (x, y, title, sub, stroke) in enumerate(stages):
        cx = x + 85
        b.append(box(x, y, 170, 104, stroke=stroke, width=2 if stroke == CORAL else 1.5))
        b.append(text(cx, y + 30, f"{i + 1}. {title}", size=15, fill=stroke, anchor="middle"))
        for j, label in enumerate(sub):
            b.append(text(cx, y + 58 + 22 * j, label, size=14, fill=INK2, anchor="middle"))
    b.append(line(190, 82, 226, 82, end="des-ink"))
    b.append(line(315, 134, 315, 214, end="des-ink"))
    b.append(line(230, 270, 194, 270, end="des-ink"))
    b.append(text(210, 366, "proposed sequence; no trial result yet", size=14, fill=INK2, anchor="middle"))
    return svg(420, 390, "des", "".join(b))


PLATES = {
    "econ-scale.svg": econ_scale,
    "econ-gap.svg": econ_gap,
    "econ-design.svg": econ_design,
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, fn in PLATES.items():
        path = OUT / name
        path.write_text(fn())
        print(f"wrote {path.relative_to(OUT.parents[1])}")


if __name__ == "__main__":
    main()
