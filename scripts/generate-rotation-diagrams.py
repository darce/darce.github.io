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
        text(ox + 88, oy - 18, "turn", size=14, fill=CORAL),
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
        text(ox + 88, oy + 32, "turn", size=14, fill=CORAL),
        text(24, 328, "y points down — how a screen is numbered", size=12, fill=INK2),
    ]
    return svg(360, 348, "\n".join(body))


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


def _rodrigues(p, u, theta):
    c, s = math.cos(theta), math.sin(theta)
    return _add(
        _add(_scale(p, c), _scale(_cross(u, p), s)),
        _scale(u, _dot(u, p) * (1.0 - c)),
    )


def _eiffel_edges():
    """Hard-edge tower: 4 legs, two decks, tip. Stands on z = 0, up is +z."""

    def sq(h, z):
        return [(-h, -h, z), (h, -h, z), (h, h, z), (-h, h, z)]

    base, mid, top = sq(0.56, 0.0), sq(0.22, 0.48), sq(0.08, 1.22)
    plat1, plat2 = sq(0.28, 0.55), sq(0.11, 1.28)
    tip = (0.0, 0.0, 1.82)
    edges = []
    for ring in (base, plat1, plat2):
        for i in range(4):
            edges.append((ring[i], ring[(i + 1) % 4]))
    for i in range(4):
        edges.append((base[i], mid[i]))
        edges.append((mid[i], top[i]))
        edges.append((top[i], tip))
    # front arch — gives the tower a facing
    arch_l, arch_r = (-0.28, -0.50, 0.0), (0.28, -0.50, 0.0)
    arch_c = (0.0, -0.42, 0.22)
    edges.extend([(arch_l, arch_c), (arch_c, arch_r)])
    return edges, tip, base


def decomposition() -> str:
    """Eiffel tower on the x–y ground, spun around a vertical axis."""
    S = 168
    theta = math.radians(62)
    u = (0.0, 0.0, 1.0)

    def raw(p):
        x, y, z = p
        return (-0.62 * S * x + S * y, 0.42 * S * x - S * z)

    edges, tip, base = _eiffel_edges()
    o = (0.0, 0.0, 0.0)
    axis_top = (0.0, 0.0, 2.15)
    axis_bot = (0.0, 0.0, -0.12)
    # ground plane
    g = 0.95
    ground = [(-g, -g, 0.0), (g, -g, 0.0), (g, g, 0.0), (-g, g, 0.0)]
    grid = []
    for t in (-0.45, 0.0, 0.45):
        grid.append(((-g, t, 0.0), (g, t, 0.0)))
        grid.append(((t, -g, 0.0), (t, g, 0.0)))
    ax = (1.15, 0.0, 0.0)
    ay = (0.0, 1.15, 0.0)
    # a base corner that travels — used to label before / after
    corner = base[1]
    corner2 = _rodrigues(corner, u, theta)

    pts = [o, axis_top, axis_bot, tip, ax, ay, corner, corner2, *ground]
    for a, b in edges:
        pts.extend([a, b, _rodrigues(a, u, theta), _rodrigues(b, u, theta)])
    pr = [raw(p) for p in pts]
    pad = 36
    min_x = min(p[0] for p in pr) - pad
    max_x = max(p[0] for p in pr) + pad + 70
    min_y = min(p[1] for p in pr) - pad
    max_y = max(p[1] for p in pr) + pad + 8
    ox, oy = -min_x, -min_y

    def P(p):
        s = raw(p)
        return (s[0] + ox, s[1] + oy)

    def vline(a, b, **kw):
        pa, pb = P(a), P(b)
        return line(pa[0], pa[1], pb[0], pb[1], **kw)

    def ring(pts3, **kw):
        return [vline(pts3[i], pts3[(i + 1) % len(pts3)], **kw) for i in range(len(pts3))]

    Pcor, Pcor2 = P(corner), P(corner2)
    Pax, Pay = P(ax), P(ay)
    Pu = P(axis_top)
    ground_pts = " ".join(f"{P(p)[0]:.1f},{P(p)[1]:.1f}" for p in ground)

    # turn arc at a moving base corner — the tip sits on the axis and does not travel
    arc = []
    for i in range(14):
        t = theta * i / 13
        arc.append(P(_rodrigues(corner, u, t)))
    ad = f"M{arc[0][0]:.1f},{arc[0][1]:.1f} " + " ".join(
        f"L{p[0]:.1f},{p[1]:.1f}" for p in arc[1:]
    )

    ghost, solid = [], []
    for a, b in edges:
        ghost.append(vline(a, b, stroke=INK2, width=1.15, dash="5 4"))
        solid.append(
            vline(_rodrigues(a, u, theta), _rodrigues(b, u, theta), stroke=CORAL, width=1.6)
        )

    w, h = max_x - min_x, max_y - min_y
    body = [
        defs("rd"),
        f'<polygon points="{ground_pts}" fill="{BLUE}" fill-opacity="0.06" '
        f'stroke="{BLUE}" stroke-width="1.2"/>',
        *[vline(a, b, stroke=BLUE, width=0.8) for a, b in grid],
        vline(o, ax, width=1.4, end="rd-ink"),
        vline(o, ay, width=1.4, end="rd-ink"),
        vline(axis_bot, axis_top, stroke=BLUE, width=2.0, end="rd-blue"),
        *ghost,
        *solid,
        f'<path d="{ad}" fill="none" stroke="{CORAL}" stroke-width="1.3"/>',
        text(Pax[0] + 8, Pax[1] + 4, "x", size=14),
        text(Pay[0] + 8, Pay[1] + 4, "y", size=14),
        text(Pu[0] + 10, Pu[1] + 2, "spin axis", fill=BLUE, size=14),
        text(Pcor[0] - 8, Pcor[1] + 16, "before", fill=INK2, size=13, anchor="end"),
        text(Pcor2[0] + 14, Pcor2[1] + 22, "after", fill=CORAL, size=14),
    ]
    return svg(round(w), round(h), "\n".join(body))


def _iso(p, ox, oy, S):
    x, y, z = p
    return (ox + S * z + 0.55 * S * x, oy - S * y + 0.32 * S * x)


def perspective() -> str:
    """One ray: eye → screen hit → point. Similar triangles, no Bx/Az."""
    ox, oy = 96, 248
    S = 100

    def proj(p):
        return _iso(p, ox, oy, S)

    depth_plane, depth_pt, height = 1.55, 3.05, 1.28
    hit_h = height * depth_plane / depth_pt

    eye = (0.0, 0.0, 0.0)
    pt = (0.0, height, depth_pt)
    hit = (0.0, hit_h, depth_plane)
    plane = [
        (-1.0, 1.55, depth_plane),
        (1.0, 1.55, depth_plane),
        (1.0, -1.05, depth_plane),
        (-1.0, -1.05, depth_plane),
    ]

    Pe, Pa, Pb = proj(eye), proj(pt), proj(hit)
    Pp = [proj(p) for p in plane]
    axis = proj((0, 0, depth_pt + 0.4))
    yup = proj((0, 1.7, 0))
    plane_pts = " ".join(f"{p[0]:.1f},{p[1]:.1f}" for p in Pp)

    # light similar-triangle wash
    foot_a = proj((0, 0, depth_pt))
    foot_b = proj((0, 0, depth_plane))

    body = [
        defs("pj"),
        line(Pe[0], Pe[1], axis[0], axis[1], width=1.2, end="pj-ink"),
        line(Pe[0], Pe[1] - 28, yup[0], yup[1], width=1.2, end="pj-ink"),
        text(axis[0] + 8, axis[1] + 4, "depth", size=13),
        text(yup[0] - 14, yup[1] - 8, "up", size=13),
        f'<polygon points="{plane_pts}" fill="{BLUE}" fill-opacity="0.10" '
        f'stroke="{BLUE}" stroke-width="1.5"/>',
        text((Pp[0][0] + Pp[1][0]) / 2, min(Pp[0][1], Pp[1][1]) - 10, "screen", fill=BLUE, size=13, anchor="middle"),
        f'<polygon points="{Pe[0]:.1f},{Pe[1]:.1f} {Pa[0]:.1f},{Pa[1]:.1f} {foot_a[0]:.1f},{foot_a[1]:.1f}" '
        f'fill="{CORAL}" fill-opacity="0.06" stroke="none"/>',
        line(Pe[0], Pe[1], Pa[0], Pa[1], stroke=CORAL, width=1.7, end="pj-coral"),
        line(Pb[0], Pb[1], foot_b[0], foot_b[1], stroke=INK2, width=1, dash="3 3"),
        line(Pa[0], Pa[1], foot_a[0], foot_a[1], stroke=INK2, width=1, dash="3 3"),
        eye_side(Pe[0], Pe[1]),
        circle(Pb[0], Pb[1], 5, fill=INK),
        text(Pb[0] - 10, Pb[1] - 12, "on screen", size=13, anchor="end"),
        circle(Pa[0], Pa[1], 5, fill=CORAL),
        text(Pa[0] + 10, Pa[1] - 6, "point in space", size=13, fill=CORAL),
        *dim_h(Pe[0], Pe[1] + 36, foot_b[0], "F", sub="focal length"),
    ]
    return svg(640, 430, "\n".join(body))


def f_projection() -> str:
    """Same height, two depths: farther lands lower on the screen."""
    ox, oy = 96, 248
    S = 94

    def proj(p):
        return _iso(p, ox, oy, S)

    d = 1.5
    h = 1.2
    z_near, z_far = 1.05, 2.25

    eye = (0.0, 0.0, 0.0)
    near = (0.0, h, d + z_near)
    far = (0.0, h, d + z_far)
    hit_n = (0.0, h * d / (d + z_near), d)
    hit_f = (0.0, h * d / (d + z_far), d)
    plane = [
        (-0.95, 1.5, d),
        (0.95, 1.5, d),
        (0.95, -1.1, d),
        (-0.95, -1.1, d),
    ]

    Pe, Pn, Pf = proj(eye), proj(near), proj(far)
    Pbn, Pbf = proj(hit_n), proj(hit_f)
    Pp = [proj(p) for p in plane]
    axis = proj((0, 0, d + z_far + 0.35))
    plane_pts = " ".join(f"{p[0]:.1f},{p[1]:.1f}" for p in Pp)

    body = [
        defs("fp"),
        line(Pe[0], Pe[1], axis[0], axis[1], width=1.2, end="fp-ink"),
        text(axis[0] + 8, axis[1] + 4, "depth", size=13),
        f'<polygon points="{plane_pts}" fill="{BLUE}" fill-opacity="0.10" '
        f'stroke="{BLUE}" stroke-width="1.5"/>',
        text((Pp[0][0] + Pp[1][0]) / 2, min(Pp[0][1], Pp[1][1]) - 10, "screen", fill=BLUE, size=13, anchor="middle"),
        eye_side(Pe[0], Pe[1]),
        line(Pe[0], Pe[1], Pn[0], Pn[1], stroke=CORAL, width=1.7, end="fp-coral"),
        line(Pe[0], Pe[1], Pf[0], Pf[1], stroke=CORAL, width=1.3, dash="5 3"),
        circle(Pbn[0], Pbn[1], 5, fill=INK),
        circle(Pbf[0], Pbf[1], 4, fill=INK2),
        circle(Pn[0], Pn[1], 5, fill=CORAL),
        circle(Pf[0], Pf[1], 5, fill=CORAL),
        text(Pn[0] + 10, Pn[1] - 8, "near", fill=CORAL, size=14),
        text(Pf[0] + 10, Pf[1] - 8, "far", fill=CORAL, size=14),
        text(Pbn[0] - 12, Pbn[1] - 12, "bigger", size=13, anchor="end"),
        text(Pbf[0] + 12, Pbf[1] + 4, "smaller", size=13, fill=INK2),
        *dim_h(Pe[0], Pe[1] + 36, proj((0, 0, d))[0], "F", sub="focal length"),
    ]
    return svg(640, 420, "\n".join(body))


def main() -> None:
    written = [
        write("rotation-ccw.svg", counterclockwise()),
        write("rotation-cw.svg", clockwise()),
        write("rotation-decomposition.svg", decomposition()),
        write("rotation-perspective.svg", perspective()),
        write("rotation-f-projection.svg", f_projection()),
    ]
    root = Path(__file__).resolve().parents[1]
    for p in written:
        print(p.relative_to(root))


if __name__ == "__main__":
    main()
