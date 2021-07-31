import { useContext, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import AuthContext from '../../store/auth-context'
import classes from './AuthForm.module.css'

const AuthForm = () => {
	const [isLogin, setIsLogin] = useState(true)
	const [isLoading, setIsLoading] = useState(false)
	const history = useHistory()

	const authCtx = useContext(AuthContext)

	const emailInputRef = useRef()
	const passwordInputRef = useRef()

	const switchAuthModeHandler = () => {
		setIsLogin(prevState => !prevState)
	}

	const formSubmitHandler = e => {
		e.preventDefault()
		const enteredEmail = emailInputRef.current.value
		const enteredPassword = passwordInputRef.current.value

		// validation
		let url
		setIsLoading(true)
		if (isLogin) {
			//login
			url =
				'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBuB1B6No6ne9783idYQDhpN-NaiKMCqu0'
		} else {
			//signup
			url =
				'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBuB1B6No6ne9783idYQDhpN-NaiKMCqu0'
		}
		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				email: enteredEmail,
				password: enteredPassword,
				returnSecureToken: true,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(res => {
				setIsLoading(false)

				if (res.ok) {
					//signup/login successfully
					return res.json()
				} else {
					//signup/login failed
					return res.json().then(data => {
						let errorMsg = 'Authentication Failed'
						if (data && data.error && data.error.message) {
							errorMsg = data.error.message
						}
						throw new Error(errorMsg)
					})
				}
			})
			.then(data => {
				const expirationTime = new Date(
					new Date().getTime() + +data.expiresIn * 1000,
				)
				//we are using context instead of redux as auth state won't change frequently
				authCtx.login(data.idToken, expirationTime.toISOString())
				history.replace('/')
			})
			.catch(err => alert(err.message))
	}

	return (
		<section className={classes.auth}>
			<h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
			<form onSubmit={formSubmitHandler}>
				<div className={classes.control}>
					<label htmlFor='email'>Your Email</label>
					<input type='email' id='email' required ref={emailInputRef} />
				</div>
				<div className={classes.control}>
					<label htmlFor='password'>Your Password</label>
					<input
						type='password'
						id='password'
						required
						ref={passwordInputRef}
					/>
				</div>
				<div className={classes.actions}>
					{!isLoading && (
						<button>{isLogin ? 'Login' : 'Create Account'}</button>
					)}
					{isLoading && <button disabled>Sending Request</button>}
					<button
						type='button'
						className={classes.toggle}
						onClick={switchAuthModeHandler}>
						{isLogin ? 'Create new account' : 'Login with existing account'}
					</button>
				</div>
			</form>
		</section>
	)
}

export default AuthForm
