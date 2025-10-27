# Create simple PNG icons using PowerShell
Add-Type -AssemblyName System.Drawing

# Function to create a simple icon
function Create-SimpleIcon {
    param(
        [int]$Size,
        [string]$OutputPath
    )
    
    # Create bitmap
    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Set high quality
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
    
    # Fill background with black
    $graphics.FillRectangle([System.Drawing.Brushes]::Black, 0, 0, $Size, $Size)
    
    # Draw circle
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, [Math]::Max(2, $Size / 64))
    $margin = $Size / 8
    $circleSize = $Size - ($margin * 2)
    $graphics.DrawEllipse($pen, $margin, $margin, $circleSize, $circleSize)
    
    # Draw "10" text
    $fontSize = [Math]::Max(12, $Size / 4)
    $font = New-Object System.Drawing.Font("Arial", $fontSize, [System.Drawing.FontStyle]::Regular)
    $brush = [System.Drawing.Brushes]::White
    
    $text = "10"
    $textSize = $graphics.MeasureString($text, $font)
    $x = ($Size - $textSize.Width) / 2
    $y = ($Size - $textSize.Height) / 2 + $textSize.Height / 4
    
    $graphics.DrawString($text, $font, $brush, $x, $y)
    
    # Save
    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Cleanup
    $graphics.Dispose()
    $bitmap.Dispose()
    $pen.Dispose()
    $font.Dispose()
}

# Create icons
$iconsDir = "D:\Nothing10.com\nothing10\public\icons"

Write-Host "Creating 192x192 icon..."
Create-SimpleIcon -Size 192 -OutputPath "$iconsDir\icon-192.png"

Write-Host "Creating 512x512 icon..."
Create-SimpleIcon -Size 512 -OutputPath "$iconsDir\icon-512.png"

Write-Host "Creating 512x512 maskable icon..."
# For maskable icon, create a version that fills more of the space
$bitmap = New-Object System.Drawing.Bitmap(512, 512)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

# Fill background
$graphics.FillRectangle([System.Drawing.Brushes]::Black, 0, 0, 512, 512)

# Draw larger circle for maskable
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, 12)
$margin = 42
$circleSize = 512 - ($margin * 2)
$graphics.DrawEllipse($pen, $margin, $margin, $circleSize, $circleSize)

# Draw "10" text
$font = New-Object System.Drawing.Font("Arial", 140, [System.Drawing.FontStyle]::Regular)
$brush = [System.Drawing.Brushes]::White

$text = "10"
$textSize = $graphics.MeasureString($text, $font)
$x = (512 - $textSize.Width) / 2
$y = (512 - $textSize.Height) / 2 + $textSize.Height / 4

$graphics.DrawString($text, $font, $brush, $x, $y)

$bitmap.Save("$iconsDir\icon-512-maskable.png", [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$bitmap.Dispose()
$pen.Dispose()
$font.Dispose()

Write-Host "All icons created successfully!"
Write-Host "Icons saved to: $iconsDir"
