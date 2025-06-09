// This component has been replaced by NewSubmissionForm.tsx
// Keeping this file to avoid breaking imports, but it's deprecated
import NewSubmissionForm from './NewSubmissionForm';

const SubmissionForm = ({ onSubmit }: { onSubmit?: (data: any) => void }) => {
  return <NewSubmissionForm onSubmit={onSubmit} />;
};

export default SubmissionForm;
