import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  getUserErrorSelector,
  clearError,
  registerUserThunk
} from '../../services/slices/userSlice';
import { useEffect } from 'react';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(getUserErrorSelector);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUserThunk({ name: userName, email, password }));
    navigate('/login');
  };

  useEffect(() => {
    dispatch(clearError());
  });

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
