import ReactDOM from 'react-dom';

import { router } from './router';
import "./style/main.css";
import registerServiceWorker from './registerServiceWorker';

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

ReactDOM.render(router, document.getElementById('root'));
registerServiceWorker();
