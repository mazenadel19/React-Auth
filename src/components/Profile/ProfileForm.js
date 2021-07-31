import { useContext, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import AuthContext from '../../store/auth-context'
import classes from './ProfileForm.module.css'

const ProfileForm = () => {
	const newPasswordInputRef = useRef()
	const authCtx = useContext(AuthContext)
	const history = useHistory()

	const { token } = authCtx

	const passwordResetHandler = e => {
		e.preventDefault()
		const enteredNewPAssword = newPasswordInputRef.current.value

		fetch(
			'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBuB1B6No6ne9783idYQDhpN-NaiKMCqu0',
			{
				method: 'POST',
				body: JSON.stringify({
					idToken: token,
					password: enteredNewPAssword,
					returnSecureToken: false,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)
			.then(res => {
				if (res.ok) {
					return res.json()
				} else {
					return res.json().then(data => {
						let errorMsg = 'Failed To Set The New Password'
						if (data && data.error && data.error.message) {
							errorMsg = data.error.message
						}
						throw new Error(errorMsg)
					})
				}
			})
			.then(data => {
				alert('Password Changed Successfully')
				history.replace('/')
			})
			.catch(err => alert(err.message))
	}

	return (
		<form className={classes.form} onSubmit={passwordResetHandler}>
			<div className={classes.control}>
				<label htmlFor='new-password'>New Password</label>
				<input type='password' id='new-password' ref={newPasswordInputRef} />
			</div>
			<div className={classes.action}>
				<button>Change Password</button>
			</div>
		</form>
	)
}

export default ProfileForm
