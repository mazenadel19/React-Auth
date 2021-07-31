import { useContext } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import UserProfile from './components/Profile/UserProfile'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import AuthContext from './store/auth-context'

function App() {
	const authContext = useContext(AuthContext)

	const { isLoggedIn } = authContext

	return (
		<Layout>
			<Switch>
				<Route path='/' exact>
					<HomePage />
				</Route>

				{!isLoggedIn && (
					<Route path='/auth'>
						<AuthPage />
					</Route>
				)}

				<Route path='/profile'>
					{isLoggedIn && <UserProfile />}
					{!isLoggedIn && <Redirect to='/' />}
				</Route>

				<Route path='*'>
					<Redirect to='/' />
				</Route>
			</Switch>
		</Layout>
	)
}

export default App
