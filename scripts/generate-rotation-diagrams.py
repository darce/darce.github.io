#!/usr/bin/env python3
"""Geometric SVGs for the rotation-matrices article.

Not WorkBay canvas node graphs. These are constructions in the same
family as the Wikipedia figures:

- Counterclockwise_rotation.png  (math: y up)
- Clockwise_rotation.png         (screen: y down)
- Rotation_decomposition.png     (Rodrigues: P(v), (I-P)v, Q(v), R(v))
- Perspective_transform_diagram.svg
- plus the article's f = 1/(d − z) similar-triangles plate

Tokens match styles/palettes.scss (paper / ink / coral / ultramarine).
"""

from __future__ import annotations

import math
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "images" / "research"

PAPER = "#e7eaef"
SURFACE = "#f2f4f7"
INK = "#171920"
INK2 = "#464c5c"
CORAL = "#d9253f"
BLUE = "#3c00f7"
FONT = "ui-monospace, GeistMonoVariableVF, monospace"


def svg(w: float, h: float, body: str) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
        f'width="{w}" height="{h}" role="img">\n'
        f'<rect width="{w}" height="{h}" fill="{PAPER}"/>\n'
        f"{body}\n</svg>\n"
    )


def arrow_defs() -> str:
    return f"""<defs>
  <marker id="ah-ink" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="{INK}"/>
  </marker>
  <marker id="ah-coral" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="{CORAL}"/>
  </marker>
  <marker id="ah-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="{BLUE}"/>
  </marker>
</defs>"""


def text(x: float, y: float, s: str, *, size: int = 13, fill: str = INK, anchor: str = "start") -> str:
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="{FONT}" font-size="{size}" '
        f'fill="{fill}" text-anchor="{anchor}">{s}</text>'
    )


def line(x1, y1, x2, y2, *, stroke=INK, width=1.2, marker=None, dash=None) -> str:
    extra = ""
    if marker:
        extra += f' marker-end="url(#{marker})"'
    if dash:
        extra += f' stroke-dasharray="{dash}"'
    return (
        f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
        f'stroke="{stroke}" stroke-width="{width}" fill="none"{extra}/>'
    )


def write(name: str, content: str) -> Path:
    path = OUT / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return path


def counterclockwise() -> str:
    """Math convention: y up, θ measured CCW from +x. Matches wiki CCW figure."""
    ox, oy = 80, 280
    ax, ay = 280, 280
    # 32° CCW
    ang = math.radians(32)
    r = 200
    px = ox + r * math.cos(ang)
    py = oy - r * math.sin(ang)
    # arc from +x to vector
    arc_r = 56
    ax1, ay1 = ox + arc_r, oy
    ax2 = ox + arc_r * math.cos(ang)
    ay2 = oy - arc_r * math.sin(ang)
    body = [
        arrow_defs(),
        line(ox, oy, ax, ay, width=1.5, marker="ah-ink"),
        line(ox, oy, ox, 48, width=1.5, marker="ah-ink"),
        line(ox, oy, px, py, stroke=CORAL, width=1.8, marker="ah-coral"),
        f'<path d="M{ax1:.1f},{ay1:.1f} A{arc_r},{arc_r} 0 0 0 {ax2:.1f},{ay2:.1f}" '
        f'fill="none" stroke="{CORAL}" stroke-width="1.2"/>',
        # small arrow on the arc
        f'<polygon points="{ax2-6:.1f},{ay2+2:.1f} {ax2+2:.1f},{ay2-6:.1f} {ax2+7:.1f},{ay2+5:.1f}" fill="{CORAL}"/>',
        text(ax + 8, oy + 5, "x"),
        text(ox - 18, 58, "y"),
        text((ox + px) / 2 + 10, (oy + py) / 2 - 8, "θ", fill=CORAL),
    ]
    return svg(360, 320, "\n".join(body))


def clockwise() -> str:
    """Screen convention: y down, θ measured CW from +x. Matches wiki CW figure."""
    ox, oy = 80, 48
    ax, ay = 280, 48
    ang = math.radians(28)
    r = 200
    px = ox + r * math.cos(ang)
    py = oy + r * math.sin(ang)
    arc_r = 56
    ax1, ay1 = ox + arc_r, oy
    ax2 = ox + arc_r * math.cos(ang)
    ay2 = oy + arc_r * math.sin(ang)
    body = [
        arrow_defs(),
        line(ox, oy, ax, ay, width=1.5, marker="ah-ink"),
        line(ox, oy, ox, 280, width=1.5, marker="ah-ink"),
        line(ox, oy, px, py, stroke=CORAL, width=1.8, marker="ah-coral"),
        f'<path d="M{ax1:.1f},{ay1:.1f} A{arc_r},{arc_r} 0 0 1 {ax2:.1f},{ay2:.1f}" '
        f'fill="none" stroke="{CORAL}" stroke-width="1.2"/>',
        f'<polygon points="{ax2-6:.1f},{ay2-2:.1f} {ax2+2:.1f},{ay2+6:.1f} {ax2+7:.1f},{ay2-5:.1f}" fill="{CORAL}"/>',
        text(ax + 8, oy + 5, "x"),
        text(ox - 18, 292, "y"),
        text((ox + px) / 2 + 8, (oy + py) / 2 - 10, "θ", fill=CORAL),
    ]
    return svg(360, 320, "\n".join(body))


def _v3(a, b, s=1.0):
    return (s * a[0] + b[0], s * a[1] + b[1], s * a[2] + b[2]) if isinstance(b, tuple) else (a[0] * b, a[1] * b, a[2] * b)


def _dot(a, b):
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]


def _cross(a, b):
    return (
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    )


def _norm(a):
    n = math.sqrt(_dot(a, a)) or 1.0
    return (a[0] / n, a[1] / n, a[2] / n)


def _add(a, b):
    return (a[0] + b[0], a[1] + b[1], a[2] + b[2])


def _sub(a, b):
    return (a[0] - b[0], a[1] - b[1], a[2] - b[2])


def _scale(a, s):
    return (a[0] * s, a[1] * s, a[2] * s)


def decomposition() -> str:
    """Rodrigues split projected from real 3D vectors (wiki Rotation_decomposition)."""
    ox, oy = 220, 300

    def proj(p):
        # cabinet: +x right, +y toward camera-left, +z up
        return (ox + 118 * p[0] + 72 * p[1], oy - 118 * p[2] + 40 * p[1])

    i, j, k = (1.55, 0, 0), (0, 1.55, 0), (0, 0, 1.7)
    u = _norm((0.18, 0.12, 1.0))
    v = (0.95, 0.35, 0.42)
    pv = _scale(u, _dot(v, u))
    ipv = _sub(v, pv)
    theta = math.radians(55)
    qv = _add(_scale(ipv, math.cos(theta)), _scale(_cross(u, ipv), math.sin(theta)))
    rv = _add(pv, qv)
    u_draw = _scale(u, 1.65)

    def P(p):
        return proj(p)

    o = (ox, oy)
    Pi, Pj, Pk = P(i), P(j), P(k)
    Pu, Pv, Ppv, Pipv, Pqv, Prv = P(u_draw), P(v), P(pv), P(ipv), P(qv), P(rv)

    def vline(a, b, **kw):
        return line(a[0], a[1], b[0], b[1], **kw)

    # sector in the plane of ipv → qv
    sector = (
        f'<path d="M{o[0]:.1f},{o[1]:.1f} L{Pipv[0]:.1f},{Pipv[1]:.1f} '
        f'L{Pqv[0]:.1f},{Pqv[1]:.1f} Z" fill="{BLUE}" fill-opacity="0.08"/>'
    )
    body = [
        arrow_defs(),
        sector,
        vline(o, Pi, width=1.5, marker="ah-blue", stroke=BLUE),
        vline(o, Pj, width=1.5, marker="ah-blue", stroke=BLUE),
        vline(o, Pk, width=1.5, marker="ah-blue", stroke=BLUE),
        vline(o, Pu, width=1.6, marker="ah-ink"),
        vline(o, Pv, stroke=CORAL, width=1.8, marker="ah-coral"),
        vline(o, Ppv, width=1.4, marker="ah-ink"),
        vline(o, Pipv, width=1.4, marker="ah-ink"),
        vline(o, Pqv, stroke=CORAL, width=1.4, marker="ah-coral"),
        vline(o, Prv, stroke=CORAL, width=1.8, marker="ah-coral"),
        vline(Ppv, Prv, stroke=INK2, width=1, dash="3 3"),
        vline(Pqv, Prv, stroke=INK2, width=1, dash="3 3"),
        vline(Pipv, Pv, stroke=INK2, width=1, dash="3 3"),
        vline(Ppv, Pv, stroke=INK2, width=1, dash="3 3"),
        f'<path d="M{Pipv[0]:.1f},{Pipv[1]:.1f} Q{(Pipv[0]+Pqv[0])/2 + 24:.1f},{(Pipv[1]+Pqv[1])/2 - 10:.1f} {Pqv[0]:.1f},{Pqv[1]:.1f}" '
        f'fill="none" stroke="{CORAL}" stroke-width="1.2"/>',
        text(Pi[0] + 8, Pi[1] + 4, "ĵ", fill=BLUE),
        text(Pj[0] - 18, Pj[1] + 14, "î", fill=BLUE),
        text(Pk[0] - 16, Pk[1] - 6, "k̂", fill=BLUE),
        text(Pu[0] + 8, Pu[1] - 4, "û"),
        text(Pv[0] + 8, Pv[1] + 4, "v⃗", fill=CORAL),
        text(Ppv[0] - 48, Ppv[1] + 4, "P(v)"),
        text(Pipv[0] - 6, Pipv[1] + 22, "(I−P)v"),
        text(Pqv[0] + 8, Pqv[1] + 4, "Q(v)", fill=CORAL),
        text(Prv[0] + 8, Prv[1] + 2, "R(v)", fill=CORAL),
        text(o[0] + 22, o[1] + 6, "θ", fill=CORAL, size=14),
    ]
    return svg(460, 470, "\n".join(body))


def perspective() -> str:
    """Side-view similar triangles, Wikipedia Bx = Ax · Bz / Az."""
    # Camera C at left. z to the right, x up.
    c = (70, 210)
    # image plane at x = 250 (Bz)
    plane_x = 250
    # point A
    a = (430, 78)
    # intersection B of CA with the plane
    # line C→A: parametrize
    t = (plane_x - c[0]) / (a[0] - c[0])
    b = (plane_x, c[1] + t * (a[1] - c[1]))
    # drop perpendiculars to the optical axis (horizontal through C)
    axis_y = c[1]
    # Az is horizontal from C to A's x; Ax is vertical from axis to A
    body = [
        arrow_defs(),
        # optical axis
        line(c[0], axis_y, 520, axis_y, width=1.2, marker="ah-ink"),
        text(528, axis_y + 4, "z"),
        # x axis up at camera
        line(c[0], axis_y, c[0], 36, width=1.2, marker="ah-ink"),
        text(c[0] - 14, 42, "x"),
        # image plane
        line(plane_x, 40, plane_x, 300, width=1.6, stroke=BLUE),
        f'<rect x="{plane_x - 5}" y="40" width="10" height="260" fill="{BLUE}" fill-opacity="0.06" stroke="none"/>',
        text(plane_x + 10, 54, "image plane", fill=BLUE, size=12),
        # camera
        f'<rect x="{c[0] - 7}" y="{c[1] - 7}" width="14" height="14" fill="{INK}"/>',
        text(c[0] - 28, c[1] + 28, "C", size=14),
        # ray
        line(c[0], c[1], a[0], a[1], stroke=CORAL, width=1.6, marker="ah-coral"),
        # point A
        f'<circle cx="{a[0]}" cy="{a[1]}" r="4" fill="{CORAL}"/>',
        text(a[0] + 8, a[1] - 6, "A (Ax, Az)", fill=CORAL),
        # point B
        f'<circle cx="{b[0]}" cy="{b[1]}" r="4" fill="{INK}"/>',
        text(b[0] - 72, b[1] - 8, "B (Bx, Bz)"),
        # similar-triangle legs
        line(a[0], a[1], a[0], axis_y, stroke=INK2, width=1, dash="3 3"),
        line(b[0], b[1], b[0], axis_y, stroke=INK2, width=1, dash="3 3"),
        # dimension ticks
        line(c[0], axis_y + 28, plane_x, axis_y + 28, stroke=INK2, width=1),
        line(c[0], axis_y + 24, c[0], axis_y + 32, stroke=INK2, width=1),
        line(plane_x, axis_y + 24, plane_x, axis_y + 32, stroke=INK2, width=1),
        text((c[0] + plane_x) / 2, axis_y + 44, "Bz", fill=INK2, anchor="middle"),
        line(c[0], axis_y + 52, a[0], axis_y + 52, stroke=INK2, width=1),
        line(a[0], axis_y + 48, a[0], axis_y + 56, stroke=INK2, width=1),
        text((c[0] + a[0]) / 2, axis_y + 68, "Az", fill=INK2, anchor="middle"),
        # vertical measures
        line(a[0] + 18, axis_y, a[0] + 18, a[1], stroke=INK2, width=1),
        text(a[0] + 24, (axis_y + a[1]) / 2 + 4, "Ax", fill=INK2),
        line(plane_x - 18, axis_y, plane_x - 18, b[1], stroke=BLUE, width=1),
        text(plane_x - 48, (axis_y + b[1]) / 2 + 4, "Bx", fill=BLUE),
        # formula
        text(70, 330, "Bx = Ax · Bz / Az", size=14),
        text(70, 350, "similar triangles:  Bx / Bz  =  Ax / Az", size=12, fill=INK2),
    ]
    return svg(560, 380, "\n".join(body))


def f_projection() -> str:
    """Article convention: viewer at z = d, plane at z = 0, f = 1/(d − z)."""
    c = (70, 200)
    plane_x = 230
    # two points at different depths, same world-x (same height off axis)
    a1 = (360, 90)   # closer (larger z, smaller d-z)
    a2 = (500, 90)   # farther
    t1 = (plane_x - c[0]) / (a1[0] - c[0])
    t2 = (plane_x - c[0]) / (a2[0] - c[0])
    b1 = (plane_x, c[1] + t1 * (a1[1] - c[1]))
    b2 = (plane_x, c[1] + t2 * (a2[1] - c[1]))
    axis_y = c[1]
    body = [
        arrow_defs(),
        line(c[0], axis_y, 540, axis_y, width=1.2, marker="ah-ink"),
        text(548, axis_y + 4, "z"),
        line(c[0], axis_y, c[0], 40, width=1.2, marker="ah-ink"),
        text(c[0] - 14, 48, "x"),
        line(plane_x, 48, plane_x, 300, width=1.6, stroke=BLUE),
        f'<rect x="{plane_x - 5}" y="48" width="10" height="252" fill="{BLUE}" fill-opacity="0.06"/>',
        text(plane_x + 10, 62, "plane  z = 0", fill=BLUE, size=12),
        f'<rect x="{c[0] - 7}" y="{c[1] - 7}" width="14" height="14" fill="{INK}"/>',
        text(c[0] - 36, c[1] + 28, "eye", size=13),
        # d
        line(c[0], axis_y + 36, plane_x, axis_y + 36, stroke=INK2, width=1),
        line(c[0], axis_y + 32, c[0], axis_y + 40, stroke=INK2),
        line(plane_x, axis_y + 32, plane_x, axis_y + 40, stroke=INK2),
        text((c[0] + plane_x) / 2, axis_y + 52, "d", fill=INK2, anchor="middle"),
        # rays
        line(c[0], c[1], a1[0], a1[1], stroke=CORAL, width=1.5, marker="ah-coral"),
        line(c[0], c[1], a2[0], a2[1], stroke=CORAL, width=1.2, dash="4 3"),
        f'<circle cx="{a1[0]}" cy="{a1[1]}" r="4" fill="{CORAL}"/>',
        f'<circle cx="{a2[0]}" cy="{a2[1]}" r="4" fill="{CORAL}" fill-opacity="0.55"/>',
        f'<circle cx="{b1[0]}" cy="{b1[1]}" r="4" fill="{INK}"/>',
        f'<circle cx="{b2[0]}" cy="{b2[1]}" r="3.5" fill="{INK}" fill-opacity="0.55"/>',
        text(a1[0] + 8, a1[1] - 6, "near  (x, z)", fill=CORAL, size=12),
        text(a2[0] - 10, a2[1] - 8, "far  (x, z′)", fill=CORAL, size=12, anchor="end"),
        text(plane_x - 8, b1[1] - 8, "x′", fill=INK, anchor="end"),
        text(plane_x - 8, b2[1] + 16, "x″", fill=INK2, anchor="end"),
        # d − z on the near point
        line(plane_x, axis_y + 70, a1[0], axis_y + 70, stroke=CORAL, width=1),
        line(plane_x, axis_y + 66, plane_x, axis_y + 74, stroke=CORAL),
        line(a1[0], axis_y + 66, a1[0], axis_y + 74, stroke=CORAL),
        text((plane_x + a1[0]) / 2, axis_y + 86, "d − z", fill=CORAL, anchor="middle", size=12),
        text(70, 340, "f = 1 / (d − z)", size=14),
        text(70, 360, "x′ = f x     y′ = f y     — farther ⇒ smaller f", size=12, fill=INK2),
    ]
    return svg(580, 390, "\n".join(body))


def main() -> None:
    written = [
        write("rotation-ccw.svg", counterclockwise()),
        write("rotation-cw.svg", clockwise()),
        write("rotation-decomposition.svg", decomposition()),
        write("rotation-perspective.svg", perspective()),
        write("rotation-f-projection.svg", f_projection()),
    ]
    for p in written:
        print(p.relative_to(Path(__file__).resolve().parents[1]))


if __name__ == "__main__":
    main()
