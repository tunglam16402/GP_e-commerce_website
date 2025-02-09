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

                    console.log('Đăng nhập thành công:', result);

                    if (result.success) {
                        // Lưu vào Redux Store
                        dispatch(login({ isLoggedIn: true, token: result.accessToken }));

                        // Gọi API lấy thông tin user
                        dispatch(getCurrent());

                        // Lưu vào localStorage
                        localStorage.setItem('accessToken', result.accessToken);
                        localStorage.setItem('userData', JSON.stringify(result.userData));

                        // Điều hướng sau khi đăng nhập
                        window.location.href = '/dashboard';
                    } else {
                        throw new Error(result.message || 'Lỗi đăng nhập Google');
                    }
                } catch (error) {
                    console.error('Lỗi đăng nhập:', error);
                    alert(error.message || 'Có lỗi xảy ra khi đăng nhập!');
                }
            }}
            onError={() => {
                console.log('Đăng nhập thất bại');
                alert('Đăng nhập Google thất bại. Vui lòng thử lại!');
            }}
        />
    );
};

export default GoogleLoginButton;
