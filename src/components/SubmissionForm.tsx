// This component has been replaced by NewMeetupForm.tsx
// Keeping this file to avoid breaking imports, but it's deprecated
import NewMeetupForm from './NewMeetupForm';

const SubmissionForm = ({ onSubmit }: { onSubmit?: () => void }) => {
  return <NewMeetupForm onSubmit={onSubmit} />;
};

export default SubmissionForm;
