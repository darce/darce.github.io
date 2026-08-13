#!/usr/bin/env python3
"""Geometry plates for the rotation-matrices article.

Manim-shaped architecture (Scene / Mobject / Camera / copy+rotate), not
the Manim library. Site tokens, hard-edge SVG. No focal-length F.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "images" / "research"

PAPER = "#ffffff"
INK = "#171920"
INK2 = "#464c5c"
CORAL = "#d9253f"
BLUE = "#3c00f7"
FONT = "ui-monospace, GeistMonoVariableVF, Helvetica, monospace"
# Equations: serif + italic variables (ISO 80000 / AMS). Words stay roman.
MATH = "Cambria Math, 'STIX Two Math', 'Times New Roman', Times, serif"

# Stroke hierarchy — subject louder than axes (Manim habit, site tokens).
SW_AXIS = 1.5
SW_SHAPE = 2.3
SW_ARC = 2.8
SW_BRACE = 1.8


# ---------------------------------------------------------------------------
# Camera
# ---------------------------------------------------------------------------


@dataclass
class Camera:
    """Projects world points to SVG. One camera per scene; frames share it."""

    ox: float
    oy: float
    scale: float
    kind: str = "zup"  # zup | pinhole | flat

    def project(self, p: tuple) -> tuple[float, float]:
        if self.kind == "flat":
            x, y = p[0], p[1]
            return (self.ox + x, self.oy - y)
        if self.kind == "pinhole":
            x, y, z = p
            return (
                self.ox + 0.88 * self.scale * z + 0.52 * self.scale * y,
                self.oy - 0.92 * self.scale * x - 0.38 * self.scale * z + 0.30 * self.scale * y,
            )
        x, y, z = p
        return (
            self.ox + self.scale * x + 0.55 * self.scale * y,
            self.oy - self.scale * z + 0.32 * self.scale * y,
        )

    def shifted(self, dx: float) -> Camera:
        return Camera(self.ox + dx, self.oy, self.scale, self.kind)


# ---------------------------------------------------------------------------
# SVG primitives
# ---------------------------------------------------------------------------


def _svg(
    w: float,
    h: float,
    body: str,
    *,
    x: float = 0,
    y: float = 0,
    width: float | None = None,
    height: float | None = None,
) -> str:
    ow = width if width is not None else w
    oh = height if height is not None else h
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x:.1f} {y:.1f} {w:.1f} {h:.1f}" '
        f'width="{ow:.0f}" height="{oh:.0f}" role="img">\n'
        f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" fill="{PAPER}"/>\n'
        f"{body}\n</svg>\n"
    )


def _crop(pts: list, pad: float = 22) -> tuple[float, float, float, float]:
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    x0, y0 = min(xs) - pad, min(ys) - pad
    return x0, y0, max(xs) - x0 + pad, max(ys) - y0 + pad


def _defs(prefix: str) -> str:
    parts = []
    for name, color in (("ink", INK), ("coral", CORAL), ("blue", BLUE)):
        parts.append(
            f'<marker id="{prefix}-{name}" viewBox="0 0 10 10" refX="9" refY="5" '
            f'markerWidth="6.5" markerHeight="6.5" orient="auto">'
            f'<path d="M0,0 L10,5 L0,10 z" fill="{color}"/>'
            f"</marker>"
        )
    return "<defs>\n" + "\n".join(parts) + "\n</defs>"


def _text(x, y, s, *, size=13, fill=INK, anchor="start", italic=False, math=False) -> str:
    face = MATH if math else FONT
    ital = ' font-style="italic"' if italic else ""
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="{face}" font-size="{size}" '
        f'fill="{fill}" text-anchor="{anchor}"{ital}>{s}</text>'
    )


def _line(x1, y1, x2, y2, *, stroke=INK, width=1.2, end=None, dash=None) -> str:
    extra = ""
    if end:
        extra += f' marker-end="url(#{end})"'
    if dash:
        extra += f' stroke-dasharray="{dash}"'
    return (
        f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
        f'stroke="{stroke}" stroke-width="{width}" fill="none"{extra}/>'
    )


def _circle(x, y, r, *, fill=INK) -> str:
    return f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="{fill}"/>'


def _eq(x, y, parts, *, size=16, anchor="start") -> str:
    """Left-aligned displayed math. parts: (text, color, italic?)."""
    inner = []
    for item in parts:
        s, c = item[0], item[1]
        italic = item[2] if len(item) > 2 else False
        st = ' font-style="italic"' if italic else ""
        inner.append(f'<tspan fill="{c}"{st}>{s}</tspan>')
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="{MATH}" font-size="{size}" '
        f'text-anchor="{anchor}">{"".join(inner)}</text>'
    )


def _write(name: str, content: str) -> Path:
    path = OUT / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return path


# ---------------------------------------------------------------------------
# Transforms (active, right-handed, column-vector)
# ---------------------------------------------------------------------------


def rx(p, a):
    x, y, z = p
    c, s = math.cos(a), math.sin(a)
    return (x, y * c - z * s, y * s + z * c)


def ry(p, a):
    x, y, z = p
    c, s = math.cos(a), math.sin(a)
    return (x * c + z * s, y, -x * s + z * c)


def rz(p, a):
    x, y, z = p
    c, s = math.cos(a), math.sin(a)
    return (x * c - y * s, x * s + y * c, z)


def rot2(p, a):
    x, y = p[0], p[1]
    c, s = math.cos(a), math.sin(a)
    return (x * c - y * s, x * s + y * c)


_AXIS_FN = {"x": rx, "y": ry, "z": rz}


# ---------------------------------------------------------------------------
# Mobjects
# ---------------------------------------------------------------------------


@dataclass
class Poly:
    """Closed polygon in world space. copy() + rotate() is the Manim habit."""

    points: list
    stroke: str = CORAL
    fill: str = CORAL
    width: float = SW_SHAPE
    opacity: float = 0.28
    dash: str | None = None

    def copy(self) -> Poly:
        return Poly(list(self.points), self.stroke, self.fill, self.width, self.opacity, self.dash)

    def faded(self) -> Poly:
        g = self.copy()
        g.stroke, g.fill, g.width, g.opacity, g.dash = INK2, INK2, 1.2, 0.10, "5 4"
        return g

    def rotate(self, axis: str, angle: float) -> Poly:
        fn = _AXIS_FN[axis]
        self.points = [fn(p, angle) for p in self.points]
        return self

    def rotate2(self, angle: float) -> Poly:
        self.points = [rot2(p, angle) for p in self.points]
        return self

    def draw(self, cam: Camera) -> tuple[list[str], list]:
        q = [cam.project(p) for p in self.points]
        d = " ".join(f"{x:.1f},{y:.1f}" for x, y in q)
        extra = f' stroke-dasharray="{self.dash}"' if self.dash else ""
        part = (
            f'<polygon points="{d}" fill="{self.fill}" fill-opacity="{self.opacity}" '
            f'stroke="{self.stroke}" stroke-width="{self.width}"{extra}/>'
        )
        return [part], q


def L_floor() -> Poly:
    return Poly(
        [
            (0.06, 0.06, 0.0),
            (1.32, 0.06, 0.0),
            (1.32, 0.38, 0.0),
            (0.38, 0.38, 0.0),
            (0.38, 1.32, 0.0),
            (0.06, 1.32, 0.0),
        ]
    )


def L_flat() -> Poly:
    """2D L in the first quadrant, pixel units for the apply plate."""
    return Poly(
        [(36, 0), (168, 0), (168, 40), (76, 40), (76, 168), (36, 168)],
        width=1.7,
        opacity=0.12,
    )


@dataclass
class Axes:
    """Always-on basis. Highlight the axis that is changing this beat."""

    reach: tuple = (1.35, 1.35, 1.25)
    highlight: str | None = None
    prefix: str = "ax"

    def draw(self, cam: Camera) -> tuple[list[str], list]:
        o = cam.project((0, 0, 0) if cam.kind != "flat" else (0, 0))
        tips = {
            "x": cam.project((self.reach[0], 0, 0) if cam.kind != "flat" else (self.reach[0], 0)),
            "y": cam.project((0, self.reach[1], 0) if cam.kind != "flat" else (0, self.reach[1])),
            "z": cam.project((0, 0, self.reach[2])) if cam.kind != "flat" else None,
        }
        parts = [_defs(self.prefix)]
        pts = [o]
        for name, tip in tips.items():
            if tip is None:
                continue
            color = CORAL if self.highlight == name else INK
            end = f"{self.prefix}-coral" if self.highlight == name else f"{self.prefix}-ink"
            parts.append(_line(o[0], o[1], tip[0], tip[1], stroke=color, width=SW_AXIS, end=end))
            if name == "x":
                parts.append(_text(tip[0] + 8, tip[1] + 5, "x", size=15, fill=color))
            elif name == "y":
                dy = 14 if cam.kind == "pinhole" else 6
                parts.append(_text(tip[0] + 10, tip[1] + dy, "y", size=15, fill=color))
            else:
                parts.append(_text(tip[0] - 16, tip[1] - 4, "z", size=15, fill=color))
            pts.append(tip)
        return parts, pts


@dataclass
class Floor:
    size: float = 1.35

    def draw(self, cam: Camera) -> tuple[list[str], list]:
        s = self.size
        poly = Poly(
            [(0, 0, 0), (s, 0, 0), (s, s, 0), (0, s, 0)],
            stroke=INK2,
            fill=INK2,
            width=0.9,
            opacity=0.07,
        )
        return poly.draw(cam)


@dataclass
class Arc:
    """Turn arrow in the plane perpendicular to `axis`."""

    axis: str
    r: float = 0.86
    a0: float = 0.08
    a1: float = 0.98
    color: str = CORAL

    def draw(self, cam: Camera) -> tuple[list[str], list]:
        world = []
        for i in range(19):
            t = self.a0 + (self.a1 - self.a0) * i / 18
            c, s = math.cos(t), math.sin(t)
            if self.axis == "z":
                world.append((self.r * c, self.r * s, 0.0))
            else:
                world.append((0.0, self.r * c, self.r * s))
        q = [cam.project(p) for p in world]
        d = f"M{q[0][0]:.1f},{q[0][1]:.1f}" + "".join(f" L{p[0]:.1f},{p[1]:.1f}" for p in q[1:])
        a, b = q[-2], q[-1]
        dx, dy = b[0] - a[0], b[1] - a[1]
        length = math.hypot(dx, dy) or 1.0
        ux, uy = dx / length, dy / length
        nx, ny = -uy, ux
        ah, aw = 16, 9
        p1 = (b[0] + ux * 2, b[1] + uy * 2)
        p2 = (b[0] - ah * ux + aw * nx, b[1] - ah * uy + aw * ny)
        p3 = (b[0] - ah * ux - aw * nx, b[1] - ah * uy - aw * ny)
        parts = [
            f'<path d="{d}" fill="none" stroke="{self.color}" stroke-width="{SW_ARC}" '
            f'stroke-linecap="round" stroke-linejoin="round"/>',
            f'<polygon points="{p1[0]:.1f},{p1[1]:.1f} {p2[0]:.1f},{p2[1]:.1f} '
            f'{p3[0]:.1f},{p3[1]:.1f}" fill="{self.color}"/>',
        ]
        return parts, q


@dataclass
class Label:
    """next_to a world point — Manim attachment, not a free-floating string."""

    point: tuple
    text: str
    color: str = INK
    size: int = 13
    dx: float = 8
    dy: float = -8
    anchor: str = "start"

    def draw(self, cam: Camera) -> tuple[list[str], list]:
        x, y = cam.project(self.point)
        px, py = x + self.dx, y + self.dy
        span = 7.4 * len(self.text)
        if self.anchor == "end":
            box = [(px - span, py), (px, py)]
        elif self.anchor == "middle":
            box = [(px - span / 2, py), (px + span / 2, py)]
        else:
            box = [(px, py), (px + span, py)]
        return [_text(px, py, self.text, size=self.size, fill=self.color, anchor=self.anchor)], box


@dataclass
class Title:
    text: str
    size: int = 16
    color: str = INK

    def draw(self, cam: Camera) -> tuple[list[str], list]:
        # Sit above the z-tip of the shared basis.
        if cam.kind == "flat":
            p = cam.project((0, cam.scale if False else 0))
            pt = (cam.ox - 8, 28)
        else:
            z = cam.project((0, 0, 1.25))
            pt = (cam.ox - 8, z[1] - 28)
        return [_text(pt[0], pt[1], self.text, size=self.size, fill=self.color)], [pt]


@dataclass
class Note:
    text: str

    def draw(self, cam: Camera) -> tuple[list[str], list]:
        # Below the floor far corner.
        if cam.kind == "zup":
            far = cam.project((0.0, 1.35, 0.0))
            pt = (cam.ox - 8, far[1] + 28)
        else:
            pt = (cam.ox - 8, cam.oy + 36)
        return [_text(pt[0], pt[1], self.text, size=13, fill=INK2)], [
            pt,
            (pt[0] + 7.2 * len(self.text), pt[1]),
        ]


@dataclass
class Brace:
    """Hard-edge brace attached to a world-space segment."""

    a: tuple
    b: tuple
    label: str
    color: str = INK2
    offset: float = 30
    size: int = 14
    nudge: tuple[float, float] = (0.0, 0.0)
    math: bool | None = None

    def draw(self, cam: Camera) -> tuple[list[str], list]:
        a, b = cam.project(self.a), cam.project(self.b)
        dx, dy = b[0] - a[0], b[1] - a[1]
        length = math.hypot(dx, dy) or 1.0
        nx, ny = -dy / length, dx / length
        off = self.offset
        if off < 0:
            nx, ny = -nx, -ny
            off = abs(off)
        tick, nub = 9.0, 7.0
        a2 = (a[0] + nx * off, a[1] + ny * off)
        b2 = (b[0] + nx * off, b[1] + ny * off)
        a1 = (a[0] + nx * (off - tick), a[1] + ny * (off - tick))
        b1 = (b[0] + nx * (off - tick), b[1] + ny * (off - tick))
        mx, my = (a2[0] + b2[0]) / 2, (a2[1] + b2[1]) / 2
        nub_pt = (mx + nx * nub, my + ny * nub)
        lx = mx + nx * (nub + 16) + self.nudge[0]
        ly = my + ny * (nub + 16) + 4 + self.nudge[1]
        use_math = self.math if self.math is not None else len(self.label) <= 3
        parts = [
            _line(a1[0], a1[1], a2[0], a2[1], stroke=self.color, width=SW_BRACE),
            _line(a2[0], a2[1], b2[0], b2[1], stroke=self.color, width=SW_BRACE),
            _line(b2[0], b2[1], b1[0], b1[1], stroke=self.color, width=SW_BRACE),
            _line(mx, my, nub_pt[0], nub_pt[1], stroke=self.color, width=SW_BRACE),
            _text(
                lx,
                ly,
                self.label,
                size=self.size,
                fill=self.color,
                anchor="middle",
                italic=use_math,
                math=use_math,
            ),
        ]
        span = (9 if use_math else 7.4) * len(self.label)
        return parts, [a1, b1, a2, b2, nub_pt, (lx - span / 2, ly), (lx + span / 2, ly)]


def _away(a: tuple, b: tuple, t: float = 0.2) -> tuple:
    """Point a fraction of the way from a to b — keeps rays off the eye."""
    return tuple(a[i] + t * (b[i] - a[i]) for i in range(len(a)))


def _tree(cx: float, cy: float, s: float, *, fill: str, stroke: str) -> list[str]:
    """Deciduous tree: cloud canopy + thick trunk. (cx, cy) is the canopy top."""
    r = s
    discs = (
        (cx, cy + 0.88 * r, r),
        (cx - 0.58 * r, cy + 1.18 * r, 0.70 * r),
        (cx + 0.58 * r, cy + 1.18 * r, 0.70 * r),
    )
    tw, top, bot = 0.20 * r, cy + 1.75 * r, cy + 2.75 * r
    parts = [
        f'<rect x="{cx - tw:.1f}" y="{top:.1f}" width="{2 * tw:.1f}" height="{bot - top:.1f}" '
        f'fill="{stroke}" stroke="{stroke}" stroke-width="1.1"/>'
    ]
    # Opaque fills so the three discs read as one canopy, not a Venn diagram.
    for x, y, rr in discs:
        parts.append(
            f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rr:.1f}" fill="{fill}" '
            f'stroke="{stroke}" stroke-width="1.2"/>'
        )
    return parts


@dataclass
class Tree:
    """Same tree in the world or on the screen; `size` is canopy radius in px."""

    point: tuple
    size: float
    color: str = CORAL
    label: str = ""
    label_color: str = CORAL

    def draw(self, cam: Camera) -> tuple[list[str], list]:
        cx, cy = cam.project(self.point)
        s = self.size
        parts = _tree(cx, cy, s, fill=self.color, stroke=self.color)
        pts = [
            (cx - 1.35 * s, cy),
            (cx + 1.35 * s, cy + 2.45 * s),
        ]
        if self.label:
            parts.append(
                _text(cx + 1.4 * s, cy + 0.6 * s, self.label, size=14, fill=self.label_color)
            )
            pts.append((cx + 1.4 * s + 8 * len(self.label), cy + 0.6 * s))
        return parts, pts


@dataclass
class Eye:
    def draw(self, cam: Camera) -> tuple[list[str], list]:
        cx, cy = cam.project((0.0, 0.0, 0.0))
        r, arm = 18.0, 22.0
        a0, a1 = math.radians(-45), math.radians(45)
        ux, uy = cx + arm * math.cos(a1), cy - arm * math.sin(a1)
        lx, ly = cx + arm * math.cos(a0), cy - arm * math.sin(a0)
        ax0, ay0 = cx + r * math.cos(a1), cy - r * math.sin(a1)
        ax1, ay1 = cx + r * math.cos(a0), cy - r * math.sin(a0)
        parts = [
            f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="20" fill="{PAPER}" stroke="none"/>',
            f'<path d="M{cx:.1f},{cy:.1f} L{ax0:.1f},{ay0:.1f} '
            f'A{r:.1f},{r:.1f} 0 0 1 {ax1:.1f},{ay1:.1f} Z" fill="{PAPER}" stroke="none"/>',
            f'<path d="M{ux:.1f},{uy:.1f} L{cx:.1f},{cy:.1f} L{lx:.1f},{ly:.1f}" '
            f'fill="none" stroke="{INK}" stroke-width="1.8" stroke-linejoin="miter"/>',
            f'<path d="M{ax0:.1f},{ay0:.1f} A{r:.1f},{r:.1f} 0 0 1 {ax1:.1f},{ay1:.1f}" '
            f'fill="none" stroke="{INK}" stroke-width="1.8"/>',
        ]
        return parts, [(cx, cy), (ux, uy), (lx, ly), (cx - 24, cy - 24)]


@dataclass
class Dot:
    point: tuple
    color: str = INK
    r: float = 5.5

    def draw(self, cam: Camera) -> tuple[list[str], list]:
        x, y = cam.project(self.point)
        return [_circle(x, y, self.r, fill=self.color)], [(x, y)]


@dataclass
class Seg:
    a: tuple
    b: tuple
    color: str = INK
    width: float = 1.4
    dash: str | None = None
    end: str | None = None

    def draw(self, cam: Camera) -> tuple[list[str], list]:
        a, b = cam.project(self.a), cam.project(self.b)
        return [_line(a[0], a[1], b[0], b[1], stroke=self.color, width=self.width, end=self.end, dash=self.dash)], [
            a,
            b,
        ]


@dataclass
class Screen:
    d: float
    hx: float = 1.28
    hy: float = 0.82

    def corners(self) -> list:
        return [
            (self.hx, -self.hy, self.d),
            (self.hx, self.hy, self.d),
            (-self.hx * 0.56, self.hy, self.d),
            (-self.hx * 0.56, -self.hy, self.d),
        ]

    def top(self, cam: Camera) -> tuple[float, float]:
        q = [cam.project(p) for p in self.corners()[:2]]
        return ((q[0][0] + q[1][0]) / 2, min(q[0][1], q[1][1]))

    def draw(self, cam: Camera) -> tuple[list[str], list]:
        q = [cam.project(p) for p in self.corners()]
        d = " ".join(f"{x:.1f},{y:.1f}" for x, y in q)
        tx, ty = self.top(cam)
        lab = (tx, ty - 14)
        parts = [
            f'<polygon points="{d}" fill="{BLUE}" fill-opacity="0.10" '
            f'stroke="{BLUE}" stroke-width="1.6"/>',
            _text(lab[0], lab[1], "screen", size=14, fill=BLUE, anchor="middle"),
        ]
        return parts, [*q, lab]


# ---------------------------------------------------------------------------
# Scene
# ---------------------------------------------------------------------------


@dataclass
class Scene:
    camera: Camera
    prefix: str = "sc"
    items: list = field(default_factory=list)

    def add(self, *mobs) -> Scene:
        self.items.extend(mobs)
        return self

    def render(self, *, pad: float = 22, min_w: float = 0, min_h: float = 0) -> str:
        parts: list[str] = []
        pts: list = []
        for mob in self.items:
            p, q = mob.draw(self.camera)
            parts.extend(p)
            pts.extend(q)
        x0, y0, w, h = _crop(pts, pad=pad)
        if w < min_w:
            x0 -= (min_w - w) / 2
            w = min_w
        if h < min_h:
            y0 -= (min_h - h) / 2
            h = min_h
        return _svg(w, h, "\n".join(parts), x=x0, y=y0)

    def gather(self) -> tuple[list[str], list]:
        parts: list[str] = []
        pts: list = []
        for mob in self.items:
            p, q = mob.draw(self.camera)
            parts.extend(p)
            pts.extend(q)
        return parts, pts


# ---------------------------------------------------------------------------
# 2D plates
# ---------------------------------------------------------------------------


def _arc2(ox, oy, r, a0, a1, *, color=CORAL, ccw=True) -> str:
    x0 = ox + r * math.cos(a0)
    y0 = oy - r * math.sin(a0)
    x1 = ox + r * math.cos(a1)
    y1 = oy - r * math.sin(a1)
    sweep = 0 if ccw else 1
    am = a0 + 0.72 * (a1 - a0)
    mx, my = ox + r * math.cos(am), oy - r * math.sin(am)
    tang = am + (math.pi / 2 if ccw else -math.pi / 2)
    ah, aw = 9, 5
    tx, ty = math.cos(tang), -math.sin(tang)
    nx, ny = -ty, tx
    p1 = (mx + ah * tx, my + ah * ty)
    p2 = (mx - aw * nx, my - aw * ny)
    p3 = (mx + aw * nx, my + aw * ny)
    return (
        f'<path d="M{x0:.1f},{y0:.1f} A{r:.1f},{r:.1f} 0 0 {sweep} {x1:.1f},{y1:.1f}" '
        f'fill="none" stroke="{color}" stroke-width="1.3"/>'
        f'<polygon points="{p1[0]:.1f},{p1[1]:.1f} {p2[0]:.1f},{p2[1]:.1f} '
        f'{p3[0]:.1f},{p3[1]:.1f}" fill="{color}"/>'
    )


def counterclockwise() -> str:
    ox, oy, reach, ang = 78, 292, 230, math.radians(32)
    px, py = ox + reach * math.cos(ang), oy - reach * math.sin(ang)
    body = [
        _defs("ccw"),
        _line(ox, oy, ox + reach + 8, oy, width=SW_AXIS, end="ccw-ink"),
        _line(ox, oy, ox, oy - reach - 8, width=SW_AXIS, end="ccw-ink"),
        _line(ox, oy, px, py, stroke=CORAL, width=2, end="ccw-coral"),
        _arc2(ox, oy, 72, 0, ang, ccw=True),
        _text(ox + reach + 16, oy + 5, "x", size=16),
        _text(ox - 20, oy - reach - 14, "y", size=16),
        _text(ox + 88, oy - 18, "θ", size=16, fill=CORAL),
        _text(24, 328, "y points up — the usual math picture", size=12, fill=INK2),
    ]
    return _svg(360, 348, "\n".join(body))


def clockwise() -> str:
    ox, oy, reach, ang = 78, 48, 230, math.radians(32)
    px, py = ox + reach * math.cos(ang), oy + reach * math.sin(ang)
    body = [
        _defs("cw"),
        _line(ox, oy, ox + reach + 8, oy, width=SW_AXIS, end="cw-ink"),
        _line(ox, oy, ox, oy + reach + 8, width=SW_AXIS, end="cw-ink"),
        _line(ox, oy, px, py, stroke=CORAL, width=2, end="cw-coral"),
        _arc2(ox, oy, 72, 0, -ang, ccw=False),
        _text(ox + reach + 16, oy + 5, "x", size=16),
        _text(ox - 20, oy + reach + 22, "y", size=16),
        _text(ox + 88, oy + 32, "θ", size=16, fill=CORAL),
        _text(24, 328, "y points down — how a screen is numbered", size=12, fill=INK2),
    ]
    return _svg(360, 348, "\n".join(body))


def apply_rotation() -> str:
    cam = Camera(200, 312, 1, kind="flat")
    ang = math.radians(50)
    before = L_flat().faded()
    after = L_flat().rotate2(ang)
    before.opacity = 0.12
    after.opacity = 0.12
    r = 56
    ax0, ay0 = cam.project((r, 0))
    ax1, ay1 = cam.ox + r * math.cos(ang), cam.oy - r * math.sin(ang)
    mid = cam.project(rot2((r - 10, 0), ang * 0.42))
    scene = Scene(cam, "rd")
    # axes drawn by hand so the 2D frame can extend past the L
    parts, pts = [], []
    parts.append(_defs("rd"))
    parts.append(_line(cam.ox - 160, cam.oy, cam.ox + 220, cam.oy, width=SW_AXIS, end="rd-ink"))
    parts.append(_line(cam.ox, cam.oy + 20, cam.ox, cam.oy - 250, width=SW_AXIS, end="rd-ink"))
    for mob in (before, after):
        p, q = mob.draw(cam)
        parts.extend(p)
        pts.extend(q)
    parts.append(
        f'<path d="M{ax0:.1f},{ay0:.1f} A{r:.1f},{r:.1f} 0 0 0 {ax1:.1f},{ay1:.1f}" '
        f'fill="none" stroke="{CORAL}" stroke-width="1.4" marker-end="url(#rd-coral)"/>'
    )
    parts.append(_circle(cam.ox, cam.oy, 3.5, fill=INK))
    parts.append(_text(cam.ox + 228, cam.oy + 5, "x", size=16))
    parts.append(_text(cam.ox - 18, cam.oy - 256, "y", size=16))
    tip_b = cam.project(before.points[1])
    tip_a = cam.project(after.points[1])
    parts.append(_text(tip_b[0] + 8, tip_b[1] + 20, "before", fill=INK2, size=13))
    parts.append(_text(tip_a[0] + 10, tip_a[1] - 6, "after", fill=CORAL, size=14))
    parts.append(_text(mid[0] - 4, mid[1] + 2, "θ", fill=CORAL, size=16, anchor="end"))
    return _svg(460, 360, "\n".join(parts))


# ---------------------------------------------------------------------------
# Combining — same L, successive rotate()
# ---------------------------------------------------------------------------


COMBINE_CAM = Camera(90, 210, 148, kind="zup")
COMBINE_SIZE = (490.0, 320.0)


def _combine_scene(
    prefix: str,
    title: str,
    current: Poly,
    ghost: Poly | None = None,
    *,
    change: str | None = None,
    ghost_label: str = "",
    ghost_at: int = 5,
    now_label: str = "",
    now_at: int = 5,
    note: str = "",
    camera: Camera | None = None,
) -> Scene:
    cam = camera or COMBINE_CAM
    scene = Scene(cam, prefix)
    scene.add(Axes(highlight=change, prefix=prefix), Floor(), Title(title))
    if change == "z":
        scene.add(Arc("z"), Label((1.08, 0.58, 0.0), "Rz", CORAL, 16, dx=8, dy=6))
    elif change == "x":
        scene.add(Arc("x", r=0.62, a0=0.12, a1=1.05), Label((0.68, 0.0, 0.0), "Rx", CORAL, 14, dx=0, dy=-16, anchor="middle"))
    if ghost is not None:
        scene.add(ghost)
        if ghost_label:
            scene.add(Label(ghost.points[ghost_at], ghost_label, INK2, 12, dx=8, dy=-10))
    scene.add(current)
    if now_label:
        scene.add(Label(current.points[now_at], now_label, CORAL, 13, dx=-8, dy=-10, anchor="end"))
    if note:
        scene.add(Note(note))
    return scene


def combine_steps() -> list[tuple[str, str]]:
    ang = math.radians(65)
    start = L_floor()
    after_z = start.copy().rotate("z", ang)
    after_zx = after_z.copy().rotate("x", ang)
    after_x = start.copy().rotate("x", ang)
    after_xz = after_x.copy().rotate("z", ang)

    beats = [
        ("rotation-combine-1.svg", _combine_scene("s1", "1 · start", start.copy(), note="on the xy floor")),
        (
            "rotation-combine-2.svg",
            _combine_scene(
                "s2",
                "2 · apply Rz",
                after_z,
                start.copy().faded(),
                change="z",
                now_label="after Rz",
                note="changing: turn around z — still flat",
            ),
        ),
        (
            "rotation-combine-3.svg",
            _combine_scene(
                "s3",
                "3 · then Rx",
                after_zx,
                after_z.copy().faded(),
                change="x",
                ghost_label="after Rz",
                now_label="tipped",
                now_at=2,
                note="changing: that pose tips around x",
            ),
        ),
        (
            "rotation-combine-4.svg",
            _combine_scene(
                "s4",
                "4 · other order",
                after_xz,
                after_x.copy().faded(),
                change="z",
                ghost_label="after Rx",
                now_label="then Rz",
                note="same two turns, reverse order ≠ step 3",
            ),
        ),
    ]
    gathered = [(name, scene.gather()) for name, scene in beats]
    # Same output box; each beat is framed on its own subject (Manim still).
    out_w, out_h = COMBINE_SIZE
    written = []
    for name, (parts, pts) in gathered:
        x0, y0, vw, vh = _crop(pts, pad=24)
        written.append(
            (name, _svg(vw, vh, "\n".join(parts), x=x0, y=y0, width=out_w, height=out_h))
        )
    return written


def combine_compare() -> str:
    ang = math.radians(65)
    start = L_floor()
    left = start.copy().rotate("z", ang).rotate("x", ang)
    right = start.copy().rotate("x", ang).rotate("z", ang)
    gap = 340
    a = _combine_scene("c5a", "Rz then Rx", left)
    b = _combine_scene("c5b", "Rx then Rz", right, camera=COMBINE_CAM.shifted(gap))
    pa, qa = a.gather()
    pb, qb = b.gather()
    left_x = COMBINE_CAM.project((1.35, 0, 0))
    right_o = COMBINE_CAM.shifted(gap).project((0, 0, 0))
    left_o = COMBINE_CAM.project((0, 0, 0))
    neq = ((left_x[0] + right_o[0]) / 2, left_o[1] - 18)
    parts = pa + pb + [_text(neq[0], neq[1], "≠", size=28, fill=CORAL, anchor="middle")]
    pts = [*qa, *qb, neq, (neq[0] - 16, neq[1] - 16), (neq[0] + 16, neq[1] + 16)]
    x0, y0, vw, vh = _crop(pts, pad=40)
    return _svg(vw, vh, "\n".join(parts), x=x0, y=y0, width=860, height=COMBINE_SIZE[1])


# ---------------------------------------------------------------------------
# Pinhole
# ---------------------------------------------------------------------------


def perspective() -> str:
    cam = Camera(70, 250, 152, kind="pinhole")
    d, Az, Ax = 1.45, 2.75, 1.18
    Bx = Ax * d / Az
    eye, pt, hit = (0.0, 0.0, 0.0), (Ax, 0.0, Az), (Bx, 0.0, d)
    foot_a, foot_b = (0.0, 0.0, Az), (0.0, 0.0, d)
    screen = Screen(d)
    world_s, hit_s = 26.0, 26.0 * (Bx / Ax)
    scene = Scene(cam, "pj")
    scene.add(
        Axes(reach=(1.38, 0.95, Az + 0.22), prefix="pj"),
        screen,
        Seg(_away(eye, pt, 0.08), pt, CORAL, 1.8),
        Seg(hit, foot_b, INK2, 1, dash="3 3"),
        Seg(pt, foot_a, INK2, 1, dash="3 3"),
        Tree(pt, world_s, CORAL),
        Tree(hit, hit_s, INK),
        Brace(eye, foot_b, "d", BLUE, offset=30, size=16),
        Brace(eye, foot_a, "depth", INK2, offset=54, math=False),
        Brace(foot_a, pt, "h", CORAL, offset=22, size=16, nudge=(-6, 0)),
        Brace(foot_b, hit, "h′", INK, offset=-34, size=16, nudge=(-14, 0)),
        Eye(),
    )
    parts, pts = scene.gather()
    Pe, Pa, Pfa = cam.project(eye), cam.project(pt), cam.project(foot_a)
    parts.insert(
        2,
        f'<polygon points="{Pe[0]:.1f},{Pe[1]:.1f} {Pa[0]:.1f},{Pa[1]:.1f} {Pfa[0]:.1f},{Pfa[1]:.1f}" '
        f'fill="{CORAL}" fill-opacity="0.06" stroke="none"/>',
    )
    left = min(p[0] for p in pts)
    top = min(p[1] for p in pts)
    eq = (left, top - 6)
    parts.append(
        _eq(
            eq[0],
            eq[1],
            [
                ("h", INK, True),
                ("′", INK),
                (" = ", INK),
                ("h", CORAL, True),
                (" · ", INK),
                ("d", BLUE, True),
                (" / depth", INK2),
            ],
        )
    )
    pts.extend([eq, (eq[0] + 200, eq[1] - 8), (eq[0], eq[1] + 10)])
    x0, y0, w, h = _crop(pts, pad=22)
    return _svg(w, h, "\n".join(parts), x=x0, y=y0)


def f_projection() -> str:
    cam = Camera(70, 250, 142, kind="pinhole")
    d, hgt = 1.38, 1.08
    z_near, z_far = 0.70, 2.35
    eye = (0.0, 0.0, 0.0)
    near = (hgt, 0.0, d + z_near)
    far = (hgt, 0.0, d + z_far)
    hit_n = (hgt * d / (d + z_near), 0.0, d)
    hit_f = (hgt * d / (d + z_far), 0.0, d)
    plane = (0.0, 0.0, d)
    n_z = (0.0, 0.0, d + z_near)
    screen = Screen(d, hx=1.22, hy=0.78)
    world_s = 24.0
    near_s = world_s * (hit_n[0] / hgt)
    far_s = world_s * (hit_f[0] / hgt)
    scene = Scene(cam, "fp")
    scene.add(
        Axes(reach=(1.32, 0.92, d + z_far + 0.18), prefix="fp"),
        screen,
        Seg(_away(eye, near, 0.08), near, CORAL, 1.7),
        Seg(_away(eye, far, 0.08), far, CORAL, 1.3, dash="5 3"),
        Tree(near, world_s, CORAL, "near"),
        Tree(far, world_s, CORAL, "far"),
        Tree(hit_n, near_s, INK),
        Tree(hit_f, max(far_s, 6.0), INK2),
        Brace(eye, plane, "d", BLUE, offset=30, size=16),
        Brace(plane, n_z, "d − z", INK2, offset=32, math=True),
        Eye(),
    )
    parts, pts = scene.gather()
    left = min(p[0] for p in pts)
    top = min(p[1] for p in pts)
    eq = (left, top - 6)
    parts.append(
        _eq(
            eq[0],
            eq[1],
            [
                ("s", INK, True),
                (" = 1 / (", INK),
                ("d", BLUE, True),
                (" − ", INK2),
                ("z", INK2, True),
                (")", INK),
            ],
        )
    )
    pts.extend([eq, (eq[0] + 180, eq[1] - 8), (eq[0], eq[1] + 10)])
    x0, y0, w, hgt_box = _crop(pts, pad=22)
    return _svg(w, hgt_box, "\n".join(parts), x=x0, y=y0)


def main() -> None:
    written = [
        _write("rotation-ccw.svg", counterclockwise()),
        _write("rotation-cw.svg", clockwise()),
        _write("rotation-apply.svg", apply_rotation()),
        _write("rotation-perspective.svg", perspective()),
        _write("rotation-f-projection.svg", f_projection()),
    ]
    written += [_write(name, content) for name, content in combine_steps()]
    written.append(_write("rotation-combine-5.svg", combine_compare()))
    stale = OUT / "rotation-combine.svg"
    if stale.exists():
        stale.unlink()
    root = Path(__file__).resolve().parents[1]
    for p in written:
        print(p.relative_to(root))


if __name__ == "__main__":
    main()
