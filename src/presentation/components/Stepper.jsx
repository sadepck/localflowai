import { Check } from 'lucide-react'

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  index < currentStep
                    ? 'bg-secondary text-white'
                    : index === currentStep
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index < currentStep ? (
                  <Check size={20} />
                ) : (
                  <span className="font-semibold">{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs md:text-sm font-medium ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 transition-all duration-200 ${
                  index < currentStep ? 'bg-secondary' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stepper
