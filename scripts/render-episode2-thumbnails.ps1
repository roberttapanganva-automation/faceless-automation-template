Add-Type -AssemblyName System.Drawing

$sourcePath = 'D:\Faceless Automation Content - Page 3\series\completed\ang-binalewalang-ama\episodes\E001\images\Episode 1 - Movie Poster Thumbnail.png'
$outputDir = 'D:\Faceless Automation Content - Page 3\series\completed\ang-binalewalang-ama\episodes\E002\images'

function New-FittedFont {
    param(
        [System.Drawing.Graphics]$Graphics,
        [string]$Text,
        [float]$StartingSize,
        [float]$MaximumWidth
    )

    $size = $StartingSize
    while ($size -gt 18) {
        $font = [System.Drawing.Font]::new('Impact', $size, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
        if ($Graphics.MeasureString($Text, $font).Width -le $MaximumWidth) {
            return $font
        }
        $font.Dispose()
        $size -= 2
    }
    return [System.Drawing.Font]::new('Impact', 18, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
}

function Draw-CenteredText {
    param(
        [System.Drawing.Graphics]$Graphics,
        [string]$Text,
        [System.Drawing.Font]$Font,
        [float]$Y
    )

    $format = [System.Drawing.StringFormat]::new()
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Near
    $outline = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::Black)
    $fill = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(245, 245, 240))

    for ($dx = -2; $dx -le 2; $dx++) {
        for ($dy = -2; $dy -le 2; $dy++) {
            if (($dx * $dx) + ($dy * $dy) -le 4) {
                $Graphics.DrawString($Text, $Font, $outline, 470.5 + $dx, $Y + $dy, $format)
            }
        }
    }
    $Graphics.DrawString($Text, $Font, $fill, 470.5, $Y, $format)

    $outline.Dispose()
    $fill.Dispose()
    $format.Dispose()
}

function Render-SubtitleVariant {
    param(
        [string]$Subtitle,
        [string]$OutputName
    )

    $source = [System.Drawing.Image]::FromFile($sourcePath)
    $bitmap = [System.Drawing.Bitmap]::new($source.Width, $source.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $graphics.DrawImage($source, 0, 0, $source.Width, $source.Height)

    # Replace only the original Episode 1 subtitle strip. All other source pixels remain unchanged.
    $strip = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 9, 9, 12))
    $red = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(210, 25, 28), 4)
    $graphics.FillRectangle($strip, 110, 1484, 721, 124)
    $graphics.DrawLine($red, 110, 1487, 831, 1487)
    $graphics.DrawLine($red, 110, 1604, 831, 1604)

    $font = New-FittedFont -Graphics $graphics -Text $Subtitle -StartingSize 43 -MaximumWidth 650
    Draw-CenteredText -Graphics $graphics -Text $Subtitle -Font $font -Y 1519

    $bitmap.Save((Join-Path $outputDir $OutputName), [System.Drawing.Imaging.ImageFormat]::Png)

    $font.Dispose()
    $red.Dispose()
    $strip.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
    $source.Dispose()
}

Render-SubtitleVariant -Subtitle 'EPISODE 2: ANG PAGBAWI' -OutputName 'Episode 2 - Movie Poster Thumbnail.png'
Render-SubtitleVariant -Subtitle 'FULL EPISODE' -OutputName 'Full Episode - Movie Poster Thumbnail.png'
