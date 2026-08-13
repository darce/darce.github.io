#!/usr/bin/env python3
"""Beginner geometry plates for the rotation-matrices article.

Physics, not node graphs. Plain-language labels — no P(v), Bx/Az, f=.
Tokens from styles/palettes.scss.
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
FONT = "ui-monospace, GeistMonoVariableVF, Helvetica, monospace"


def svg(w: float, h: float, body: str) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
        f'width="{w}" height="{h}" role="img">\n'
        f'<rect width="{w}" height="{h}" fill="{PAPER}"/>\n'
        f"{body}\n</svg>\n"
    )


def defs(prefix: str) -> str:
    parts = []
    for name, color in (("ink", INK), ("coral", CORAL), ("blue", BLUE)):
        parts.append(
            f'<marker id="{prefix}-{name}" viewBox="0 0 10 10" refX="9" refY="5" '
            f'markerWidth="6.5" markerHeight="6.5" orient="auto">'
            f'<path d="M0,0 L10,5 L0,10 z" fill="{color}"/>'
            f"</marker>"
        )
    return "<defs>\n" + "\n".join(parts) + "\n</defs>"


def text(x, y, s, *, size=13, fill=INK, anchor="start") -> str:
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="{FONT}" font-size="{size}" '
        f'fill="{fill}" text-anchor="{anchor}">{s}</text>'
    )


def line(x1, y1, x2, y2, *, stroke=INK, width=1.2, end=None, dash=None) -> str:
    extra = ""
    if end:
        extra += f' marker-end="url(#{end})"'
    if dash:
        extra += f' stroke-dasharray="{dash}"'
    return (
        f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
        f'stroke="{stroke}" stroke-width="{width}" fill="none"{extra}/>'
    )


def dim_h(x1, y, x2, label, *, color=INK2, sub=None) -> list[str]:
    """Horizontal measure with end ticks."""
    mid = (x1 + x2) / 2
    out = [
        line(x1, y, x2, y, stroke=color, width=1),
        line(x1, y - 4, x1, y + 4, stroke=color, width=1),
        line(x2, y - 4, x2, y + 4, stroke=color, width=1),
        text(mid, y + 16, label, size=15, fill=color, anchor="middle"),
    ]
    if sub:
        out.append(text(mid, y + 32, sub, size=11, fill=color, anchor="middle"))
    return out


def dim_v(x, y1, y2, label, *, color=INK2, side=-1) -> list[str]:
    """Vertical measure with end ticks. side −1 = label to the left."""
    mid = (y1 + y2) / 2
    lx = x + 12 * side
    return [
        line(x, y1, x, y2, stroke=color, width=1),
        line(x - 4, y1, x + 4, y1, stroke=color, width=1),
        line(x - 4, y2, x + 4, y2, stroke=color, width=1),
        text(lx, mid + 4, label, size=13, fill=color, anchor="end" if side < 0 else "start"),
    ]


def circle(x, y, r, *, fill=INK, stroke=None, sw=0) -> str:
    extra = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    return f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="{fill}"{extra}/>'


def eye_side(cx: float, cy: float) -> str:
    """Wiki-style side view: two rays + quarter-circle, opening toward the screen.

    Same mark as Perspective_transform_diagram.svg (axes + arc at the camera).
    (cx, cy) is the ray origin.
    """
    r = 18.0
    arm = 22.0
    # 90° opening, looking right — same as the wiki triad, aimed down the axis
    a0, a1 = math.radians(-45), math.radians(45)
    ux = cx + arm * math.cos(a1)
    uy = cy - arm * math.sin(a1)
    lx = cx + arm * math.cos(a0)
    ly = cy - arm * math.sin(a0)
    ax0 = cx + r * math.cos(a1)
    ay0 = cy - r * math.sin(a1)
    ax1 = cx + r * math.cos(a0)
    ay1 = cy - r * math.sin(a0)
    fill = (
        f'<path d="M{cx:.1f},{cy:.1f} L{ax0:.1f},{ay0:.1f} '
        f'A{r:.1f},{r:.1f} 0 0 1 {ax1:.1f},{ay1:.1f} Z" '
        f'fill="{PAPER}" stroke="none"/>'
    )
    lids = (
        f'<path d="M{ux:.1f},{uy:.1f} L{cx:.1f},{cy:.1f} L{lx:.1f},{ly:.1f}" '
        f'fill="none" stroke="{INK}" stroke-width="1.6" stroke-linejoin="miter"/>'
    )
    arc = (
        f'<path d="M{ax0:.1f},{ay0:.1f} A{r:.1f},{r:.1f} 0 0 1 {ax1:.1f},{ay1:.1f}" '
        f'fill="none" stroke="{INK}" stroke-width="1.6"/>'
    )
    return "\n".join([fill, lids, arc])


def write(name: str, content: str) -> Path:
    path = OUT / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return path


def _arc_arrow(ox, oy, r, a0, a1, *, color=CORAL, ccw=True) -> str:
    x0 = ox + r * math.cos(a0)
    y0 = oy - r * math.sin(a0)
    x1 = ox + r * math.cos(a1)
    y1 = oy - r * math.sin(a1)
    sweep = 0 if ccw else 1
    am = a0 + 0.72 * (a1 - a0)
    mx = ox + r * math.cos(am)
    my = oy - r * math.sin(am)
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
    """Math frame: y up, turn left from +x."""
    ox, oy = 78, 292
    reach = 230
    ang = math.radians(32)
    px = ox + reach * math.cos(ang)
    py = oy - reach * math.sin(ang)
    body = [
        defs("ccw"),
        line(ox, oy, ox + reach + 8, oy, width=1.6, end="ccw-ink"),
        line(ox, oy, ox, oy - reach - 8, width=1.6, end="ccw-ink"),
        line(ox, oy, px, py, stroke=CORAL, width=2, end="ccw-coral"),
        _arc_arrow(ox, oy, 72, 0, ang, ccw=True),
        text(ox + reach + 16, oy + 5, "x", size=16),
        text(ox - 20, oy - reach - 14, "y", size=16),
        text(ox + 88, oy - 18, "θ", size=16, fill=CORAL),
        text(24, 328, "y points up — the usual math picture", size=12, fill=INK2),
    ]
    return svg(360, 348, "\n".join(body))


def clockwise() -> str:
    """Screen frame: y down, turn right from +x."""
    ox, oy = 78, 48
    reach = 230
    ang = math.radians(32)
    px = ox + reach * math.cos(ang)
    py = oy + reach * math.sin(ang)
    body = [
        defs("cw"),
        line(ox, oy, ox + reach + 8, oy, width=1.6, end="cw-ink"),
        line(ox, oy, ox, oy + reach + 8, width=1.6, end="cw-ink"),
        line(ox, oy, px, py, stroke=CORAL, width=2, end="cw-coral"),
        _arc_arrow(ox, oy, 72, 0, -ang, ccw=False),
        text(ox + reach + 16, oy + 5, "x", size=16),
        text(ox - 20, oy + reach + 22, "y", size=16),
        text(ox + 88, oy + 32, "θ", size=16, fill=CORAL),
        text(24, 328, "y points down — how a screen is numbered", size=12, fill=INK2),
    ]
    return svg(360, 348, "\n".join(body))


def _rot2(p, ang):
    x, y = p
    c, s = math.cos(ang), math.sin(ang)
    return (x * c - y * s, x * s + y * c)


def apply_rotation() -> str:
    """Flat x–y plane. A simple L turns around the origin."""
    ox, oy = 200, 312
    ang = math.radians(50)
    # L in the first quadrant — any rigid shape; orientation is obvious
    L = [(36, 0), (168, 0), (168, 40), (76, 40), (76, 168), (36, 168)]
    L2 = [_rot2(p, ang) for p in L]

    def S(p):
        return (ox + p[0], oy - p[1])

    def poly(pts, *, fill, stroke, width, dash=None):
        d = " ".join(f"{S(p)[0]:.1f},{S(p)[1]:.1f}" for p in pts)
        extra = f' stroke-dasharray="{dash}"' if dash else ""
        return (
            f'<polygon points="{d}" fill="{fill}" fill-opacity="0.12" '
            f'stroke="{stroke}" stroke-width="{width}"{extra}/>'
        )

    r = 56
    ax0, ay0 = S((r, 0))
    ax1 = ox + r * math.cos(ang)
    ay1 = oy - r * math.sin(ang)
    mid = S(_rot2((r - 10, 0), ang * 0.42))

    body = [
        defs("rd"),
        line(ox - 160, oy, ox + 220, oy, width=1.5, end="rd-ink"),
        line(ox, oy + 20, ox, oy - 250, width=1.5, end="rd-ink"),
        poly(L, fill=INK2, stroke=INK2, width=1.4, dash="6 4"),
        poly(L2, fill=CORAL, stroke=CORAL, width=1.7),
        f'<path d="M{ax0:.1f},{ay0:.1f} A{r:.1f},{r:.1f} 0 0 0 {ax1:.1f},{ay1:.1f}" '
        f'fill="none" stroke="{CORAL}" stroke-width="1.4" marker-end="url(#rd-coral)"/>',
        circle(ox, oy, 3.5, fill=INK),
        text(ox + 228, oy + 5, "x", size=16),
        text(ox - 18, oy - 256, "y", size=16),
        text(S((168, 0))[0] + 8, S((168, 0))[1] + 20, "before", fill=INK2, size=13),
        text(S(L2[1])[0] + 10, S(L2[1])[1] - 6, "after", fill=CORAL, size=14),
        text(mid[0] - 4, mid[1] + 2, "θ", fill=CORAL, size=16, anchor="end"),
    ]
    return svg(460, 360, "\n".join(body))


def _rx(p, a):
    x, y, z = p
    c, s = math.cos(a), math.sin(a)
    return (x, y * c - z * s, y * s + z * c)


def _rz(p, a):
    x, y, z = p
    c, s = math.cos(a), math.sin(a)
    return (x * c - y * s, x * s + y * c, z)


def _iso_zup(p, ox, oy, S):
    """z up, x right, y receding — world frame for Rx / Rz."""
    x, y, z = p
    return (ox + S * x + 0.55 * S * y, oy - S * z + 0.32 * S * y)


def combine_rotations() -> str:
    """Two panels: Rz then Rx vs Rx then Rz. Same L, different order."""
    ang = math.radians(70)
    # L on the xy floor — two arms, obvious heading
    L = [
        (0.08, 0.08, 0.0),
        (1.15, 0.08, 0.0),
        (1.15, 0.32, 0.0),
        (0.32, 0.32, 0.0),
        (0.32, 1.15, 0.0),
        (0.08, 1.15, 0.0),
    ]

    def seq(pts, ops):
        out = pts
        for fn in ops:
            out = [fn(p, ang) for p in out]
        return out

    left = seq(L, (_rz, _rx))
    right = seq(L, (_rx, _rz))

    def panel(ox, oy, result, title, prefix):
        S = 88

        def P(p):
            return _iso_zup(p, ox, oy, S)

        def poly(pts, *, fill, stroke, width, dash=None):
            d = " ".join(f"{P(p)[0]:.1f},{P(p)[1]:.1f}" for p in pts)
            extra = f' stroke-dasharray="{dash}"' if dash else ""
            return (
                f'<polygon points="{d}" fill="{fill}" fill-opacity="0.14" '
                f'stroke="{stroke}" stroke-width="{width}"{extra}/>'
            )

        o, px, py, pz = P((0, 0, 0)), P((1.35, 0, 0)), P((0, 1.35, 0)), P((0, 0, 1.25))
        return [
            defs(prefix),
            line(o[0], o[1], px[0], px[1], width=1.3, end=f"{prefix}-ink"),
            line(o[0], o[1], py[0], py[1], width=1.3, end=f"{prefix}-ink"),
            line(o[0], o[1], pz[0], pz[1], width=1.3, end=f"{prefix}-ink"),
            text(px[0] + 8, px[1] + 4, "x", size=14),
            text(py[0] + 10, py[1] + 4, "y", size=14),
            text(pz[0] - 14, pz[1] - 4, "z", size=14),
            poly(L, fill=INK2, stroke=INK2, width=1.2, dash="5 4"),
            poly(result, fill=CORAL, stroke=CORAL, width=1.6),
            text(ox + 20, 28, title, size=14),
        ]

    body = [
        *panel(90, 230, left, "Rz then Rx", "c1"),
        *panel(400, 230, right, "Rx then Rz", "c2"),
    ]
    return svg(680, 320, "\n".join(body))


def _iso(p, ox, oy, S):
    """Isometric pinhole frame: +x up, +y width (right-down), +z depth (right-up).

    Matches the standing image plane: its edges run with x and y; z
    pierces the plane. Not a 2D side-view triad laid on a 3D plate.
    """
    x, y, z = p
    return (
        ox + 0.88 * S * z + 0.52 * S * y,
        oy - 0.92 * S * x - 0.38 * S * z + 0.30 * S * y,
    )


def dim_along(a, b, label, *, offset, color=INK2, size=13) -> list[str]:
    """Measure between two already-projected points, offset in screen-perpendicular."""
    dx, dy = b[0] - a[0], b[1] - a[1]
    length = math.hypot(dx, dy) or 1.0
    px, py = -dy / length * offset, dx / length * offset
    a2, b2 = (a[0] + px, a[1] + py), (b[0] + px, b[1] + py)
    nx, ny = px / offset, py / offset
    mx, my = (a2[0] + b2[0]) / 2, (a2[1] + b2[1]) / 2
    lx, ly = mx + nx * 10, my + ny * 10 + 4
    return [
        line(a2[0], a2[1], b2[0], b2[1], stroke=color, width=1),
        line(a2[0] - nx * 4, a2[1] - ny * 4, a2[0] + nx * 4, a2[1] + ny * 4, stroke=color, width=1),
        line(b2[0] - nx * 4, b2[1] - ny * 4, b2[0] + nx * 4, b2[1] + ny * 4, stroke=color, width=1),
        text(lx, ly, label, size=size, fill=color, anchor="middle"),
    ]


def perspective() -> str:
    """Isometric pinhole: x up, y across the screen, z through the plane."""
    ox, oy = 120, 300
    S = 92

    def proj(p):
        return _iso(p, ox, oy, S)

    F, Az, Ax = 1.55, 3.10, 1.28
    Bx = Ax * F / Az

    eye = (0.0, 0.0, 0.0)
    # similar-triangle plane is xz (y = 0)
    pt = (Ax, 0.0, Az)
    hit = (Bx, 0.0, F)
    foot_a = (0.0, 0.0, Az)
    foot_b = (0.0, 0.0, F)
    plane = [
        (1.55, -1.05, F),
        (1.55, 1.05, F),
        (-1.05, 1.05, F),
        (-1.05, -1.05, F),
    ]

    Pe, Pa, Pb = proj(eye), proj(pt), proj(hit)
    Pfa, Pfb = proj(foot_a), proj(foot_b)
    Pp = [proj(p) for p in plane]
    Pz = proj((0.0, 0.0, Az + 0.55))
    Px = proj((1.75, 0.0, 0.0))
    Py = proj((0.0, 1.35, 0.0))
    plane_pts = " ".join(f"{p[0]:.1f},{p[1]:.1f}" for p in Pp)

    body = [
        defs("pj"),
        line(Pe[0], Pe[1], Pz[0], Pz[1], width=1.3, end="pj-ink"),
        line(Pe[0], Pe[1], Px[0], Px[1], width=1.3, end="pj-ink"),
        line(Pe[0], Pe[1], Py[0], Py[1], width=1.3, end="pj-ink"),
        text(Pz[0] + 8, Pz[1] + 2, "z", size=14),
        text(Px[0] - 14, Px[1] - 6, "x", size=14),
        text(Py[0] + 8, Py[1] + 12, "y", size=14),
        f'<polygon points="{plane_pts}" fill="{BLUE}" fill-opacity="0.10" '
        f'stroke="{BLUE}" stroke-width="1.5"/>',
        text((Pp[0][0] + Pp[1][0]) / 2 - 8, min(Pp[0][1], Pp[1][1]) - 12, "screen", fill=BLUE, size=13, anchor="middle"),
        f'<polygon points="{Pe[0]:.1f},{Pe[1]:.1f} {Pa[0]:.1f},{Pa[1]:.1f} {Pfa[0]:.1f},{Pfa[1]:.1f}" '
        f'fill="{CORAL}" fill-opacity="0.06" stroke="none"/>',
        line(Pe[0], Pe[1], Pa[0], Pa[1], stroke=CORAL, width=1.7, end="pj-coral"),
        line(Pb[0], Pb[1], Pfb[0], Pfb[1], stroke=INK2, width=1, dash="3 3"),
        line(Pa[0], Pa[1], Pfa[0], Pfa[1], stroke=INK2, width=1, dash="3 3"),
        eye_side(Pe[0], Pe[1]),
        circle(Pb[0], Pb[1], 5, fill=INK),
        text(Pb[0] + 10, Pb[1] - 4, "B", size=14),
        circle(Pa[0], Pa[1], 5, fill=CORAL),
        text(Pa[0] + 10, Pa[1] - 6, "A", size=14, fill=CORAL),
        *dim_along(Pe, Pfb, "d", offset=30),
        *dim_along(Pe, Pfa, "Az", offset=50),
        *dim_along(Pfa, Pa, "Ax", offset=16, color=CORAL),
        *dim_along(Pfb, Pb, "Bx", offset=-16),
    ]
    return svg(640, 460, "\n".join(body))


def f_projection() -> str:
    """Same isometric frame. Same eye distance d, two depths."""
    ox, oy = 120, 300
    S = 88

    def proj(p):
        return _iso(p, ox, oy, S)

    d = 1.55
    h = 1.20
    z_near, z_far = 1.10, 2.30

    eye = (0.0, 0.0, 0.0)
    near = (h, 0.0, d + z_near)
    far = (h, 0.0, d + z_far)
    hit_n = (h * d / (d + z_near), 0.0, d)
    hit_f = (h * d / (d + z_far), 0.0, d)
    plane = [
        (1.50, -1.00, d),
        (1.50, 1.00, d),
        (-1.05, 1.00, d),
        (-1.05, -1.00, d),
    ]

    Pe, Pn, Pf = proj(eye), proj(near), proj(far)
    Pbn, Pbf = proj(hit_n), proj(hit_f)
    Pp = [proj(p) for p in plane]
    Pz = proj((0.0, 0.0, d + z_far + 0.45))
    Px = proj((1.70, 0.0, 0.0))
    Py = proj((0.0, 1.30, 0.0))
    Pplane = proj((0.0, 0.0, d))
    Pnz = proj((0.0, 0.0, d + z_near))
    plane_pts = " ".join(f"{p[0]:.1f},{p[1]:.1f}" for p in Pp)

    body = [
        defs("fp"),
        line(Pe[0], Pe[1], Pz[0], Pz[1], width=1.3, end="fp-ink"),
        line(Pe[0], Pe[1], Px[0], Px[1], width=1.3, end="fp-ink"),
        line(Pe[0], Pe[1], Py[0], Py[1], width=1.3, end="fp-ink"),
        text(Pz[0] + 8, Pz[1] + 2, "z", size=14),
        text(Px[0] - 14, Px[1] - 6, "x", size=14),
        text(Py[0] + 8, Py[1] + 12, "y", size=14),
        f'<polygon points="{plane_pts}" fill="{BLUE}" fill-opacity="0.10" '
        f'stroke="{BLUE}" stroke-width="1.5"/>',
        text((Pp[0][0] + Pp[1][0]) / 2 - 8, min(Pp[0][1], Pp[1][1]) - 12, "screen", fill=BLUE, size=13, anchor="middle"),
        eye_side(Pe[0], Pe[1]),
        line(Pe[0], Pe[1], Pn[0], Pn[1], stroke=CORAL, width=1.7, end="fp-coral"),
        line(Pe[0], Pe[1], Pf[0], Pf[1], stroke=CORAL, width=1.3, dash="5 3"),
        circle(Pbn[0], Pbn[1], 5, fill=INK),
        circle(Pbf[0], Pbf[1], 4, fill=INK2),
        circle(Pn[0], Pn[1], 5, fill=CORAL),
        circle(Pf[0], Pf[1], 5, fill=CORAL),
        text(Pn[0] + 10, Pn[1] - 8, "near", fill=CORAL, size=14),
        text(Pf[0] + 10, Pf[1] - 8, "far", fill=CORAL, size=14),
        text(Pbn[0] - 12, Pbn[1] - 10, "x′", size=14, anchor="end"),
        text(Pbf[0] + 12, Pbf[1] + 4, "x″", size=13, fill=INK2),
        *dim_along(Pe, Pplane, "d", offset=32),
        *dim_along(Pplane, Pnz, "d − z", offset=32, color=CORAL),
    ]
    return svg(660, 460, "\n".join(body))


def main() -> None:
    written = [
        write("rotation-ccw.svg", counterclockwise()),
        write("rotation-cw.svg", clockwise()),
        write("rotation-apply.svg", apply_rotation()),
        write("rotation-combine.svg", combine_rotations()),
        write("rotation-perspective.svg", perspective()),
        write("rotation-f-projection.svg", f_projection()),
    ]
    root = Path(__file__).resolve().parents[1]
    for p in written:
        print(p.relative_to(root))


if __name__ == "__main__":
    main()
