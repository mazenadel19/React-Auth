import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthContextProvider } from './store/auth-context.js'

ReactDOM.render(
	<AuthContextProvider>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</AuthContextProvider>,
	document.getElementById('root'),
)
