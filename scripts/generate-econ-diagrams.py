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
    # log ruler: one decade per 60px, axis spans seven decades
    x0, step = 40, 60

    def at(d: float) -> float:
        return x0 + step * d

    b = []
    b.append(line(x0, 120, at(7), 120))
    for i in range(8):
        b.append(line(at(i), 114, at(i), 126, width=1))
    # the packet, half a decade in
    b.append(sq(at(0.5) - 5, 102, 10, CORAL))
    b.append(line(at(0.5), 102, at(0.5), 96, stroke=CORAL, width=1))
    b.append(text(at(0.5), 88, "the packet", size=12, fill=CORAL, anchor="middle"))
    # a typical task, three decades above the packet
    b.append(sq(at(3.5) - 5, 102, 10, INK))
    b.append(line(at(3.5), 102, at(3.5), 96, width=1))
    b.append(text(at(3.5), 88, "a typical task", size=12, anchor="middle"))
    # the observed spread of tasks
    b.append(line(at(1), 140, at(6), 140, width=1))
    b.append(line(at(1), 134, at(1), 140, width=1))
    b.append(line(at(6), 134, at(6), 140, width=1))
    b.append(text(at(3.5), 160, "tasks, smallest to largest", size=12, fill=INK2, anchor="middle"))
    b.append(text(x0, 190, "each step to the right is ten times the tokens", size=11, fill=INK2))
    return svg(520, 210, "scale", "".join(b))


def econ_gap() -> str:
    b = []
    panels = [
        (34, "interactive sessions", "packet: always", "meter: unreliable", True),
        (304, "orchestrated lanes", "meter: audited", "packet: never", False),
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
        ("A/A pairs", ["measure pair", "noise"], "sets N", INK),
        ("content probe", ["relevant vs", "unrelated"], "validates content", INK),
        ("paired trial", ["memory vs cold,", "randomized"], "the experiment", CORAL),
        ("readout", ["token effect +", "blinded quality"], "effect interval", INK),
    ]
    b = []
    for i, (title, sub, foot, stroke) in enumerate(stages):
        x = 20 + i * 128
        cx = x + 50
        b.append(box(x, 60, 100, 64, stroke=stroke, width=2 if stroke == CORAL else 1.5))
        b.append(text(cx, 86, title, size=12, fill=stroke, anchor="middle"))
        for j, s in enumerate(sub):
            b.append(text(cx, 103 + 13 * j, s, size=10, fill=INK2, anchor="middle"))
        foot_fill = CORAL if stroke == CORAL else INK2
        b.append(text(cx, 152, foot, size=10, fill=foot_fill, anchor="middle"))
        if i < 3:
            b.append(line(x + 100, 92, x + 126, 92, end="des-ink"))
    return svg(520, 200, "des", "".join(b))


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
