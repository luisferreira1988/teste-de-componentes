import { useState } from 'react';
import CustomStepper from './components/custom-stepper/custom-stepper';

function App() {
  const [currentStep, setCurrentStep] = useState('Submitted'); // Example: 'Transforming' step is active

  return <CustomStepper currentStep={currentStep} />;
}

export default App;
