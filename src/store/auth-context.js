import React, { useState } from 'react'

const AuthContext = React.createContext({
	token: '',
	isLoggedIn: false,
	login: token => {},
	logout: () => {},
})

const calcRemainingTime = expirationTime => {
	const currentTime = new Date().getTime()
	const adjExpirationTime = new Date(expirationTime).getDate()

	const remainingTime = adjExpirationTime - currentTime
	return remainingTime
}

export const AuthContextProvider = props => {
	const [token, setToken] = useState(localStorage.getItem('token'))

	const userIsLoggedIn = !!token

	const logoutHandler = () => {
		setToken(null)
		localStorage.removeItem('token')
	}

	const loginHandler = (token, expirationTime) => {
		setToken(token)
		localStorage.setItem('token', token)
		const remainingTime = calcRemainingTime(expirationTime)
		setTimeout(logoutHandler, remainingTime)
	}

	const contextValue = {
		token: token,
		isLoggedIn: userIsLoggedIn,
		login: loginHandler,
		logout: logoutHandler,
	}

	return (
		<AuthContext.Provider value={contextValue}>
			{props.children}
		</AuthContext.Provider>
	)
}

export default AuthContext
