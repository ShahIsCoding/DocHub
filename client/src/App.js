
import Editor from './components/Editor';
import ToolBar from './components/ToolBar';

function App() {
  return (
    <div className="h-screen bg-slate-200">
      <ToolBar />
      <hr />
      <Editor/>
    </div>
  );
}

export default App;
