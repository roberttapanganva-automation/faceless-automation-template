from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(r"D:\Faceless Automation Content")
ASSETS = ROOT / "pages" / "bawat-pilipino-may-kuwento" / "assets"
SOURCE = ASSETS / "facebook-cover-background-v1.png"
OUTPUT = ASSETS / "facebook-cover-final-v2.png"

PAGE_NAME_PREFIX = "BAWAT PILIPINO,"
PAGE_NAME_FOCUS = "May Kuwento"
BIO = (
    "Kathang-isip na Tagalog drama at kuwentong Pilipino tungkol sa pamilya "
    "at napapanahong isyu."
)

TARGET_SIZE = (1640, 624)
TITLE_FONT = Path(r"C:\Windows\Fonts\segoeuib.ttf")
FOCUS_FONT = Path(r"C:\Windows\Fonts\georgiai.ttf")
BODY_FONT = Path(r"C:\Windows\Fonts\arial.ttf")


def cover_crop(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    target_ratio = size[0] / size[1]
    source_ratio = image.width / image.height
    if source_ratio > target_ratio:
        crop_width = round(image.height * target_ratio)
        left = (image.width - crop_width) // 2
        box = (left, 0, left + crop_width, image.height)
    else:
        crop_height = round(image.width / target_ratio)
        top = (image.height - crop_height) // 2
        box = (0, top, image.width, top + crop_height)
    return image.crop(box).resize(size, Image.Resampling.LANCZOS)


def fit_font(draw: ImageDraw.ImageDraw, text: str, font_path: Path, max_width: int, start: int) -> ImageFont.FreeTypeFont:
    size = start
    while size >= 24:
        font = ImageFont.truetype(str(font_path), size)
        box = draw.textbbox((0, 0), text, font=font)
        if box[2] - box[0] <= max_width:
            return font
        size -= 2
    return ImageFont.truetype(str(font_path), 24)


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current: list[str] = []
    for word in words:
        candidate = " ".join([*current, word])
        box = draw.textbbox((0, 0), candidate, font=font)
        if current and box[2] - box[0] > max_width:
            lines.append(" ".join(current))
            current = [word]
        else:
            current.append(word)
    if current:
        lines.append(" ".join(current))
    return lines


def draw_tracking_centered(
    draw: ImageDraw.ImageDraw,
    text: str,
    y: int,
    font: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int, int],
    tracking: int,
) -> None:
    widths = [draw.textlength(char, font=font) for char in text]
    total = sum(widths) + tracking * max(0, len(text) - 1)
    x = (TARGET_SIZE[0] - total) / 2
    for char, width in zip(text, widths):
        draw.text((round(x), y), char, font=font, fill=fill)
        x += width + tracking


def main() -> None:
    if OUTPUT.exists():
        raise FileExistsError(f"Refusing to overwrite existing asset: {OUTPUT}")
    image = cover_crop(Image.open(SOURCE).convert("RGB"), TARGET_SIZE)

    # A soft central vignette protects exact copy without using a box or text shadow.
    shade = Image.new("RGBA", TARGET_SIZE, (0, 0, 0, 0))
    shade_draw = ImageDraw.Draw(shade)
    shade_draw.ellipse((180, -170, 1460, 780), fill=(18, 13, 16, 156))
    shade = shade.filter(ImageFilter.GaussianBlur(95))
    composed = Image.alpha_composite(image.convert("RGBA"), shade)
    draw = ImageDraw.Draw(composed)

    title_font = ImageFont.truetype(str(TITLE_FONT), 38)
    focus_font = fit_font(draw, PAGE_NAME_FOCUS, FOCUS_FONT, 840, 108)
    body_font = ImageFont.truetype(str(BODY_FONT), 29)
    draw_tracking_centered(
        draw,
        PAGE_NAME_PREFIX,
        143,
        title_font,
        (245, 220, 172, 255),
        6,
    )
    focus_box = draw.textbbox((0, 0), PAGE_NAME_FOCUS, font=focus_font)
    focus_width = focus_box[2] - focus_box[0]
    draw.text(
        ((TARGET_SIZE[0] - focus_width) // 2, 205),
        PAGE_NAME_FOCUS,
        font=focus_font,
        fill=(255, 244, 222, 255),
    )
    draw.rounded_rectangle((675, 338, 965, 342), radius=2, fill=(202, 149, 70, 240))

    lines = wrap_text(draw, BIO, body_font, 900)
    line_height = 43
    start_y = 372
    for index, line in enumerate(lines):
        box = draw.textbbox((0, 0), line, font=body_font)
        width = box[2] - box[0]
        x = (TARGET_SIZE[0] - width) // 2
        y = start_y + index * line_height
        draw.text((x, y), line, font=body_font, fill=(247, 231, 202, 255))

    composed.convert("RGB").save(OUTPUT, format="PNG", optimize=True)
    print(OUTPUT)


if __name__ == "__main__":
    main()
