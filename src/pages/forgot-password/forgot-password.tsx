import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  forgotPasswordThunk,
  getUserErrorSelector,
  clearError
} from '../../services/slices/userSlice';
import { useEffect } from 'react';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(getUserErrorSelector);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(forgotPasswordThunk({ email }))
      .unwrap()
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch(() => {});
  };

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <ForgotPasswordUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
