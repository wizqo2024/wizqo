#!/usr/bin/env python3
from pathlib import Path
from string import Template

HTML_TEMPLATE = Template("""
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Tracing the number ${num} (${word})</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      @page { size: A4; margin: 18mm; }
      html, body { margin:0; padding:0; }
      body { font-family: Arial, Helvetica, sans-serif; color:#111; }
      .brand { display:flex; align-items:center; gap:10px; font-weight:700; font-size:18px; }
      h1 { font-size:22px; margin:8px 0 12px; }
      .sub { font-size:12px; color:#3a3a3a; }
      .sheet { border-top:3px solid #6aa0ff; padding-top:10px; }

      /* tracing lines */
      .trace-row { border-bottom:2px solid #333; margin:12px 0; height:46px; position:relative; }
      .trace-row .mid { position:absolute; left:0; right:0; top:50%; height:0; border-top:2px dotted #9aa; }
      .trace-cell { position:absolute; top:4px; bottom:4px; width:48px; text-align:center; font-size:36px; color:#888; }
      .trace-cell.solid { color:#111; }

      /* count box */
      .grid-box { border:2px solid #9cc2ff; padding:10px; }
      .grid-title { font-size:16px; margin-bottom:8px; }
      .numbers { display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; font-size:28px; text-align:center; }

      .footer-word { font-size:110px; letter-spacing:4px; text-align:center; margin-top:10px; font-family: 'Century Gothic', Arial, sans-serif; }

      .flex { display:flex; gap:24px; align-items:flex-start; }
      .apple { width:90px; height:90px; border-radius:12px; background: radial-gradient(circle at 30% 30%, #ff6b6b, #b00020); position:relative; }
      .apple:before { content:""; position:absolute; width:16px; height:16px; background:#4caf50; border-radius:3px; left:34px; top:-6px; transform:rotate(20deg); }
      .apple:after { content:""; position:absolute; width:6px; height:22px; background:#6d4c41; border-radius:3px; left:42px; top:-22px; transform:rotate(12deg); }

      .big-num { font-size:64px; float:right; margin-top:-40px; }
    </style>
  </head>
  <body>
    <div class="sheet">
      <div class="brand">K5 Learning-like Practice</div>
      <h1>Tracing the number ${num} (${word})</h1>
      <div class="sub">Practice tracing and printing the number ${num} (${word}). <span class="big-num">${num}</span></div>

      ${trace_section}

      <div class="flex" style="margin-top:18px;">
        <div>
          <div style="font-size:16px; margin-bottom:6px;">Count the apple.</div>
          <div class="apple" aria-label="apple"></div>
        </div>
        <div class="grid-box">
          <div class="grid-title">Circle the number ${num}.</div>
          <div class="numbers">${numbers_grid}</div>
        </div>
      </div>

      <div class="footer-word">${word}</div>
    </div>
  </body>
</html>
""")

NUM_WORDS = {
    0: "zero", 1: "one", 2: "two", 3: "three", 4: "four",
    5: "five", 6: "six", 7: "seven", 8: "eight", 9: "nine",
}


def build_trace_section(num: int) -> str:
    # First tracing row (dotted guides), then a row with a few starter examples, then two blank ruled lines
    cells = []
    for i in range(10):
        style = f"left:{i*52}px;"
        cells.append(f'<div class="trace-cell">{num}</div>'.replace('"trace-cell"', f'"trace-cell" style="{style}"'))
    row1 = f'<div class="trace-row"><div class="mid"></div>{"".join(cells)}</div>'

    cells2 = []
    for i in range(3):
        style = f"left:{i*52}px;"
        cells2.append(f'<div class="trace-cell solid" style="{style}">{num}</div>')
    row2 = f'<div class="trace-row"><div class="mid"></div>{"".join(cells2)}</div>'

    ruled = '<div class="trace-row"><div class="mid"></div></div>'
    return row1 + row2 + ruled + ruled


def build_numbers_grid(num: int) -> str:
    import random
    rng = random.Random(42 + num)
    choices = list(range(10))
    rng.shuffle(choices)
    # ensure at least 3 occurrences of the target number scattered
    grid = []
    slots = 9
    indices = set(rng.sample(range(slots), 3))
    ptr = 0
    for i in range(slots):
        if i in indices:
            grid.append(str(num))
        else:
            while choices[ptr] == num:
                ptr += 1
            grid.append(str(choices[ptr]))
            ptr += 1
    return "".join(f"<div>{n}</div>" for n in grid)


def render_number(num: int) -> str:
    word = NUM_WORDS.get(num, str(num))
    html = HTML_TEMPLATE.substitute(
        num=num,
        word=word,
        trace_section=build_trace_section(num),
        numbers_grid=build_numbers_grid(num),
    )
    return html


def write_file(out_dir: Path, filename: str, content: str) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / filename
    path.write_text(content, encoding="utf-8")
    return path


def main():
    import argparse
    p = argparse.ArgumentParser(description="Generate number tracing worksheet HTML")
    p.add_argument("number", type=int, help="Digit 0-9 to generate")
    p.add_argument("--out", type=Path, default=Path("."), help="Output directory")
    args = p.parse_args()

    if not (0 <= args.number <= 9):
        raise SystemExit("number must be 0..9")

    html = render_number(args.number)
    filename = f"number-{args.number}.html"
    out_path = write_file(args.out, filename, html)
    print(out_path)


if __name__ == "__main__":
    main()
