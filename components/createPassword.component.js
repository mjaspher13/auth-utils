// CreatePassword.jsx
import { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import USBButton from '@usb-shield/react-button';
import { USBGrid, USBColumn } from '@usb-shield/react-grid';
import USBPasswordInput from '@usb-commons/react-forms-input-password';
import '@usb-commons/react-forms-input-password/dist/library/styles/index.css';

import './createPassword.scss';

import {
  resetPasswordResponseObj,
} from '../../../app/actions/resetPasswordSlice';

// NEW: call a helper that DOES NOT dispatch secrets
import { postResetPassword } from '../../../app/actions/resetPasswordSlice';

const passwordRules = [
  { label: '8–15 characters', errorCode: 102, rule: (input) => !!input && input.length >= 8 && input.length <= 15 },
  { label: 'No spaces',       errorCode: 103, rule: (input) => !!input && !/\s/.test(input) },
  {
    label: '1 special character i.e. @%$*#',
    errorCode: 104,
    rule: (input) => !!input && /[@%$*#^()[\]{}_.\-]/.test(input) && !/[^A-Za-z0-9@%$*#^()[\]{}_.\-]/.test(input),
  },
  { label: '1 uppercase letter', errorCode: 105, rule: (input) => !!input && /[A-Z]/.test(input) },
  { label: '1 number',           errorCode: 106, rule: (input) => !!input && /\d/.test(input) },
  // "Passwords match" is handled separately (needs both fields)
];

function validatePassword(input, other) {
  if (!input) return 101; // required
  for (const rule of passwordRules) {
    if (typeof rule.rule === 'function' && !rule.rule(input, other)) {
      return rule.errorCode;
    }
  }
  return 0; // valid
}

export default function CreatePassword(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Token stays in Redux, but we DO NOT put passwords there
  const token = useSelector((state) => state?.verifyOtp?.verifyOtpResponse2?.data?.token);

  // Keep secrets OUT of state; use refs
  const newPwdRef = useRef(null);
  const confirmPwdRef = useRef(null);

  // Only derived, non-sensitive UI state
  const [newPasswordErrorCount, setNewPasswordErrorCount] = useState(0);
  const [confirmPasswordErrorCount, setConfirmPasswordErrorCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  const onCancel = () => {
    dispatch(resetPasswordResponseObj({})); // keep existing behavior of clearing obj
    navigate('/login');
  };

  const liveValidate = useCallback(() => {
    const pwd = newPwdRef.current?.value ?? '';
    const confirm = confirmPwdRef.current?.value ?? '';
    setNewPasswordErrorCount(validatePassword(pwd, confirm));
    setConfirmPasswordErrorCount(validatePassword(confirm, pwd));
    setErrorCount((prev) => prev + 1);
  }, []);

  const onCreatePassword = async (e) => {
    e.preventDefault();

    const pwd = newPwdRef.current?.value ?? '';
    const confirm = confirmPwdRef.current?.value ?? '';

    const newPassErr = validatePassword(pwd, confirm);
    const confirmPassErr = validatePassword(confirm, pwd);
    const mismatch = pwd !== confirm;

    setNewPasswordErrorCount(newPassErr);
    setConfirmPasswordErrorCount(confirmPassErr);

    if (newPassErr !== 0 || confirmPassErr !== 0 || mismatch) return;

    // >>> send secret directly (HTTPS POST body). DO NOT dispatch it. <<<
    const { status, json } = await postResetPassword({ password: pwd }, token);

    // zeroize immediately
    if (newPwdRef.current) newPwdRef.current.value = '';
    if (confirmPwdRef.current) confirmPwdRef.current.value = '';

    // keep your existing reducer usage (store only response, never the secret)
    dispatch(resetPasswordResponseObj(json ?? {}));

    const ok =
      json?.payload?.serviceStatus?.statusCode === 200 ||
      status === 200;

    if (ok) {
      navigate('/login');
    }
  };

  const passwordErrorMessages = {
    101: 'Please enter a valid password.',
    102: 'Please enter a valid password.',
    103: 'Please enter a valid password.',
    104: 'Please enter a valid password.',
    105: 'Please enter a valid password.',
    106: 'Please enter a valid password.',
  };

  const confirmPasswordErrorMessages = {
    101: 'Please enter a valid confirm password.',
    102: 'Please enter a valid confirm password.',
    103: 'Please enter a valid confirm password.',
    104: 'Please enter a valid confirm password.',
    105: 'Please enter a valid confirm password.',
    106: 'Please enter a valid confirm password.',
  };

  return (
    <div className="createPasswordContainer">
      <USBGrid justifyContent="center" gridGap="normal">
        <USBColumn layoutOpts={{ spans: { large: 16, large16: 16, medium: 8, small: 4 } }} className="passwordGridContainer">
          <p className={props.appType === 'IC' ? 'heading' : 'heading headingElan'}>
            Create a new password
          </p>

          <div style={{ width: '100%' }}>
            <USBPasswordInput
              addClasses="password-input"
              inputName="new-password-input"
              labelText="New password"
              errorMessages={passwordErrorMessages}
              callbackFrequency="dynamic"
              dynamicErrorCount={errorCount}
              validationFunction={() => {
                const pwd = newPwdRef.current?.value ?? '';
                const confirm = confirmPwdRef.current?.value ?? '';
                return validatePassword(pwd, confirm);
              }}
              showFieldError={true}
              dataTestId="newPassword"
              autoComplete="new-password"
              // Pass ref & live validator; do NOT store value in state
              inputProps={{ ref: newPwdRef, onInput: liveValidate, type: 'password' }}
              statusUpdateCallback={(val) => setNewPasswordErrorCount(val?.errorCode)}
            />

            <USBPasswordInput
              addClasses="confirm-password"
              inputName="confirm-password-input"
              labelText="Confirm password"
              callbackFrequency="dynamic"
              dynamicErrorCount={errorCount}
              errorMessages={confirmPasswordErrorMessages}
              dataTestId="confirmPassword"
              autoComplete="new-password"
              inputProps={{ ref: confirmPwdRef, onInput: liveValidate, type: 'password' }}
              // validity rules can still be rendered, but they don't receive secrets
              liveValidationRules={passwordRules.map((rule) => ({ ...rule, rule: (input) => rule.rule(input) }))}
              validationFunction={() => {
                const pwd = newPwdRef.current?.value ?? '';
                const confirm = confirmPwdRef.current?.value ?? '';
                return validatePassword(confirm, pwd);
              }}
              statusUpdateCallback={(val) => setConfirmPasswordErrorCount(val?.errorCode)}
            />
          </div>

          <USBButton
            addClasses={props.appType === 'IC' ? 'icButton' : 'elanButton elanPrimaryButton'}
            type="button"
            variant="primary"
            handleClick={onCreatePassword}
            size="large"
          >
            Save
          </USBButton>

          <USBButton
            addClasses={props.appType === 'IC' ? 'icButton adjustMargin' : 'elanButton adjustMargin'}
            type="button"
            variant="secondary"
            handleClick={onCancel}
            size="large"
          >
            Cancel
          </USBButton>
        </USBColumn>
      </USBGrid>
      &nbsp;
    </div>
  );
}