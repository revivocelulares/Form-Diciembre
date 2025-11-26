import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FormWizard } from './components/FormWizard';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormWizard />} />
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
