// components/ColorPalette.tsx

interface ColorPaletteProps {
    colors: string[];
    selectedColor: string;
    onSelectColor: (color: string) => void;
  }
  
  const ColorPalette: React.FC<ColorPaletteProps> = ({
    colors,
    selectedColor,
    onSelectColor,
  }) => {
    return (
      <div className="color-palette">
        {colors.map((color) => (
          <div
            key={color}
            className={`color ${selectedColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onSelectColor(color)}
          />
        ))}
      </div>
    );
  };
  
  export default ColorPalette;
  