import React, { useState } from "react"
import { GoogleLoginButton ,FacebookLoginButton, GithubLoginButton } from "react-social-login-buttons";

function LoginPage() {
    
    const oauthSignIn = (provider) => {
        window.location.href = `http://localhost:5000/auth/login/${provider}`
    }

    return (
        <div class="login-page-container">
            <div className="login-box">
                <h2>Log in</h2>
                <form className="login-form">
                    <h4>Username or email</h4>
                    <input className="login-input" type="text" />
                    <br />
                    <h4>Password</h4>
                    <input className="login-input" type="text" />
                </form>
                <span className="login-line">
                    <h3><span>OR</span></h3>
                </span>
                <div className="login-oauth-box">
                    <GoogleLoginButton onClick={()=>oauthSignIn('google')} />
                    <FacebookLoginButton onClick={()=>oauthSignIn('google')} />
                    <GithubLoginButton onClick={()=>oauthSignIn('google')} />
                </div>
            </div>
        </div>
    )

}

export default LoginPage