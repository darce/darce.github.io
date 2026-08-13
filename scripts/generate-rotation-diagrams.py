#!/usr/bin/env python3
"""Generate rotation-matrix article diagrams via workbay-canvas first-party SVG.

Uses ``workbay_canvas_mcp.models.Canvas`` + ``to_svg`` (the same emitter as
``export_canvas(format=svg)``). Tokens are remapped to darce.xyz after export
so the diagrams share the site field (cool paper / ink) and drop the canvas
default radius.

Run from the repo root:

    PYTHONPATH=../agentic-protocol-monorepo/packages/mcp-workbay-canvas/src \\
      python3 scripts/generate-rotation-diagrams.py
"""

from __future__ import annotations

import sys
from pathlib import Path

CANVAS_SRC = (
    Path(__file__).resolve().parents[2]
    / "agentic-protocol-monorepo"
    / "packages"
    / "mcp-workbay-canvas"
    / "src"
)
if CANVAS_SRC.is_dir():
    sys.path.insert(0, str(CANVAS_SRC))

from workbay_canvas_mcp.export_svg import to_svg  # noqa: E402
from workbay_canvas_mcp.models import Canvas, Edge, EdgeKind, Node, NodeKind  # noqa: E402

OUT_DIR = Path(__file__).resolve().parents[1] / "public" / "images" / "research"

# Site tokens (styles/palettes.scss after the ADLC transplant).
_RESTYLE = (
    ("#ffffff", "#e7eaef"),
    ("#f7f7f7", "#f2f4f7"),
    ("#1a1a1a", "#171920"),
    ("#666666", "#464c5c"),
    ("#cccccc", "#171920"),
    ('rx="8"', 'rx="0"'),
    ('rx="18"', 'rx="0"'),
    ('font-family="sans-serif"', 'font-family="ui-monospace, GeistMonoVariableVF, monospace"'),
)


def _n(id: str, kind: NodeKind, label: str, x: float, y: float) -> Node:
    return Node(id=id, kind=kind, label=label, x=x, y=y)


def _e(id: str, source: str, target: str, label: str | None = None) -> Edge:
    return Edge(id=id, kind=EdgeKind.FREEFORM, source=source, target=target, label=label)


def restyle(svg: str) -> str:
    for old, new in _RESTYLE:
        svg = svg.replace(old, new)
    return svg


def write(canvas: Canvas, name: str) -> Path:
    path = OUT_DIR / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(restyle(to_svg(canvas)), encoding="utf-8")
    return path


def canvas_axes() -> Canvas:
    """One axis at a time: each rotation preserves its axis."""
    return Canvas(
        canvas_ref="diagram:rotation-axes",
        nodes=[
            _n("rx", NodeKind.TASK, "Rx(θ)  x unchanged", 120, 40),
            _n("rxp", NodeKind.FREEFORM, "yz plane rotates", 380, 40),
            _n("ry", NodeKind.TASK, "Ry(θ)  y unchanged", 120, 120),
            _n("ryp", NodeKind.FREEFORM, "xz plane rotates", 380, 120),
            _n("rz", NodeKind.TASK, "Rz(θ)  z unchanged", 120, 200),
            _n("rzp", NodeKind.FREEFORM, "xy plane rotates", 380, 200),
        ],
        edges=[
            _e("e-rx", "rx", "rxp", "leaves x"),
            _e("e-ry", "ry", "ryp", "leaves y"),
            _e("e-rz", "rz", "rzp", "leaves z"),
        ],
    )


def canvas_compose() -> Canvas:
    """Order matters: Rx then Ry ≠ Ry then Rx."""
    return Canvas(
        canvas_ref="diagram:rotation-compose",
        nodes=[
            _n("p", NodeKind.SLICE, "(x, y, z)", 80, 120),
            _n("rx1", NodeKind.TASK, "Rx", 220, 50),
            _n("ry1", NodeKind.TASK, "Ry", 360, 50),
            _n("pxy", NodeKind.FINDING, "Pxy  Rx then Ry", 520, 50),
            _n("ry2", NodeKind.TASK, "Ry", 220, 190),
            _n("rx2", NodeKind.TASK, "Rx", 360, 190),
            _n("pyx", NodeKind.FINDING, "Pyx  Ry then Rx", 520, 190),
            _n("note", NodeKind.DECISION, "not commutative", 360, 120),
        ],
        edges=[
            _e("a1", "p", "rx1"),
            _e("a2", "rx1", "ry1"),
            _e("a3", "ry1", "pxy"),
            _e("b1", "p", "ry2"),
            _e("b2", "ry2", "rx2"),
            _e("b3", "rx2", "pyx"),
            _e("neq", "pxy", "pyx", "≠"),
        ],
    )


def canvas_pipeline() -> Canvas:
    """Visible pipeline from the article's closing list."""
    return Canvas(
        canvas_ref="diagram:rotation-pipeline",
        nodes=[
            _n("pt", NodeKind.SLICE, "1. 3D point", 80, 80),
            _n("rot", NodeKind.TASK, "2. Rx · Ry · Rz", 280, 80),
            _n("proj", NodeKind.DECISION, "3. project  x/(d−z)", 500, 80),
            _n("css", NodeKind.SLICE, "4. CSS translate3d", 720, 80),
        ],
        edges=[
            _e("e1", "pt", "rot", "TypeScript"),
            _e("e2", "rot", "proj", "still 3D"),
            _e("e3", "proj", "css", "screen"),
        ],
    )


def canvas_focal() -> Canvas:
    """Perspective: viewer, distance d, plane, and the divide by (d − z)."""
    return Canvas(
        canvas_ref="diagram:focal-plane",
        nodes=[
            _n("eye", NodeKind.WORKER, "viewer", 80, 140),
            _n("d", NodeKind.FREEFORM, "distance d", 260, 60),
            _n("plane", NodeKind.TASK, "projection plane", 260, 140),
            _n("pt", NodeKind.SLICE, "point (x, y, z)", 480, 60),
            _n("screen", NodeKind.FINDING, "screen (x′, y′)", 480, 220),
            _n("formula", NodeKind.DECISION, "x′ = x / (d − z)", 260, 260),
        ],
        edges=[
            _e("e-d", "eye", "plane", "d"),
            _e("e-ray", "pt", "plane", "ray"),
            _e("e-hit", "plane", "screen", "hits plane"),
            _e("e-f", "pt", "formula", "farther → smaller"),
            _e("e-out", "formula", "screen"),
        ],
    )


def main() -> None:
    written = [
        write(canvas_axes(), "rotation-axes.svg"),
        write(canvas_compose(), "rotation-compose.svg"),
        write(canvas_pipeline(), "rotation-pipeline.svg"),
        write(canvas_focal(), "rotation-focal-plane.svg"),
    ]
    for path in written:
        print(path.relative_to(Path(__file__).resolve().parents[1]))


if __name__ == "__main__":
    main()
