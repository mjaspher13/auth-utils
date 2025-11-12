// src/components/features/register/RegisterPage.jsx
import { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import isEmail from 'validator/lib/isEmail';

import USBInput from '@usb-shield/react-forms-input-text';
import USBButton from '@usb-shield/react-button';
import { USBGrid, USBColumn } from '@usb-shield/react-grid';

// Labels/content (unchanged)
import RegisterLabels from '../../../templates/register.json';
import ForgotLabels from '../../../templates/forgotpassword.json';
// Optional modal (keep if you already have this component)
import RegisterModel from '../../register/terms-and-conditions-model/modal';

import {
  registerFlowFlag,
  setMaskedEmail,
  registerEmailResponseObj,
  maskEmail,
  postRegisterEmail,
} from '../../../app/actions/registerEmailSlice';
import { resetPasswordResponseObj } from '../../../app/actions/resetPasswordSlice';

import './register.scss';

const RegisterPage = ({ appType }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Keep PII out of React/Redux state
  const emailRef = useRef(null);

  // Derived UI state only
  const [errorCode, setErrorCode] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Route-based flow (same as before)
  const pathname = window.location.pathname;
  const isRegister = pathname === '/register';
  const labels = isRegister ? RegisterLabels : ForgotLabels;

  // ---- Validation ----
  const validateEmail = useCallback((email) => {
    if (!email || email.trim() === '') return 225; // required
    if (!isEmail(email)) return 224;               // invalid format
    return 0;
  }, []);

  const readAndValidate = useCallback(() => {
    const value = emailRef.current?.value?.trim() || '';
    const code = validateEmail(value);
    setErrorCode(code);
    return { value, code };
  }, [validateEmail]);

  // ---- Actions ----
  const handleContinue = useCallback(async () => {
    const { value: email, code } = readAndValidate();
    setAttempts((n) => n + 1);
    if (code !== 0) return; // block further action

    dispatch(registerFlowFlag(true));
    setIsSubmitting(true);
    try {
      const { status, json } = await postRegisterEmail({ email, flow: 'register' });
      dispatch(registerEmailResponseObj(json || {}));
      dispatch(setMaskedEmail(maskEmail(email)));
      if (status === 200) setShowRegisterModal(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, readAndValidate]);

  const handleForgotPassword = useCallback(async () => {
    const { value: email, code } = readAndValidate();
    setAttempts((n) => n + 1);
    if (code !== 0) return;

    dispatch(registerFlowFlag(false));
    setIsSubmitting(true);
    try {
      const { status, json } = await postRegisterEmail({ email, flow: 'forgot' });
      dispatch(registerEmailResponseObj(json || {}));
      dispatch(setMaskedEmail(maskEmail(email)));
      if (status === 200) navigate('/otp');
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, readAndValidate, navigate]);

  const handleCancel = useCallback(() => {
    dispatch(resetPasswordResponseObj({})); // preserve original behavior
    navigate('/login');
  }, [dispatch, navigate]);

  // Same error copy you used before
  const errorMessages = {
    224: 'Email not found. Please re-enter.',
    225: 'Email is required.',
  };

  return (
    <div className="registerContainer">
      <USBGrid justifyContent="center" gridGap="normal">
        <USBColumn
          layoutOpts={{ spans: { large: 16, large16: 16, medium: 8, small: 4 } }}
          className="registerGridContainer"
          style={{ padding: 'zero' }}
        >
          <p className={appType === 'IC' ? 'heading' : 'heading headingElan'}>
            {labels?.heading?.label1}
            <p className="subHeading">{labels?.subHeading?.label2}</p>
          </p>

          <USBInput
            addClasses="emailInput"
            inputName="email"
            labelText="Email"
            type="email"
            autoComplete="email"
            callbackFrequency="dynamic"
            errorMessages={errorMessages}
            // keep dynamic validation without storing PII
            statusUpdateCallback={() => {
              const email = emailRef.current?.value ?? '';
              setErrorCode(validateEmail(email));
            }}
            filteringFunction={(inputValue) => {
              const code = validateEmail(inputValue);
              return [inputValue, code];
            }}
            inputProps={{
              ref: emailRef,
              onBlur: () => {
                const email = emailRef.current?.value ?? '';
                setErrorCode(validateEmail(email));
              },
            }}
          />

          <USBButton
            addClasses={
              appType === 'IC'
                ? 'continueButton'
                : 'continueButton continueButtonElan'
            }
            type="button"
            variant="primary"
            size="large"
            handleClick={isRegister ? handleContinue : handleForgotPassword}
            disabled={isSubmitting || (attempts > 0 && errorCode !== 0)}
          >
            {isSubmitting ? 'Please wait…' : 'Continue'}
          </USBButton>

          <USBButton
            addClasses={
              appType === 'IC'
                ? 'cancelButton'
                : 'cancelButton cancelButtonElan'
            }
            type="button"
            variant="secondary"
            size="large"
            handleClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </USBButton>
        </USBColumn>
      </USBGrid>

      {/* Keep your modal if used in the register flow */}
      {showRegisterModal && RegisterModel ? (
        <RegisterModel isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
      ) : null}
    </div>
  );
};

RegisterPage.propTypes = {
  appType: PropTypes.string.isRequired,
};

export default RegisterPage;
