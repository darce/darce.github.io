#!/usr/bin/env python3
"""Concept plates for the agent-memory research entries.

Same contract as generate-rotation-diagrams.py: site tokens, hard-edge SVG,
labels only (captions live in the MDX Diagram components).
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


def rows(x, y, w, h, n, *, stroke=INK) -> str:
    step = h / n
    return "".join(
        line(x + 8, y + step * i, x + w - 8, y + step * i, stroke=stroke, width=1)
        for i in range(1, n)
    )


def memory_loop() -> str:
    b = []
    # session A with the context it accumulated
    b.append(box(28, 48, 130, 90))
    b.append(text(93, 68, "session A", anchor="middle"))
    for y in (84, 96, 108):
        b.append(line(48, y, 138, y, stroke=INK2, width=1))
    # the context evaporates
    b.append(line(93, 138, 93, 156, stroke=INK2, width=1, dash="3 3"))
    b.append(box(28, 158, 130, 44, stroke=INK2, dash="4 3"))
    b.append(text(93, 184, "context erased", size=12, fill=INK2, anchor="middle"))
    # the record persists
    b.append(box(195, 150, 150, 110, width=2))
    b.append(rows(195, 150, 150, 110, 5))
    b.append(text(270, 140, "handoff.db", size=14, anchor="middle"))
    b.append(text(270, 280, "one file in the repo", size=12, fill=INK2, anchor="middle"))
    # writes in, packet out
    b.append(text(166, 88, "decisions, findings,", size=12))
    b.append(text(166, 104, "results", size=12))
    b.append(line(158, 112, 190, 166, end="loop-ink"))
    b.append(line(345, 190, 418, 143, stroke=CORAL, width=2, end="loop-coral"))
    b.append(text(388, 186, "small packet", size=12, fill=CORAL))
    # the next session, starting fresh but seeded
    b.append(box(362, 48, 130, 90))
    b.append(text(427, 68, "session B", anchor="middle"))
    return svg(520, 310, "loop", "".join(b))


def memory_layers() -> str:
    bands = [
        (20, 28, 380, "rows: the canonical record", INK, 1.5),
        (50, 112, 320, "exact search: SQL and full text", INK, 1.5),
        (80, 196, 260, "meaning search: embeddings", CORAL, 2),
        (125, 280, 170, "the packet", INK, 1.5),
    ]
    b = []
    for x, y, w, label, stroke, sw in bands:
        b.append(box(x, y, w, 54, stroke=stroke, width=sw))
        ly = 48 if y == 28 else y + 32
        b.append(text(210, ly, label, size=13, anchor="middle"))
    b.append(
        text(210, 354, "what the next session reads", size=12, fill=INK2, anchor="middle")
    )
    for y in (58, 66, 74):
        b.append(line(90, y, 330, y, stroke=INK2, width=1))
    for y1 in (82, 166, 250):
        b.append(line(210, y1, 210, y1 + 26, end="layers-ink"))
    # the card in the index points back to the shelf
    b.append(box(414, 200, 46, 30, stroke=CORAL))
    b.append(
        f'<path d="M437,200 C450,130 442,86 404,62" fill="none" '
        f'stroke="{CORAL}" stroke-width="1.5" marker-end="url(#layers-coral)"/>'
    )
    b.append(text(437, 250, "each vector", size=12, fill=INK2, anchor="middle"))
    b.append(text(437, 264, "points back", size=12, fill=INK2, anchor="middle"))
    b.append(text(437, 278, "to a row", size=12, fill=INK2, anchor="middle"))
    return svg(500, 370, "layers", "".join(b))


def memory_boundary() -> str:
    b = []
    b.append(box(30, 70, 170, 120, width=2))
    b.append(rows(30, 70, 170, 120, 5))
    b.append(text(115, 60, "handoff.db", size=14, anchor="middle"))
    b.append(text(115, 212, "private", size=12, fill=INK2, anchor="middle"))
    # the machine boundary, with one deliberate gate
    b.append(text(280, 20, "machine boundary", size=12, fill=INK2, anchor="middle"))
    b.append(line(280, 32, 280, 108, dash="4 4"))
    b.append(line(280, 154, 280, 288, dash="4 4"))
    # the export path, through the gate
    b.append(line(200, 118, 322, 129, stroke=CORAL, width=2, end="bound-coral"))
    b.append(box(326, 104, 130, 54, stroke=CORAL, width=2))
    b.append(text(391, 135, "bounded export", size=12, fill=CORAL, anchor="middle"))
    b.append(line(456, 131, 500, 131, stroke=CORAL, width=1.5, end="bound-coral"))
    b.append(text(512, 178, "chosen rows only", size=12, fill=INK2, anchor="end"))
    # the path that never opens
    b.append(line(200, 168, 272, 202, end="bound-ink"))
    b.append(line(273, 199, 287, 213, stroke=CORAL, width=2))
    b.append(line(273, 213, 287, 199, stroke=CORAL, width=2))
    b.append(text(296, 207, "never", size=13, fill=CORAL))
    b.append(box(360, 216, 120, 54))
    b.append(text(420, 247, "git / public", size=13, anchor="middle"))
    return svg(520, 300, "bound", "".join(b))


def memory_window() -> str:
    b = []
    y0, pitch, rh = 30, 17, 13
    coral_rows = {2, 9, 10, 11, 12, 13}
    for i in range(16):
        y = y0 + i * pitch
        b.append(box(110, y, 110, rh, width=1))
        if (i + 1) in coral_rows:
            b.append(
                f'<rect x="206" y="{y + 2.5}" width="8" height="8" fill="{CORAL}"/>'
            )
    bottom = y0 + 15 * pitch + rh
    # everything the record holds
    b.append(line(96, y0, 96, bottom))
    b.append(line(96, y0, 104, y0))
    b.append(line(96, bottom, 104, bottom))
    b.append(text(8, 156, "what the", size=13))
    b.append(text(8, 172, "record", size=13))
    b.append(text(8, 188, "holds", size=13))
    # the slice one session sees
    win_bottom = y0 + pitch + rh
    b.append(line(234, y0, 234, win_bottom, stroke=CORAL, width=2))
    b.append(line(226, y0, 234, y0, stroke=CORAL, width=2))
    b.append(line(226, win_bottom, 234, win_bottom, stroke=CORAL, width=2))
    b.append(text(246, 42, "what one", size=13, fill=CORAL))
    b.append(text(246, 58, "session sees", size=13, fill=CORAL))
    # legend
    b.append(f'<rect x="110" y="{bottom + 26}" width="8" height="8" fill="{CORAL}"/>')
    b.append(text(126, bottom + 34, "failed review", size=12, fill=INK2))
    return svg(380, 360, "win", "".join(b))


PLATES = {
    "memory-loop.svg": memory_loop,
    "memory-layers.svg": memory_layers,
    "memory-boundary.svg": memory_boundary,
    "memory-window.svg": memory_window,
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, fn in PLATES.items():
        path = OUT / name
        path.write_text(fn())
        print(f"wrote {path.relative_to(OUT.parents[1])}")


if __name__ == "__main__":
    main()
