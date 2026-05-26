import Dashboard from './Dashboard';
export { Dashboard };

export const Login: React.FC<{ setIsAuthenticated: (val: boolean) => void }> = ({ setIsAuthenticated }) => {
  return <div className="container py-8"><h1 className="text-4xl font-bold">Login</h1></div>;
};

export const Profile: React.FC = () => {
  return <div className="container py-8"><h1 className="text-4xl font-bold">Profile</h1></div>;
};

export const SkillsPage: React.FC = () => {
  return <div className="container py-8"><h1 className="text-4xl font-bold">Skills</h1></div>;
};

export const Predictions: React.FC = () => {
  return <div className="container py-8"><h1 className="text-4xl font-bold">Predictions</h1></div>;
};

export const AIMentor: React.FC = () => {
  return <div className="container py-8"><h1 className="text-4xl font-bold">AI Mentor</h1></div>;
};
