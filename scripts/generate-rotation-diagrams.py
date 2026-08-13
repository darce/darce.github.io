#!/usr/bin/env python3
"""Beginner geometry plates for the rotation-matrices article.

Physics, not node graphs. Labels match the article: d, s = 1/(d − z),
Ax / Az / Bx. No focal-length F. Tokens from styles/palettes.scss.
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


def svg(w: float, h: float, body: str, *, x: float = 0, y: float = 0) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x:.1f} {y:.1f} {w:.1f} {h:.1f}" '
        f'width="{w:.0f}" height="{h:.0f}" role="img">\n'
        f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" fill="{PAPER}"/>\n'
        f"{body}\n</svg>\n"
    )


def crop(pts: list, pad: float = 28) -> tuple[float, float, float, float]:
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    x0, y0 = min(xs) - pad, min(ys) - pad
    return x0, y0, max(xs) - x0 + pad, max(ys) - y0 + pad


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


def _l_floor():
    return [
        (0.06, 0.06, 0.0),
        (1.32, 0.06, 0.0),
        (1.32, 0.38, 0.0),
        (0.38, 0.38, 0.0),
        (0.38, 1.32, 0.0),
        (0.06, 1.32, 0.0),
    ]


def _apply_ops(pts, ops, ang):
    out = pts
    for fn in ops:
        out = [fn(p, ang) for p in out]
    return out


def _iso_arc(P, pts3, *, color, end) -> str:
    q = [P(p) for p in pts3]
    d = f"M{q[0][0]:.1f},{q[0][1]:.1f}" + "".join(f" L{p[0]:.1f},{p[1]:.1f}" for p in q[1:])
    return (
        f'<path d="{d}" fill="none" stroke="{color}" stroke-width="1.6" '
        f'marker-end="url(#{end})"/>'
    )


def _arc_pts(axis: str, r: float, a0: float, a1: float, n: int = 18):
    out = []
    for i in range(n + 1):
        t = a0 + (a1 - a0) * i / n
        c, s = math.cos(t), math.sin(t)
        if axis == "z":
            out.append((r * c, r * s, 0.0))
        else:
            out.append((0.0, r * c, r * s))
    return out


def combine_frame(
    prefix: str,
    title: str,
    current,
    ghost=None,
    *,
    change: str | None = None,
    ghost_label: str = "",
    ghost_at: int = 2,
    now_label: str = "",
    now_at: int = 2,
    note: str = "",
) -> tuple[list, str]:
    """One isometric step. Returns (crop points, svg body) for a shared camera."""
    S, ox, oy = 132, 90, 210

    def P(p):
        return _iso_zup(p, ox, oy, S)

    def poly(pts, *, fill, stroke, width, dash=None, opacity=0.18):
        d = " ".join(f"{P(p)[0]:.1f},{P(p)[1]:.1f}" for p in pts)
        extra = f' stroke-dasharray="{dash}"' if dash else ""
        return (
            f'<polygon points="{d}" fill="{fill}" fill-opacity="{opacity}" '
            f'stroke="{stroke}" stroke-width="{width}"{extra}/>'
        )

    o, px, py, pz = P((0, 0, 0)), P((1.35, 0, 0)), P((0, 1.35, 0)), P((0, 0, 1.25))
    floor = [(0.0, 0.0, 0.0), (1.35, 0.0, 0.0), (1.35, 1.35, 0.0), (0.0, 1.35, 0.0)]
    geom = [o, px, py, pz, *(P(p) for p in current), *(P(p) for p in floor)]
    if ghost:
        geom.extend(P(p) for p in ghost)

    title_pt = (o[0] - 8, pz[1] - 28)
    note_pt = (o[0] - 8, max(p[1] for p in geom) + 24)

    def axis_ink(name: str) -> tuple[str, str]:
        if change == name:
            return CORAL, f"{prefix}-coral"
        return INK, f"{prefix}-ink"

    x_stroke, x_end = axis_ink("x")
    z_stroke, z_end = axis_ink("z")

    body = [
        defs(prefix),
        poly(floor, fill=INK2, stroke=INK2, width=0.9, opacity=0.07),
        line(o[0], o[1], px[0], px[1], stroke=x_stroke, width=1.5, end=x_end),
        line(o[0], o[1], py[0], py[1], width=1.4, end=f"{prefix}-ink"),
        line(o[0], o[1], pz[0], pz[1], stroke=z_stroke, width=1.5, end=z_end),
        text(px[0] + 8, px[1] + 5, "x", size=15, fill=x_stroke),
        text(py[0] + 10, py[1] + 6, "y", size=15),
        text(pz[0] - 16, pz[1] - 4, "z", size=15, fill=z_stroke),
        text(title_pt[0], title_pt[1], title, size=16),
    ]
    geom.append(title_pt)
    if change == "z":
        body.append(_iso_arc(P, _arc_pts("z", 0.46, 0.18, 0.95), color=CORAL, end=f"{prefix}-coral"))
        rz = (pz[0] + 12, (o[1] + pz[1]) / 2 + 4)
        body.append(text(rz[0], rz[1], "Rz", size=14, fill=CORAL))
        geom.append(rz)
    elif change == "x":
        body.append(_iso_arc(P, _arc_pts("x", 0.46, 0.18, 0.95), color=CORAL, end=f"{prefix}-coral"))
        rx = ((o[0] + px[0]) / 2, px[1] - 16)
        body.append(text(rx[0], rx[1], "Rx", size=14, fill=CORAL, anchor="middle"))
        geom.append(rx)
    if ghost:
        body.append(poly(ghost, fill=INK2, stroke=INK2, width=1.2, dash="5 4", opacity=0.10))
        if ghost_label:
            g = P(ghost[ghost_at])
            body.append(text(g[0] + 8, g[1] - 10, ghost_label, size=12, fill=INK2))
            geom.append((g[0] + 52, g[1] - 10))
    body.append(poly(current, fill=CORAL, stroke=CORAL, width=1.8, opacity=0.20))
    if now_label:
        c = P(current[now_at])
        body.append(text(c[0] - 8, c[1] - 10, now_label, size=13, fill=CORAL, anchor="end"))
        geom.append((c[0] - 8 * len(now_label), c[1] - 10))
    if note:
        body.append(text(note_pt[0], note_pt[1], note, size=13, fill=INK2))
        geom.extend([note_pt, (note_pt[0] + 7.2 * len(note), note_pt[1])])
    return geom, "\n".join(body)


def combine_steps() -> list[tuple[str, str]]:
    ang = math.radians(65)
    start = _l_floor()
    after_z = _apply_ops(start, (_rz,), ang)
    after_zx = _apply_ops(start, (_rz, _rx), ang)
    after_xz = _apply_ops(start, (_rx, _rz), ang)
    specs = [
        dict(name="rotation-combine-1.svg", prefix="s1", title="1 · start", current=start, note="on the xy floor"),
        dict(
            name="rotation-combine-2.svg",
            prefix="s2",
            title="2 · apply Rz",
            current=after_z,
            ghost=start,
            change="z",
            now_label="after Rz",
            now_at=5,
            note="changing: turn around z — still flat",
        ),
        dict(
            name="rotation-combine-3.svg",
            prefix="s3",
            title="3 · then Rx",
            current=after_zx,
            ghost=after_z,
            change="x",
            ghost_label="after Rz",
            ghost_at=5,
            now_label="tipped",
            now_at=2,
            note="changing: that pose tips around x",
        ),
        dict(
            name="rotation-combine-4.svg",
            prefix="s4",
            title="4 · other order",
            current=after_xz,
            ghost=after_zx,
            ghost_label="step 3",
            ghost_at=2,
            now_label="Rx then Rz",
            now_at=5,
            note="same two turns, reverse order ≠ step 3",
        ),
    ]
    frames = []
    all_pts: list = []
    for spec in specs:
        name = spec.pop("name")
        pts, body = combine_frame(**spec)
        frames.append((name, body))
        all_pts.extend(pts)
    x0, y0, w, h = crop(all_pts, pad=20)
    return [(name, svg(w, h, body, x=x0, y=y0)) for name, body in frames]


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
    ox, oy = 70, 250
    S = 152

    def proj(p):
        return _iso(p, ox, oy, S)

    d, Az, Ax = 1.45, 2.75, 1.18
    Bx = Ax * d / Az

    eye = (0.0, 0.0, 0.0)
    pt = (Ax, 0.0, Az)
    hit = (Bx, 0.0, d)
    foot_a = (0.0, 0.0, Az)
    foot_b = (0.0, 0.0, d)
    plane = [
        (1.28, -0.82, d),
        (1.28, 0.82, d),
        (-0.72, 0.82, d),
        (-0.72, -0.82, d),
    ]

    Pe, Pa, Pb = proj(eye), proj(pt), proj(hit)
    Pfa, Pfb = proj(foot_a), proj(foot_b)
    Pp = [proj(p) for p in plane]
    Pz = proj((0.0, 0.0, Az + 0.22))
    Px = proj((1.38, 0.0, 0.0))
    Py = proj((0.0, 0.95, 0.0))
    plane_pts = " ".join(f"{p[0]:.1f},{p[1]:.1f}" for p in Pp)
    screen_lab = ((Pp[0][0] + Pp[1][0]) / 2, min(Pp[0][1], Pp[1][1]) - 14)

    body = [
        defs("pj"),
        line(Pe[0], Pe[1], Pz[0], Pz[1], width=1.4, end="pj-ink"),
        line(Pe[0], Pe[1], Px[0], Px[1], width=1.4, end="pj-ink"),
        line(Pe[0], Pe[1], Py[0], Py[1], width=1.4, end="pj-ink"),
        text(Pz[0] + 8, Pz[1] + 2, "z", size=16),
        text(Px[0] - 16, Px[1] - 4, "x", size=16),
        text(Py[0] + 8, Py[1] + 14, "y", size=16),
        f'<polygon points="{plane_pts}" fill="{BLUE}" fill-opacity="0.10" '
        f'stroke="{BLUE}" stroke-width="1.6"/>',
        text(screen_lab[0], screen_lab[1], "screen", fill=BLUE, size=14, anchor="middle"),
        f'<polygon points="{Pe[0]:.1f},{Pe[1]:.1f} {Pa[0]:.1f},{Pa[1]:.1f} {Pfa[0]:.1f},{Pfa[1]:.1f}" '
        f'fill="{CORAL}" fill-opacity="0.06" stroke="none"/>',
        line(Pe[0], Pe[1], Pa[0], Pa[1], stroke=CORAL, width=1.8, end="pj-coral"),
        line(Pb[0], Pb[1], Pfb[0], Pfb[1], stroke=INK2, width=1, dash="3 3"),
        line(Pa[0], Pa[1], Pfa[0], Pfa[1], stroke=INK2, width=1, dash="3 3"),
        eye_side(Pe[0], Pe[1]),
        circle(Pb[0], Pb[1], 5.5, fill=INK),
        text(Pb[0] + 10, Pb[1] - 4, "B", size=16),
        circle(Pa[0], Pa[1], 5.5, fill=CORAL),
        text(Pa[0] + 10, Pa[1] - 6, "A", size=16, fill=CORAL),
        *dim_along(Pe, Pfb, "d", offset=26, size=15),
        *dim_along(Pe, Pfa, "Az", offset=46, size=15),
        *dim_along(Pfa, Pa, "Ax", offset=16, color=CORAL, size=15),
        *dim_along(Pfb, Pb, "Bx", offset=-16, size=15),
    ]
    pts = [
        Pe, Pa, Pb, Pfa, Pfb, Pz, Px, Py, *Pp, screen_lab,
        (Pe[0] - 36, Pe[1] + 52), (Pa[0] + 36, Pa[1] - 18),
        (Pfa[0] + 20, Pfa[1] + 56), (Px[0] - 20, Px[1] - 12),
    ]
    x0, y0, w, h = crop(pts, pad=16)
    return svg(w, h, "\n".join(body), x=x0, y=y0)


def f_projection() -> str:
    """Same isometric frame. Same eye distance d, two depths."""
    ox, oy = 70, 250
    S = 142

    def proj(p):
        return _iso(p, ox, oy, S)

    d = 1.38
    h = 1.08
    z_near, z_far = 0.88, 1.85

    eye = (0.0, 0.0, 0.0)
    near = (h, 0.0, d + z_near)
    far = (h, 0.0, d + z_far)
    hit_n = (h * d / (d + z_near), 0.0, d)
    hit_f = (h * d / (d + z_far), 0.0, d)
    plane = [
        (1.22, -0.78, d),
        (1.22, 0.78, d),
        (-0.70, 0.78, d),
        (-0.70, -0.78, d),
    ]

    Pe, Pn, Pf = proj(eye), proj(near), proj(far)
    Pbn, Pbf = proj(hit_n), proj(hit_f)
    Pp = [proj(p) for p in plane]
    Pz = proj((0.0, 0.0, d + z_far + 0.18))
    Px = proj((1.32, 0.0, 0.0))
    Py = proj((0.0, 0.92, 0.0))
    Pplane = proj((0.0, 0.0, d))
    Pnz = proj((0.0, 0.0, d + z_near))
    plane_pts = " ".join(f"{p[0]:.1f},{p[1]:.1f}" for p in Pp)
    screen_lab = ((Pp[0][0] + Pp[1][0]) / 2, min(Pp[0][1], Pp[1][1]) - 14)
    formula = ((Pe[0] + Pplane[0]) / 2, min(Pp[0][1], Pp[1][1]) - 34)

    body = [
        defs("fp"),
        line(Pe[0], Pe[1], Pz[0], Pz[1], width=1.4, end="fp-ink"),
        line(Pe[0], Pe[1], Px[0], Px[1], width=1.4, end="fp-ink"),
        line(Pe[0], Pe[1], Py[0], Py[1], width=1.4, end="fp-ink"),
        text(Pz[0] + 8, Pz[1] + 2, "z", size=16),
        text(Px[0] - 16, Px[1] - 4, "x", size=16),
        text(Py[0] + 8, Py[1] + 14, "y", size=16),
        f'<polygon points="{plane_pts}" fill="{BLUE}" fill-opacity="0.10" '
        f'stroke="{BLUE}" stroke-width="1.6"/>',
        text(screen_lab[0], screen_lab[1], "screen", fill=BLUE, size=14, anchor="middle"),
        eye_side(Pe[0], Pe[1]),
        line(Pe[0], Pe[1], Pn[0], Pn[1], stroke=CORAL, width=1.8, end="fp-coral"),
        line(Pe[0], Pe[1], Pf[0], Pf[1], stroke=CORAL, width=1.4, dash="5 3"),
        circle(Pbn[0], Pbn[1], 5.5, fill=INK),
        circle(Pbf[0], Pbf[1], 4.5, fill=INK2),
        circle(Pn[0], Pn[1], 5.5, fill=CORAL),
        circle(Pf[0], Pf[1], 5.5, fill=CORAL),
        text(Pn[0] + 10, Pn[1] - 8, "near", fill=CORAL, size=15),
        text(Pf[0] + 10, Pf[1] - 8, "far", fill=CORAL, size=15),
        text(Pbn[0] - 12, Pbn[1] - 10, "x′", size=15, anchor="end"),
        text(Pbf[0] + 12, Pbf[1] + 6, "x″", size=14, fill=INK2),
        *dim_along(Pe, Pplane, "d", offset=26, size=15),
        *dim_along(Pplane, Pnz, "d − z", offset=26, color=CORAL, size=15),
        text(formula[0], formula[1], "s = 1/(d − z)", size=15, fill=INK, anchor="middle"),
    ]
    pts = [
        Pe, Pn, Pf, Pbn, Pbf, Pz, Px, Py, Pplane, Pnz, *Pp, screen_lab, formula,
        (Pe[0] - 40, Pe[1] + 48), (Pf[0] + 40, Pf[1] - 16),
        (Pn[0] + 48, Pn[1] - 10), (Pbn[0] - 28, Pbn[1] - 12),
    ]
    x0, y0, w, hgt = crop(pts, pad=16)
    return svg(w, hgt, "\n".join(body), x=x0, y=y0)


def main() -> None:
    written = [
        write("rotation-ccw.svg", counterclockwise()),
        write("rotation-cw.svg", clockwise()),
        write("rotation-apply.svg", apply_rotation()),
        write("rotation-perspective.svg", perspective()),
        write("rotation-f-projection.svg", f_projection()),
    ]
    written += [write(name, content) for name, content in combine_steps()]
    stale = OUT / "rotation-combine.svg"
    if stale.exists():
        stale.unlink()
        print(f"removed {stale.relative_to(Path(__file__).resolve().parents[1])}")
    root = Path(__file__).resolve().parents[1]
    for p in written:
        print(p.relative_to(root))


if __name__ == "__main__":
    main()
