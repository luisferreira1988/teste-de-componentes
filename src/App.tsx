import { useState } from 'react';
import CustomStepper from './components/custom-stepper/custom-stepper';
import CustomUpload from './components/custom-upload/custom-upload';

function App() {
  const [currentStep, setCurrentStep] = useState('Completed'); // Example: 'Transforming' step is active

  return <CustomUpload />;
}

export default App;
