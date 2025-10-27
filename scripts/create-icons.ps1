# Create simple PNG icons using PowerShell
Add-Type -AssemblyName System.Drawing

# Function to create a simple icon
function Create-Icon {
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
    
    # Fill background
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

Create-Icon -Size 192 -OutputPath "$iconsDir\icon-192.png"
Create-Icon -Size 512 -OutputPath "$iconsDir\icon-512.png"

# For maskable icon, create a version that fills more of the space
function Create-MaskableIcon {
    param(
        [int]$Size,
        [string]$OutputPath
    )
    
    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
    
    # Fill background
    $graphics.FillRectangle([System.Drawing.Brushes]::Black, 0, 0, $Size, $Size)
    
    # Draw larger circle for maskable
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, [Math]::Max(3, $Size / 32))
    $margin = $Size / 12
    $circleSize = $Size - ($margin * 2)
    $graphics.DrawEllipse($pen, $margin, $margin, $circleSize, $circleSize)
    
    # Draw "10" text
    $fontSize = [Math]::Max(16, $Size / 3.5)
    $font = New-Object System.Drawing.Font("Arial", $fontSize, [System.Drawing.FontStyle]::Regular)
    $brush = [System.Drawing.Brushes]::White
    
    $text = "10"
    $textSize = $graphics.MeasureString($text, $font)
    $x = ($Size - $textSize.Width) / 2
    $y = ($Size - $textSize.Height) / 2 + $textSize.Height / 4
    
    $graphics.DrawString($text, $font, $brush, $x, $y)
    
    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphics.Dispose()
    $bitmap.Dispose()
    $pen.Dispose()
    $font.Dispose()
}

Create-MaskableIcon -Size 512 -OutputPath "$iconsDir\icon-512-maskable.png"

Write-Host "Icons created successfully!"
