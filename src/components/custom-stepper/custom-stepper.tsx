import './custom-stepper.css';

interface CustomStepperProps {
  currentStep: string;
}

function CustomStepper(props: CustomStepperProps) {
  const steps = [
    'Submitted',
    'Parsing',
    'Transforming',
    'Importing',
    'Completed',
  ];

  return (
    <div className="stepper-wrapper">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`stepper-item ${
            steps.indexOf(props.currentStep) > index ? 'completed' : ''
          } ${props.currentStep === step ? 'active' : ''}`}
        >
          <div className="step-counter">
            {props.currentStep === step && <div className="blob white"></div>}
          </div>
          <div className="step-name">{step}</div>
        </div>
      ))}
    </div>
  );
}

export default CustomStepper;
