// components/Toolbar.tsx

interface ToolbarProps {
    onReset: () => void;
    onToggleEraser: () => void; 
    onRun: () => void;
    isErasing: boolean;
  }
  
  const Toolbar: React.FC<ToolbarProps> = ({ isErasing, onReset, onToggleEraser, onRun  }) => {
    return (
      <div className="flex gap-4 mb-4">
        <button
          onClick={onReset}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          Reset 
         
        </button>
        <button
        onClick={onToggleEraser}
        className={`px-4 py-2 ${
          isErasing ? 'bg-gray-500' : 'bg-blue-500'
        } text-white rounded shadow hover:${isErasing ? 'bg-gray-600' : 'bg-blue-900'}`}
      >
        {isErasing ? 'Draw' : 'Erase'}
      </button>
        <button
          onClick={onRun}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-900"
        >
          Run
        </button>
      </div>
    );
  };
  
  export default Toolbar;
  