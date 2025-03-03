import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { apiGoogleLogin } from 'apis/user';
import { login } from 'store/users/userSlice';
import { getCurrent } from 'store/users/asyncAction';

const GoogleLoginButton = () => {
    const dispatch = useDispatch();

    return (
        <GoogleLogin
            onSuccess={async (response) => {
                try {
                    console.log('Google Response:', response);
                    const result = await apiGoogleLogin({ token: response.credential });

                    console.log('Login successful:', result);

                    if (result.success) {
                        // Save to Redux Store
                        dispatch(login({ isLoggedIn: true, token: result.accessToken }));

                        // Call API to get user information
                        dispatch(getCurrent());

                        // Save to localStorage
                        localStorage.setItem('accessToken', result.accessToken);
                        localStorage.setItem('userData', JSON.stringify(result.userData));

                        // Redirect after login
                        window.location.href = '/';
                    } else {
                        throw new Error(result.message || 'Google login error');
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    alert(error.message || 'An error occurred while logging in!');
                }
            }}
            onError={() => {
                console.log('Login failed');
                alert('Google login failed. Please try again!');
            }}
        />
    );
};

export default GoogleLoginButton;
